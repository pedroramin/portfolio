import { useState, useEffect, useRef, useCallback, memo } from "react";
import hamburgueriaVideo from "./videos/hamburgueria.mp4";
import confeitariaVideo from "./videos/confeitaria.mp4";
import restauranteVideo from "./videos/restaurante.mp4";
import babeariaVideo from "./videos/babearia.mp4";
import cafeteriaVideo from "./videos/cafeteria.mp4";
import academiaVideo from "./videos/academia.mp4";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');`;

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:#0b0b0b;color:#e8e4dc;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes grain{
  0%,100%{transform:translate(0,0);}
  10%{transform:translate(-2%,-3%);}
  20%{transform:translate(2%,2%);}
  30%{transform:translate(-1%,4%);}
  40%{transform:translate(3%,-1%);}
  50%{transform:translate(-3%,3%);}
  60%{transform:translate(1%,-2%);}
  70%{transform:translate(-2%,1%);}
  80%{transform:translate(2%,3%);}
  90%{transform:translate(-1%,-2%);}
}

.fade-up{animation:fadeUp .6s ease both;}
.fade-in{animation:fadeIn .5s ease both;}

.project-card:hover .project-img-wrap{transform:scale(1.03);}
.project-card:hover .project-arrow{transform:translate(3px,-3px);}
.template-card:hover{border-color:rgba(180,255,120,0.4) !important;}
.template-card:hover .tpl-preview{transform:translateY(-4px);}

