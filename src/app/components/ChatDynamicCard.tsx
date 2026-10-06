import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Package,
  ShieldCheck,
} from "lucide-react";
import type { CompanySkinId } from "../skins";
import {
  DynamicCard,
  CardActions,
  CardPrimaryButton,
  CardSecondaryButton,
  type DynamicCardAccent,
  type DynamicCardBadgeTone,
} from "./DynamicCard";

export type DynamicCardPhase = "review" | "running" | "complete" | "dismissed";

export type DynamicCardField = { label: string; value: string };

export type DynamicCardScenario = {
  id: string;
  title: string;
  reviewBadge: string;
  reviewTone: DynamicCardBadgeTone;
  accent: DynamicCardAccent;
  summary: string;
  fields: DynamicCardField[];
  steps: string[];
  primaryLabel: string;
  secondaryLabel: string;
  completeTitle: string;
  completeMessage: string;
  completeMeta: string;
  confirmationId: string;
  icon: "payment" | "shield" | "package" | "alert";
};

function ScenarioIcon({ kind }: { kind: DynamicCardScenario["icon"] }) {
  const cls = "size-[14px] shrink-0";
  if (kind === "payment") return <CreditCard className={`${cls} text-blue-600`} />;
  if (kind === "shield") return <ShieldCheck className={`${cls} text-[#096]`} />;
  if (kind === "package") return <Package className={`${cls} text-blue-600`} />;
  return <AlertTriangle className={`${cls} text-amber-600`} />;
}

