import { useEffect, useState } from "react";
import { wedding } from "../config/wedding";

const deadline = Date.parse(wedding.startsAt);
const remaining = () => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

export function WeddingCountdown() {
  const [seconds, setSeconds] = useState(remaining);
  useEffect(() => {
    const interval = window.setInterval(() => setSeconds(remaining()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const units = [
    [Math.floor(seconds / 86400), "Dias"],
    [Math.floor(seconds / 3600) % 24, "Horas"],
    [Math.floor(seconds / 60) % 60, "Minutos"],
    [seconds % 60, "Segundos"],
  ] as const;
  return <div className="wedding-countdown" aria-live="off">
    <p className="sr-only">Casamento em 08 de outubro de 2026, às 19h30, no fuso America/Araguaina (UTC−03:00).</p>
    {seconds === 0 ? <p className="countdown-arrived">O grande dia chegou!</p> : <div className="countdown-units">{units.map(([value, label]) => <div className="countdown-unit" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>}
  </div>;
}
