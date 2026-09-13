import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { WeddingRSVP } from "./WeddingRSVP";
import { WeddingMusic } from "./WeddingMusic";
import { Link } from "react-router-dom";
import { wedding } from "../config/wedding";
import { OriginalCoverArt } from "./OriginalCoverArt";
import "./invitation-page.css";

export function Invitation() {
  const hearts = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => hearts.current?.classList.toggle("is-paused", document.hidden);
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return (
    <main className="wedding-page">
      <div className="wedding-florals" aria-hidden="true">
        {["tl", "tr", "bl", "br", "ml", "mr", "al", "ar"].map(corner => <div key={corner} className={`wedding-floral wedding-floral--${corner}`}><OriginalCoverArt /></div>)}
      </div>
      <div className="wedding-hearts" ref={hearts} aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => <span key={i} style={{ "--x": `${i % 2 ? 96 - (i % 5) * 2 : 1 + (i % 5) * 2}%`, "--size": `${14 + i % 5 * 4}px`, "--duration": `${10 + i % 9}s`, "--delay": `${-1 - i * 1.7}s`, "--color": i % 2 ? "#D77989" : "#C44754" } as CSSProperties}><svg viewBox="0 0 24 24" focusable="false"><path d="M12 21C9 18 2 13 2 7.5 2 1.5 9 1 12 6c3-5 10-4.5 10 1.5C22 13 15 18 12 21Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" /></svg></span>)}
      </div>
      <div className="wedding-content">
        <header className="wedding-opening">
          <WeddingMusic />
          <figure className="wedding-portrait"><img src={wedding.photo.src} alt={wedding.photo.alt} width="960" height="1280" fetchPriority="high" /></figure>
          <h1>{wedding.names}</h1>
        </header>
        <p className="wedding-message">{wedding.message}</p>
        <section className="wedding-ceremony" aria-labelledby="ceremony-heading">
          <div className="ceremony-floral" aria-hidden="true"><OriginalCoverArt /></div>
          <span className="wedding-rule" aria-hidden="true" />
          <h2 id="ceremony-heading">O grande dia</h2>
          <p className="wedding-date"><time dateTime="2026-10-08">{wedding.date}</time></p>
          <p className="wedding-time">{wedding.time}</p>
          <p className="wedding-location">{wedding.location}<br />{wedding.locationDetail}</p>
          <a className="wedding-directions" href={wedding.directions} target="_blank" rel="noopener noreferrer">Como chegar à igreja <span aria-hidden="true">↗</span></a>
        </section>
        <section className="wedding-album" aria-label="Fotos de Philipe e Vanessa">
          {wedding.album.map(photo => <figure key={photo.src}><img src={photo.src} alt={photo.alt} width="800" height="1067" loading="lazy" decoding="async" /></figure>)}
        </section>
        <footer className="wedding-closing">
          <p>{wedding.closing}</p>
          <p className="wedding-signature">Com carinho, Philipe & Vanessa.</p>
          <WeddingRSVP />
          <Link className="quiet-link" to="/">← Voltar à capa</Link>
        </footer>
      </div>
    </main>
  );
}