/** Demo scenarios keyed by skin + query hints. */
export function buildChatDynamicScenario(
  skinId: CompanySkinId,
  query: string,
  categoryHint = "",
): DynamicCardScenario {
  const q = `${query} ${categoryHint}`.toLowerCase();

  if (skinId === "disney-plus") {
    if (q.includes("cancel") || q.includes("subscription")) {
      return {
        id: "dplus-cancel",
        title: "Cancel Disney+ subscription",
        reviewBadge: "Review",
        reviewTone: "warning",
        accent: "warning",
        summary:
          "Cancel Standard with Ads at the end of the current billing period. Profiles and watchlist stay available until then.",
        fields: [
          { label: "Plan", value: "Standard with Ads" },
          { label: "Renews", value: "Oct 28, 2026" },
          { label: "Billed by", value: "Disney+" },
        ],
        steps: [
          "Verify account ownership",
          "Schedule cancellation for renewal date",
          "Send confirmation email",
        ],
        primaryLabel: "Confirm cancel",
        secondaryLabel: "Keep plan",
        completeTitle: "Cancellation scheduled",
        completeMessage: "Disney+ will end on Oct 28, 2026. You can reactivate anytime.",
        completeMeta: "Confirmation · CXL-2026-88421",
        confirmationId: "CXL-2026-88421",
        icon: "alert",
      };
    }
    if (q.includes("password") || q.includes("login")) {
      return {
        id: "dplus-password",
        title: "Reset Disney+ password",
        reviewBadge: "Ready",
        reviewTone: "info",
        accent: "info",
        summary: "Send a secure reset link to the email on file and sign out other devices.",
        fields: [
          { label: "Email", value: "alex@email.com" },
          { label: "Devices", value: "3 signed in" },
          { label: "Last login", value: "2 hours ago" },
        ],
        steps: ["Send reset email", "Invalidate active sessions", "Confirm mailbox delivery"],
        primaryLabel: "Send reset link",
        secondaryLabel: "Cancel",
        completeTitle: "Password reset sent",
        completeMessage: "Reset link delivered. Other devices will need to sign in again.",
        completeMeta: "Credentials · RST-2026-44102",
        confirmationId: "RST-2026-44102",
        icon: "shield",
      };
    }
    return {
      id: "dplus-payment",
      title: "Update payment method",
      reviewBadge: "Review",
      reviewTone: "info",
      accent: "info",
      summary: "Replace the card on file for upcoming Disney+ renewals.",
      fields: [
        { label: "Current", value: "Visa ···· 4242" },
        { label: "New card", value: "Mastercard ···· 8910" },
        { label: "Next charge", value: "Oct 28 · $7.99" },
      ],
      steps: [
        "Validate new card with issuer",
        "Replace billing instrument",
        "Queue receipt for next renewal",
      ],
      primaryLabel: "Apply change",
      secondaryLabel: "Edit",
      completeTitle: "Payment method updated",
      completeMessage: "Mastercard ···· 8910 is now the default for Disney+ billing.",
      completeMeta: "Billing · PAY-2026-77301",
      confirmationId: "PAY-2026-77301",
      icon: "payment",
    };
  }

  if (skinId === "southwest") {
    if (q.includes("bag") || q.includes("luggage") || q.includes("claim")) {
      return {
        id: "swa-baggage",
        title: "File baggage claim",
        reviewBadge: "Ready",
        reviewTone: "info",
        accent: "info",
        summary: "Submit a delayed-bag claim for WN 1842 DAL → DEN.",
        fields: [
          { label: "Flight", value: "WN 1842 · DAL→DEN" },
          { label: "Bag tag", value: "SWA847291" },
          { label: "Priority", value: "A-List Preferred" },
        ],
        steps: [
          "Match PNR and bag tag",
          "Create claim CAS-2026-55201",
          "Notify Denver baggage desk",
        ],
        primaryLabel: "Submit claim",
        secondaryLabel: "Cancel",
        completeTitle: "Claim submitted",
        completeMessage: "Baggage desk will contact you within 24 hours with delivery options.",
        completeMeta: "Claim · CAS-2026-55201",
        confirmationId: "CAS-2026-55201",
        icon: "package",
      };
    }
    return {
      id: "swa-seat",
      title: "Change assigned seat",
      reviewBadge: "Review",
      reviewTone: "info",
      accent: "info",
      summary: "Move from 14C to 8A (window) on tomorrow’s Dallas–Denver flight.",
      fields: [
        { label: "Flight", value: "WN 1842 · Oct 7" },
        { label: "Current", value: "14C · Aisle" },
        { label: "Requested", value: "8A · Window" },
      ],
      steps: ["Check seat inventory", "Update boarding pass", "Send confirmation SMS"],
      primaryLabel: "Confirm seat",
      secondaryLabel: "Keep 14C",
      completeTitle: "Seat updated",
      completeMessage: "You’re now in 8A. Updated boarding pass is in the Southwest app.",
      completeMeta: "PNR · ABC123 · seat change",
      confirmationId: "SEAT-2026-0912",
      icon: "package",
    };
  }

  // Default (education / Power Education)
  if (q.includes("notif") || q.includes("remind") || q.includes("message")) {
    return {
      id: "edu-notify",
      title: "Send learner reminder",
      reviewBadge: "Review",
      reviewTone: "info",
      accent: "info",
      summary: "Email 12 learners who haven’t started Module 3 this week.",
      fields: [
        { label: "Cohort", value: "Fall Algebra · Period 2" },
        { label: "Recipients", value: "12 learners" },
        { label: "Channel", value: "Email + in-app" },
      ],
      steps: ["Build recipient list", "Personalize message", "Queue delivery"],
      primaryLabel: "Send reminder",
      secondaryLabel: "Edit",
      completeTitle: "Reminder sent",
      completeMessage: "12 learners notified. Delivery receipts will appear in Activity.",
      completeMeta: "Campaign · NTF-2026-3301",
      confirmationId: "NTF-2026-3301",
      icon: "package",
    };
  }

  return {
    id: "edu-assign",
    title: "Assign enrichment module",
    reviewBadge: "Review",
    reviewTone: "info",
    accent: "info",
    summary: "Assign “Fractions bootcamp” to Sophia Patel with a Friday deadline.",
    fields: [
      { label: "Learner", value: "Sophia Patel" },
      { label: "Module", value: "Fractions bootcamp" },
      { label: "Due", value: "Fri · Oct 10" },
    ],
    steps: ["Check readiness score", "Create assignment", "Notify guardian"],
    primaryLabel: "Assign module",
    secondaryLabel: "Cancel",
    completeTitle: "Module assigned",
    completeMessage: "Sophia and her guardian were notified. Progress will show on the roster.",
    completeMeta: "Assignment · ASN-2026-1104",
    confirmationId: "ASN-2026-1104",
    icon: "shield",
  };
}

interface ChatDynamicCardProps {
  scenario: DynamicCardScenario;
  /** Instant mode skips step animation delays. */
  instant?: boolean;
  onPhaseChange?: (phase: DynamicCardPhase) => void;
}

/**
 * Interactive dynamic card for chat — review → running steps → complete / dismissed.
 */
