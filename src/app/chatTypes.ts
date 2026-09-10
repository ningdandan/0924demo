// ── Card types ───────────────────────────────────────────────────────────────

export type CardType = "assign_module" | "send_notification" | "confirmation" | "action_tiles" | "learner_progress" | "module_stepper" | "extend_deadline" | "specialist_chat" | "student_readiness" | "feedback_form";

export interface CardButton {
  label: string;
  variant: "primary" | "secondary";
}

export interface ActionTileItem {
  label: string;
  recommended?: boolean;
  expandCard?: ChatCard;
}

/** Shared card metadata — every card has these */
export interface CardMeta {
  type: CardType;
  title: string;          // card header title
  statusLabel: string;    // the chip text  e.g. "REVIEW & CONFIRM"
  statusColor: "purple" | "green" | "blue" | "gray";
  footerNote: string;
  buttons: CardButton[];  // ordered list; first primary is the CTA
}

export interface AssignModuleCard extends CardMeta {
  type: "assign_module";
  // done / complete state shown after primary button is clicked
  doneStatusLabel: string;
  doneStatusColor: "purple" | "green" | "blue" | "gray";
  doneMessage: string;
  doneDescription: string;
  doneFooterNote: string;
}

export interface SendNotificationCard extends CardMeta {
  type: "send_notification";
  // sent state
  sentStatusLabel: string;
  sentStatusColor: "green";
  sentMessage: string;
}

export interface ConfirmationCard extends CardMeta {
  type: "confirmation";
  successMessage: string;
  description: string;
}

export interface ActionTilesCard extends CardMeta {
  type: "action_tiles";
  tilesTitle: string;
  tiles: ActionTileItem[];
}

export interface LearnerProgressModule {
  name: string;
  status: "not_started" | "completed";
  score?: string;
}

export interface LearnerProgressCard extends CardMeta {
  type: "learner_progress";
  modules: LearnerProgressModule[];
}

export interface StudentReadinessStudent {
  name: string;
  photo: string;
  learningStyle: string;
  learningStyleIcon: string;
}

export interface StudentReadinessCard extends CardMeta {
  type: "student_readiness";
  students: StudentReadinessStudent[];
  explanation: string;
  tilesTitle?: string;
  tiles?: ActionTileItem[];
}

export interface ModuleStepperCard extends CardMeta {
  type: "module_stepper";
}

export interface ExtendDeadlineCard extends CardMeta {
  type: "extend_deadline";
  assignment: string;
  currentDeadline: string;
  suggestedDeadline: string;
}

export interface SpecialistChatCard extends CardMeta {
  type: "specialist_chat";
  specialistName: string;
  specialistRole: string;
  introMessage: string;
}

export interface FeedbackFormCard extends CardMeta {
  type: "feedback_form";
}

export type ChatCard =
  | AssignModuleCard
  | SendNotificationCard
  | ConfirmationCard
  | ActionTilesCard
  | LearnerProgressCard
  | ModuleStepperCard
  | ExtendDeadlineCard
  | SpecialistChatCard
  | StudentReadinessCard
  | FeedbackFormCard;

// ── Message types ─────────────────────────────────────────────────────────────

export type MessageRole = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;           // plain text (empty string if only a card)
  citations?: string[];      // only for agent messages
  card?: ChatCard;           // at most one card per message
  // timestamp is auto-generated at runtime, not stored in tokens
}

// ── Full chat script ──────────────────────────────────────────────────────────

export interface ChatScript {
  messages: ChatMessage[];
}
