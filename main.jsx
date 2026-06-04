import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellRing, Check, X, Smartphone } from "lucide-react";
import { supabase } from "./lib/supabase";
import * as api from "./lib/api";
import { enablePush, pushSupported } from "./lib/push";
import Login from "./screens/Login";
import { OasicoApp, AdmApp, StyleInjection, GrainBg } from "./OasisApp";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oasicos, setOasicosState] = useState([]);
  const [tasks, setTasksState] = useState([]);
  const [mentorings, setMentoringsState] = useState([]);
  const [groupEvents, setGroupEventsState] = useState([]);
  const [notifs, setNotifs] = useState([]);

  const ctxRef = useRef({ profileId: null, role: null, oasicos: [] });
  useEffect(() => { ctxRef.current = { profileId: profile?.id, role: profile?.role, oasicos }; }, [profile, oasicos]);

  /* sessão */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  /* perfil + dados */
  useEffect(() => {
    let active = true;
    (async () => {
      if (!session) { setProfile(null); setLoading(false); return; }
      setLoading(true);
      // perfil (com pequena espera caso o trigger ainda esteja criando)
      let prof = null;
      for (let i = 0; i < 4 && !prof; i++) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        prof = data;
        if (!prof) await new Promise((r) => setTimeout(r, 600));
      }
      if (!active) return;
      setProfile(prof);
      if (prof) {
        const all = await api.loadAll(prof);
        if (!active) return;
        setOasicosState(all.oasicos); setTasksState(all.tasks);
        setMentoringsState(all.mentorings); setGroupEventsState(all.groupEvents);
        setNotifs(await api.loadNotifications(prof.id));
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [session]);

  /* notificações em tempo real */
  useEffect(() => {
    if (!profile) return;
    const ch = supabase.channel("notif-" + profile.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `recipient=eq.${profile.id}` },
        (payload) => setNotifs((n) => [payload.new, ...n]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile]);

  /* setters que persistem (otimista + reconciliação) */
  const makeSetter = useCallback((setState, reconcile) => (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      Promise.resolve().then(async () => {
        try { const fixed = await reconcile(prev, next, ctxRef.current); if (fixed) setState(fixed); }
        catch (e) { console.error("persist", e); }
      });
      return next;
    });
  }, []);

  const setOasicos = makeSetter(setOasicosState, api.reconcileOasicos);
  const setTasks = makeSetter(setTasksState, api.reconcileTasks);
  const setMentorings = makeSetter(setMentoringsState, api.reconcileMentorings);
  const setGroupEvents = makeSetter(setGroupEventsState, api.reconcileGroupEvents);

  const db = { oasicos, setOasicos, tasks, setTasks, mentorings, setMentorings, groupEvents, setGroupEvents };

  const logout = async () => { await supabase.auth.signOut(); };

  let content;
  if (!session) content = <Login />;
  else if (loading) content = <Loader />;
  else if (!profile) content = <SetupNeeded onLogout={logout} />;
  else {
    const myOasico = oasicos.find((o) => o.profileId === profile.id);
    const user = { name: profile.full_name || profile.email, email: profile.email, role: profile.role, oasicoId: myOasico?.id };
    content = profile.role === "adm"
      ? <AdmApp user={user} db={db} onLogout={logout} />
      : <OasicoApp user={user} db={db} onLogout={logout} />;
  }

  return (
    <div className="oasis-root">
      <StyleInjection />
      <GrainBg />
      {session && profile && (
        <NotificationBell notifs={notifs} setNotifs={setNotifs} profile={profile} />
      )}
      {content}
    </div>
  );
}

function Loader() {
  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="reveal" style={{ textAlign: "center" }}>
        <div className="serif gold-grad" style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>OÁSIS</div>
        <div style={{ color: "var(--muted)", marginTop: 8, fontSize: 13 }}>Carregando seu hub…</div>
      </div>
    </div>
  );
}

function SetupNeeded({ onLogout }) {
  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="panel" style={{ padding: 28, maxWidth: 440, textAlign: "center" }}>
        <h2 className="serif" style={{ fontSize: 24 }}>Quase lá</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: 14 }}>
          Seu perfil ainda não foi criado. Se você acabou de se cadastrar e a confirmação por e-mail está ativa,
          confirme o e-mail e entre novamente. Se o problema persistir, verifique se as migrações SQL foram aplicadas no Supabase.
        </p>
        <button className="btn-ghost" style={{ padding: "10px 18px", marginTop: 12 }} onClick={onLogout}>Sair</button>
      </div>
    </div>
  );
}

function NotificationBell({ notifs, setNotifs, profile }) {
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;

  const markAll = async () => {
    await api.markAllRead(profile.id);
    setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  };
  const click = async (n) => {
    if (!n.read) { await api.markNotificationRead(n.id); setNotifs((arr) => arr.map((x) => x.id === n.id ? { ...x, read: true } : x)); }
  };
  const ask = async () => {
    try { await enablePush(profile.id); alert("Notificações ativadas neste aparelho!"); }
    catch (e) { alert(e.message); }
  };

  return (
    <div style={{ position: "fixed", top: 13, right: 16, zIndex: 60 }} className="bell-wrap">
      <style>{`@media(max-width:880px){.bell-wrap{right:64px!important;top:14px!important;}}`}</style>
      <button onClick={() => setOpen(!open)} className="btn-ghost" style={{ padding: 10, position: "relative", borderRadius: 12 }} title="Notificações">
        {unread > 0 ? <BellRing size={19} color="var(--gold)" /> : <Bell size={19} />}
        {unread > 0 && (
          <span style={{ position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 99,
            background: "#E5484D", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{unread}</span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
          <div className="panel" style={{ position: "absolute", top: 50, right: 0, width: "min(340px,86vw)", maxHeight: "70vh", overflow: "auto", padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span className="serif" style={{ fontSize: 18, fontWeight: 700 }}>Notificações</span>
              <div style={{ display: "flex", gap: 6 }}>
                {unread > 0 && <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={markAll}><Check size={13} style={{ verticalAlign: "middle" }} /> Ler tudo</button>}
                <button className="btn-ghost" style={{ padding: 7 }} onClick={() => setOpen(false)}><X size={14} /></button>
              </div>
            </div>
            {pushSupported() && (
              <button className="btn-ghost" style={{ padding: "9px 12px", fontSize: 12.5, width: "100%", marginBottom: 10, justifyContent: "center", display: "flex", gap: 8, alignItems: "center" }} onClick={ask}>
                <Smartphone size={15} color="var(--gold)" /> Ativar push neste aparelho
              </button>
            )}
            {notifs.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: "18px 0" }}>Nenhuma notificação.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notifs.map((n) => (
                <div key={n.id} onClick={() => click(n)} style={{ padding: "11px 12px", borderRadius: 10, cursor: "pointer",
                  background: n.read ? "rgba(255,255,255,.02)" : "rgba(201,162,75,.10)", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{n.body}</div>}
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{new Date(n.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
