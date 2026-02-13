"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-fika-mocha/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal - bottom sheet on mobile, centered dialog on desktop */}
      <div
        className={cn(
          "relative w-full sm:max-w-lg bg-white shadow-xl animate-scale-in",
          "rounded-t-2xl sm:rounded-3xl",
          "max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-fika-latte flex-shrink-0">
            <h2 className="font-display text-base sm:text-xl font-semibold text-fika-espresso">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-fika-cinnamon hover:bg-fika-latte hover:text-fika-espresso transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

