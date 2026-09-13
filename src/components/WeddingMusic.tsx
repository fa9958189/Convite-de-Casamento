import { useEffect, useRef, useState } from "react";

export function WeddingMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef(false);
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
      onPlaying={() => { setPlaying(true); setFailed(false); }}
      onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onError={() => { setAvailable(false); setPlaying(false); }} />
    {available && <div className="wedding-music">
      <button className="wedding-directions" onClick={toggleMusic}>
        <svg width="16" height="18" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17V5l10-3v12M7 8l10-3"/><ellipse cx="4" cy="18" rx="3" ry="2.5"/><ellipse cx="14" cy="15" rx="3" ry="2.5"/></svg>
        {playing ? "Pausar música" : "Tocar nossa trilha sonora"}
      </button>
      {failed && <p className="music-status" role="status">Não foi possível iniciar a música. Tente novamente.</p>}
    </div>}
  </>;
}
