import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fontsource/parisienne/latin-400.css";
import "@fontsource/italiana/latin-400.css";
import { wedding } from "../config/wedding";
import { OriginalCoverArt } from "./OriginalCoverArt";
import "./original-cover.css";
const imagePetals = [
  new URL("../../Fotos/1.PNG", import.meta.url).href,
  new URL("../../Fotos/2.PNG", import.meta.url).href,
  new URL("../../Fotos/3.PNG", import.meta.url).href,
  new URL("../../Fotos/4.PNG", import.meta.url).href,
];
export function Cover() {
  const [opening, setOpening] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => () => clearTimeout(timer.current), []);
  const petals = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateVisibility = () => {
      petals.current?.classList.toggle("is-paused", document.hidden);
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);
  function open() {
    if (locked.current) return;
    locked.current = true;
    setOpening(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => navigate("/convite"), reduced ? 180 : 2100);
  }
  return <main className={`paper-cover${opening ? " is-opening" : ""}`}>
    <div className="paper-flowers" aria-hidden="true">{["tl","tr","bl","br"].map(corner => <div key={corner} className={`paper-flower paper-flower--${corner}`}><OriginalCoverArt /></div>)}</div>
    <div className="paper-petals" ref={petals} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span className="paper-petal" key={index}>
          <svg viewBox="0 0 24 30" focusable="false"><path d="M19 2C9-3-2 8 2 19c3 9 13 13 18 5 5-8 4-16-1-22Z" fill="currentColor"/><path d="M18 4C9 10 7 18 10 25" fill="none" stroke="#fffaf2" strokeOpacity=".4" strokeWidth=".7"/></svg>
        </span>
      ))}
      {Array.from({ length: 6 }, (_, index) => (
        <span className="paper-petal paper-petal--image" key={`image-${index}`}>
          <img src={imagePetals[index % imagePetals.length]} alt="" draggable={false} />
        </span>
      ))}
    </div>
    <div className="paper-composition">
      <header className="paper-heading"><p>Um convite especial para você</p><h1>{wedding.names}</h1><p className="paper-message">Convidamos você para celebrar o nosso casamento.</p></header>
      <div className="envelope-stage">
        <div className="paper-envelope">
          <div className="envelope-back" aria-hidden="true" />
          <div className="envelope-card" aria-hidden={!opening}><p className="card-names">{wedding.names}</p><span className="card-divider" aria-hidden="true"/><p>Com carinho, convidamos você para o nosso casamento</p></div>
          <div className="envelope-front" aria-hidden="true" />
          <div className="envelope-flap" aria-hidden="true" />
          <button className="envelope-seal" aria-label="Abrir convite" disabled={opening} onClick={open}><OriginalCoverArt seal /></button>
        </div>
      </div>
      <p className="paper-hint">Toque no selo para abrir</p>
      <Link className="paper-skip quiet-link" to="/convite" onClick={e => {if(locked.current)e.preventDefault();}}>Pular abertura</Link>
    </div>
    <span className="sr-only" role="status">{opening ? "Abrindo convite…" : ""}</span>
  </main>;
}
