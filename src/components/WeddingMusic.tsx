import { useEffect, useRef, useState } from "react";

export function WeddingMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef(false);
  const [started, setStarted] = useState(false);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = audio.current!;
    active.current = true;
    element.src = "/audio/trilha.mp3";
    return () => {
      active.current = false;
      element.pause();
      element.removeAttribute("src");
      element.load();
    };
  }, []);

  function toggleMusic() {
    const element = audio.current;
    if (!element) return;
    setFailed(false);
    if (!element.paused) element.pause();
    else element.play().catch(() => { if (active.current) setFailed(true); });
  }

  return <>
    <audio ref={audio} preload="metadata"
      onLoadedMetadata={() => setAvailable(true)}
      onPlaying={() => { setPlaying(true); setStarted(true); setFailed(false); }}
      onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onError={() => { setAvailable(false); setPlaying(false); }} />
    {available && <div className="wedding-music">
      <button className="wedding-directions" onClick={toggleMusic}>
        {playing ? "❚❚ Pausar música" : started ? "♫ Continuar nossa música" : "♫ Ouça nossa música"}
      </button>
      {failed && <p className="music-status" role="status">Não foi possível iniciar a música. Toque novamente.</p>}
    </div>}
  </>;
}