input:focus,textarea:focus{outline:none;border-color:rgba(180,255,120,0.5) !important;}
`;

// ─── Glowing Effect ───────────────────────────────────────────────────────────
const GlowingEffect = memo(({ blur=0, inactiveZone=0.7, proximity=0, spread=20, borderWidth=1, disabled=false }) => {
  const containerRef = useRef(null);
  const lastPosition = useRef({ x:0, y:0 });
  const animationFrameRef = useRef(0);

  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const mouseX = e?.x ?? lastPosition.current.x;
      const mouseY = e?.y ?? lastPosition.current.y;
      if (e) lastPosition.current = { x: mouseX, y: mouseY };
      const center = [left + width * 0.5, top + height * 0.5];
      const dist = Math.hypot(mouseX - center[0], mouseY - center[1]);
      if (dist < 0.5 * Math.min(width, height) * inactiveZone) { el.style.setProperty("--active","0"); return; }
      const isActive = mouseX > left-proximity && mouseX < left+width+proximity && mouseY > top-proximity && mouseY < top+height+proximity;
      el.style.setProperty("--active", isActive ? "1" : "0");
      if (!isActive) return;
      const angle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;
      el.style.setProperty("--start", String(angle));
    });
  }, [inactiveZone, proximity]);

  useEffect(() => {
    if (disabled) return;
    const onScroll = () => handleMove();
    const onMove = (e) => handleMove(e);
    window.addEventListener("scroll", onScroll, { passive:true });
    document.body.addEventListener("pointermove", onMove, { passive:true });
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("scroll", onScroll);
      document.body.removeEventListener("pointermove", onMove);
    };
  }, [handleMove, disabled]);

  return (
    <div ref={containerRef} style={{
      "--spread": spread, "--start":"0", "--active":"0",
      "--bw": `${borderWidth}px`,
      position:"absolute", inset:0, borderRadius:"inherit", pointerEvents:"none",
    }}>
      <style>{`
        .glow-inner::after {
          content: "";
          position: absolute;
          border-radius: inherit;
          inset: calc(-1 * var(--bw));
          border: var(--bw) solid transparent;
          background:
            radial-gradient(circle, #dd7bbb 10%, transparent 20%),
            radial-gradient(circle at 40% 40%, #d79f1e 5%, transparent 15%),
            radial-gradient(circle at 60% 60%, #5a922c 10%, transparent 20%),
            radial-gradient(circle at 40% 60%, #4c7894 10%, transparent 20%),
            repeating-conic-gradient(from 236.84deg at 50% 50%,
              #dd7bbb 0%,
              #d79f1e calc(25% / 5),
              #5a922c calc(50% / 5),
              #4c7894 calc(75% / 5),
              #dd7bbb calc(100% / 5)
            );
          background-origin: border-box;
          opacity: var(--active);
          transition: opacity 300ms;
          -webkit-mask-clip: padding-box, border-box;
          -webkit-mask-composite: intersect;
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
          -webkit-mask-image:
            linear-gradient(#000, #000),
            conic-gradient(
              from calc((var(--start) - var(--spread)) * 1deg),
              transparent 0deg,
              white,
              transparent calc(var(--spread) * 2deg)
            );
          mask-image:
            linear-gradient(#000, #000),
            conic-gradient(
              from calc((var(--start) - var(--spread)) * 1deg),
              transparent 0deg,
              white,
              transparent calc(var(--spread) * 2deg)
            );
        }
      `}</style>
      <div className="glow-inner" style={{ position:"absolute", inset:0, borderRadius:"inherit" }} />
    </div>
  );
});
GlowingEffect.displayName = "GlowingEffect";

// ─── Data ─────────────────────────────────────────────────────────────────────
// SVG icons por categoria
const CAT_ICONS = {
  burger: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11h18"/><path d="M3 7h18"/><path d="M3 15h18"/>
      <path d="M5 7C5 5.3 6.3 4 8 4h8c1.7 0 3 1.3 3 3"/>
      <path d="M5 15v1c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3v-1"/>
    </svg>
  ),
  confeitaria: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="18" height="9" rx="1.5"/>
      <path d="M3 12c0-3 3-3 3-6M9 12c0-3 3-3 3-6M15 12c0-3 3-3 3-6"/>
      <path d="M3 16h18"/>
    </svg>
  ),
  restaurant: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
    </svg>
  ),
  cafe: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
      <line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>
    </svg>
  ),
  personal: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="12" cy="9" r="2.5"/>
      <path d="M7 19c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
    </svg>
  ),
  fitness: (c) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h.01M17.5 6.5h.01"/>
      <rect x="3" y="8" width="3" height="8" rx="1.5"/>
      <rect x="18" y="8" width="3" height="8" rx="1.5"/>
      <rect x="1" y="10" width="2" height="4" rx="1"/>
      <rect x="21" y="10" width="2" height="4" rx="1"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
    </svg>
  ),
};

const TEMPLATES = [
  { id: "burger",     label: "Hamburgueria", color: "#E85D04", desc: "Ideal para lanchonetes e hamburguerias artesanais" },
  { id: "confeitaria", label: "Confeitaria",  color: "#D4A017", desc: "Vitrine de bolos, doces e encomendas pelo WhatsApp" },
  { id: "restaurant", label: "Restaurante",  color: "#C9184A", desc: "Cardápio em destaque com reserva por WhatsApp" },
  { id: "cafe",       label: "Cafeteria",    color: "#8B5E3C", desc: "Atmosfera aconchegante com cardápio visual" },
  { id: "personal",    label: "Pág. Pessoal", color: "#9B5DE5", desc: "Portfólio, bio e links para profissionais autônomos" },
  { id: "fitness",    label: "Academia",     color: "#0077B6", desc: "Planos, horários e captação de alunos" },
];

const ACCENT = "#b4ff78";

// ─── Grain overlay ────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position: "fixed", inset: "-50%", zIndex: 1000, pointerEvents: "none",
      opacity: 0.035,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "200px",
      animation: "grain 0.8s steps(1) infinite",
    }} />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "0 40px", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(11,11,11,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      transition: "all .4s ease",
    }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: "22px", letterSpacing: "2px", color: "#e8e4dc" }}>
        Ramos<span style={{ color: ACCENT }}>dev</span>
      </div>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {[["Projetos", "#projetos"], ["Contato", "#contato"]].map(([label, href]) => (
          <a key={label} href={href} style={{
            fontSize: "13px", color: "#666", textDecoration: "none",
            transition: "color .2s", letterSpacing: ".3px"
          }}
            onMouseEnter={e => e.target.style.color = "#e8e4dc"}
            onMouseLeave={e => e.target.style.color = "#666"}>{label}</a>
        ))}
        <button onClick={onContact} style={{
          background: ACCENT, border: "none", borderRadius: "8px",
          padding: "8px 18px", color: "#0b0b0b", fontFamily: "'DM Sans'",
          fontSize: "13px", fontWeight: 600, cursor: "pointer",
          transition: "all .2s"
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 20px ${ACCENT}40`; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
          Solicitar orçamento
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onContact }) {
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setTick(p => !p), 530);
    return () => clearInterval(t);
  }, []);

  const words = ["hamburguerias", "barbearias", "restaurantes", "cafeterias", "salões", "academias"];
  const [wi, setWi] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWi(p => (p + 1) % words.length); setFade(true); }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "80px 40px 60px",
      position: "relative", overflow: "hidden",
      maxWidth: "1200px", margin: "0 auto",
    }}>
      {/* Big background text */}
      <div style={{
        position: "absolute", top: "50%", left: "-20px", transform: "translateY(-50%)",
        fontFamily: "'Bebas Neue'", fontSize: "clamp(120px, 18vw, 240px)",
        color: "rgba(255,255,255,0.025)", letterSpacing: "-4px",
        userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap", lineHeight: 1,
      }}>PEDRO RAMOS</div>

      {/* Floating dot */}
      <div style={{
        position: "absolute", top: "20%", right: "8%",
        width: "180px", height: "180px", borderRadius: "50%",
        background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`,
        animation: "float 4s ease-in-out infinite",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Tag */}
        <div className="fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px",
          padding: "6px 14px", marginBottom: "32px",
          fontSize: "12px", color: "#666", letterSpacing: ".5px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ACCENT, animation: "blink 1.5s ease infinite" }} />
          Disponível para novos projetos
        </div>

        {/* Name */}
        <h1 className="fade-up" style={{
          fontFamily: "'Bebas Neue'", fontSize: "clamp(64px, 10vw, 130px)",
          lineHeight: .95, letterSpacing: "-1px", marginBottom: "24px",
          animationDelay: ".1s"
        }}>
          Ramos<br />
          <span style={{ color: ACCENT }}>Dev</span>
        </h1>

        {/* Subtitle */}
        <p className="fade-up" style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "#888",
          maxWidth: "520px", lineHeight: 1.6, marginBottom: "16px",
          animationDelay: ".2s", fontWeight: 300,
        }}>
          Desenvolvo sites profissionais para{" "}
          <span style={{
            color: ACCENT, fontFamily: "'Instrument Serif'", fontStyle: "italic",
            fontSize: "110%", transition: "opacity .3s",
            opacity: fade ? 1 : 0,
          }}>{words[wi]}</span>
          <span style={{ opacity: tick ? 1 : 0, color: ACCENT }}>_</span>
        </p>

        <p className="fade-up" style={{ fontSize: "14px", color: "#444", maxWidth: "420px", lineHeight: 1.7, marginBottom: "44px", animationDelay: ".25s" }}>
          Sites rápidos, bonitos e que realmente trazem clientes pro seu negócio — sem complicação.
        </p>

        <div className="fade-up" style={{ display: "flex", gap: "12px", animationDelay: ".35s" }}>
          <button onClick={onContact} style={{
            background: ACCENT, border: "none", borderRadius: "10px",
            padding: "14px 28px", color: "#0b0b0b", fontFamily: "'DM Sans'",
            fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "all .25s",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 32px ${ACCENT}50`; }}
            onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
            Quero um site assim →
          </button>
          <a href="#projetos" style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px", padding: "14px 24px", color: "#888",
            fontFamily: "'DM Sans'", fontSize: "15px", cursor: "pointer",
            transition: "all .2s", textDecoration: "none", display: "inline-block"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#e8e4dc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#888"; }}>
            Ver projetos
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: .3
      }}>
        <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, transparent, #e8e4dc)" }} />
        <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>scroll</span>
      </div>
    </section>
  );
}

