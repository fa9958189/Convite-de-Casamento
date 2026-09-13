import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { getSupabase } from "../lib/supabase";
import { OriginalCoverArt } from "./OriginalCoverArt";

export function WeddingRSVP() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const locked = useRef(false);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (locked.current || success) return;
    const nome = name.trim();
    if (Array.from(nome).length < 2 || Array.from(nome).length > 120) {
      setInvalid(true); setMessage("Informe seu nome completo, com 2 a 120 caracteres."); input.current?.focus(); return;
    }
    setInvalid(false); locked.current = true; setSending(true); setMessage("");
    try {
      let supabase;
      try { supabase = getSupabase(); }
      catch { setMessage("A confirmação está temporariamente indisponível. Tente novamente mais tarde."); return; }
      const { error } = await supabase.from("casamento_confirmacoes").insert({ nome });
      if (error) {
        setMessage("Não foi possível confirmar sua presença. Seu nome foi mantido; tente novamente."); return;
      }
      setSuccess(true);
      setMessage("Presença confirmada! Esperamos você para celebrar conosco.");
    } catch {
      setMessage("Não recebemos a confirmação do servidor. Verifique sua conexão antes de tentar novamente.");
    } finally { locked.current = false; setSending(false); }
  }
  return <section className="wedding-rsvp" aria-label="Confirmação de presença">
    <div className="rsvp-ornaments" aria-hidden="true"><span className="rsvp-rose"><OriginalCoverArt /></span><span className="rsvp-seal"><OriginalCoverArt seal /></span><span className="rsvp-rose rsvp-rose--right"><OriginalCoverArt /></span></div>
    <button className="wedding-directions" aria-expanded={open} aria-controls="rsvp-form" onClick={() => { setOpen(true); if (open) input.current?.focus(); }}>Confirmar Presença</button>
    {open && <form id="rsvp-form" className="rsvp-form" onSubmit={submit} noValidate aria-busy={sending}>
      {!success && <><label htmlFor="rsvp-name">Seu nome completo</label><input ref={input} id="rsvp-name" name="nome" autoComplete="name" required value={name} disabled={sending} aria-invalid={invalid} aria-describedby="rsvp-status" onChange={e => { setName(e.target.value); setInvalid(false); }} /><button className="wedding-directions" type="submit" disabled={sending}>{sending ? "Confirmando…" : "Confirmar minha presença"}</button></>}
      <p id="rsvp-status" role="status" aria-live="polite">{message}</p>
    </form>}
  </section>;
}