export function ChatDynamicCard({
  scenario,
  instant = false,
  onPhaseChange,
}: ChatDynamicCardProps) {
  const [phase, setPhase] = useState<DynamicCardPhase>("review");
  const [stepIndex, setStepIndex] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const setPhaseSafe = (next: DynamicCardPhase) => {
    setPhase(next);
    onPhaseChange?.(next);
  };

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const runAutomation = () => {
    clearTimers();
    setPhaseSafe("running");
    setStepIndex(0);

    if (instant) {
      setStepIndex(scenario.steps.length - 1);
      setPhaseSafe("complete");
      return;
    }

    scenario.steps.forEach((_, i) => {
      const t = setTimeout(() => {
        setStepIndex(i);
        if (i === scenario.steps.length - 1) {
          const done = setTimeout(() => setPhaseSafe("complete"), 700);
          timers.current.push(done);
        }
      }, 650 + i * 750);
      timers.current.push(t);
    });
  };

  if (phase === "dismissed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-[8px] rounded-[12px] border border-[#e8e8ed] bg-[#fafafb] px-[14px] py-[10px]"
      >
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#6b7280]">
          Task cancelled — no changes applied.
        </p>
      </motion.div>
    );
  }

  const badge =
    phase === "complete"
      ? { label: "Complete", tone: "success" as const }
      : phase === "running"
        ? { label: "In progress", tone: "info" as const }
        : { label: scenario.reviewBadge, tone: scenario.reviewTone };

  const accent = phase === "complete" ? "success" : scenario.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className="mt-[8px] w-full max-w-[420px]"
    >
      <DynamicCard
        accent={accent}
        title={phase === "complete" ? scenario.completeTitle : scenario.title}
        badge={badge}
        meta={
          phase === "complete"
            ? scenario.completeMeta
            : phase === "running"
              ? "Live automation · do not refresh"
              : "Draft · awaiting confirmation"
        }
        footer={
          phase === "review" ? (
            <CardActions
              secondary={
                <CardSecondaryButton onClick={() => setPhaseSafe("dismissed")}>
                  {scenario.secondaryLabel}
                </CardSecondaryButton>
              }
              primary={
                <CardPrimaryButton onClick={runAutomation}>
                  {scenario.primaryLabel}
                </CardPrimaryButton>
              }
            />
          ) : phase === "complete" ? (
            <CardActions
              primary={
                <CardPrimaryButton onClick={() => {}}>
                  <span className="inline-flex items-center justify-center gap-[6px]">
                    <CheckCircle2 className="size-[14px]" />
                    View confirmation
                  </span>
                </CardPrimaryButton>
              }
            />
          ) : undefined
        }
      >
        <AnimatePresence mode="wait">
          {phase === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-[12px]"
            >
              <div className="flex items-start gap-[8px] rounded-[10px] bg-blue-50 border border-blue-100 px-[12px] py-[8px]">
                <ScenarioIcon kind={scenario.icon} />
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] text-[#374151]">
                  {scenario.summary}
                </p>
              </div>
              <dl className="space-y-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px]">
                {scenario.fields.map((f) => (
                  <div key={f.label} className="flex justify-between gap-[12px]">
                    <dt className="text-[#9ca3af]">{f.label}</dt>
                    <dd className="text-[#1a1a2e] text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}

          {phase === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-[10px]"
            >
              {scenario.steps.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-[10px] rounded-[10px] px-[12px] py-[8px] border transition-colors ${
                      active
                        ? "bg-blue-50 border-blue-100"
                        : done
                          ? "bg-green-50 border-green-100"
                          : "bg-[#fafafb] border-[#e8e8ed]"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
                    ) : active ? (
                      <Loader2 className="size-[14px] text-blue-600 shrink-0 animate-spin" />
                    ) : (
                      <span className="size-[14px] rounded-full border border-[#d1d5db] shrink-0" />
                    )}
                    <span
                      className={`font-['Plus_Jakarta_Sans',sans-serif] text-[13px] ${
                        done
                          ? "text-[#096]"
                          : active
                            ? "text-[#1a1a2e] font-medium"
                            : "text-[#9ca3af]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="space-y-[12px]"
            >
              <div className="flex items-center gap-[8px] rounded-[10px] bg-green-50 border border-green-100 px-[12px] py-[8px]">
                <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#096]">
                  {scenario.completeMessage}
                </span>
              </div>
              <dl className="space-y-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px]">
                <div className="flex justify-between gap-[12px]">
                  <dt className="text-[#9ca3af]">Confirmation</dt>
                  <dd className="text-[#1a1a2e] font-medium">{scenario.confirmationId}</dd>
                </div>
                {scenario.fields.slice(0, 2).map((f) => (
                  <div key={f.label} className="flex justify-between gap-[12px]">
                    <dt className="text-[#9ca3af]">{f.label}</dt>
                    <dd className="text-[#1a1a2e] text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </DynamicCard>
    </motion.div>
  );
}
