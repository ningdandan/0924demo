import { gradients } from "../styleTokens";

// Shared visual tokens for all action cards.
// All class values use Tailwind utilities generated from @theme in theme.css.
// To retheme: change the token values in theme.css — no component edits needed.

export const CARD_WRAP      = "bg-white border border-ui-border-faint rounded-card shadow-sm overflow-hidden w-full";
export const CARD_DONE_WRAP = "bg-white border border-green-200 rounded-card shadow-sm overflow-hidden w-full";

export const CARD_HEADER = "flex items-center justify-between px-6 py-[14px] border-b border-ui-border-faint";
export const CARD_TITLE  = "font-body font-semibold text-[15px] text-ui-body";

export const CARD_BODY   = "px-6 py-4";
export const CARD_FOOTER = "px-6 py-[14px] border-t border-ui-border-faint";
export const FOOTER_NOTE = "font-body text-sm text-ui-muted";

export const FIELD_LABEL    = "font-body font-medium text-xs text-ui-muted-dark";
export const FIELD_INPUT    = "w-full px-[14px] py-[10px] bg-ui-bg-input border border-ui-border-faint rounded-input font-body text-[13px] text-ui-body focus:outline-none focus:ring-2 focus:ring-accent-indigo/20";
export const FIELD_SELECT   = "w-full px-[14px] py-[10px] bg-ui-bg-input border border-ui-border-faint rounded-input font-body text-[13px] text-ui-body focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 appearance-none";
export const FIELD_TEXTAREA = "w-full px-[14px] py-[10px] bg-ui-bg-input border border-ui-border-faint rounded-input font-body text-[13px] text-ui-body focus:outline-none focus:ring-2 focus:ring-accent-indigo/20 resize-none";

// Status chips — pass CHIP[card.statusColor] as className
export const CHIP: Record<string, string> = {
  purple: "px-[10px] py-1 bg-purple-100 text-purple font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  green:  "px-[10px] py-1 bg-green-100  text-green-brand font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  blue:   "px-[10px] py-1 bg-blue-100   text-blue-700    font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  amber:  "px-[10px] py-1 bg-amber-100  text-amber-700   font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
  gray:   "px-[10px] py-1 bg-gray-100   text-gray-600    font-body font-semibold text-[11px] rounded-chip uppercase tracking-wider",
};

// Primary CTA: use BTN_PRIMARY as className + themeStyle() as inline style for gradient
export const BTN_PRIMARY = "font-body font-semibold text-[13px] px-5 py-[11px] rounded-btn text-navy-deep transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed";

// Legacy fallback — prefer useTheme().theme.gradient at component level
export const BTN_PRIMARY_STYLE   = { backgroundImage: gradients.button.primary };
export const SEARCH_BAR_GRADIENT = BTN_PRIMARY_STYLE;

// Secondary / cancel button
export const BTN_SECONDARY = "px-5 py-[11px] border border-ui-border-faint rounded-btn font-body text-[13px] text-ui-body hover:bg-ui-bg-page transition-colors";
