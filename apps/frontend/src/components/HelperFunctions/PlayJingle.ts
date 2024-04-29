export default function PlayJingle(id: string) {
  const audioElement: HTMLAudioElement = document.getElementById(
    id,
  ) as HTMLAudioElement;
  if (audioElement) {
    audioElement.currentTime = 0; // Rewind to start
    audioElement.load();
    audioElement.play(); // Play the jingle
  }
}
