import ThemeToggle from './themetoggle'
import Links from './links'
import Arrow from './arrow'
import { homePageContent } from '../utils/text'
import { IntroContent, CTAContent } from './TextContent'

// RESPONSIVE CONFIGURATION
// Adjust these values to fine-tune the layout at different breakpoints
const LAYOUT_CONFIG = {
  // Container widths
  containerWidth: {
    mobile: 'w-[85%]',      // < 768px
    tablet: 'md:w-[80%]',   // 768px - 1024px
    desktop: 'lg:w-[75%]',  // >= 1024px
  },
  
  // Mobile 2-column grid gaps
  mobileGridGap: {
    columnSmall: 'gap-x-20',    // Column gap < 640px
    columnLarge: 'sm:gap-x-40', // Column gap >= 640px
    row: 'gap-y-4',             // Row gap (vertical spacing)
  },
  
  // Typography sizes
  typography: {
    mobile: {
      h1: 'text-xl',
      body: 'text-sm',
      cta: 'text-lg',
      ctaLarge: 'text-4xl',
      arrow: 'text-6xl',
    },
    tablet: {
      h1: 'text-2xl',
      body: 'text-base',
      cta: 'text-xl',
      ctaLarge: 'text-5xl',
      arrow: 'text-7xl',
    },
    desktop: {
      h1: 'text-2xl 2xl:text-3xl',
      body: 'text-base',
      cta: 'text-xl 2xl:text-2xl',
      ctaLarge: 'text-6xl 2xl:text-8xl',
      arrow: 'text-8xl',
    },
  },
  
  // Content area widths (percentage of center column)
  contentWidth: {
    tablet: 'w-[65%]',      // Intro text width in tablet layout
    desktop: 'w-[60%]',     // Intro text width in desktop layout
  },
  
  // Center column widths
  centerColumnWidth: {
    tablet: 'w-[50%]',      // Tablet portrait
    desktop: 'w-[45%]',     // Desktop/landscape
  },
  
  // Spacing adjustments
  spacing: {
    tabletCtaTop: 'pt-20',  // Top padding for tablet CTA section
  },
}

function Layout() {
  const { containerWidth, mobileGridGap, typography, contentWidth, centerColumnWidth, spacing } = LAYOUT_CONFIG

  return (
    <div className={`
      flex flex-col lg:flex-row 
      ${containerWidth.mobile} ${containerWidth.tablet} ${containerWidth.desktop}
      h-[95%] md:h-[90%] lg:h-[90%] 
      gap-4 md:gap-6 lg:gap-6 
      py-4 md:py-[8vh] lg:py-[10vh] 
      justify-center
    `}>
    
      {/* ============================================
          MOBILE 2-COLUMN LAYOUT (< 768px)
          Using CSS Grid with explicit rows for accurate alignment
          ============================================ */}
      <div className={`md:hidden w-full grid grid-cols-[1fr_auto] grid-rows-[auto_1fr_auto] ${mobileGridGap.columnSmall} ${mobileGridGap.columnLarge} ${mobileGridGap.row}`}>
        
        {/* Row 1, Col 1: Intro Content */}
        <div className="row-start-1 flex items-start flex-col gap-2">
          <div className = "pb-4"><ThemeToggle /></div>
          <IntroContent 
            greeting={homePageContent.intro.greeting}
            paragraphs={homePageContent.intro.paragraphs}
            greetingClassName={typography.mobile.h1}
            paragraphClassName={typography.mobile.body}
          />
        </div>
        
        {/* Row 1, Col 2: Links */}
        <div className="row-start-1 flex items-start justify-end">
          <Links />
        </div>
        
        {/* Row 3, Col 1: CTA Text */}
        <div className="row-start-3 flex flex-col gap-2">
          <CTAContent 
            prompt={homePageContent.cta.prompt}
            heading={homePageContent.cta.heading}
            promptClassName={typography.mobile.cta}
            headingClassName={typography.mobile.ctaLarge}
          />
        </div>
        
        {/* Row 3, Col 2: Arrow - perfectly aligned with CTA */}
        <div className="row-start-3 flex items-end justify-end">
          <Arrow size={typography.mobile.arrow} mailto={homePageContent.cta.mailto} />
        </div>
        
      </div>
    
      {/* ============================================
          TABLET PORTRAIT 3-COLUMN LAYOUT (768px - 1024px)
          - Left: ThemeToggle
          - Center: Content + Links + CTA
          - Right: Spacing
          ============================================ */}
      <div className="hidden md:flex lg:hidden flex-row w-full">
        
        {/* Left Spacing */}
        <div className="flex flex-1 items-start">
          <ThemeToggle />
        </div>
        
        {/* Center Content */}
        <div className={`flex flex-col ${centerColumnWidth.tablet} justify-between`}>
          
          {/* Top: Intro + Links */}
          <div className="flex flex-row justify-between gap-6">
            <div className={`flex flex-col gap-4 ${contentWidth.tablet}`}>
              <IntroContent 
                greeting={homePageContent.intro.greeting}
                paragraphs={homePageContent.intro.paragraphs}
                greetingClassName={`${typography.tablet.h1} pb-4`}
                paragraphClassName={typography.tablet.body}
              />
            </div>
            
            <div className="flex items-start">
              <Links />
            </div>
          </div>
          
          {/* Bottom: CTA */}
          <div className={`flex flex-row justify-between items-start mt-auto ${spacing.tabletCtaTop}`}>
            <div className="flex flex-col">
              <CTAContent 
                prompt={homePageContent.cta.prompt}
                heading={homePageContent.cta.heading}
                promptClassName={typography.tablet.cta}
                headingClassName={typography.tablet.ctaLarge}
              />
            </div>
            <Arrow size={typography.tablet.arrow} mailto={homePageContent.cta.mailto} />
          </div>
          
        </div>
        
        {/* Right Spacing */}
        <div className="flex flex-1"></div>
        
      </div>
    
      {/* ============================================
          DESKTOP/LANDSCAPE LAYOUT (>= 1024px)
          Figma design - 3-column with wider spacing
          ============================================ */}
      <div className="hidden lg:flex flex-row w-full">
        
        {/* Left Spacing */}
        <div className="flex flex-1 items-start">
          <ThemeToggle />
        </div>
        
        {/* Center Content */}
        <div className={`flex flex-col ${centerColumnWidth.desktop} justify-between`}>
          
          {/* Top: Intro + Links */}
          <div className="flex flex-row justify-between gap-6">
            <div className={`flex flex-col gap-4 ${contentWidth.desktop}`}>
              <IntroContent 
                greeting={homePageContent.intro.greeting}
                paragraphs={homePageContent.intro.paragraphs}
                greetingClassName={`${typography.desktop.h1} pb-4`}
                paragraphClassName={typography.desktop.body}
              />
            </div>
            
            <div className="flex items-start">
              <Links />
            </div>
          </div>
          
          {/* Bottom: CTA */}
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col">
              <CTAContent 
                prompt={homePageContent.cta.prompt}
                heading={homePageContent.cta.heading}
                promptClassName={typography.desktop.cta}
                headingClassName={typography.desktop.ctaLarge}
              />
            </div>
            <Arrow size={typography.desktop.arrow} mailto={homePageContent.cta.mailto} />
          </div>
          
        </div>
        
        {/* Right Spacing */}
        <div className="flex flex-1"></div>
        
      </div>
    </div>
  )
}

export default function Page() {
  return <Layout />
}
