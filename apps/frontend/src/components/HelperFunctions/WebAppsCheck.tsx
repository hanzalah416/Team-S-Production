import SpeechNavigate from "../nav_bar/SpeechNavigate.tsx";

export default function WebAppsCheck() {
  if (
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) &&
    ("SpeechGrammarList" in window || "webkitSpeechGrammarList" in window)
  ) {
    return <SpeechNavigate />;
  }
}
