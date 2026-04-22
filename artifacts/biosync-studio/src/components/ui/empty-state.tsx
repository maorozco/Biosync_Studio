import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  kbd?: string; // keyboard hint for secondary
}

/**
 * EmptyState — componente reusable para pages sin data.
 * Pattern: icon monocromo teal 40% + 1 frase problema + 1 CTA primario
 * (Pencil&Paper rule). Mantiene aesthetic Mission Control.
 */
export default function EmptyState({
  icon,
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  kbd,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "var(--bs-bg-3)",
          border: "1px solid var(--bs-border-subtle)",
          fontSize: 32,
          opacity: 0.7,
        }}
      >
        {icon}
      </div>
      <h2
        className="text-xl font-bold bs-h-tight mb-2"
        style={{ color: "var(--bs-text-primary)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm max-w-md leading-relaxed mb-6"
          style={{ color: "var(--bs-text-muted)" }}
        >
          {subtitle}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 justify-center">
        {primaryLabel && onPrimary && (
          <button
            type="button"
            onClick={onPrimary}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: "var(--bs-accent)",
              color: "var(--bs-bg-1)",
              boxShadow: "0 0 16px rgba(0, 229, 204, 0.25)",
            }}
          >
            {primaryLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 inline-flex items-center gap-2"
            style={{
              color: "var(--bs-text-secondary)",
              border: "1px solid var(--bs-border-default)",
            }}
          >
            {secondaryLabel}
            {kbd && (
              <kbd
                className="bs-mono text-[10px] px-1 rounded"
                style={{
                  background: "rgba(0,229,204,0.12)",
                  color: "var(--bs-accent)",
                }}
              >
                {kbd}
              </kbd>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
