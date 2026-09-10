import { ChatScreen } from "./ChatScreen";
import type { ChatMessage } from "../chatTypes";
import content from "../content";

const MESSAGES: ChatMessage[] = content.vignette5.messages as ChatMessage[];

export function Vignette5Screen() {
  return <ChatScreen initialQuery="" scriptOverride={MESSAGES} />;
}
