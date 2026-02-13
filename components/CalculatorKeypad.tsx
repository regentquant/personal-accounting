"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./ui/Icon";

interface CalculatorKeypadProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  onDone: (finalValue: number) => void;
  currency?: "CNY" | "USD";
}

type Operator = "+" | "-" | "×" | "÷";

export function CalculatorKeypad({
  isOpen,
  onClose,
  value,
  onChange,
  onDone,
  currency = "CNY",
}: CalculatorKeypadProps) {
  const [expression, setExpression] = useState(value || "");
  const [result, setResult] = useState<number | null>(null);
  const keypadRef = useRef<HTMLDivElement>(null);
  
  // Use refs to store latest handlers for keyboard events
  const handlersRef = useRef({
    handleNumber: null as any,
    handleOperator: null as any,
    handleBackspace: null as any,
    handleClear: null as any,
    handleDone: null as any,
  });

  // Sync external value with internal expression
  useEffect(() => {
    if (isOpen) {
      if (value) {
        setExpression(value);
        setResult(parseFloat(value) || null);
      } else {
        setExpression("");
        setResult(null);
      }
    }
  }, [isOpen, value]);

  // Calculate result from expression
  const calculateResult = useCallback((expr: string): number | null => {
    if (!expr || expr.trim() === "") return null;

    try {
      // Replace display operators with JS operators
      let sanitized = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/[^0-9+\-*/.\s]/g, "");

      // Remove trailing operators and whitespace
      sanitized = sanitized.trim().replace(/[+\-*/]+$/, "");

      if (!sanitized || sanitized.trim() === "") return null;

      // Evaluate the expression safely
      const evalResult = Function('"use strict"; return (' + sanitized + ")")();
      
      if (typeof evalResult === "number" && !isNaN(evalResult) && isFinite(evalResult)) {
        // Round to 2 decimal places
        return Math.round(evalResult * 100) / 100;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Update result when expression changes
  useEffect(() => {
    const calculatedResult = calculateResult(expression);
    setResult(calculatedResult);
    // Always pass the expression to parent so decimal points are preserved
    onChange(expression);
  }, [expression, calculateResult, onChange]);

  // Haptic feedback
  const vibrate = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  // Get the last number part of the expression
  const getLastNumberPart = (expr: string): string => {
    if (!expr) return "";
    const parts = expr.split(/[+\-×÷]/);
    return parts[parts.length - 1] || "";
  };

  // Count decimal places in a number string
  const getDecimalPlaces = (numStr: string): number => {
    if (!numStr.includes(".")) return 0;
    const parts = numStr.split(".");
    return parts[1]?.length || 0;
  };

  // Handle number/decimal input
  const handleNumber = useCallback((num: string) => {
    vibrate();
    setExpression((prev) => {
      // Handle decimal point
      if (num === ".") {
        const lastPart = getLastNumberPart(prev);
        
        // If last part already has a decimal, don't add another
        if (lastPart.includes(".")) {
          return prev;
        }
        
        // If expression is empty or ends with operator, add "0."
        if (!prev || /[+\-×÷]$/.test(prev)) {
          return prev + "0.";
        }
        
        // Otherwise, just add the decimal point
        return prev + ".";
      }

      // Handle regular numbers
      const lastPart = getLastNumberPart(prev);
      
      // Limit decimal places to 2
      if (lastPart.includes(".")) {
        const decimalPlaces = getDecimalPlaces(lastPart);
        if (decimalPlaces >= 2) {
          return prev; // Don't allow more than 2 decimal places
        }
      }
      
      // Prevent multiple leading zeros (but allow 0.xx)
      if (num === "0" && lastPart === "0") {
        return prev;
      }
      
      // If last part is just "0" and we're adding a non-decimal number, replace it
      if (lastPart === "0" && num !== "." && !/[+\-×÷]/.test(prev)) {
        return num;
      }
      
      return prev + num;
    });
  }, [vibrate]);

  // Handle operator input
  const handleOperator = useCallback((op: Operator) => {
    vibrate();
    setExpression((prev) => {
      if (!prev) return "";
      
      // If expression ends with a decimal point, remove it before adding operator
      if (prev.endsWith(".")) {
        prev = prev.slice(0, -1);
      }
      
      // Replace last operator if there is one
      if (/[+\-×÷]$/.test(prev)) {
        return prev.slice(0, -1) + op;
      }
      
      return prev + op;
    });
  }, [vibrate]);

  // Handle backspace (delete last character)
  const handleBackspace = useCallback(() => {
    vibrate();
    setExpression((prev) => {
      if (prev.length <= 1) return "";
      return prev.slice(0, -1);
    });
  }, [vibrate]);

  // Handle clear all
  const handleClear = useCallback(() => {
    vibrate();
    setExpression("");
    setResult(null);
  }, [vibrate]);

  // Handle done - evaluate and close
  const handleDone = useCallback(() => {
    vibrate();
    let finalValue = 0;
    
    if (result !== null) {
      finalValue = result;
    } else if (expression) {
      // If no calculated result, try to parse the expression
      const calculatedResult = calculateResult(expression);
      finalValue = calculatedResult ?? parseFloat(expression) ?? 0;
    }
    
    onDone(Math.max(0, finalValue)); // Ensure non-negative
    onClose();
  }, [vibrate, result, expression, calculateResult, onDone, onClose]);

  // Update handlers ref
  useEffect(() => {
    handlersRef.current = {
      handleNumber,
      handleOperator,
      handleBackspace,
      handleClear,
      handleDone,
    };
  }, [handleNumber, handleOperator, handleBackspace, handleClear, handleDone]);

  // Keyboard event handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Enter key to trigger Done
      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handlersRef.current.handleDone();
        return;
      }

      // Handle Escape to close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Handle number keys
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        handlersRef.current.handleNumber(e.key);
        return;
      }

      // Handle decimal point (including Chinese period "。")
      if (e.key === "." || e.key === "," || e.key === "。") {
        e.preventDefault();
        handlersRef.current.handleNumber(".");
        return;
      }

      // Handle operators
      if (e.key === "+") {
        e.preventDefault();
        handlersRef.current.handleOperator("+");
        return;
      }
      if (e.key === "-") {
        e.preventDefault();
        handlersRef.current.handleOperator("-");
        return;
      }
      if (e.key === "*") {
        e.preventDefault();
        handlersRef.current.handleOperator("×");
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        handlersRef.current.handleOperator("÷");
        return;
      }

      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        handlersRef.current.handleBackspace();
        return;
      }

      // Handle Delete (clear all)
      if (e.key === "Delete") {
        e.preventDefault();
        handlersRef.current.handleClear();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Format display number - show expression if it ends with decimal or is being typed
  const formatDisplay = (num: number | null): string => {
    const prefix = currency === "CNY" ? "¥" : "$";
    
    // If expression ends with decimal or contains incomplete decimal, show expression
    if (expression && (expression.endsWith(".") || /\.\d*$/.test(expression))) {
      const lastPart = getLastNumberPart(expression);
      if (lastPart.includes(".") && !lastPart.match(/\.\d{2}$/)) {
        // Show expression with currency prefix
        return prefix + expression;
      }
    }
    
    if (num === null) {
      // If expression exists but no result, show the expression
      if (expression) {
        // If expression is just a number (no operators), show it as-is
        if (!/[+\-×÷]/.test(expression)) {
          return prefix + expression;
        }
        const parsed = parseFloat(expression);
        if (!isNaN(parsed)) {
          return prefix + parsed.toLocaleString("en-US", { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 2 
          });
        }
      }
      return prefix + "0";
    }
    return prefix + num.toLocaleString("en-US", { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    });
  };

  // Check if expression has operators
  const hasOperators = /[+\-×÷]/.test(expression);

  // Display expression or result
  const displayExpression = expression || "0";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Keypad Bottom Sheet - Match modal width */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div
          ref={keypadRef}
          className={cn(
            "w-full sm:max-w-lg bg-fika-cream rounded-t-3xl shadow-2xl",
            "transform transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{ maxHeight: "70vh" }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-fika-caramel rounded-full" />
          </div>

          {/* Display Area */}
          <div className="px-5 pb-4">
            {/* Expression preview (small text) */}
            {hasOperators && (
              <div className="text-right text-sm text-fika-cinnamon/70 font-medium mb-1 h-5 overflow-hidden">
                {displayExpression}
              </div>
            )}
            
            {/* Main result display */}
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-bold text-fika-espresso font-display">
                {formatDisplay(result)}
              </span>
            </div>
          </div>

          {/* Keypad Grid - Standard 4-column layout */}
          <div className="px-4 pb-6 sm:pb-8">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {/* Row 1: AC (span 3 columns), ÷ */}
              <div className="col-span-3">
                <KeypadButton onClick={handleClear} variant="function" className="w-full">
                  AC
                </KeypadButton>
              </div>
              <KeypadButton onClick={() => handleOperator("÷")} variant="operator">÷</KeypadButton>

              {/* Row 2: 7, 8, 9, × */}
              <KeypadButton onClick={() => handleNumber("7")}>7</KeypadButton>
              <KeypadButton onClick={() => handleNumber("8")}>8</KeypadButton>
              <KeypadButton onClick={() => handleNumber("9")}>9</KeypadButton>
              <KeypadButton onClick={() => handleOperator("×")} variant="operator">×</KeypadButton>

              {/* Row 3: 4, 5, 6, - */}
              <KeypadButton onClick={() => handleNumber("4")}>4</KeypadButton>
              <KeypadButton onClick={() => handleNumber("5")}>5</KeypadButton>
              <KeypadButton onClick={() => handleNumber("6")}>6</KeypadButton>
              <KeypadButton onClick={() => handleOperator("-")} variant="operator">−</KeypadButton>

              {/* Row 4: 1, 2, 3, + */}
              <KeypadButton onClick={() => handleNumber("1")}>1</KeypadButton>
              <KeypadButton onClick={() => handleNumber("2")}>2</KeypadButton>
              <KeypadButton onClick={() => handleNumber("3")}>3</KeypadButton>
              <KeypadButton onClick={() => handleOperator("+")} variant="operator">+</KeypadButton>

              {/* Row 5: 0 (span 2 columns), ., Backspace */}
              <div className="col-span-2">
                <KeypadButton onClick={() => handleNumber("0")} className="w-full">0</KeypadButton>
              </div>
              <KeypadButton onClick={() => handleNumber(".")}>.</KeypadButton>
              <KeypadButton onClick={handleBackspace} variant="function">
                <Icon name="Delete" size={20} />
              </KeypadButton>

              {/* Row 5: Done button spans full width */}
              <div className="col-span-4 mt-2">
                <KeypadButton onClick={handleDone} variant="done" className="w-full">
                  Done
                </KeypadButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Individual keypad button component
interface KeypadButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "number" | "operator" | "function" | "done";
  className?: string;
}

function KeypadButton({
  children,
  onClick,
  variant = "number",
  className,
}: KeypadButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = cn(
    "flex items-center justify-center rounded-2xl font-semibold text-xl sm:text-2xl",
    "transition-all duration-100 select-none",
    "active:scale-95 active:brightness-95",
    "min-h-[60px] sm:min-h-[70px]"
  );

  const variantClasses = {
    number: "bg-white text-fika-espresso shadow-sm hover:bg-fika-latte/50",
    operator: "bg-fika-honey/20 text-fika-honey hover:bg-fika-honey/30",
    function: "bg-fika-latte text-fika-cinnamon hover:bg-fika-caramel/50",
    done: "bg-fika-espresso text-fika-cream hover:bg-fika-mocha shadow-lg font-bold tracking-wide",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={cn(
        baseClasses,
        variantClasses[variant],
        isPressed && "scale-95 brightness-95",
        className
      )}
    >
      {children}
    </button>
  );
}
