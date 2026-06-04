import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import {
  Palmtree, LayoutDashboard, ClipboardList, HeartPulse, Building2, MessageSquareQuote,
  ListChecks, Users, LineChart, CalendarClock, LogOut, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, Sparkles, Search, Plus,
  CheckCircle2, Clock, CircleDashed, XCircle, ArrowLeft, Send, Lock, Mail, Eye, EyeOff,
  Target, Compass, Award, Flame, Menu, X, CalendarPlus, ExternalLink, Trash2,
} from "lucide-react";

/* ============================================================
   OASIS HUB — Oásis Business Hub
   Identidade: Preto, Dourado, Branco · Tipografia serifada
   ============================================================ */

const GOLD = "#C9A24B";
const GOLD_SOFT = "#E4C977";
const CREAM = "#F4EFE3";

/* ---------- IOE: 5 pilares, 10 perguntas cada ---------- */
const IOE_PILLARS = [
  {
    key: "proposito",
    name: "Propósito e Direção",
    short: "Propósito",
    icon: Compass,
    questions: [
      "Tenho clareza sobre o propósito da minha empresa além de apenas ganhar dinheiro.",
      "Sei explicar com clareza onde quero que minha empresa esteja nos próximos 12 meses.",
      "Tenho metas claras de faturamento, lucro, crescimento e impacto.",
      "Tenho uma visão clara do tipo de empresário que preciso me tornar para viver a próxima fase.",
      "Minha empresa possui uma proposta de valor clara para o mercado.",
      "Sei quem é meu cliente ideal e quais problemas reais minha empresa resolve.",
      "Minhas decisões empresariais estão alinhadas com princípios e valores cristãos.",
      "Tenho clareza sobre quais oportunidades devo aceitar e quais devo recusar.",
      "Minha família entende e apoia a direção que estou construindo no negócio.",
      "Tenho uma rotina de revisão das minhas metas, visão e prioridades.",
    ],
  },
  {
    key: "financas",
    name: "Finanças e Sustentabilidade",
    short: "Finanças",
    icon: LineChart,
    critical: true,
    questions: [
      "Tenho controle atualizado do faturamento mensal da empresa.",
      "Sei exatamente quais são meus custos fixos e variáveis.",
      "Sei qual é o lucro real da minha empresa, não apenas o faturamento.",
      "Tenho separação clara entre dinheiro pessoal e dinheiro da empresa.",
      "Tenho pró-labore definido de forma coerente com a realidade do negócio.",
      "Tenho controle de fluxo de caixa para os próximos 30, 60 e 90 dias.",
      "Sei qual é meu ponto de equilíbrio mensal.",
      "Tenho reserva financeira ou plano claro para formar caixa na empresa.",
      "Faço análise de margem antes de vender, contratar ou assumir novos compromissos.",
      "Tenho indicadores financeiros que acompanho periodicamente.",
    ],
  },
  {
    key: "marketing",
    name: "Marketing e Vendas",
    short: "Marketing",
    icon: TrendingUp,
    critical: true,
    questions: [
      "Tenho clareza sobre meu público-alvo e cliente ideal.",
      "Minha empresa possui uma oferta clara, atrativa e fácil de entender.",
      "Tenho canais ativos para atrair novos clientes.",
      "Tenho uma rotina de prospecção ativa, e não dependo apenas de indicação.",
      "Tenho metas semanais ou mensais de vendas.",
      "Acompanho indicadores comerciais como leads, propostas, conversão e ticket médio.",
      "Tenho um processo claro de atendimento, follow-up e fechamento.",
      "Sei apresentar minha empresa de forma convincente em poucos minutos.",
      "Tenho estratégias para vender novamente para clientes atuais.",
      "Minha empresa tem previsibilidade mínima de geração de oportunidades.",
    ],
  },
  {
    key: "gestao",
    name: "Gestão e Processos",
    short: "Gestão",
    icon: ListChecks,
    critical: true,
    questions: [
      "Tenho processos claros para as principais atividades da empresa.",
      "As tarefas importantes da empresa não dependem exclusivamente da minha memória.",
      "Tenho rotina de reuniões, acompanhamento e tomada de decisão.",
      "Uso ferramentas ou sistemas para organizar clientes, tarefas, financeiro ou operação.",
      "Minha empresa tem indicadores de desempenho acompanhados com frequência.",
      "Tenho clareza sobre quais atividades geram resultado e quais apenas ocupam tempo.",
      "Existe padrão mínimo de qualidade na entrega ao cliente.",
      "Tenho processos documentados ou em fase de documentação.",
      "Consigo delegar atividades sem perder completamente o controle.",
      "Minha empresa consegue funcionar parcialmente sem minha presença o tempo todo.",
    ],
  },
  {
    key: "lideranca",
    name: "Liderança, Pessoas e Execução",
    short: "Liderança",
    icon: Award,
    critical: true,
    questions: [
      "Tenho clareza das minhas principais responsabilidades como líder.",
      "Consigo comunicar prioridades com clareza para minha equipe ou parceiros.",
      "Tenho disciplina para executar o que defino como prioridade.",
      "Cumpro as atividades e decisões assumidas nas mentorias.",
      "Tenho uma rotina semanal de planejamento e revisão de ações.",
      "Sei dar feedbacks claros e respeitosos para pessoas que trabalham comigo.",
      "Consigo lidar com conflitos sem fugir, explodir ou empurrar o problema.",
      "Tenho pessoas certas ou estou formando pessoas certas para a próxima fase da empresa.",
      "Consigo manter constância mesmo quando os resultados demoram.",
      "Minhas ações semanais estão conectadas às metas maiores da empresa.",
    ],
  },
];

const SCALE_LEGEND = [
  { range: "0", label: "Não existe / não acontece" },
  { range: "1–3", label: "Muito fraco / quase inexistente" },
  { range: "4–5", label: "Existe de forma irregular" },
  { range: "6–7", label: "Existe, mas precisa melhorar" },
  { range: "8–9", label: "Funciona bem e com consistência" },
  { range: "10", label: "Funciona com excelência" },
];

/* ---------- Fases ---------- */
const PHASES = [
  { min: 0, max: 19, name: "Sobrevivência", focus: "Sair do caos", color: "#E5484D",
    diagnostic: "O Oásico está em uma fase de urgência. O foco é sair do caos, organizar caixa, reduzir desperdícios, definir prioridades e criar ações comerciais imediatas." },
  { min: 20, max: 39, name: "Organização", focus: "Colocar ordem", color: "#F76B15",
    diagnostic: "O Oásico já tem movimento, mas precisa colocar ordem. O foco é organizar finanças, agenda, processos básicos, metas e responsabilidades." },
  { min: 40, max: 59, name: "Crescimento", focus: "Aumentar faturamento", color: "#E6B800",
    diagnostic: "O Oásico já possui alguma base, mas precisa aumentar faturamento. O foco é melhorar oferta, prospecção, vendas, conversão, ticket médio e recorrência." },
  { min: 60, max: 74, name: "Gestão", focus: "Estruturar empresa", color: "#30A46C",
    diagnostic: "O Oásico já vende e cresce, mas precisa estruturar a empresa. O foco é processos, indicadores, delegação, equipe, rotina de gestão e controle." },
  { min: 75, max: 89, name: "Escala", focus: "Crescer com previsibilidade", color: "#3E7BFA",
    diagnostic: "O Oásico já possui estrutura e precisa crescer com previsibilidade. O foco é escala comercial, liderança, cultura, processos replicáveis, margem e expansão." },
  { min: 90, max: 100, name: "Legado", focus: "Impacto e multiplicação", color: "#8E4EC6",
    diagnostic: "O Oásico está em fase de maturidade. O foco é impacto, multiplicação, sucessão, governança, formação de líderes e contribuição para outros empresários." },
];

const getPhase = (ioe) => PHASES.find((p) => ioe >= p.min && ioe <= p.max) || PHASES[0];

/* ---------- Rodas ---------- */
const LIFE_WHEEL = ["Espiritualidade", "Família", "Saúde", "Finanças pessoais", "Desenvolvimento pessoal", "Equilíbrio emocional", "Relacionamentos", "Propósito"];
const BUSINESS_WHEEL = ["Clareza de visão", "Marketing", "Vendas", "Finanças empresariais", "Processos", "Liderança", "Equipe", "Execução"];