// ─── Marquee strip ─────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Hamburgueria", "Barbearia", "Restaurante", "Cafeteria", "Salão", "Academia", "Pet Shop", "Pizzaria"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ display: "flex", animation: "marquee 18s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "20px", paddingRight: "40px", fontSize: "12px", color: "#333", textTransform: "uppercase", letterSpacing: "2px", whiteSpace: "nowrap" }}>
            <span style={{ color: ACCENT, fontSize: "8px" }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Site Mockup (visual preview per category) ────────────────────────────────
function SiteMockup({ tpl }) {
  const c = tpl.color;
  const bg = {
    burger:     "#120800",
    barber:     "#071210",
    restaurant: "#120008",
    cafe:       "#100c07",
    salon:      "#0d0612",
    fitness:    "#060d14",
  }[tpl.id] || "#111";

  const taglines = {
    burger:     "Os melhores smash burgers da cidade",
    barber:     "Cortes que falam por si",
    restaurant: "Sabor de casa, experiência única",
    cafe:       "Cada xícara conta uma história",
    salon:      "Beleza que transforma",
    fitness:    "Seu corpo. Sua evolução.",
  };

  const menuItems = {
    burger:     ["Classic Smash", "Double Bacon", "Crispy Chicken"],
    barber:     ["Corte Degradê", "Barba Completa", "Combo Social"],
    restaurant: ["Prato do Dia", "Frutos do Mar", "Sobremesas"],
    cafe:       ["Espresso", "Cappuccino", "Croissant"],
    salon:      ["Escova", "Coloração", "Manicure"],
    fitness:    ["Musculação", "Funcional", "Spinning"],
  };

  return (
    <div style={{
      background: bg, borderRadius: "10px", overflow: "hidden",
      border: `1px solid ${c}25`, fontSize: "0",
    }}>
      {/* Browser chrome */}
      <div style={{ background: "#1a1a1a", padding: "7px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {["#ff5f57","#febc2e","#28c840"].map(col => (
            <div key={col} style={{ width: "7px", height: "7px", borderRadius: "50%", background: col }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#111", borderRadius: "4px", padding: "3px 8px", marginLeft: "4px" }}>
          <div style={{ height: "5px", width: "55%", background: "#2a2a2a", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Hero section */}
      <div style={{
        background: `linear-gradient(160deg, ${bg} 0%, ${c}28 100%)`,
        padding: "16px 14px 14px",
        borderBottom: `1px solid ${c}15`,
      }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: `${c}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>{tpl.emoji}</div>
            <div style={{ height: "6px", width: "44px", background: `${c}60`, borderRadius: "3px" }} />
          </div>
          <div style={{ width: "42px", height: "14px", background: "#25D366", borderRadius: "4px", opacity: 0.8 }} />
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ height: "11px", width: "70%", background: `${c}70`, borderRadius: "4px", marginBottom: "5px" }} />
          <div style={{ height: "7px", width: "90%", background: "rgba(255,255,255,0.12)", borderRadius: "3px", marginBottom: "3px" }} />
          <div style={{ height: "7px", width: "60%", background: "rgba(255,255,255,0.07)", borderRadius: "3px", marginBottom: "10px" }} />
          <div style={{ fontSize: "8px", color: `${c}cc`, fontFamily: "'DM Sans'", marginBottom: "8px", fontWeight: 500 }}>
            {taglines[tpl.id]}
          </div>
        </div>

        {/* CTA button */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#25D366", borderRadius: "5px", padding: "4px 10px" }}>
          <div style={{ height: "5px", width: "5px", background: "rgba(255,255,255,0.6)", borderRadius: "50%" }} />
          <div style={{ height: "5px", width: "50px", background: "rgba(255,255,255,0.7)", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Menu/services list */}
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${c}10` }}>
        <div style={{ height: "5px", width: "30%", background: `${c}40`, borderRadius: "2px", marginBottom: "8px" }} />
        <div style={{ display: "flex", gap: "6px" }}>
          {(menuItems[tpl.id] || []).map((item, i) => (
            <div key={i} style={{
              flex: 1, background: `${c}12`, border: `1px solid ${c}20`,
              borderRadius: "6px", padding: "6px 5px", textAlign: "center"
            }}>
              <div style={{ height: "4px", background: `${c}50`, borderRadius: "2px", marginBottom: "4px" }} />
              <div style={{ fontSize: "6px", color: `${c}99`, fontFamily: "'DM Sans'", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info strip */}
      <div style={{ padding: "8px 14px", display: "flex", gap: "10px" }}>
        {["📍 Rua Exemplo, 123", "⏰ 11h – 23h"].map((info, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <div style={{ fontSize: "7px" }}>{info.split(" ")[0]}</div>
            <div style={{ height: "4px", width: i === 0 ? "52px" : "38px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Vídeos por categoria — em produção use caminhos /public, aqui estão embutidos
const TRUMANS_VIDEO = hamburgueriaVideo;
const CONFEITARIA_VIDEO = confeitariaVideo;
const RESTAURANT_VIDEO = restauranteVideo;
const PERSONAL_VIDEO = babeariaVideo;
const CAFE_VIDEO = cafeteriaVideo;
const FITNESS_VIDEO = academiaVideo;

const VIDEOS_BY_CAT = {
  burger: [
    { id: 1, video: TRUMANS_VIDEO }
  ],

  confeitaria: [
    { id: 1, video: CONFEITARIA_VIDEO }
  ],

  restaurant: [
    { id: 1, video: RESTAURANT_VIDEO }
  ],

  personal: [
    { id: 1, video: PERSONAL_VIDEO }
  ],

  cafe: [
    { id: 1, video: CAFE_VIDEO }
  ],

  fitness: [
    { id: 1, video: FITNESS_VIDEO }
 
  ]
};

// ─── Trabalhos ────────────────────────────────────────────────────────────────
function Trabalhos({ onContact }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [lightbox, setLightbox]       = useState(null); // { catId, videoIndex }

  const openLightbox  = (catId, idx) => setLightbox({ catId, idx });
  const closeLightbox = ()           => setLightbox(null);

  useEffect(() => {
    if (!lightbox) return;
    const videos = VIDEOS_BY_CAT[lightbox.catId] || [];
    const h = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")  setLightbox(l => ({ ...l, idx: (l.idx - 1 + videos.length) % videos.length }));
      if (e.key === "ArrowRight") setLightbox(l => ({ ...l, idx: (l.idx + 1) % videos.length }));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox]);

  return (
    <section id="projetos" style={{ padding: "100px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px" }}>
          <div>
            <p style={{ fontSize: "11px", color: ACCENT, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "12px" }}>Portfólio</p>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "1px" }}>
              Projetos &<br />Modelos
            </h2>
          </div>
          <p style={{ fontSize: "13px", color: "#444", maxWidth: "220px", textAlign: "right", lineHeight: 1.7 }}>
            {selectedCat ? "Clique no vídeo para expandir." : "Escolha uma categoria para ver os projetos."}
          </p>
        </div>

        {/* ── Grade de categorias ── */}
        {!selectedCat && (
          <div className="fade-in">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:"16px" }}>
              {TEMPLATES.map((tpl) => {
                const count = (VIDEOS_BY_CAT[tpl.id] || []).length;
                const hasProjects = count > 0;
                return (
                  <button key={tpl.id} onClick={() => setSelectedCat(tpl)} style={{
                    background:"transparent", border:"none", padding:"1px",
                    cursor:"pointer", textAlign:"left", position:"relative",
                    color:"inherit", fontFamily:"'DM Sans'", borderRadius:"20px",
                  }}>
                    {/* Glow border */}
                    <GlowingEffect spread={40} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    {/* Outer ring */}
                    <div style={{ borderRadius:"20px", border:"1px solid rgba(255,255,255,0.08)", padding:"2px" }}>
                      {/* Inner card */}
                      <div style={{
                        background:"#0f0f0f", borderRadius:"18px",
                        border:"1px solid rgba(255,255,255,0.05)",
                        padding:"24px", display:"flex", flexDirection:"column",
                        justifyContent:"space-between", minHeight:"200px", gap:"24px",
                      }}>
                        {/* Icon */}
                        <div style={{
                          width:"36px", height:"36px", borderRadius:"8px",
                          background:"rgba(180,255,120,0.08)", border:"1px solid rgba(180,255,120,0.2)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                          {CAT_ICONS[tpl.id]?.(ACCENT)}
                        </div>
                        {/* Text */}
                        <div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                            <h3 style={{ fontSize:"18px", fontWeight:600, color:ACCENT, letterSpacing:"-0.3px", lineHeight:1.3 }}>
                              {tpl.label}
                            </h3>
                            {hasProjects ? (
                              <div style={{ display:"flex", alignItems:"center", gap:"5px", background:"rgba(255,255,255,0.05)", borderRadius:"20px", padding:"3px 10px", border:"1px solid rgba(255,255,255,0.1)", flexShrink:0 }}>
                                <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"rgba(255,255,255,0.5)", animation:"blink 1.5s ease infinite" }} />
                                <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", letterSpacing:".5px" }}>EXEMPLO</span>
                              </div>
                            ) : (
                              <span style={{ fontSize:"10px", color:"#2a2a2a", letterSpacing:"1px", padding:"3px 10px", border:"1px solid #1a1a1a", borderRadius:"20px", flexShrink:0 }}>EM BREVE</span>
                            )}
                          </div>
                          <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.35)", lineHeight:1.6, margin:0 }}>{tpl.desc}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{
              marginTop: "40px", borderRadius: "20px", padding: "40px 36px",
              background: "linear-gradient(135deg, rgba(180,255,120,0.06) 0%, rgba(180,255,120,0.02) 100%)",
              border: "1px solid rgba(180,255,120,0.15)",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px"
            }}>
              <div>
                <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: "28px", letterSpacing: "1px", marginBottom: "6px" }}>Não encontrou sua categoria?</h3>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>Desenvolvo sites para qualquer tipo de negócio local. Me conte sobre o seu.</p>
              </div>
              <button onClick={onContact} style={{
                background: ACCENT, border: "none", borderRadius: "12px",
                padding: "14px 28px", color: "#0b0b0b", fontFamily: "'DM Sans'",
                fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all .2s"
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 32px ${ACCENT}40`; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
                Falar com Ramos Dev →
              </button>
            </div>
          </div>
        )}

        {/* ── Dentro da categoria: vídeos ── */}
        {selectedCat && (() => {
          const videos = VIDEOS_BY_CAT[selectedCat.id] || [];
          return (
            <div className="fade-in">
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
                <button onClick={() => setSelectedCat(null)} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", padding: "7px 14px", color: "#888",
                  fontFamily: "'DM Sans'", fontSize: "13px", cursor: "pointer", transition: "all .2s"
                }}
                  onMouseEnter={e => { e.target.style.color = "#e8e4dc"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { e.target.style.color = "#888"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  ← Voltar
                </button>
                <span style={{ fontSize: "13px", color: "#333" }}>/</span>
                <span style={{ fontSize: "13px", color: "#555" }}>{selectedCat.label}</span>
              </div>

              {videos.length === 0 ? (
                /* Placeholder — mesmo grid/card dos vídeos reais */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  <div style={{
                    borderRadius: "14px", overflow: "hidden", position: "relative",
                    background: "#111", border: `1px solid ${selectedCat.color}25`,
                    aspectRatio: "16/10", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "14px",
                  }}>
                    {/* Número do projeto — placeholder */}
                    <div style={{
                      position: "absolute", top: "12px", left: "12px",
                      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                      borderRadius: "6px", padding: "4px 10px",
                      fontFamily: "'DM Sans'", fontSize: "11px", color: "#888",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>Projeto 01</div>

                    {/* Ícone de câmera animado */}
                    <div style={{ fontSize: "32px", opacity: 0.25 }}>🎬</div>

                    <p style={{
                      fontFamily: "'Instrument Serif'", fontSize: "18px",
                      color: "#e8e4dc", opacity: 0.55, margin: 0,
                    }}>Em breve</p>

                    <p style={{
                      fontFamily: "'DM Sans'", fontSize: "12px",
                      color: "#444", margin: 0, textAlign: "center", lineHeight: 1.6, padding: "0 24px",
                    }}>
                      Seja o primeiro de {selectedCat.label.toLowerCase()} no portfólio
                    </p>

                    <button onClick={onContact} style={{
                      background: "transparent", border: `1px solid ${selectedCat.color}60`,
                      borderRadius: "8px", padding: "8px 20px", color: selectedCat.color,
                      fontFamily: "'DM Sans'", fontSize: "12px", fontWeight: 600,
                      cursor: "pointer", marginTop: "4px", transition: "all .2s",
                    }}
                      onMouseEnter={e => { e.target.style.background = `${selectedCat.color}15`; }}
                      onMouseLeave={e => { e.target.style.background = "transparent"; }}
                    >Solicitar orçamento</button>

                    {/* Grade decorativa de fundo */}
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${selectedCat.color}08 39px, ${selectedCat.color}08 40px),
                                        repeating-linear-gradient(90deg, transparent, transparent 39px, ${selectedCat.color}08 39px, ${selectedCat.color}08 40px)`,
                    }} />
                  </div>
                </div>
              ) : (
                /* Grid de vídeos pequenos */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {videos.map((proj, idx) => (
                    <div key={proj.id}
                      onClick={() => openLightbox(selectedCat.id, idx)}
                      style={{
                        borderRadius: "14px", overflow: "hidden", cursor: "pointer",
                        position: "relative", background: "#111",
                        border: `1px solid ${selectedCat.color}25`,
                        transition: "all .25s", aspectRatio: "16/10",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget;
                        el.style.transform = "translateY(-4px)";
                        el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5)`;
                        el.style.borderColor = selectedCat.color;
                        const vid = el.querySelector("video");
                        if (vid) vid.play().catch(() => {});
                        const ov = el.querySelector(".ov");
                        if (ov) ov.style.opacity = "1";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget;
                        el.style.transform = "";
                        el.style.boxShadow = "";
                        el.style.borderColor = `${selectedCat.color}25`;
                        const vid = el.querySelector("video");
                        if (vid) vid.pause();
                        const ov = el.querySelector(".ov");
                        if (ov) ov.style.opacity = "0";
                      }}>

                      <video
                        src={proj.video}
                        muted playsInline preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                      />

                      {/* Número do projeto */}
                      <div style={{
                        position: "absolute", top: "12px", left: "12px",
                        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
                        borderRadius: "6px", padding: "4px 10px",
                        fontSize: "11px", color: "#aaa", letterSpacing: ".5px"
                      }}>
                        Projeto 0{idx + 1}
                      </div>

                      {/* Hover overlay */}
                      <div className="ov" style={{
                        position: "absolute", inset: 0, opacity: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "opacity .25s"
                      }}>
                        <div style={{
                          width: "52px", height: "52px", borderRadius: "50%",
                          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "22px", color: "#fff"
                        }}>⛶</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (() => {
        const videos = VIDEOS_BY_CAT[lightbox.catId] || [];
        const proj   = videos[lightbox.idx];
        if (!proj) return null;
        return (
          <div onClick={closeLightbox} style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn .2s ease",
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              position: "relative", width: "min(92vw, 1200px)",
              borderRadius: "16px", overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
              animation: "fadeUp .25s ease",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <video
                src={proj.video}
                autoPlay loop muted playsInline
                style={{ width: "100%", display: "block", maxHeight: "85vh", objectFit: "cover", objectPosition: "top" }}
              />
            </div>

            {/* Fechar */}
            <button onClick={closeLightbox} style={{
              position: "fixed", top: "24px", right: "24px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%", width: "44px", height: "44px",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>✕</button>

            {/* Setas — só se tiver mais de 1 vídeo */}
            {videos.length > 1 && (<>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx - 1 + videos.length) % videos.length })); }}
                style={{ position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "44px", height: "44px", color: "#fff", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>‹</button>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx + 1) % videos.length })); }}
                style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "44px", height: "44px", color: "#fff", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>›</button>
            </>)}

            {/* Contador */}
            {videos.length > 1 && (
              <div style={{ position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
                {lightbox.idx + 1} / {videos.length}
              </div>
            )}
          </div>
        );
      })()}
    </section>
  );
}


// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact({ formRef }) {
  const [form, setForm] = useState({ name: "", business: "", phone: "", category: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.business) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  return (
    <section id="contato" ref={formRef} style={{
      padding: "100px 40px 120px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", color: ACCENT, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "12px" }}>Contato</p>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1, letterSpacing: "1px", marginBottom: "16px" }}>
          Vamos criar<br />seu site?
        </h2>
        <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.7, marginBottom: "48px" }}>
          Preencha o formulário abaixo e entrarei em contato em até 24h com uma proposta personalizada.
        </p>

        {sent ? (
          <div style={{
            background: "rgba(180,255,120,0.06)", border: "1px solid rgba(180,255,120,0.2)",
            borderRadius: "16px", padding: "48px", textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>🎉</div>
            <h3 style={{ fontFamily: "'Instrument Serif'", fontSize: "26px", marginBottom: "10px" }}>Mensagem enviada!</h3>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.7 }}>
              Obrigado, <strong style={{ color: "#e8e4dc" }}>{form.name}</strong>!<br />
              Entrarei em contato em breve com uma proposta para <em style={{ color: ACCENT }}>{form.business}</em>.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Seu nome *", field: "name", placeholder: "Como você se chama?" },
              { label: "Nome do negócio *", field: "business", placeholder: "Ex: Barbearia Roots" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label style={{ fontSize: "11px", color: "#444", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</label>
                <input value={form[field]} onChange={e => set(field, e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                    padding: "14px 16px", color: "#e8e4dc", fontSize: "15px",
                    transition: "border-color .2s"
                  }} />
              </div>
            ))}

            <div>
              <label style={{ fontSize: "11px", color: "#444", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>WhatsApp / Telefone</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>📱</span>
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  type="tel"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                    padding: "14px 16px 14px 46px", color: "#e8e4dc", fontSize: "15px",
                    transition: "border-color .2s"
                  }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#444", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Tipo do negócio</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                  padding: "14px 16px", color: form.category ? "#e8e4dc" : "#444",
                  fontSize: "15px", outline: "none", cursor: "pointer", transition: "border-color .2s"
                }}>
                <option value="">Selecione uma categoria</option>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                <option value="other">Outro tipo de negócio</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#444", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Mensagem</label>
              <textarea value={form.message} onChange={e => set("message", e.target.value)}
                placeholder="Conte um pouco mais sobre o que você precisa..."
                rows={4}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                  padding: "14px 16px", color: "#e8e4dc", fontSize: "15px",
                  resize: "vertical", transition: "border-color .2s"
                }} />
            </div>

            <button onClick={handleSubmit} disabled={loading || !form.name || !form.business}
              style={{
                background: form.name && form.business ? ACCENT : "rgba(255,255,255,0.05)",
                border: "none", borderRadius: "10px", padding: "16px",
                color: form.name && form.business ? "#0b0b0b" : "#333",
                fontFamily: "'DM Sans'", fontSize: "15px", fontWeight: 600,
                cursor: form.name && form.business ? "pointer" : "not-allowed",
                transition: "all .25s", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px"
              }}
              onMouseEnter={e => { if (form.name && form.business) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 10px 32px ${ACCENT}40`; } }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
              {loading
                ? <><div style={{ width: "14px", height: "14px", border: "2px solid #0b0b0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .6s linear infinite" }} /> Enviando...</>
                : "Enviar solicitação →"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "32px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      maxWidth: "1200px", margin: "0 auto"
    }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "2px" }}>
        Ramos<span style={{ color: ACCENT }}>dev</span>
      </div>
      <p style={{ fontSize: "12px", color: "#2a2a2a" }}>
        © 2026 Ramos Dev · Desenvolvedor web para negócios locais
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        {["Instagram", "LinkedIn"].map(s => (
          <span key={s} style={{ fontSize: "12px", color: "#2a2a2a", cursor: "pointer", transition: "color .2s" }}
            onMouseEnter={e => e.target.style.color = "#666"}
            onMouseLeave={e => e.target.style.color = "#2a2a2a"}>{s}</span>
        ))}
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const formRef = useRef();
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{FONTS + CSS}</style>
      <Grain />
      <Navbar onContact={scrollToForm} />
      <Hero onContact={scrollToForm} />
      <Marquee />
      <Trabalhos onContact={scrollToForm} />
      <Contact formRef={formRef} />
      <Footer />
    </>
  );
}
