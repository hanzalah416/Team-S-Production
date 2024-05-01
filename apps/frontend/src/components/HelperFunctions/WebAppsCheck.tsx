import SpeechNavigate from "../nav_bar/SpeechNavigate.tsx";

export function WebAppsCheck() {
  if (
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) &&
    (window.SpeechGrammarList || window.webkitSpeechGrammarList)
  ) {
    return (
      <div className={"micVisibility"}>
        <SpeechNavigate />
      </div>
    );
  } else {
    return <div></div>;
  }
}