/* ---------- Cálculo IOE ---------- */
function computeIOE(answers) {
  // answers: { pillarKey: [10 notas] }
  const pillarScores = {};
  IOE_PILLARS.forEach((p) => {
    const arr = answers[p.key] || [];
    const vals = arr.filter((v) => v !== null && v !== undefined);
    pillarScores[p.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });
  const generalAvg = IOE_PILLARS.reduce((a, p) => a + pillarScores[p.key], 0) / IOE_PILLARS.length;
  const ioe = Math.round(generalAvg * 10);
  return { pillarScores, generalAvg, ioe };
}

function buildAlerts(pillarScores, ioe, previousIoe) {
  const alerts = [];
  IOE_PILLARS.forEach((p) => {
    if (pillarScores[p.key] < 5) {
      alerts.push({ type: p.critical && pillarScores[p.key] < 4 ? "critical" : "warning",
        text: `${p.name}: ${pillarScores[p.key].toFixed(1)} — ${p.critical && pillarScores[p.key] < 4 ? "alerta crítico" : "abaixo do ideal"}` });
    }
  });
  if (previousIoe != null) {
    if (ioe - previousIoe > 5) alerts.push({ type: "positive", text: `Evolução relevante: +${ioe - previousIoe} pontos no IOE` });
    if (previousIoe - ioe > 5) alerts.push({ type: "drop", text: `Queda relevante: -${previousIoe - ioe} pontos no IOE` });
  }
  return alerts;
}

function suggestFocus(pillarScores) {
  let worst = null;
  IOE_PILLARS.forEach((p) => {
    if (!worst || pillarScores[p.key] < pillarScores[worst.key]) worst = p;
  });
  return worst ? `Priorizar "${worst.name}" (${pillarScores[worst.key].toFixed(1)}/10) na próxima mentoria.` : "—";
}

/* ---------- Google Agenda: gera link de evento (sem backend) ---------- */
function gcalUrl({ title, datetime, endDatetime, description, location }) {
  if (!datetime) return "#";
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(datetime);
  const end = endDatetime ? new Date(endDatetime) : new Date(start.getTime() + 60 * 60 * 1000);
  const p = new URLSearchParams({
    action: "TEMPLATE", text: title || "Mentoria Oásis",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: description || "Agendado pelo OASIS HUB.", location: location || "",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}


/* ============================================================
   ESTILO GLOBAL · MOTION · TIPOGRAFIA
   ============================================================ */
function StyleInjection() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');

      .oasis-root{
        --gold:${GOLD}; --gold-soft:${GOLD_SOFT}; --cream:${CREAM};
        --ink:#070707; --ink-2:#0e0e0f; --panel:#141416; --panel-2:#1b1b1e;
        --line:rgba(201,162,75,0.16); --muted:#8a8a8f;
        font-family:'Manrope',system-ui,sans-serif;
        background:var(--ink); color:var(--cream);
        min-height:100vh; position:relative; overflow-x:hidden;
        -webkit-font-smoothing:antialiased;
      }
      .oasis-root *{box-sizing:border-box;}
      .serif{font-family:'Playfair Display',serif;}
      .gold{color:var(--gold);}
      .gold-grad{background:linear-gradient(120deg,var(--gold-soft),var(--gold) 55%,#9c7a2e);
        -webkit-background-clip:text;background-clip:text;color:transparent;}

      .grain{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");}
      .glow-a{position:fixed;width:60vw;height:60vw;border-radius:50%;z-index:0;pointer-events:none;
        background:radial-gradient(circle,rgba(201,162,75,0.10),transparent 70%);
        top:-15vw;right:-10vw;filter:blur(20px);}
      .glow-b{position:fixed;width:50vw;height:50vw;border-radius:50%;z-index:0;pointer-events:none;
        background:radial-gradient(circle,rgba(201,162,75,0.06),transparent 70%);
        bottom:-20vw;left:-15vw;filter:blur(20px);}

      .panel{background:linear-gradient(160deg,var(--panel),var(--ink-2));
        border:1px solid var(--line);border-radius:18px;position:relative;}
      .stat-clickable{transition:transform .25s,border-color .25s,box-shadow .25s;}
      .stat-clickable:hover{transform:translateY(-3px);border-color:var(--gold);
        box-shadow:0 16px 40px -18px rgba(201,162,75,.5);}
      .panel-2{background:var(--panel-2);border:1px solid rgba(255,255,255,0.05);border-radius:14px;}
      .hairline{border-bottom:1px solid var(--line);}
      .gold-line{height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}

      .btn-gold{background:linear-gradient(120deg,var(--gold-soft),var(--gold));color:#161200;
        font-weight:700;border:none;border-radius:12px;cursor:pointer;letter-spacing:.2px;
        transition:transform .25s,box-shadow .25s,filter .25s;box-shadow:0 8px 30px -10px rgba(201,162,75,.55);}
      .btn-gold:hover{transform:translateY(-2px);filter:brightness(1.07);box-shadow:0 14px 40px -10px rgba(201,162,75,.7);}
      .btn-gold:active{transform:translateY(0);}
      .btn-ghost{background:rgba(255,255,255,0.03);color:var(--cream);border:1px solid var(--line);
        border-radius:12px;cursor:pointer;transition:all .2s;font-weight:600;}
      .btn-ghost:hover{background:rgba(201,162,75,0.08);border-color:var(--gold);}

      .nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;
        color:var(--muted);cursor:pointer;transition:all .22s;font-weight:500;font-size:14.5px;
        border:1px solid transparent;position:relative;}
      .nav-item:hover{color:var(--cream);background:rgba(255,255,255,0.03);}
      .nav-item.active{color:var(--cream);background:linear-gradient(120deg,rgba(201,162,75,.14),rgba(201,162,75,.03));
        border-color:var(--line);}
      .nav-item.active::before{content:'';position:absolute;left:0;top:18%;bottom:18%;width:3px;border-radius:3px;
        background:linear-gradient(var(--gold-soft),var(--gold));}

      input,textarea,select{font-family:inherit;background:rgba(0,0,0,.35);border:1px solid var(--line);
        color:var(--cream);border-radius:11px;padding:12px 14px;width:100%;outline:none;transition:border .2s,box-shadow .2s;font-size:14.5px;}
      input:focus,textarea:focus,select:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,162,75,.12);}
      label{font-size:12.5px;color:var(--muted);font-weight:600;letter-spacing:.4px;text-transform:uppercase;}

      input[type=range]{-webkit-appearance:none;appearance:none;height:6px;padding:0;border:none;
        background:linear-gradient(90deg,var(--gold) var(--pct,50%),rgba(255,255,255,.08) var(--pct,50%));border-radius:99px;}
      input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;
        background:radial-gradient(circle at 30% 30%,var(--gold-soft),var(--gold));cursor:pointer;
        border:2px solid #1a1500;box-shadow:0 2px 10px rgba(201,162,75,.6);transition:transform .15s;}
      input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.18);}
      input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--gold);
        cursor:pointer;border:2px solid #1a1500;}

      .chip{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:99px;
        font-size:11.5px;font-weight:700;letter-spacing:.3px;border:1px solid;}

      .reveal{opacity:0;transform:translateY(16px);animation:reveal .7s cubic-bezier(.2,.7,.2,1) forwards;}
      @keyframes reveal{to{opacity:1;transform:none;}}
      .float-in{opacity:0;transform:translateY(28px) scale(.98);animation:floatin .9s cubic-bezier(.2,.7,.2,1) forwards;}
      @keyframes floatin{to{opacity:1;transform:none;}}
      @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
      .shimmer-line{height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);
        background-size:200% 100%;animation:shimmer 3s linear infinite;}
      @keyframes pulse-ring{0%{transform:scale(.9);opacity:.7;}70%{transform:scale(1.5);opacity:0;}100%{opacity:0;}}

      ::-webkit-scrollbar{width:9px;height:9px;}
      ::-webkit-scrollbar-thumb{background:rgba(201,162,75,.25);border-radius:9px;}
      ::-webkit-scrollbar-track{background:transparent;}

      .mobile-only{display:none;}
      @media(max-width:880px){
        .desktop-only{display:none!important;}
        .mobile-only{display:flex;}
      }
    `}</style>
  );
}

function GrainBg() {
  return (<><div className="glow-a" /><div className="glow-b" /><div className="grain" /></>);
}

/* ---------- Logo / wordmark ---------- */
function Logo({ size = 34, stacked = false, mono = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexDirection: stacked ? "column" : "row" }}>
      <Palmtree size={size} strokeWidth={1.4} color={mono ? CREAM : GOLD} />
      <div style={{ lineHeight: 0.92, textAlign: stacked ? "center" : "left" }}>
        <div className="serif" style={{ fontSize: size * 0.74, fontWeight: 800, letterSpacing: size * 0.07, color: CREAM }}>OÁSIS</div>
        <div style={{ fontStyle: "italic", fontSize: size * 0.42, fontWeight: 500, color: CREAM, opacity: .9, letterSpacing: .5 }}>business</div>
      </div>
    </div>
  );
}

/* ---------- Pequenos componentes ---------- */
function PhaseChip({ ioe }) {
  const ph = getPhase(ioe);
  return (
    <span className="chip" style={{ color: ph.color, borderColor: ph.color + "55", background: ph.color + "14" }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: ph.color }} />{ph.name}
    </span>
  );
}

function Stat({ icon: Icon, label, value, sub, accent = GOLD, delay = 0, onClick }) {
  return (
    <div className={`panel reveal${onClick ? " stat-clickable" : ""}`} onClick={onClick}
      style={{ padding: "18px 20px", animationDelay: `${delay}ms`, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: .4, textTransform: "uppercase" }}>{label}</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 700, marginTop: 6, color: CREAM }}>{value}</div>
          {sub && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center",
          background: accent + "16", border: `1px solid ${accent}33` }}>
          <Icon size={20} color={accent} />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
      <div>
        {kicker && <div className="gold" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{kicker}</div>}
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 700, margin: 0, color: CREAM }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function AlertPill({ alert }) {
  const map = {
    critical: { c: "#E5484D", Icon: ShieldAlert, label: "Crítico" },
    warning: { c: "#E6B800", Icon: AlertTriangle, label: "Atenção" },
    drop: { c: "#F76B15", Icon: TrendingDown, label: "Queda" },
    positive: { c: "#30A46C", Icon: TrendingUp, label: "Evolução" },
  };
  const m = map[alert.type] || map.warning;
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 13px", borderRadius: 11,
      background: m.c + "12", border: `1px solid ${m.c}30` }}>
      <m.Icon size={17} color={m.c} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: CREAM }}>{alert.text}</span>
    </div>
  );
}

/* ---------- Roda interativa (radar + sliders) ---------- */
function WheelRadar({ labels, values, color = GOLD }) {
  const data = labels.map((l, i) => ({ axis: l, v: values[i] }));
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(201,162,75,0.18)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: CREAM, fontSize: 11, fontWeight: 500 }} />
        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
        <Radar dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.28} dot
          isAnimationActive animationDuration={600} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function WheelEditor({ labels, values, onChange, color = GOLD, readOnly = false }) {
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 26, alignItems: "center" }} className="wheel-grid">
      <style>{`@media(max-width:760px){.wheel-grid{grid-template-columns:1fr!important;}}`}</style>
      <div className="panel-2" style={{ padding: 16, position: "relative" }}>
        <WheelRadar labels={labels} values={values} color={color} />
        <div style={{ position: "absolute", top: 16, right: 18, textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Média</div>
          <div className="serif gold-grad" style={{ fontSize: 30, fontWeight: 800 }}>{avg}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {labels.map((l, i) => (
          <div key={l}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{l}</span>
              <span className="gold serif" style={{ fontSize: 16, fontWeight: 700 }}>{values[i]}</span>
            </div>
            <input type="range" min={0} max={10} value={values[i]} disabled={readOnly}
              style={{ "--pct": `${values[i] * 10}%` }}
              onChange={(e) => { const n = [...values]; n[i] = +e.target.value; onChange(n); }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Shell (layout com nav lateral + bottom nav) ---------- */
function Shell({ user, nav, current, setCurrent, onLogout, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" }}>
      {/* Sidebar desktop */}
      <aside className="desktop-only" style={{ width: 256, flexShrink: 0, padding: "22px 16px",
        borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 6,
        position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "6px 8px 18px" }}><Logo size={30} /></div>
        <div className="gold-line" style={{ marginBottom: 12 }} />
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px 8px", fontWeight: 700 }}>
          {user.role === "adm" ? "Mentor · ADM" : "Oásico"}
        </div>
        {nav.map((n) => (
          <div key={n.key} className={`nav-item ${current === n.key ? "active" : ""}`} onClick={() => setCurrent(n.key)}>
            <n.icon size={18} /> {n.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div className="gold-line" style={{ margin: "12px 0" }} />
          <div style={{ padding: "6px 10px", marginBottom: 8 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{user.email}</div>
          </div>
          <div className="nav-item" onClick={onLogout}><LogOut size={18} /> Sair</div>
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="mobile-only" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
        height: 60, alignItems: "center", justifyContent: "space-between", padding: "0 16px",
        background: "rgba(7,7,7,.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
        <Logo size={24} />
        <button className="btn-ghost" style={{ padding: 9 }} onClick={() => setOpen(true)}><Menu size={20} /></button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="mobile-only" style={{ position: "fixed", inset: 0, zIndex: 50, flexDirection: "column" }}>
          <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", marginLeft: "auto", width: 270, height: "100%", background: "var(--ink-2)",
            borderLeft: "1px solid var(--line)", padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Logo size={26} /><button className="btn-ghost" style={{ padding: 8 }} onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            <div className="gold-line" style={{ marginBottom: 10 }} />
            {nav.map((n) => (
              <div key={n.key} className={`nav-item ${current === n.key ? "active" : ""}`}
                onClick={() => { setCurrent(n.key); setOpen(false); }}><n.icon size={18} /> {n.label}</div>
            ))}
            <div className="nav-item" style={{ marginTop: "auto" }} onClick={onLogout}><LogOut size={18} /> Sair</div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <main style={{ flex: 1, minWidth: 0, padding: "clamp(18px,3vw,38px)", paddingTop: 0 }}>
        <div className="mobile-only" style={{ height: 60 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24 }}>{children}</div>
      </main>
    </div>
  );
}

/* ============================================================
   LOGIN — entrada cinematográfica
   ============================================================ */
/* ---------- helpers de status ---------- */
const STATUS = {
  "pendente": { c: "#8a8a8f", Icon: CircleDashed },
  "em andamento": { c: "#3E7BFA", Icon: Clock },
  "concluída": { c: "#30A46C", Icon: CheckCircle2 },
  "atrasada": { c: "#E5484D", Icon: AlertTriangle },
  "cancelada": { c: "#6b6b70", Icon: XCircle },
};
const fmtDate = (d) => d ? new Date(d + (d.length <= 10 ? "T00:00" : "")).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

function StatusChip({ status }) {
  const s = STATUS[status] || STATUS["pendente"];
  return (
    <span className="chip" style={{ color: s.c, borderColor: s.c + "55", background: s.c + "14", textTransform: "capitalize" }}>
      <s.Icon size={13} /> {status}
    </span>
  );
}

function GcalButton({ event, small }) {
  return (
    <a href={gcalUrl(event)} target="_blank" rel="noopener noreferrer" className="btn-ghost"
      title="Adicionar ao Google Agenda"
      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: small ? "7px 11px" : "9px 14px",
        fontSize: small ? 12 : 13, textDecoration: "none", whiteSpace: "nowrap" }}>
      <CalendarPlus size={small ? 14 : 16} color={GOLD} /> Google Agenda
      <ExternalLink size={small ? 11 : 12} color="var(--muted)" />
    </a>
  );
}

/* ============================================================
   APP DO OÁSICO
   ============================================================ */
function OasicoApp({ user, db, onLogout }) {
  const [current, setCurrent] = useState("painel");
  const oasico = db.oasicos.find((o) => o.id === user.oasicoId);

  const nav = [
    { key: "painel", label: "Meu Painel", icon: LayoutDashboard },
    { key: "ioe", label: "Meu IOE", icon: ClipboardList },
    { key: "vida", label: "Roda da Vida", icon: HeartPulse },
    { key: "empresa", label: "Roda Empresarial", icon: Building2 },
    { key: "mentorias", label: "Minhas Mentorias", icon: MessageSquareQuote },
    { key: "atividades", label: "Minhas Atividades", icon: ListChecks },
  ];

  const update = (patch) => db.setOasicos((arr) => arr.map((o) => o.id === oasico.id ? { ...o, ...patch } : o));

  return (
    <Shell user={user} nav={nav} current={current} setCurrent={setCurrent} onLogout={onLogout}>
      {current === "painel" && <OasicoPainel oasico={oasico} db={db} go={setCurrent} />}
      {current === "ioe" && <OasicoIOE oasico={oasico} update={update} />}
      {current === "vida" && <WheelScreen kicker="Pessoal" title="Roda da Vida" labels={LIFE_WHEEL}
        values={oasico.lifeWheel} onSave={(v) => update({ lifeWheel: v })} color="#E4C977" />}
      {current === "empresa" && <WheelScreen kicker="Negócio" title="Roda Empresarial" labels={BUSINESS_WHEEL}
        values={oasico.businessWheel} onSave={(v) => update({ businessWheel: v })} color={GOLD} />}
      {current === "mentorias" && <OasicoMentorias oasico={oasico} db={db} />}
      {current === "atividades" && <OasicoAtividades oasico={oasico} db={db} />}
    </Shell>
  );
}

function OasicoPainel({ oasico, db, go }) {
  const last = oasico.ioeHistory[oasico.ioeHistory.length - 1];
  const pending = db.tasks.filter((t) => t.oasicoId === oasico.id && ["pendente", "em andamento", "atrasada"].includes(t.status));
  return (
    <div>
      <div className="reveal" style={{ marginBottom: 24 }}>
        <div className="gold" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Olá, {oasico.name.split(" ")[0]}</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, margin: "6px 0 0" }}>{oasico.company}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 22 }}>
        <Stat icon={CalendarClock} label="Próxima mentoria" value={oasico.nextMentoring ? fmtDateTime(oasico.nextMentoring).split(",")[0] : "A agendar"} sub={oasico.nextMentoring ? fmtDateTime(oasico.nextMentoring).split(", ")[1] : "—"} delay={0} onClick={() => go("mentorias")} />
        <Stat icon={ListChecks} label="Atividades pendentes" value={pending.length} sub="em aberto" accent="#3E7BFA" delay={80} onClick={() => go("atividades")} />
        <Stat icon={Sparkles} label="Última avaliação" value={last ? fmtDate(last.date) : "—"} sub={last ? "IOE enviado" : "Faça seu IOE"} accent="#30A46C" delay={160} onClick={() => go("ioe")} />
      </div>

      {last && (
        <div className="panel reveal" style={{ padding: 22, marginBottom: 22, display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div className="serif gold-grad" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{last.ioe}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>IOE / 100</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <PhaseChip ioe={last.ioe} />
            <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13.5, lineHeight: 1.6 }}>
              Foco da fase: <span className="gold" style={{ fontWeight: 600 }}>{getPhase(last.ioe).focus}</span>
            </div>
          </div>
          <button className="btn-ghost" style={{ padding: "11px 18px" }} onClick={() => go("ioe")}>Refazer IOE <ChevronRight size={15} style={{ verticalAlign: "middle" }} /></button>
        </div>
      )}

      <div className="panel reveal" style={{ padding: 20, marginBottom: 22 }}>
        <SectionTitle kicker="Calendário" title="Minha agenda" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {oasico.nextMentoring && (
            <div className="panel-2" style={{ padding: "13px 15px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <CalendarClock size={20} color={GOLD} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{oasico.nextMentoringMeta?.title || "Mentoria individual"}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{fmtDateTime(oasico.nextMentoring)}{oasico.nextMentoringMeta?.location ? ` · ${oasico.nextMentoringMeta.location}` : ""}</div>
              </div>
              <GcalButton event={{ title: oasico.nextMentoringMeta?.title || "Mentoria Oásis", datetime: oasico.nextMentoring, location: oasico.nextMentoringMeta?.location || "", description: oasico.nextMentoringMeta?.description || "Sua mentoria individual no Oásis Business Hub." }} small />
            </div>
          )}
          {[...db.groupEvents].sort((a, b) => a.datetime.localeCompare(b.datetime)).map((ev) => (
            <div key={ev.id} className="panel-2" style={{ padding: "13px 15px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 10, background: "#8E4EC618" }}>
                <Users size={18} color="#8E4EC6" />
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</span>
                  <span className="chip" style={{ color: "#8E4EC6", borderColor: "#8E4EC655", background: "#8E4EC614" }}>Em grupo</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{fmtDateTime(ev.datetime)}{ev.location ? ` · ${ev.location}` : ""}</div>
              </div>
              <GcalButton event={ev} small />
            </div>
          ))}
          {!oasico.nextMentoring && db.groupEvents.length === 0 && (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Nenhum encontro agendado no momento.</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }} className="wheel-grid">
        <div className="panel reveal stat-clickable" style={{ padding: 18, cursor: "pointer" }} onClick={() => go("vida")}>
          <SectionTitle kicker="Pessoal" title="Roda da Vida" />
          <WheelRadar labels={LIFE_WHEEL} values={oasico.lifeWheel} color="#E4C977" />
        </div>
        <div className="panel reveal stat-clickable" style={{ padding: 18, animationDelay: "120ms", cursor: "pointer" }} onClick={() => go("empresa")}>
          <SectionTitle kicker="Negócio" title="Roda Empresarial" />
          <WheelRadar labels={BUSINESS_WHEEL} values={oasico.businessWheel} color={GOLD} />
        </div>
      </div>

      <div className="panel reveal" style={{ padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: GOLD + "16", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <MessageSquareQuote size={20} color={GOLD} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Mensagem do seu mentor</div>
          <p className="serif" style={{ fontSize: 17, fontStyle: "italic", margin: "6px 0 0", lineHeight: 1.5 }}>"{oasico.message}"</p>
        </div>
      </div>
    </div>
  );
}

function OasicoIOE({ oasico, update }) {
  const [answers, setAnswers] = useState(() => {
    const a = {}; IOE_PILLARS.forEach((p) => a[p.key] = Array(10).fill(null)); return a;
  });
  const [step, setStep] = useState(0); // 0..4 pilares, 5 = enviado
  const [sent, setSent] = useState(false);

  const pillar = IOE_PILLARS[step];
  const setAnswer = (qi, val) => setAnswers((prev) => ({ ...prev, [pillar.key]: prev[pillar.key].map((v, i) => i === qi ? val : v) }));
  const pillarDone = pillar && answers[pillar.key].every((v) => v !== null);
  const allDone = IOE_PILLARS.every((p) => answers[p.key].every((v) => v !== null));

  const submit = () => {
    const prev = oasico.ioeHistory[oasico.ioeHistory.length - 1];
    const calc = computeIOE(answers);
    const entry = { date: new Date().toISOString().slice(0, 10), ...calc, answers };
    update({ ioeHistory: [...oasico.ioeHistory, entry] });
    setSent({ ioe: calc.ioe, prev: prev?.ioe });
  };

  if (sent) {
    const ph = getPhase(sent.ioe);
    return (
      <div className="reveal" style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
        <div style={{ display: "inline-grid", placeItems: "center", width: 96, height: 96, borderRadius: 99,
          background: "#30A46C18", border: "1px solid #30A46C44", marginBottom: 20 }}>
          <CheckCircle2 size={48} color="#30A46C" />
        </div>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 700 }}>Avaliação enviada!</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 420, margin: "10px auto 0" }}>
          Seu IOE foi registrado e já está disponível para o seu mentor. Veja abaixo um resumo simplificado da sua fase atual.
        </p>
        <div className="panel" style={{ padding: 26, marginTop: 26, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase" }}>Sua fase atual</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: ph.color, marginTop: 4 }}>{ph.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 2 }}>Foco: {ph.focus}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="serif gold-grad" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{sent.ioe}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>IOE / 100</div>
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.65, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
            O diagnóstico completo, notas por pilar e plano de ação serão trabalhados com seu mentor na próxima mentoria.
          </p>
        </div>
      </div>
    );
  }

  const ScaleLegend = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      {SCALE_LEGEND.map((s) => (
        <span key={s.range} className="chip" style={{ borderColor: "var(--line)", color: "var(--muted)", background: "rgba(255,255,255,.02)" }}>
          <b className="gold">{s.range}</b> {s.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="reveal">
      <SectionTitle kicker="Diagnóstico · IOE" title="Meu IOE" />
      <div className="panel" style={{ padding: "16px 20px", marginBottom: 18 }}>
        <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
          Responda com sinceridade, de <b className="gold">0 a 10</b>, considerando como cada item funciona hoje na sua empresa.
        </div>
        <ScaleLegend />
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {IOE_PILLARS.map((p, i) => (
          <div key={p.key} onClick={() => setStep(i)} style={{ flex: 1, cursor: "pointer" }}>
            <div style={{ height: 5, borderRadius: 99, background: i <= step ? GOLD : "rgba(255,255,255,.08)", transition: "background .3s" }} />
            <div className="desktop-only" style={{ fontSize: 11, marginTop: 6, color: i === step ? CREAM : "var(--muted)", fontWeight: i === step ? 700 : 500 }}>{p.short}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ padding: "clamp(18px,3vw,28px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: GOLD + "16", display: "grid", placeItems: "center" }}>
            <pillar.icon size={22} color={GOLD} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>PILAR {step + 1} / 5</div>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{pillar.name}</h3>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {pillar.questions.map((q, qi) => (
            <div key={qi} style={{ paddingBottom: 14, borderBottom: qi < 9 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 10 }}>
                <span style={{ fontSize: 14.5, lineHeight: 1.5 }}><span className="gold" style={{ fontWeight: 700 }}>{qi + 1}.</span> {q}</span>
                <span className="serif" style={{ fontSize: 22, fontWeight: 800, color: answers[pillar.key][qi] === null ? "var(--muted)" : GOLD, minWidth: 28, textAlign: "right" }}>
                  {answers[pillar.key][qi] === null ? "–" : answers[pillar.key][qi]}
                </span>
              </div>
              <input type="range" min={0} max={10} value={answers[pillar.key][qi] ?? 0}
                style={{ "--pct": `${(answers[pillar.key][qi] ?? 0) * 10}%`, opacity: answers[pillar.key][qi] === null ? .55 : 1 }}
                onChange={(e) => setAnswer(qi, +e.target.value)} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 24 }}>
          <button className="btn-ghost" style={{ padding: "12px 18px", opacity: step === 0 ? .4 : 1 }}
            disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft size={16} style={{ verticalAlign: "middle" }} /> Anterior</button>
          {step < 4 ? (
            <button className="btn-gold" style={{ padding: "12px 22px", opacity: pillarDone ? 1 : .5 }}
              disabled={!pillarDone} onClick={() => setStep(step + 1)}>Próximo pilar <ChevronRight size={16} style={{ verticalAlign: "middle" }} /></button>
          ) : (
            <button className="btn-gold" style={{ padding: "12px 24px", opacity: allDone ? 1 : .5 }}
              disabled={!allDone} onClick={submit}><Send size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />Enviar avaliação</button>
          )}
        </div>
      </div>
    </div>
  );
}

function WheelScreen({ kicker, title, labels, values, onSave, color }) {
  const [local, setLocal] = useState(values);
  const [saved, setSaved] = useState(false);
  useEffect(() => setLocal(values), [values]);
  const save = () => { onSave(local); setSaved(true); setTimeout(() => setSaved(false), 2200); };
  return (
    <div className="reveal">
      <SectionTitle kicker={kicker} title={title} action={
        <button className="btn-gold" style={{ padding: "11px 20px" }} onClick={save}>
          {saved ? <><CheckCircle2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />Salvo</> : "Salvar roda"}
        </button>} />
      <div className="panel" style={{ padding: "clamp(18px,3vw,28px)" }}>
        <WheelEditor labels={labels} values={local} onChange={setLocal} color={color} />
      </div>
    </div>
  );
}

function OasicoMentorias({ oasico, db }) {
  const list = db.mentorings.filter((m) => m.oasicoId === oasico.id).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="reveal">
      <SectionTitle kicker="Histórico" title="Minhas Mentorias" />
      {list.length === 0 && <div className="panel" style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>Nenhuma mentoria registrada ainda.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.map((m, i) => (
          <div key={m.id} className="panel reveal" style={{ padding: 20, animationDelay: `${i * 70}ms` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="chip gold" style={{ borderColor: "var(--line)", background: GOLD + "12" }}>{m.type}</span>
                {m.group && <span className="chip" style={{ color: "#8E4EC6", borderColor: "#8E4EC655", background: "#8E4EC614" }}><Users size={12} /> Em grupo</span>}
                <span className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{fmtDate(m.date)}</span>
              </div>
              {m.nextDate && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Próxima: {fmtDateTime(m.nextDate)}</span>}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 14px", color: "var(--cream)" }}>{m.summary}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <MiniBlock label="Vitórias" value={m.wins} c="#30A46C" />
              <MiniBlock label="Dificuldades" value={m.difficulties} c="#E6B800" />
              <MiniBlock label="Pontos de atenção" value={m.attention} c="#F76B15" />
              <MiniBlock label="Decisões" value={m.decisions} c={GOLD} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBlock({ label, value, c }) {
  if (!value) return null;
  return (
    <div className="panel-2" style={{ padding: 12 }}>
      <div style={{ fontSize: 11, color: c, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function OasicoAtividades({ oasico, db }) {
  const list = db.tasks.filter((t) => t.oasicoId === oasico.id);
  const update = (id, patch) => db.setTasks((arr) => arr.map((t) => t.id === id ? { ...t, ...patch } : t));
  const [f, setF] = useState({ title: "", description: "", deadline: "" });
  const create = () => {
    if (!f.title.trim()) return;
    db.setTasks((arr) => [...arr, { id: "t" + Date.now(), oasicoId: oasico.id, title: f.title.trim(),
      description: f.description.trim(), deadline: f.deadline, status: "pendente",
      commentOasico: "", commentAdm: "", origin: "Criada pelo Oásico" }]);
    setF({ title: "", description: "", deadline: "" });
  };
  return (
    <div className="reveal">
      <SectionTitle kicker="Execução" title="Minhas Atividades" />

      <div className="panel" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, fontWeight: 600 }}>
          <Plus size={15} style={{ verticalAlign: "middle" }} /> Adicionar atividade
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end" }} className="wheel-grid">
          <div><label>Título</label><input style={{ marginTop: 6 }} value={f.title} placeholder="O que você vai fazer?"
            onChange={(e) => setF({ ...f, title: e.target.value })} onKeyDown={(e) => e.key === "Enter" && create()} /></div>
          <div><label>Prazo</label><input type="date" style={{ marginTop: 6 }} value={f.deadline}
            onChange={(e) => setF({ ...f, deadline: e.target.value })} /></div>
          <button className="btn-gold" style={{ padding: "12px 20px" }} onClick={create}>Adicionar</button>
        </div>
        <div style={{ marginTop: 12 }}><label>Descrição (opcional)</label>
          <input style={{ marginTop: 6 }} value={f.description} placeholder="Detalhes da atividade…"
            onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {list.length === 0 && <div className="panel" style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>Nenhuma atividade ainda. Adicione a primeira acima.</div>}
        {list.map((t, i) => (
          <div key={t.id} className="panel reveal" style={{ padding: 18, animationDelay: `${i * 70}ms` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{t.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "5px 0 0", lineHeight: 1.5 }}>{t.description}</p>
              </div>
              <StatusChip status={t.status} />
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--muted)", margin: "12px 0", flexWrap: "wrap" }}>
              <span>Prazo: <b style={{ color: CREAM }}>{fmtDate(t.deadline)}</b></span>
              {t.origin && <span>Origem: {t.origin}</span>}
              {t.commentAdm && <span className="gold">Mentor: "{t.commentAdm}"</span>}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label>Meu comentário</label>
                <input style={{ marginTop: 6 }} value={t.commentOasico} placeholder="Atualize seu progresso…"
                  onChange={(e) => update(t.id, { commentOasico: e.target.value })} />
              </div>
              <select style={{ width: 170 }} value={t.status} onChange={(e) => update(t.id, { status: e.target.value })}>
                {Object.keys(STATUS).map((s) => <option key={s} value={s} style={{ background: "#161618" }}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   APP DO ADM
   ============================================================ */
function AdmApp({ user, db, onLogout }) {
  const [current, setCurrent] = useState("dash");
  const [selectedId, setSelectedId] = useState(null);
  const [listPhase, setListPhase] = useState("all");
  const [listAlert, setListAlert] = useState("all");

  const nav = [
    { key: "dash", label: "Dashboard Geral", icon: LayoutDashboard },
    { key: "lista", label: "Lista de Oásicos", icon: Users },
    { key: "ioe", label: "Avaliações IOE", icon: ClipboardList },
    { key: "vida", label: "Resultados — Vida", icon: HeartPulse },
    { key: "empresa", label: "Resultados — Empresa", icon: Building2 },
    { key: "mentoria", label: "Registro de Mentoria", icon: MessageSquareQuote },
    { key: "atividades", label: "Gestão de Atividades", icon: ListChecks },
    { key: "agenda", label: "Agenda", icon: CalendarClock },
  ];

  const openDetail = (id) => { setSelectedId(id); setCurrent("detalhe"); };
  const openLista = (phase = "all", alert = "all") => { setListPhase(phase); setListAlert(alert); setCurrent("lista"); };

  return (
    <Shell user={user} nav={nav} current={current === "detalhe" ? "lista" : current} setCurrent={setCurrent} onLogout={onLogout}>
      {current === "dash" && <AdmDashboard db={db} openDetail={openDetail} go={setCurrent} openLista={openLista} />}
      {current === "lista" && <AdmLista db={db} openDetail={openDetail} phase={listPhase} setPhase={setListPhase} alert={listAlert} setAlert={setListAlert} />}
      {current === "detalhe" && <AdmDetalhe db={db} id={selectedId} back={() => setCurrent("lista")} go={setCurrent} setSelectedId={setSelectedId} />}
      {current === "ioe" && <AdmAvaliacoesIOE db={db} openDetail={openDetail} />}
      {current === "vida" && <AdmWheels db={db} kind="life" />}
      {current === "empresa" && <AdmWheels db={db} kind="business" />}
      {current === "mentoria" && <AdmMentoria db={db} preselect={selectedId} />}
      {current === "atividades" && <AdmAtividades db={db} />}
      {current === "agenda" && <AdmAgenda db={db} openDetail={openDetail} />}
    </Shell>
  );
}

/* ---------- utilidades ADM ---------- */
function lastIOE(o) { return o.ioeHistory[o.ioeHistory.length - 1]; }
function prevIOE(o) { return o.ioeHistory.length > 1 ? o.ioeHistory[o.ioeHistory.length - 2] : null; }
function oasicoAlerts(o) {
  const l = lastIOE(o); if (!l) return [];
  return buildAlerts(l.pillarScores, l.ioe, prevIOE(o)?.ioe);
}
function hasCritical(o) { return oasicoAlerts(o).some((a) => a.type === "critical"); }
function hasLateTasks(db, o) { return db.tasks.some((t) => t.oasicoId === o.id && t.status === "atrasada"); }

function AdmDashboard({ db, openDetail, go, openLista }) {
  const withIOE = db.oasicos.filter((o) => lastIOE(o));
  const avgIOE = withIOE.length ? Math.round(withIOE.reduce((a, o) => a + lastIOE(o).ioe, 0) / withIOE.length) : 0;
  const byPhase = PHASES.map((p) => ({ ...p, count: withIOE.filter((o) => getPhase(lastIOE(o).ioe).name === p.name).length }));
  const critical = db.oasicos.filter(hasCritical);
  const late = db.oasicos.filter((o) => hasLateTasks(db, o));
  const recent = withIOE.map((o) => ({ o, l: lastIOE(o) })).sort((a, b) => b.l.date.localeCompare(a.l.date)).slice(0, 4);
  const upcoming = db.oasicos.filter((o) => o.nextMentoring).sort((a, b) => a.nextMentoring.localeCompare(b.nextMentoring));

  return (
    <div>
      <div className="reveal" style={{ marginBottom: 22 }}>
        <div className="gold" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Visão geral</div>
        <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, margin: "6px 0 0" }}>Dashboard do Mentor</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 22 }}>
        <Stat icon={Users} label="Total de Oásicos" value={db.oasicos.length} delay={0} onClick={() => openLista()} />
        <Stat icon={TrendingUp} label="IOE médio" value={avgIOE} sub="/ 100" accent="#30A46C" delay={70} onClick={() => go("ioe")} />
        <Stat icon={ShieldAlert} label="Alertas críticos" value={critical.length} accent="#E5484D" delay={140} onClick={() => openLista("all", "critical")} />
        <Stat icon={AlertTriangle} label="Atividades atrasadas" value={late.length} accent="#F76B15" delay={210} onClick={() => openLista("all", "late")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 22 }} className="wheel-grid">
        <div className="panel reveal" style={{ padding: 22 }}>
          <SectionTitle kicker="Distribuição" title="Oásicos por fase" />
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {byPhase.map((p) => (
              <div key={p.name} onClick={() => p.count && openLista(p.name, "all")}
                style={{ display: "flex", alignItems: "center", gap: 12, cursor: p.count ? "pointer" : "default",
                  padding: "3px 6px", margin: "0 -6px", borderRadius: 8, transition: "background .2s" }}
                onMouseEnter={(e) => p.count && (e.currentTarget.style.background = "rgba(201,162,75,.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span style={{ width: 110, fontSize: 13, fontWeight: 600, color: p.color }}>{p.name}</span>
                <div style={{ flex: 1, height: 10, borderRadius: 99, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
                  <div style={{ width: `${db.oasicos.length ? (p.count / db.oasicos.length) * 100 : 0}%`, height: "100%",
                    background: p.color, borderRadius: 99, transition: "width .8s cubic-bezier(.2,.7,.2,1)" }} />
                </div>
                <span className="serif" style={{ width: 24, textAlign: "right", fontWeight: 700 }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel reveal" style={{ padding: 22, animationDelay: "100ms" }}>
          <SectionTitle kicker="Agenda" title="Próximas mentorias" action={<button className="btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => go("agenda")}>Ver tudo</button>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Nenhuma agendada.</div>}
            {upcoming.map((o) => (
              <div key={o.id} className="panel-2" style={{ padding: "11px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => openDetail(o.id)}>
                <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{o.name}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{o.company}</div></div>
                <div className="gold" style={{ fontSize: 12.5, fontWeight: 600 }}>{fmtDateTime(o.nextMentoring)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel reveal" style={{ padding: 22 }}>
        <SectionTitle kicker="Últimas avaliações" title="Avaliações recebidas" action={<button className="btn-ghost" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => go("ioe")}>Avaliações IOE</button>} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map(({ o, l }) => (
            <div key={o.id} className="panel-2" style={{ padding: "13px 15px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", flexWrap: "wrap" }} onClick={() => openDetail(o.id)}>
              <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontWeight: 600 }}>{o.name}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{o.company} · {fmtDate(l.date)}</div></div>
              <PhaseChip ioe={l.ioe} />
              <div className="serif gold-grad" style={{ fontSize: 26, fontWeight: 800, minWidth: 40, textAlign: "right" }}>{l.ioe}</div>
              {hasCritical(o) && <ShieldAlert size={18} color="#E5484D" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdmLista({ db, openDetail, phase = "all", setPhase, alert = "all", setAlert }) {
  const [q, setQ] = useState("");

  const filtered = db.oasicos.filter((o) => {
    const l = lastIOE(o);
    if (q && !(`${o.name} ${o.company}`.toLowerCase().includes(q.toLowerCase()))) return false;
    if (phase !== "all" && (!l || getPhase(l.ioe).name !== phase)) return false;
    if (alert === "critical" && !hasCritical(o)) return false;
    if (alert === "late" && !hasLateTasks(db, o)) return false;
    return true;
  });

  return (
    <div className="reveal">
      <SectionTitle kicker="Membros" title="Lista de Oásicos" action={
        (phase !== "all" || alert !== "all") ? (
          <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 12.5 }}
            onClick={() => { setPhase && setPhase("all"); setAlert && setAlert("all"); }}>
            <X size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />Limpar filtros
          </button>
        ) : null} />
      <div className="panel" style={{ padding: 14, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={16} color="var(--muted)" style={{ position: "absolute", left: 12, top: 13 }} />
          <input style={{ paddingLeft: 36 }} placeholder="Buscar por nome ou empresa…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select style={{ width: 170 }} value={phase} onChange={(e) => setPhase(e.target.value)}>
          <option value="all" style={{ background: "#161618" }}>Todas as fases</option>
          {PHASES.map((p) => <option key={p.name} value={p.name} style={{ background: "#161618" }}>{p.name}</option>)}
        </select>
        <select style={{ width: 160 }} value={alert} onChange={(e) => setAlert(e.target.value)}>
          <option value="all" style={{ background: "#161618" }}>Todos os alertas</option>
          <option value="critical" style={{ background: "#161618" }}>Crítico</option>
          <option value="late" style={{ background: "#161618" }}>Atividade atrasada</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {filtered.map((o, i) => {
          const l = lastIOE(o);
          return (
            <div key={o.id} className="panel reveal" style={{ padding: 18, cursor: "pointer", animationDelay: `${i * 60}ms` }} onClick={() => openDetail(o.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontSize: 16, fontWeight: 700 }}>{o.name}</div><div style={{ fontSize: 12.5, color: "var(--muted)" }}>{o.company}</div></div>
                {l && <div className="serif gold-grad" style={{ fontSize: 28, fontWeight: 800 }}>{l.ioe}</div>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                {l ? <PhaseChip ioe={l.ioe} /> : <span className="chip" style={{ color: "var(--muted)", borderColor: "var(--line)" }}>Sem IOE</span>}
                {hasCritical(o) && <span className="chip" style={{ color: "#E5484D", borderColor: "#E5484D55", background: "#E5484D14" }}><ShieldAlert size={12} /> Crítico</span>}
                {hasLateTasks(db, o) && <span className="chip" style={{ color: "#F76B15", borderColor: "#F76B1555", background: "#F76B1514" }}><Clock size={12} /> Atrasada</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Painel de resultado IOE (reutilizável) ---------- */
function IOEResultPanel({ o }) {
  const l = lastIOE(o); const prev = prevIOE(o);
  if (!l) return <div className="panel" style={{ padding: 24, color: "var(--muted)" }}>Este Oásico ainda não enviou uma avaliação IOE.</div>;
  const ph = getPhase(l.ioe);
  const alerts = buildAlerts(l.pillarScores, l.ioe, prev?.ioe);
  const delta = prev ? l.ioe - prev.ioe : null;

  return (
    <div className="panel" style={{ padding: "clamp(18px,3vw,26px)" }}>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{o.name} · {o.company}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Data da avaliação: {fmtDate(l.date)}</div>
          <div style={{ marginTop: 10 }}><PhaseChip ioe={l.ioe} /></div>
          <div className="serif" style={{ fontSize: 18, marginTop: 8 }}>Foco da fase: <span className="gold">{ph.focus}</span></div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="serif gold-grad" style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{l.ioe}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>IOE / 100</div>
          {delta != null && (
            <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: delta >= 0 ? "#30A46C" : "#E5484D" }}>
              {delta >= 0 ? <TrendingUp size={14} style={{ verticalAlign: "middle" }} /> : <TrendingDown size={14} style={{ verticalAlign: "middle" }} />}
              {" "}{delta >= 0 ? "+" : ""}{delta} vs anterior ({prev.ioe})
            </div>
          )}
        </div>
      </div>

      <div className="gold-line" style={{ margin: "20px 0" }} />

      {/* Notas por pilar */}
      <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 12 }}>Notas por pilar</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {IOE_PILLARS.map((p) => {
          const sc = l.pillarScores[p.key];
          const c = sc < 4 ? "#E5484D" : sc < 5 ? "#E6B800" : sc < 7 ? "#3E7BFA" : "#30A46C";
          return (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 130, fontSize: 13, fontWeight: 500 }} className="desktop-only">{p.name}</span>
              <span style={{ width: 70, fontSize: 12, fontWeight: 600 }} className="mobile-only">{p.short}</span>
              <div style={{ flex: 1, height: 9, borderRadius: 99, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
                <div style={{ width: `${sc * 10}%`, height: "100%", background: c, borderRadius: 99, transition: "width .8s" }} />
              </div>
              <span className="serif" style={{ width: 38, textAlign: "right", fontWeight: 700, color: c }}>{sc.toFixed(1)}</span>
            </div>
          );
        })}
      </div>

      {/* Diagnóstico */}
      <div className="panel-2" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: GOLD, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Diagnóstico automático</div>
        <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{ph.diagnostic}</p>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Alertas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.map((a, i) => <AlertPill key={i} alert={a} />)}
          </div>
        </div>
      )}

      {/* Sugestão de foco */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", borderRadius: 11, background: GOLD + "10", border: `1px solid ${GOLD}33` }}>
        <Target size={18} color={GOLD} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 13.5 }}><b className="gold">Sugestão p/ próxima mentoria:</b> {suggestFocus(l.pillarScores)}</span>
      </div>
    </div>
  );
}

function AdmAvaliacoesIOE({ db, openDetail }) {
  const list = db.oasicos.filter((o) => lastIOE(o)).sort((a, b) => lastIOE(b).date.localeCompare(lastIOE(a).date));
  return (
    <div className="reveal">
      <SectionTitle kicker="Diagnóstico" title="Avaliações IOE" />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {list.map((o, i) => <div key={o.id} className="reveal" style={{ animationDelay: `${i * 80}ms` }}><IOEResultPanel o={o} /></div>)}
      </div>
    </div>
  );
}

function AdmWheels({ db, kind }) {
  const labels = kind === "life" ? LIFE_WHEEL : BUSINESS_WHEEL;
  const field = kind === "life" ? "lifeWheel" : "businessWheel";
  const color = kind === "life" ? "#E4C977" : GOLD;
  return (
    <div className="reveal">
      <SectionTitle kicker="Percepção" title={kind === "life" ? "Resultados — Roda da Vida" : "Resultados — Roda Empresarial"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {db.oasicos.map((o, i) => (
          <div key={o.id} className="panel reveal" style={{ padding: 18, animationDelay: `${i * 70}ms` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div><div style={{ fontWeight: 700 }}>{o.name}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{o.company}</div></div>
              <div className="serif gold-grad" style={{ fontSize: 22, fontWeight: 800 }}>
                {(o[field].reduce((a, b) => a + b, 0) / o[field].length).toFixed(1)}
              </div>
            </div>
            <WheelRadar labels={labels} values={o[field]} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmDetalhe({ db, id, back, go, setSelectedId }) {
  const o = db.oasicos.find((x) => x.id === id);
  if (!o) return null;
  const tasks = db.tasks.filter((t) => t.oasicoId === o.id);
  const mentorings = db.mentorings.filter((m) => m.oasicoId === o.id);
  return (
    <div className="reveal">
      <button className="btn-ghost" style={{ padding: "8px 14px", marginBottom: 16 }} onClick={back}><ArrowLeft size={16} style={{ verticalAlign: "middle" }} /> Voltar</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 className="serif" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>{o.name}</h1>
          <div style={{ color: "var(--muted)" }}>{o.company} · {o.email}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ padding: "9px 14px" }} onClick={() => { setSelectedId(o.id); go("mentoria"); }}>Registrar mentoria</button>
          <button className="btn-gold" style={{ padding: "9px 14px" }} onClick={() => { setSelectedId(o.id); go("atividades"); }}>Nova atividade</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}><IOEResultPanel o={o} /></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }} className="wheel-grid">
        <div className="panel" style={{ padding: 18 }}><SectionTitle kicker="Pessoal" title="Roda da Vida" /><WheelRadar labels={LIFE_WHEEL} values={o.lifeWheel} color="#E4C977" /></div>
        <div className="panel" style={{ padding: 18 }}><SectionTitle kicker="Negócio" title="Roda Empresarial" /><WheelRadar labels={BUSINESS_WHEEL} values={o.businessWheel} color={GOLD} /></div>
      </div>

      {/* Histórico IOE */}
      {o.ioeHistory.length > 1 && (
        <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
          <SectionTitle kicker="Evolução" title="Histórico de IOE" />
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 130 }}>
            {o.ioeHistory.map((h, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: getPhase(h.ioe).color, marginBottom: 6 }}>{h.ioe}</div>
                <div style={{ height: h.ioe + "%", maxHeight: 100, background: `linear-gradient(${getPhase(h.ioe).color},${getPhase(h.ioe).color}55)`, borderRadius: "8px 8px 0 0", transition: "height .8s" }} />
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{fmtDate(h.date)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="wheel-grid">
        <div className="panel" style={{ padding: 18 }}>
          <SectionTitle kicker="Execução" title="Atividades" />
          {tasks.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Nenhuma atividade.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map((t) => (
              <div key={t.id} className="panel-2" style={{ padding: 12, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: 11.5, color: "var(--muted)" }}>Prazo {fmtDate(t.deadline)}</div></div>
                <StatusChip status={t.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <SectionTitle kicker="Histórico" title="Mentorias" />
          {mentorings.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Nenhuma mentoria.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mentorings.map((m) => (
              <div key={m.id} className="panel-2" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 13.5 }}>{m.type}</b><span style={{ fontSize: 12, color: "var(--muted)" }}>{fmtDate(m.date)}</span></div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{m.summary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MField({ label, value, onChange, area, c }) {
  return (
    <div>
      <label style={c ? { color: c } : {}}>{label}</label>
      {area
        ? <textarea rows={2} style={{ marginTop: 6, resize: "vertical" }} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input style={{ marginTop: 6 }} value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function AdmMentoria({ db, preselect }) {
  const blank = { mode: "individual", oasicoId: preselect || db.oasicos[0]?.id || "", date: new Date().toISOString().slice(0, 10), type: "Estratégica",
    wins: "", difficulties: "", attention: "", decisions: "", summary: "", privateNotes: "", nextDate: "", newTask: "" };
  const [f, setF] = useState(blank);
  const [done, setDone] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const isGroup = f.mode === "grupo";

  const save = () => {
    const targets = isGroup ? db.oasicos.map((o) => o.id) : [f.oasicoId];
    if (targets.length === 0) return;
    const base = Date.now();
    const records = targets.map((oid, i) => ({
      id: "m" + (base + i), oasicoId: oid, date: f.date, type: isGroup ? `${f.type} (em grupo)` : f.type,
      group: isGroup, wins: f.wins, difficulties: f.difficulties, attention: f.attention,
      decisions: f.decisions, summary: f.summary, privateNotes: f.privateNotes, nextDate: f.nextDate,
    }));
    db.setMentorings((arr) => [...arr, ...records]);
    if (f.nextDate) db.setOasicos((arr) => arr.map((o) => targets.includes(o.id) ? { ...o, nextMentoring: f.nextDate } : o));
    if (f.newTask.trim()) {
      const newTasks = targets.map((oid, i) => ({
        id: "t" + (base + i), oasicoId: oid, title: f.newTask, description: "Atividade gerada na mentoria.",
        deadline: f.nextDate ? f.nextDate.slice(0, 10) : "", status: "pendente", commentOasico: "", commentAdm: "",
        origin: `Mentoria ${isGroup ? "em grupo " : ""}${fmtDate(f.date)}`,
      }));
      db.setTasks((arr) => [...arr, ...newTasks]);
    }
    setDone(true); setTimeout(() => { setDone(false); setF({ ...blank, mode: f.mode }); }, 2400);
  };

  return (
    <div className="reveal">
      <SectionTitle kicker="Mentoria" title="Registro de Mentoria" />
      <div className="panel" style={{ padding: "clamp(18px,3vw,26px)" }}>
        {/* Seletor de modo */}
        <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 12, background: "rgba(0,0,0,.35)",
          border: "1px solid var(--line)", marginBottom: 18 }}>
          {[["individual", "Individual", Users], ["grupo", "Em grupo", Users]].map(([m, label]) => (
            <button key={m} onClick={() => set("mode", m)}
              style={{ padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13.5,
                fontFamily: "inherit", transition: "all .2s",
                background: f.mode === m ? "linear-gradient(120deg,var(--gold-soft),var(--gold))" : "transparent",
                color: f.mode === m ? "#161200" : "var(--muted)" }}>
              {m === "grupo" ? "Em grupo" : "Individual"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }} className="wheel-grid">
          {isGroup ? (
            <div><label>Participantes</label>
              <div className="panel-2" style={{ marginTop: 6, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={18} color={GOLD} />
                <span style={{ fontSize: 13.5 }}>Todos os <b className="gold">{db.oasicos.length} Oásicos</b></span>
              </div>
            </div>
          ) : (
            <div><label>Oásico</label>
              <select style={{ marginTop: 6 }} value={f.oasicoId} onChange={(e) => set("oasicoId", e.target.value)}>
                {db.oasicos.map((o) => <option key={o.id} value={o.id} style={{ background: "#161618" }}>{o.name}</option>)}
              </select></div>
          )}
          <div><label>Data da mentoria</label><input type="date" style={{ marginTop: 6 }} value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
          <div><label>Tipo de mentoria</label>
            <select style={{ marginTop: 6 }} value={f.type} onChange={(e) => set("type", e.target.value)}>
              {["Estratégica", "Financeira", "Comercial", "Gestão", "Liderança", "Acompanhamento", "Coletiva"].map((t) => <option key={t} style={{ background: "#161618" }}>{t}</option>)}
            </select></div>
        </div>

        {isGroup && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "11px 14px", borderRadius: 11,
            background: GOLD + "10", border: `1px solid ${GOLD}33`, marginBottom: 14, fontSize: 13 }}>
            <Sparkles size={16} color={GOLD} style={{ flexShrink: 0 }} />
            <span>Este registro será aplicado a <b className="gold">todos os {db.oasicos.length} Oásicos</b>. Próxima data e atividade, se preenchidas, valem para todos.</span>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="wheel-grid">
          <MField label="Vitórias conquistadas" value={f.wins} onChange={(v) => set("wins", v)} area c="#30A46C" />
          <MField label="Dificuldades relatadas" value={f.difficulties} onChange={(v) => set("difficulties", v)} area c="#E6B800" />
          <MField label="Pontos de atenção" value={f.attention} onChange={(v) => set("attention", v)} area c="#F76B15" />
          <MField label="Decisões tomadas" value={f.decisions} onChange={(v) => set("decisions", v)} area c={GOLD} />
        </div>
        <div style={{ marginBottom: 14 }}><MField label="Resumo da mentoria" value={f.summary} onChange={(v) => set("summary", v)} area /></div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#8E4EC6" }}>Observações privadas do ADM (não visível ao Oásico)</label>
          <textarea rows={2} style={{ marginTop: 6, resize: "vertical", borderColor: "#8E4EC633" }} value={f.privateNotes} onChange={(e) => set("privateNotes", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }} className="wheel-grid">
          <div><label>Próxima mentoria</label><input type="datetime-local" style={{ marginTop: 6 }} value={f.nextDate} onChange={(e) => set("nextDate", e.target.value)} /></div>
          <div><label>Atividade gerada (opcional)</label><input style={{ marginTop: 6 }} placeholder="Ex: Montar fluxo de caixa…" value={f.newTask} onChange={(e) => set("newTask", e.target.value)} /></div>
        </div>
        <button className="btn-gold" style={{ padding: "13px 26px" }} onClick={save}>
          {done
            ? <><CheckCircle2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />{isGroup ? `Registrada para ${db.oasicos.length} Oásicos` : "Mentoria registrada"}</>
            : (isGroup ? "Salvar mentoria em grupo" : "Salvar mentoria")}
        </button>
      </div>
    </div>
  );
}

function AdmAtividades({ db }) {
  const [f, setF] = useState({ oasicoId: db.oasicos[0]?.id || "", title: "", description: "", deadline: "", origin: "Criada pelo ADM" });
  const create = () => {
    if (!f.title.trim()) return;
    db.setTasks((arr) => [...arr, { id: "t" + Date.now(), ...f, status: "pendente", commentOasico: "", commentAdm: "" }]);
    setF({ ...f, title: "", description: "", deadline: "" });
  };
  const update = (id, patch) => db.setTasks((arr) => arr.map((t) => t.id === id ? { ...t, ...patch } : t));

  return (
    <div className="reveal">
      <SectionTitle kicker="Execução" title="Gestão de Atividades" />
      <div className="panel" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, fontWeight: 600 }}><Plus size={15} style={{ verticalAlign: "middle" }} /> Nova atividade</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr auto", gap: 12, alignItems: "end" }} className="wheel-grid">
          <div><label>Oásico</label><select style={{ marginTop: 6 }} value={f.oasicoId} onChange={(e) => setF({ ...f, oasicoId: e.target.value })}>{db.oasicos.map((o) => <option key={o.id} value={o.id} style={{ background: "#161618" }}>{o.name}</option>)}</select></div>
          <div><label>Título</label><input style={{ marginTop: 6 }} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><label>Prazo</label><input type="date" style={{ marginTop: 6 }} value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></div>
          <button className="btn-gold" style={{ padding: "12px 18px" }} onClick={create}>Criar</button>
        </div>
        <div style={{ marginTop: 12 }}><label>Descrição</label><input style={{ marginTop: 6 }} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {db.tasks.map((t) => {
          const o = db.oasicos.find((x) => x.id === t.oasicoId);
          return (
            <div key={t.id} className="panel" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 11.5, color: GOLD, fontWeight: 600 }}>{o?.name}</div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, margin: "2px 0" }}>{t.title}</h3>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Prazo {fmtDate(t.deadline)} · {t.origin}</div>
                  {t.commentOasico && <div style={{ fontSize: 12.5, marginTop: 6 }}>Oásico: "{t.commentOasico}"</div>}
                </div>
                <select style={{ width: 160 }} value={t.status} onChange={(e) => update(t.id, { status: e.target.value })}>
                  {Object.keys(STATUS).map((s) => <option key={s} value={s} style={{ background: "#161618" }}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginTop: 10 }}><label>Comentário do ADM</label><input style={{ marginTop: 6 }} value={t.commentAdm} placeholder="Feedback ao Oásico…" onChange={(e) => update(t.id, { commentAdm: e.target.value })} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdmAgenda({ db, openDetail }) {
  const list = db.oasicos.filter((o) => o.nextMentoring).sort((a, b) => a.nextMentoring.localeCompare(b.nextMentoring));
  const events = [...db.groupEvents].sort((a, b) => a.datetime.localeCompare(b.datetime));
  const [mode, setMode] = useState("individual");
  const [f, setF] = useState({ oasicoId: db.oasicos[0]?.id || "", title: "", datetime: "", location: "Online · Google Meet", description: "" });
  const [done, setDone] = useState(false);
  const isGroup = mode === "grupo";

  const create = () => {
    if (!f.datetime) return;
    if (isGroup) {
      const title = f.title.trim() || "Mentoria em Grupo";
      db.setGroupEvents((arr) => [...arr, { id: "g" + Date.now(), type: "Mentoria em grupo", title, datetime: f.datetime, location: f.location, description: f.description }]);
    } else {
      if (!f.oasicoId) return;
      const meta = { title: f.title.trim() || "Mentoria individual", location: f.location, description: f.description };
      db.setOasicos((arr) => arr.map((o) => o.id === f.oasicoId ? { ...o, nextMentoring: f.datetime, nextMentoringMeta: meta } : o));
    }
    setDone(true); setTimeout(() => setDone(false), 2200);
    setF({ oasicoId: f.oasicoId, title: "", datetime: "", location: "Online · Google Meet", description: "" });
  };
  const removeGroup = (id) => db.setGroupEvents((arr) => arr.filter((e) => e.id !== id));
  const removeIndividual = (id) => db.setOasicos((arr) => arr.map((o) => o.id === id ? { ...o, nextMentoring: null, nextMentoringMeta: null } : o));

  return (
    <div className="reveal">
      <SectionTitle kicker="Calendário" title="Agenda" />

      {/* Criar mentoria */}
      <div className="panel" style={{ padding: 20, marginBottom: 22 }}>
        {/* Seletor de modo */}
        <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 12, background: "rgba(0,0,0,.35)", border: "1px solid var(--line)", marginBottom: 16 }}>
          {["individual", "grupo"].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13.5, fontFamily: "inherit", transition: "all .2s",
                background: mode === m ? "linear-gradient(120deg,var(--gold-soft),var(--gold))" : "transparent",
                color: mode === m ? "#161200" : "var(--muted)" }}>
              {m === "grupo" ? "Em grupo" : "Individual"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: (isGroup ? "#8E4EC6" : GOLD) + "18", display: "grid", placeItems: "center" }}>
            {isGroup ? <Users size={19} color="#8E4EC6" /> : <CalendarClock size={19} color={GOLD} />}
          </div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>{isGroup ? "Criar mentoria em grupo" : "Criar mentoria individual"}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{isGroup ? `Vai para a agenda de todos os ${db.oasicos.length} Oásicos.` : "Agenda na conta de um Oásico específico."}</div>
          </div>
        </div>

        {!isGroup && (
          <div style={{ marginBottom: 12 }}><label>Oásico</label>
            <select style={{ marginTop: 6 }} value={f.oasicoId} onChange={(e) => setF({ ...f, oasicoId: e.target.value })}>
              {db.oasicos.map((o) => <option key={o.id} value={o.id} style={{ background: "#161618" }}>{o.name} — {o.company}</option>)}
            </select></div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.4fr", gap: 12 }} className="wheel-grid">
          <div><label>Título</label><input style={{ marginTop: 6 }} value={f.title} placeholder={isGroup ? "Mentoria em Grupo" : "Mentoria individual"} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><label>Data e hora</label><input type="datetime-local" style={{ marginTop: 6 }} value={f.datetime} onChange={(e) => setF({ ...f, datetime: e.target.value })} /></div>
          <div><label>Local / link</label><input style={{ marginTop: 6 }} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 12 }}><label>Descrição</label><input style={{ marginTop: 6 }} value={f.description} placeholder={isGroup ? "Pauta do encontro coletivo…" : "Pauta da mentoria…"} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <button className="btn-gold" style={{ padding: "12px 22px", marginTop: 14 }} onClick={create}>
          {done
            ? <><CheckCircle2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />{isGroup ? "Adicionada à agenda de todos" : "Mentoria agendada"}</>
            : <><CalendarPlus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />{isGroup ? "Criar e enviar a todos" : "Agendar mentoria"}</>}
        </button>
      </div>

      {/* Mentorias em grupo */}
      {events.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 12, color: "#8E4EC6", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 12 }}>Mentorias em grupo</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {events.map((ev, i) => {
              const dt = new Date(ev.datetime);
              return (
                <div key={ev.id} className="panel reveal" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", animationDelay: `${i * 70}ms`, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", minWidth: 64, padding: "10px 8px", borderRadius: 12, background: "#8E4EC614", border: "1px solid #8E4EC640" }}>
                    <div className="serif" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: "#B073E0" }}>{dt.getDate()}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>{dt.toLocaleDateString("pt-BR", { month: "short" })}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15.5 }}>{ev.title}</span>
                      <span className="chip" style={{ color: "#8E4EC6", borderColor: "#8E4EC655", background: "#8E4EC614" }}><Users size={12} /> Todos</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
                      {dt.toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" })}{ev.location ? ` · ${ev.location}` : ""}
                    </div>
                    {ev.description && <div style={{ fontSize: 12.5, marginTop: 4, color: "var(--cream)", opacity: .85 }}>{ev.description}</div>}
                  </div>
                  <GcalButton event={ev} small />
                  <button className="btn-ghost" style={{ padding: 9 }} title="Remover" onClick={() => removeGroup(ev.id)}><Trash2 size={15} color="#E5484D" /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mentorias individuais */}
      <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 12 }}>Próximas mentorias individuais</div>
      {list.length === 0 && <div className="panel" style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>Nenhuma mentoria individual agendada.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((o, i) => {
          const dt = new Date(o.nextMentoring);
          const meta = o.nextMentoringMeta;
          return (
            <div key={o.id} className="panel reveal" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", animationDelay: `${i * 70}ms`, flexWrap: "wrap" }}>
              <div onClick={() => openDetail(o.id)} style={{ textAlign: "center", minWidth: 64, padding: "10px 8px", borderRadius: 12, background: GOLD + "12", border: `1px solid ${GOLD}33`, cursor: "pointer" }}>
                <div className="serif gold" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{dt.getDate()}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>{dt.toLocaleDateString("pt-BR", { month: "short" })}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, cursor: "pointer" }} onClick={() => openDetail(o.id)}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{o.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  {o.company} · {dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}{meta?.location ? ` · ${meta.location}` : ""}
                </div>
                {meta?.title && <div style={{ fontSize: 12.5, marginTop: 3, color: GOLD }}>{meta.title}</div>}
              </div>
              {lastIOE(o) && <PhaseChip ioe={lastIOE(o).ioe} />}
              <GcalButton event={{ title: meta?.title || `Mentoria — ${o.name}`, datetime: o.nextMentoring, location: meta?.location || "", description: meta?.description || `Mentoria individual com ${o.name} (${o.company}).` }} small />
              <button className="btn-ghost" style={{ padding: 9 }} title="Cancelar agendamento" onClick={() => removeIndividual(o.id)}><Trash2 size={15} color="#E5484D" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export { OasicoApp, AdmApp, StyleInjection, GrainBg, Logo };
