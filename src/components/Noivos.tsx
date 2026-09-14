import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getNoivosSupabase } from "../lib/supabase";
import { OriginalCoverArt } from "./OriginalCoverArt";
import "./invitation-page.css";
import "./noivos.css";

type Confirmation = { id: string; nome: string; criado_em: string };
const pageSize = 50;
const noivosId = "bc4a3a35-56e0-4e77-981d-02dce2627f12";
function logError(error: { code?: string; status?: number; message: string }, status?: number) {
  console.error({ code: error.code, status: status ?? error.status, message: error.message });
}
function confirmedDate(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("pt-BR", { timeZone: "America/Araguaina" })} às ${date.toLocaleTimeString("pt-BR", { timeZone: "America/Araguaina", hour: "2-digit", minute: "2-digit" })}`;
}
export function Noivos() {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [username, setUsername] = useState("noivos");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [rows, setRows] = useState<Confirmation[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  const loginLock = useRef(false);
  const hearts = useRef<HTMLDivElement>(null);
  function clearData() { generation.current++; setRows([]); setTotal(null); setAuthorized(false); }
  useEffect(() => {
    const sync = () => hearts.current?.classList.toggle("is-paused", document.hidden);
    sync(); document.addEventListener("visibilitychange", sync);
    let active = true;
    let unsubscribe = () => {};
    try {
      const client = getNoivosSupabase();
      const { data } = client.auth.onAuthStateChange((event, next) => {
        if (!active) return;
        clearData(); setSession(next); setInitializing(false); if (next) setRevision(r => r + 1);
        if (event === "SIGNED_OUT") { setPassword(""); setPage(0); setMessage("Sessão encerrada. Entre novamente para consultar."); }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch { setMessage("A área privada ainda não está configurada."); setInitializing(false); }
    return () => { active = false; generation.current++; unsubscribe(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    if (!session) return;
    const request = ++generation.current;
    const controller = new AbortController();
    setLoading(true); setRows([]); setTotal(null); setAuthorized(false); setMessage("");
    async function load() {
      try {
        const client = getNoivosSupabase();
        const user = await client.auth.getUser();
        if (request !== generation.current) return;
        if (user.error || !user.data.user) {
          if (user.error) logError(user.error);
          if (user.error && (!user.error.status || user.error.status >= 500)) throw new Error("Não foi possível verificar a sessão. Confira a conexão e tente atualizar.");
          clearData(); setSession(null); setPassword(""); setLoading(false);
          setMessage("Sessão ausente ou expirada. Entre novamente."); return;
        }
        if (user.data.user.id !== noivosId) throw new Error("Esta conta não é a conta autorizada dos noivos. Saia e entre com a conta correta.");
        const result = await client.from("casamento_confirmacoes")
          .select("id,nome,criado_em", { count: "exact" })
          .order("criado_em", { ascending: false }).order("id", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1).abortSignal(controller.signal);
        if (request !== generation.current) return;
        if (result.error) {
          logError(result.error, result.status);
          if (result.status === 401 && result.error.code !== "42501") {
            clearData(); setSession(null); setPassword(""); setLoading(false);
            setMessage("Sessão expirada. Entre novamente."); return;
          }
          if (result.error.code === "42501" || result.status === 403) throw new Error("O banco negou permissão de leitura. Verifique a política RLS e a permissão SELECT da conta dos noivos.");
          if (!result.status || result.status >= 500) throw new Error("Não foi possível conectar ao banco. Verifique a conexão e tente atualizar.");
          throw new Error("Não foi possível consultar as confirmações. Tente atualizar.");
        }
        if (result.count === null) throw new Error("O banco não retornou a contagem. Tente atualizar.");
        if (request !== generation.current) return;
        if (page > 0 && page * pageSize >= result.count) { setPage(Math.max(0, Math.ceil(result.count / pageSize) - 1)); return; }
        setRows(result.data); setTotal(result.count); setAuthorized(true);
      } catch (error) { if (request === generation.current) setMessage(error instanceof Error ? error.message : "Falha ao consultar confirmações."); }
      finally { if (request === generation.current) setLoading(false); }
    }
    void load();
    return () => { controller.abort(); generation.current++; };
  }, [session, page, revision]);

  async function login(event: FormEvent) {
    event.preventDefault(); if (loginLock.current) return;
    const email = import.meta.env.VITE_NOIVOS_EMAIL?.trim();
    if (!email || email === "EMAIL_REAL_DA_CONTA_DOS_NOIVOS") { setMessage("Falta configurar o e-mail da conta dos noivos."); return; }
    if (username.trim() !== "noivos") { setMessage("Usuário ou senha incorretos."); return; }
    loginLock.current = true; setBusy(true); setMessage("");
    try {
      const { error } = await getNoivosSupabase().auth.signInWithPassword({ email, password });
      if (error) setMessage("Não foi possível entrar. Confira usuário e senha ou tente novamente.");
      else setPassword("");
    } catch { setMessage("Não foi possível conectar. Tente novamente."); }
    finally { setBusy(false); loginLock.current = false; }
  }
  async function logout() {
    clearData(); setLoading(false); setBusy(true); setMessage("");
    try { const { error } = await getNoivosSupabase().auth.signOut({ scope: "local" }); if (error) throw error; setSession(null); setPassword(""); }
    catch { setMessage("Não foi possível encerrar a sessão. Tente Sair novamente."); }
    finally { setBusy(false); }
  }
  return <main className="wedding-page noivos-page">
    <div className="wedding-florals" aria-hidden="true">{["tl","tr","bl","br"].map(c => <div key={c} className={`wedding-floral wedding-floral--${c}`}><OriginalCoverArt /></div>)}</div>
    <div className="wedding-hearts noivos-hearts" ref={hearts} aria-hidden="true">{[0,1,2,3].map(i => <span key={i}><svg viewBox="0 0 24 24"><path d="M12 21C9 18 2 13 2 7.5 2 1.5 9 1 12 6c3-5 10-4.5 10 1.5C22 13 15 18 12 21Z" fill="currentColor" /></svg></span>)}</div>
    <div className="noivos-content">
      <div className="noivos-seal" aria-hidden="true"><OriginalCoverArt seal /></div>
      <h1>Confirmações do nosso casamento</h1>
      {initializing ? <p>Verificando sessão…</p> : !session ? <form className="noivos-login" onSubmit={login}>
        <label htmlFor="noivos-user">Usuário</label><input id="noivos-user" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required disabled={busy} />
        <label htmlFor="noivos-password">Senha</label><input id="noivos-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required disabled={busy} />
        <button className="wedding-directions" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
      </form> : <>
        <div className="noivos-actions"><button className="wedding-directions" disabled={loading || busy} onClick={() => setRevision(r => r + 1)}>Atualizar</button><button className="wedding-directions" disabled={busy} onClick={logout}>Sair</button></div>
        {loading && <p role="status">Carregando confirmações…</p>}
        {authorized && total !== null && <><div className="noivos-total"><span>Total de confirmações</span><strong>{total}</strong></div>
          {total === 0 ? <p>Ainda não há presenças confirmadas.</p> : <><table><thead><tr><th>Convidado</th><th>Data da confirmação</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{row.nome}</td><td><time dateTime={row.criado_em}>{confirmedDate(row.criado_em)}</time></td></tr>)}</tbody></table>
          <nav className="noivos-pagination" aria-label="Paginação"><button className="wedding-directions" disabled={page === 0 || loading} onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page + 1} de {Math.ceil(total / pageSize)}</span><button className="wedding-directions" disabled={(page + 1) * pageSize >= total || loading} onClick={() => setPage(p => p + 1)}>Próxima</button></nav></>}
        </>}
      </>}
      <p role="status" aria-live="polite" className="noivos-status">{message}</p>
    </div>
  </main>;
}
