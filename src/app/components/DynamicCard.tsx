import type { ReactNode } from "react";
import {
  CARD_BODY,
  CARD_FOOTER,
  CARD_HEADER,
  CARD_TITLE,
  CARD_WRAP,
  CHIP,
  BTN_PRIMARY,
  BTN_SECONDARY,
} from "./cardStyles";
import { useTheme } from "../ThemeContext";

export type DynamicCardAccent =
  | "default"
  | "danger"
  | "success"
  | "info"
  | "warning"
  | "urgent";

export type DynamicCardBadgeTone =
  | "neutral"
  | "danger"
  | "success"
  | "info"
  | "warning"
  | "urgent";

const ACCENT_BORDER: Record<DynamicCardAccent, string> = {
  default: "",
  danger: "border-l-4 border-l-red-500",
  urgent: "border-l-4 border-l-red-500",
  success: "border-green-200",
  info: "border-blue-200",
  warning: "border-l-4 border-l-amber-500",
};

const BADGE_CHIP: Record<DynamicCardBadgeTone, string> = {
  neutral: CHIP.gray,
  danger:
    "px-[10px] py-1 bg-red-100 text-red-700 font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  urgent:
    "px-[10px] py-1 bg-red-100 text-red-700 font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  success: CHIP.green,
  info: CHIP.blue,
  warning: CHIP.amber,
};

/** Shared dynamic card shell — app cardStyles / theme gradient. */
export function DynamicCard({
  title,
  badge,
  children,
  footer,
  meta,
  accent = "default",
  className = "",
}: {
  title: ReactNode;
  badge?: { label: string; tone?: DynamicCardBadgeTone };
  children: ReactNode;
  footer?: ReactNode;
  meta?: ReactNode;
  accent?: DynamicCardAccent;
  className?: string;
}) {
  return (
    <div className={`${CARD_WRAP} ${ACCENT_BORDER[accent]} ${className}`.trim()}>
      <div className={CARD_HEADER}>
        <div className={`min-w-0 flex-1 ${CARD_TITLE}`}>{title}</div>
        {badge && <StatusBadge label={badge.label} tone={badge.tone} />}
      </div>
      <div className={`${CARD_BODY} space-y-[12px]`}>{children}</div>
      {footer && <div className={CARD_FOOTER}>{footer}</div>}
      {meta && (
        <div className="px-6 pb-[12px] font-body text-[11px] text-ui-muted">{meta}</div>
      )}
    </div>
  );
}

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: DynamicCardBadgeTone;
}) {
  return <span className={`shrink-0 ${BADGE_CHIP[tone]}`}>{label}</span>;
}

export function CardActions({
  secondary,
  primary,
}: {
  secondary?: ReactNode;
  primary: ReactNode;
}) {
  if (!secondary) return <div className="w-full">{primary}</div>;
  return (
    <div className="flex gap-[12px]">
      <div className="flex-1">{secondary}</div>
      <div className="flex-1">{primary}</div>
    </div>
  );
}

export function CardPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full ${BTN_PRIMARY}`}
      style={{ backgroundImage: theme.gradient }}
    >
      {children}
    </button>
  );
}

export function CardSecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full ${BTN_SECONDARY}`}
    >
      {children}
    </button>
  );
}
