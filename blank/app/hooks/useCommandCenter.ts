"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  getAutocompleteRoutes,
  getNavigationPath,
  isValidRoute,
} from "@/app/utils/routes";
import { getAutocompleteCodes, findCodeByCode, isValidPublicCode } from "@/app/utils/codes";
import { validateSecretCode, type ValidationResponse } from "@/app/utils/encrypt_secrets";
import { evaluate, canEvaluate, type EvaluateResult } from "@/app/utils/evaluate";
import { PORTFOLIO_PRELOADER_HANDOFF_KEY } from "@/app/utils/preloader";
import { useOptionalPreloaderContext } from "@/app/context/PreloaderContext";

export function useCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [secretCodeValidation, setSecretCodeValidation] = useState<ValidationResponse | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const preloaderContext = useOptionalPreloaderContext();

  const routeSuggestions = useMemo(() => {
    const trimmed = inputValue.trim();
    return trimmed.startsWith("/") ? getAutocompleteRoutes(trimmed) : [];
  }, [inputValue]);

  const codeSuggestions = useMemo(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed.startsWith("/")) return [];
    return getAutocompleteCodes(trimmed);
  }, [inputValue]);

  const resetCommandCenter = useCallback(() => {
    setIsOpen(false);
    setInputValue("");
    setSelectedIndex(0);
    setSecretCodeValidation(null);
    setEvaluationResult(null);
    setIsEvaluating(false);
    setIsValidatingCode(false);
  }, []);

  const handleInputValueChange = useCallback((value: string) => {
    setInputValue(value);
    setSelectedIndex(0);
    setSecretCodeValidation(null);
    setEvaluationResult(null);
    setIsEvaluating(false);
    setIsValidatingCode(false);
  }, []);

  const isPreloaderVisible = useCallback(() => {
    const fromContext = Boolean(preloaderContext?.showPreloader && !preloaderContext?.isPreloaderDone);
    if (fromContext) return true;
    if (typeof document === "undefined") return false;
    return Boolean(document.querySelector('[data-preloader-active="true"]'));
  }, [preloaderContext?.isPreloaderDone, preloaderContext?.showPreloader]);

  const isMobileViewport = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || "ontouchstart" in window;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === " ") {
        event.preventDefault();
        if (isMobileViewport() || isPreloaderVisible()) return;

        setIsOpen((prev) => {
          const next = !prev;
          if (next) {
            setInputValue("");
            setSelectedIndex(0);
            setSecretCodeValidation(null);
            setEvaluationResult(null);
          }
          return next;
        });
      }

      if (event.key === "Escape" && isOpen) {
        resetCommandCenter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPreloaderVisible, resetCommandCenter]);

  useEffect(() => {
    if (!isOpen || !isPreloaderVisible()) return;
    const timeoutId = window.setTimeout(() => {
      resetCommandCenter();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, isPreloaderVisible, resetCommandCenter]);

  useEffect(() => {
    const trimmedInput = inputValue.trim();
    if (
      !trimmedInput ||
      trimmedInput.startsWith("/") ||
      codeSuggestions.length > 0 ||
      isValidPublicCode(trimmedInput) ||
      !canEvaluate(trimmedInput)
    ) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsEvaluating(true);
      const result = await evaluate(trimmedInput);
      setEvaluationResult(result);
      setIsEvaluating(false);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [inputValue, codeSuggestions.length]);

  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (
      !trimmedInput ||
      trimmedInput.startsWith("/") ||
      codeSuggestions.length > 0 ||
      isValidPublicCode(trimmedInput) ||
      canEvaluate(trimmedInput)
    ) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsValidatingCode(true);
      const result = await validateSecretCode(trimmedInput);
      setSecretCodeValidation(result);
      setIsValidatingCode(false);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [inputValue, codeSuggestions.length]);

  const handleNavigate = (path: string): boolean => {
    const trimmedPath = path.trim();

    if (!trimmedPath.startsWith("/")) {
      return false;
    }

    if (!isValidRoute(trimmedPath)) {
      return false;
    }

    router.push(getNavigationPath(trimmedPath));
    resetCommandCenter();
    return true;
  };

  const executeAction = (action: string): boolean => {
    switch (action) {
      case "refresh_page":
        window.location.reload();
        return true;
      case "contact_me":
        window.open("mailto:ienzovillarama@gmail.com", "_blank", "noopener,noreferrer");
        resetCommandCenter();
        return true;
      case "go_home":
        router.push("/");
        resetCommandCenter();
        return true;
      case "go_portfolio":
        router.push("/portfolio");
        resetCommandCenter();
        return true;
      case "go_portfolio_with_preloader":
        sessionStorage.setItem(PORTFOLIO_PRELOADER_HANDOFF_KEY, "true");
        router.push("/portfolio");
        resetCommandCenter();
        return true;
      case "go_ily":
        router.push("/ily");
        resetCommandCenter();
        return true;
      default:
        return false;
    }
  };

  const handlePublicCode = (codeString: string): boolean => {
    const code = findCodeByCode(codeString);
    if (!code) return false;
    return executeAction(code.action);
  };

  const handleSecretCommand = async (command: string): Promise<boolean> => {
    const result = await validateSecretCode(command);
    if (!result.valid || !result.action) return false;
    return executeAction(result.action);
  };

  const handleFallbackSearch = (rawInput: string): boolean => {
    const trimmedInput = rawInput.trim();
    if (!trimmedInput) return false;

    const startsWithNonAlphanumeric = /^[^a-zA-Z0-9]/.test(trimmedInput);
    if (startsWithNonAlphanumeric) {
      resetCommandCenter();
      return true;
    }

    const googlePrefixRegex = /^google:\s*/i;
    const searchQuery = googlePrefixRegex.test(trimmedInput)
      ? trimmedInput.replace(googlePrefixRegex, "").trim()
      : trimmedInput;

    if (!searchQuery) {
      resetCommandCenter();
      return true;
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, "_blank", "noopener,noreferrer");
    resetCommandCenter();
    return true;
  };

  const handleInputKeyDown = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      inputRef.current?.select();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedInput = inputValue.trim();

      if (!trimmedInput) {
        resetCommandCenter();
        return;
      }

      if (evaluationResult?.success && evaluationResult.input === trimmedInput) {
        resetCommandCenter();
        return;
      }

      let handled = false;

      if (trimmedInput.startsWith("/")) {
        if (routeSuggestions.length > 0 && selectedIndex < routeSuggestions.length) {
          handled = handleNavigate(routeSuggestions[selectedIndex].path);
        } else {
          handled = handleNavigate(trimmedInput);
        }

        // For route-like inputs, do not fall back to search. Close gracefully if invalid.
        if (!handled) {
          resetCommandCenter();
        }
        return;
      } else {
        if (codeSuggestions.length > 0 && selectedIndex < codeSuggestions.length) {
          handled = handlePublicCode(codeSuggestions[selectedIndex].code);
        }

        if (!handled && isValidPublicCode(trimmedInput)) {
          handled = handlePublicCode(trimmedInput);
        }

        if (!handled) {
          handled = await handleSecretCommand(trimmedInput);
        }
      }

      if (!handled && canEvaluate(trimmedInput)) {
        const result = await evaluate(trimmedInput);
        if (result.success) {
          setEvaluationResult(result);
          return;
        }
      }

      if (!handled) {
        handleFallbackSearch(trimmedInput);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const suggestionCount = inputValue.trim().startsWith("/")
        ? routeSuggestions.length
        : codeSuggestions.length;
      const maxIndex = suggestionCount - 1;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleSuggestionClick = (path: string) => {
    handleNavigate(path);
  };

  const handleCodeSuggestionClick = (code: string) => {
    handlePublicCode(code);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return {
    isOpen,
    inputValue,
    selectedIndex,
    isValidatingCode,
    secretCodeValidation,
    evaluationResult,
    isEvaluating,
    inputRef,
    routeSuggestions,
    codeSuggestions,
    setIsOpen,
    setInputValue: handleInputValueChange,
    setSelectedIndex,
    handleInputKeyDown,
    handleSuggestionClick,
    handleCodeSuggestionClick,
    handlePublicCode,
  };
}

