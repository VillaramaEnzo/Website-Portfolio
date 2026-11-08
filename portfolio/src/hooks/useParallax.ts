"use client"

import { RefObject, useEffect, useState } from 'react'
import { useTransform, MotionValue, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useScrollContext } from '@/context'

/**
 * Hook for creating parallax effects on individual elements
 * Works with window scroll via Lenis (ScrollProvider)
 *
 * @param elementRef - Reference to the element to track
 * @param offsetStart - When animation starts (0 = element enters viewport, 1 = element fully past viewport)
 * @param offsetEnd - When animation ends (0 = element enters viewport, 1 = element fully past viewport)
 * @returns MotionValue<number> - Progress from 0 to 1
 */
export function useParallax(
  elementRef: RefObject<HTMLElement>,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  const { scrollYMotion } = useScrollContext()
  const [bounds, setBounds] = useState<[number, number]>([0, 1])
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!elementRef?.current) {
      setBounds([0, 1])
      return
    }

    const updateBounds = () => {
      const element = elementRef.current
      if (!element) return

      const elementHeight = element.offsetHeight
      const viewportHeight = window.innerHeight
      const elementTop = element.getBoundingClientRect().top + window.scrollY

      const start = elementTop - viewportHeight * offsetStart
      const end = elementTop + elementHeight - viewportHeight * offsetEnd

      setBounds([start, end])
    }

    updateBounds()

    const resizeObserver = new ResizeObserver(updateBounds)
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current)
    }

    const handleScroll = () => {
      updateBounds()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [elementRef, offsetStart, offsetEnd])

  const transform = useTransform(scrollYMotion, bounds, [0, 1], {
    clamp: true
  })

  useMotionValueEvent(transform, 'change', (value) => {
    progress.set(value)
  })

  return progress
}

/**
 * Hook for creating parallax effects based on section scroll progress.
 * Sections are tracked by element refs passed by the caller (ScrollProvider
 * no longer exposes sectionRefs).
 */
export function useSectionParallax(
  sectionRef: RefObject<HTMLElement>,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  return useParallax(sectionRef, offsetStart, offsetEnd)
}

/**
 * Hook for checking if an element is in viewport
 */
export function useElementInView(
  elementRef: RefObject<HTMLElement>,
  threshold: number = 0.1
): MotionValue<boolean> {
  const { scrollYMotion } = useScrollContext()
  const [elementInfo, setElementInfo] = useState<{
    height: number
    minVisible: number
    getTop: () => number
  } | null>(null)
  const isVisible = useMotionValue(false)

  useEffect(() => {
    if (!elementRef?.current) {
      setElementInfo(null)
      return
    }

    const element = elementRef.current
    const elementHeight = element.offsetHeight

    const getTop = () => {
      if (!elementRef.current) return 0
      return elementRef.current.getBoundingClientRect().top + window.scrollY
    }

    setElementInfo({
      height: elementHeight,
      minVisible: elementHeight * threshold,
      getTop
    })

    const resizeObserver = new ResizeObserver(() => {
      if (!elementRef.current) return
      setElementInfo({
        height: elementRef.current.offsetHeight,
        minVisible: elementRef.current.offsetHeight * threshold,
        getTop
      })
    })
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [elementRef, threshold])

  const transform = useTransform(scrollYMotion, (scrollPos) => {
    if (!elementInfo) return false

    const elementTop = elementInfo.getTop()
    const elementBottom = elementTop + elementInfo.height
    const viewportHeight = window.innerHeight
    const viewportTop = scrollPos
    const viewportBottom = scrollPos + viewportHeight

    const visibleTop = Math.max(elementTop, viewportTop)
    const visibleBottom = Math.min(elementBottom, viewportBottom)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)

    return visibleHeight >= elementInfo.minVisible
  })

  useMotionValueEvent(transform, 'change', (value) => {
    isVisible.set(value)
  })

  return isVisible
}

/**
 * Hook for creating parallax effects triggered by a different element's scroll position
 */
export function useCrossSectionParallax(
  triggerRef: RefObject<HTMLElement>,
  _targetRef?: RefObject<HTMLElement>,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  return useParallax(triggerRef, offsetStart, offsetEnd)
}
