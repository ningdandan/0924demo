import { CheckCircle2, Package, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  DynamicCard,
  CardActions,
  CardPrimaryButton,
  CardSecondaryButton,
} from "./DynamicCard";

/** Sample cards for the lab — not wired into product flows yet. */
export function DynamicCardGallery() {
  return (
    <div className="max-w-[920px] mx-auto px-[24px] py-[28px] space-y-[28px]">
      <header>
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af] mb-[6px]">
          Component · app CSS
        </p>
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
          Dynamic cards
        </h1>
        <p className="mt-[6px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#6b7280] max-w-[520px]">
          Shell + actions use this project&apos;s cardStyles / theme gradient — not the
          design-folder shadcn theme. Spec sheet is available in the Specs tab.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <DynamicCard
          accent="success"
          title="Password reset complete"
          badge={{ label: "Complete", tone: "success" }}
          meta="Credentials updated · just now"
          footer={
            <CardActions
              secondary={<CardSecondaryButton>Undo</CardSecondaryButton>}
              primary={
                <CardPrimaryButton>
                  <span className="inline-flex items-center justify-center gap-[6px]">
                    <ShieldCheck className="size-[14px]" /> View audit log
                  </span>
                </CardPrimaryButton>
              }
            />
          }
        >
          <div className="flex items-center gap-[8px] rounded-[10px] bg-green-50 border border-green-100 px-[12px] py-[8px]">
            <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#096]">
              Password reset successfully
            </span>
          </div>
          <dl className="space-y-[8px] font-['Plus_Jakarta_Sans',sans-serif] text-[13px]">
            <div className="flex justify-between gap-[12px]">
              <dt className="text-[#9ca3af]">Reset ID</dt>
              <dd className="text-[#1a1a2e]">RST-2026-0423</dd>
            </div>
            <div className="flex justify-between gap-[12px]">
              <dt className="text-[#9ca3af]">Email</dt>
              <dd className="text-[#1a1a2e]">your.name@company.com</dd>
            </div>
            <div className="flex justify-between gap-[12px]">
              <dt className="text-[#9ca3af]">Status</dt>
              <dd className="text-[#096]">Active</dd>
            </div>
          </dl>
        </DynamicCard>

        <DynamicCard
          accent="success"
          title="Order placed"
          badge={{ label: "Complete", tone: "success" }}
          meta="Order #PO-2026-0423 · $379"
          footer={
            <CardActions
              secondary={<CardSecondaryButton>Undo</CardSecondaryButton>}
              primary={
                <CardPrimaryButton>
                  <span className="inline-flex items-center justify-center gap-[6px]">
                    <Package className="size-[14px]" /> Track shipment
                  </span>
                </CardPrimaryButton>
              }
            />
          }
        >
          <div className="flex items-center gap-[8px] rounded-[10px] bg-green-50 border border-green-100 px-[12px] py-[8px]">
            <CheckCircle2 className="size-[14px] text-[#096] shrink-0" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#096]">
              Order placed successfully
            </span>
          </div>
          <div className="flex gap-[12px] items-center rounded-[10px] border border-[#e8e8ed] bg-[#fafafb] p-[12px]">
            <div className="size-[56px] rounded-[8px] bg-[#e8e8ed] shrink-0" />
            <div className="min-w-0">
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-[#1a1a2e]">
                LG UltraFine 27&quot;
              </p>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#9ca3af]">
                Qty 1 · Express shipping
              </p>
            </div>
          </div>
        </DynamicCard>

        <DynamicCard
          accent="urgent"
          title="Account health risk"
          badge={{ label: "Urgent", tone: "urgent" }}
          meta="Engagement −45% · last 14 days"
          footer={
            <CardActions
              secondary={<CardSecondaryButton>Dismiss</CardSecondaryButton>}
              primary={<CardPrimaryButton>Book recovery call</CardPrimaryButton>}
            />
          }
        >
          <div className="flex items-start gap-[8px] rounded-[10px] bg-red-50 border border-red-100 px-[12px] py-[8px]">
            <AlertTriangle className="size-[14px] text-red-600 shrink-0 mt-[2px]" />
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[18px] text-red-700">
              Global Corp weekly active users dropped from 13 → 7. Renewal is Jul 31.
            </p>
          </div>
        </DynamicCard>

        <DynamicCard
          accent="info"
          title="Config change ready"
          badge={{ label: "Review", tone: "info" }}
          meta="Draft · not applied"
          footer={
            <CardActions
              secondary={<CardSecondaryButton>Edit</CardSecondaryButton>}
              primary={<CardPrimaryButton>Apply change</CardPrimaryButton>}
            />
          }
        >
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[20px] text-[#374151]">
            Update SSO session timeout from 8h → 4h for the Engineering org unit.
          </p>
        </DynamicCard>
      </div>
    </div>
  );
}
