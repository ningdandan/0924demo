import { ChatScreen } from "./ChatScreen";
import type { ChatMessage } from "../chatTypes";
import content from "../content";

const MESSAGES: ChatMessage[] = content.vignette7.messages as ChatMessage[];

export function Vignette7Screen() {
  return <ChatScreen initialQuery="" scriptOverride={MESSAGES} />;
}
