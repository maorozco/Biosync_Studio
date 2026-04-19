// Source of truth for bilingual copy. Plain strings with `{token}`
// placeholders — clients interpolate via lib/utils.ts `interpolate`.
// Rule from launch-blueprint §Fase 4: messages MUST be strings, never
// functions (React Server Components cannot serialize fn across the
// Server/Client boundary — even though we are a Vite SPA today, this
// rule keeps us portable to Next.js later).

export type Lang = "es" | "en";

export interface Messages {
  nav: { cta: string };
  hero: {
    h1: string;
    sub: string;
    emailPlaceholder: string;
    button: string;
    counterBefore: string;
    counterAfter: string;
    errorInvalid: string;
    submitting: string;
  };
  social: {
    intro: string;
    quotes: { text: string; who: string }[];
  };
  problem: {
    h2: string;
    bullets: string[];
    closing: string;
  };
  dream: { h2: string; body: string };
  how: {
    h2: string;
    steps: { n: string; title: string; body: string }[];
  };
  what: {
    h2: string;
    bullets: { title: string; body: string }[];
  };
  founder: {
    quote: string;
    name: string;
    title: string;
  };
  buildInPublic: {
    h2: string;
    body: string;
    cta: string;
  };
  finalCta: {
    h2: string;
    body: string;
    emailPlaceholder: string;
    button: string;
  };
  footer: {
    tagline: string;
    links: { label: string; href: string }[];
    contact: string;
  };
  thankYou: {
    h1: string;
    sub: string;
    progress: string;
    q: {
      role: { label: string; options: { id: string; label: string }[] };
      country: { label: string };
      sector: {
        label: string;
        options: { id: string; label: string }[];
      };
      pain: { label: string; placeholder: string; hint: string };
      solutions: {
        label: string;
        hint: string;
        options: { id: string; label: string }[];
      };
      timeline: { label: string; options: { id: string; label: string }[] };
      callIntent: {
        label: string;
        options: { id: string; label: string }[];
      };
    };
    next: string;
    back: string;
    submit: string;
    submitting: string;
    resultGreen: {
      h2: string;
      body: string;
      calendlyLabel: string;
      note: string;
    };
    resultYellow: { h2: string; body: string };
    resultRed: { h2: string; body: string };
    errorGeneric: string;
  };
}

export const es: Messages = {
  nav: { cta: "Lista de espera →" },
  hero: {
    h1: "No pierdas otro lote por muestrear una vez al día.",
    sub: "BioSync Studio detecta deriva de batch en <60 minutos (con sensores en tiempo real), y compacta 6 meses de OFAT a 3 semanas de DoE híbrido cuando tenés ≥20 corridas etiquetadas. $99/mes por reactor. Para labs de 2 a 15 personas que no van a pagar Sartorius.",
    emailPlaceholder: "tu@email.com",
    button: "Quiero probarlo",
    counterBefore: "Ya somos",
    counterAfter: "labs en la lista de espera · LATAM, EE.UU. y Europa",
    errorInvalid: "Eso no parece un email válido.",
    submitting: "Enviando…",
  },
  social: {
    intro: "Lo que nos cuentan las primeras entrevistas:",
    quotes: [
      {
        text: "Perdimos 3 lotes este mes por no ver el pH derivar a tiempo. El cuarto no queremos perderlo.",
        who: "Fermentation engineer, startup alt-protein, MX",
      },
      {
        text: "Benchling cotizó 42 mil dólares. Somos 6 personas. Eso es imposible.",
        who: "PD Scientist, spin-off universitario, BR",
      },
      {
        text: "Sartorius quiere 9 meses de onboarding. Mi Series A es en 7.",
        who: "Founder, precision fermentation, AR",
      },
    ],
  },
  problem: {
    h2: "Los laboratorios pequeños no pierden por mala ciencia. Pierden por herramientas diseñadas para Pfizer.",
    bullets: [
      "Sanofi rechazó el 20% de sus lotes de biorreactor en su planta Framingham entre enero 2022 y julio 2024 (FDA, 2025). Sanofi tiene $80B de revenue. Tú no.",
      "Un batch industrial fallido cuesta $1–2M. Un batch de lab cuesta $500–$5,000 en reactivos. Cualquiera duele.",
      "Benchling cotizó $246K en 24 meses a una biotech pequeña en 2023. El 60% de las Series A biotech queman eso en 4 meses de software.",
    ],
    closing: "Tu lab necesita detección de deriva, no un contrato enterprise.",
  },
  dream: {
    h2: "Imaginá abrir tu laptop el lunes y ver esto:",
    body: "El reactor 3 está derivando — el pH bajó 0.15 puntos en 40 minutos. BioSync te mandó un SMS a las 2:47am. El bot sugirió bajar RPM a 400 y añadir 2 mL de antifoam. Abriste el dashboard desde la cama, aprobaste, te volviste a dormir. A las 8am el pH está estable. El lote sigue vivo. No es futurismo. Es BioSync, corriendo ahora.",
  },
  how: {
    h2: "Cómo funciona, en 3 pasos.",
    steps: [
      {
        n: "01",
        title: "Conectá",
        body: "Subí CSV de 5 corridas (DASbox, eve, Pioreactor, Ambr — o manual). En 48h tenés baseline.",
      },
      {
        n: "02",
        title: "Aprende",
        body: "Te generamos un gemelo digital de tu organismo + un PINN para los residuos que Monod no explica.",
      },
      {
        n: "03",
        title: "Actúa",
        body: "Alertas SMS/Slack en <60 min antes del crash (con sensores reportando <5 min cadencia). DoE híbrido que compacta 6 meses de OFAT a 3 semanas con ≥20 corridas etiquetadas.",
      },
    ],
  },
  what: {
    h2: "No es «IA mágica». Es ciencia abierta.",
    bullets: [
      {
        title: "Gradient Boosting + PINN",
        body: "Ecuaciones Monod que corren en tu CPU + red neuronal que corrige los residuos que Monod no explica. Código auditable.",
      },
      {
        title: "Aprendizaje federado (Flower 1.29)",
        body: "Tu lab comparte pesos, nunca data cruda. MELLODDY hizo drug discovery. Nosotros hacemos fermentación — categoría sin dueño.",
      },
      {
        title: "Annex 22-ready (seguimos la publicación)",
        body: "EMA Annex 22 draft (jul 2025, regla final Q2 2026) restringe IA adaptativa en GMP. Diseñamos desde día uno con weights fijos + audit trail ALCOA+. Cuando la regla final salga, ya estamos listos.",
      },
      {
        title: "Plantillas verticales",
        body: "B12, B2, astaxantina, PHB, probióticos, proteínas recombinantes. No otra suite CHO-mAb genérica.",
      },
    ],
  },
  founder: {
    quote:
      "Inicié esto porque no encontré mejor momentum para que la ciencia y la tecnología se unieran para encontrar lo que hace tanto tiempo estamos buscando como humanidad.",
    name: "Manuela Orozco",
    title: "Ingeniera Biológica + Analytics Engineer · 5 años en ciencia de datos + investigación biológica",
  },
  buildInPublic: {
    h2: "Construyendo en vivo. Cada día. Con data real.",
    body: "Publicamos todos los días: número de signups, feedback de entrevistas, lo que se rompió en producción, lo que funcionó. Si te gusta la transparencia, seguí el journey.",
    cta: "Ver el último update en LinkedIn →",
  },
  finalCta: {
    h2: "Primeros 50 labs: beta gratis 90 días. El resto: $99/mes.",
    body: "Launch 2026-04-22. Los 50 primeros labs de la waitlist entran al beta sin cargo hasta el 22 de julio 2026. Después, $99 USD/mes por reactor. Sin «contact sales», sin procurement de 6 meses.",
    emailPlaceholder: "tu@email.com",
    button: "Entro a la lista",
  },
  footer: {
    tagline: "BioSync Studio © 2026 · Hecho en Colombia con equipo remoto LATAM",
    links: [
      { label: "Privacidad", href: "/es/privacidad" },
      { label: "Términos", href: "/es/terminos" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/manuela-orozco" },
      { label: "GitHub", href: "https://github.com/JustinWebconnex" },
    ],
    contact: "hola@biosync.studio",
  },
  thankYou: {
    h1: "Un último paso — 90 segundos, prometido.",
    sub: "Cuanto más nos cuentes, más útil es la primera respuesta de Manuela.",
    progress: "Pregunta {current} de {total}",
    q: {
      role: {
        label: "¿Cuál es tu rol?",
        options: [
          { id: "pd-scientist", label: "PD Scientist (I / II / Sr)" },
          { id: "fermentation-engineer", label: "Fermentation Engineer" },
          { id: "research-associate", label: "Research Associate" },
          { id: "founder", label: "Founder / CEO / PI" },
          { id: "cto", label: "CTO / Asesor científico" },
          { id: "other", label: "Otro" },
        ],
      },
      country: { label: "¿Desde qué país?" },
      sector: {
        label: "¿Sector?",
        options: [
          { id: "precision-fermentation", label: "Precision fermentation / alt-protein" },
          { id: "vitamins", label: "Vitaminas / aminoácidos / ingredientes" },
          { id: "pigments", label: "Pigmentos / colorantes / fragancias" },
          { id: "enzymes", label: "Enzimas industriales" },
          { id: "bioplastics", label: "Bioplásticos / materiales" },
          { id: "probiotics", label: "Probióticos / nutracéuticos" },
          { id: "other-biomfg", label: "Otro biomanufacturing" },
          { id: "academia", label: "Academia pura (sin spin-off)" },
          { id: "other", label: "Otro" },
        ],
      },
      pain: {
        label: "En una frase, ¿cuál es tu mayor dolor HOY con el proceso de batch?",
        placeholder:
          "Ej: «muestreo manual 2 veces al día, si se cae el finde me entero el lunes».",
        hint: "Máx 200 caracteres. Lo vamos a anonimizar si lo citamos.",
      },
      solutions: {
        label: "¿Qué usás hoy? (podés marcar varios)",
        hint: "Sé honesta — el espray blanqueador no sirve acá.",
        options: [
          { id: "excel", label: "Excel / Google Sheets" },
          { id: "benchling", label: "Benchling" },
          { id: "jmp", label: "JMP" },
          { id: "modde", label: "MODDE" },
          { id: "simca", label: "SIMCA (Sartorius)" },
          { id: "eln-notion", label: "ELN propio / Notion / similar" },
          { id: "notebook-paper", label: "Cuaderno de laboratorio (papel)" },
          { id: "dasware-eve-bioxpert", label: "DASware / eve / BioXpert (propietario)" },
          { id: "pioreactor-oss", label: "Pioreactor / open-source" },
          { id: "other", label: "Otro" },
        ],
      },
      timeline: {
        label: "¿En cuánto tiempo tomás una decisión si la herramienta encaja?",
        options: [
          { id: "this-week", label: "Esta semana (decido sola, <$100/mes)" },
          { id: "2-4-weeks", label: "2–4 semanas (convenzo al founder)" },
          { id: "1-3-months", label: "1–3 meses (procurement / compliance review)" },
          { id: "3-plus", label: "3+ meses (enterprise procurement)" },
          { id: "exploring", label: "No estoy buscando — explorando" },
        ],
      },
      callIntent: {
        label: "¿Querés 15 min con Manuela para feedback honesto? (no es demo)",
        options: [
          { id: "yes-calendly", label: "Sí, quiero agendar" },
          { id: "yes-email-first", label: "Sí, pero que me escriba por mail primero" },
          { id: "no-yet", label: "No todavía, solo estoy en la lista" },
        ],
      },
    },
    next: "Siguiente →",
    back: "← Atrás",
    submit: "Enviar",
    submitting: "Enviando…",
    resultGreen: {
      h2: "Listo. Estás en la lista — y sos de las primeras a las que Manuela va a escribir.",
      body: "Si marcaste «sí, quiero agendar», abajo tenés 15 min con ella. Mientras tanto, en tu inbox vas a ver un mail con 3 cosas útiles hoy.",
      calendlyLabel: "Agendar 15 min con Manuela →",
      note: "Nota: no es demo, es conversación. Vas a hablar vos el 70% del tiempo.",
    },
    resultYellow: {
      h2: "Listo, estás en la lista.",
      body: "Te vamos a mandar un update semanal (viernes, 5 min) con lo que aprendemos del launch. Si algo te mueve a hablar, respondé el mail — Manuela del otro lado.",
    },
    resultRed: {
      h2: "Gracias por registrarte.",
      body: "Parece que tu situación es distinta al lab típico que estamos ayudando ahora. Te sumamos al newsletter — si en algún momento tu contexto cambia, el link para agendar siempre va a estar ahí.",
    },
    errorGeneric: "Algo salió mal. Probá de nuevo en un segundo.",
  },
};

export const en: Messages = {
  nav: { cta: "Join waitlist →" },
  hero: {
    h1: "Don't lose another batch to once-a-day sampling.",
    sub: "BioSync Studio flags batch drift in <60 minutes (with real-time sensors), and compresses 6 months of OFAT into 3 weeks of hybrid DoE once you have ≥20 labeled runs. $99/mo per reactor. For 2–15 FTE labs that won't pay Sartorius.",
    emailPlaceholder: "you@work.com",
    button: "Let me in",
    counterBefore: "Already",
    counterAfter: "labs on the waitlist · LATAM, US & Europe",
    errorInvalid: "That doesn't look like a valid email.",
    submitting: "Submitting…",
  },
  social: {
    intro: "What first interviews are telling us:",
    quotes: [
      {
        text: "We lost 3 batches this month because we didn't see the pH drift in time. We don't want to lose a fourth.",
        who: "Fermentation engineer, alt-protein startup, MX",
      },
      {
        text: "Benchling quoted us $42K. We're 6 people. That's impossible.",
        who: "PD Scientist, university spin-off, BR",
      },
      {
        text: "Sartorius wants 9 months of onboarding. My Series A is in 7.",
        who: "Founder, precision fermentation, AR",
      },
    ],
  },
  problem: {
    h2: "Small labs don't lose because of bad science. They lose because tools are built for Pfizer.",
    bullets: [
      "Sanofi rejected 20% of its bioreactor batches at its Framingham plant between Jan 2022 and Jul 2024 (FDA, 2025). Sanofi has $80B in revenue. You don't.",
      "A failed industrial batch costs $1–2M. A lab batch costs $500–$5,000 in reagents. Either hurts.",
      "Benchling quoted a small biotech $246K over 24 months in 2023. 60% of biotech Series A burn that much on software in 4 months.",
    ],
    closing: "Your lab needs drift detection, not an enterprise contract.",
  },
  dream: {
    h2: "Imagine opening your laptop on Monday and seeing this:",
    body: "Reactor 3 is drifting — pH dropped 0.15 points in 40 minutes. BioSync texted you at 2:47am. The bot suggested dropping RPM to 400 and adding 2 mL of antifoam. You opened the dashboard from bed, approved, went back to sleep. At 8am pH is stable. The batch is alive. Not futurism. BioSync, running now.",
  },
  how: {
    h2: "How it works, in 3 steps.",
    steps: [
      {
        n: "01",
        title: "Connect",
        body: "Upload a CSV of 5 runs (DASbox, eve, Pioreactor, Ambr — or manual). Baseline in 48h.",
      },
      {
        n: "02",
        title: "Learn",
        body: "We generate a digital twin of your organism + a PINN for the residuals Monod can't explain.",
      },
      {
        n: "03",
        title: "Act",
        body: "SMS/Slack alerts <60 min before the crash (with sensors reporting every <5 min). Hybrid DoE that compresses 6 months of OFAT into 3 weeks once you have ≥20 labeled runs.",
      },
    ],
  },
  what: {
    h2: "Not 'magic AI'. Open science.",
    bullets: [
      {
        title: "Gradient Boosting + PINN",
        body: "Monod equations running on your CPU + a neural net correcting the residuals Monod can't explain. Code is open for inspection.",
      },
      {
        title: "Federated learning (Flower 1.29)",
        body: "Your lab shares weights, never raw data. MELLODDY did drug discovery. We do fermentation — an unowned category.",
      },
      {
        title: "Annex 22-ready (we follow the publication)",
        body: "EMA Annex 22 draft (Jul 2025, final rule Q2 2026) restricts adaptive AI in GMP decisions. We ship with fixed weights + ALCOA+ audit trail from day one. When the final rule lands, we're already compliant.",
      },
      {
        title: "Vertical templates",
        body: "B12, B2, astaxanthin, PHB, probiotics, recombinant proteins. Not another generic CHO-mAb suite.",
      },
    ],
  },
  founder: {
    quote:
      "I started this because I couldn't find a better moment for science and technology to finally converge on what humanity has been looking for for too long.",
    name: "Manuela Orozco",
    title: "Biological Engineer + Analytics Engineer · 5 years in data science + biology research",
  },
  buildInPublic: {
    h2: "Building in public. Every day. With real data.",
    body: "We post daily: signup numbers, interview feedback, what broke in production, what worked. If you like transparency, follow the journey.",
    cta: "See the latest update on LinkedIn →",
  },
  finalCta: {
    h2: "First 50 labs: 90-day free beta. The rest: $99/mo.",
    body: "Launch April 22, 2026. The first 50 labs on the waitlist get free beta access through July 22, 2026. After that, $99/mo per reactor. No 'contact sales,' no 6-month procurement.",
    emailPlaceholder: "you@work.com",
    button: "Put me on the list",
  },
  footer: {
    tagline: "BioSync Studio © 2026 · Made in Colombia with a remote LATAM team",
    links: [
      { label: "Privacy", href: "/en/privacy" },
      { label: "Terms", href: "/en/terms" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/manuela-orozco" },
      { label: "GitHub", href: "https://github.com/JustinWebconnex" },
    ],
    contact: "hello@biosync.studio",
  },
  thankYou: {
    h1: "One last step — 90 seconds, promise.",
    sub: "The more you tell us, the more useful Manuela's first reply will be.",
    progress: "Question {current} of {total}",
    q: {
      role: {
        label: "What's your role?",
        options: [
          { id: "pd-scientist", label: "PD Scientist (I / II / Sr)" },
          { id: "fermentation-engineer", label: "Fermentation Engineer" },
          { id: "research-associate", label: "Research Associate" },
          { id: "founder", label: "Founder / CEO / PI" },
          { id: "cto", label: "CTO / Scientific advisor" },
          { id: "other", label: "Other" },
        ],
      },
      country: { label: "Where are you based?" },
      sector: {
        label: "Sector?",
        options: [
          { id: "precision-fermentation", label: "Precision fermentation / alt-protein" },
          { id: "vitamins", label: "Vitamins / amino acids / ingredients" },
          { id: "pigments", label: "Pigments / colorants / fragrances" },
          { id: "enzymes", label: "Industrial enzymes" },
          { id: "bioplastics", label: "Bioplastics / materials" },
          { id: "probiotics", label: "Probiotics / nutraceuticals" },
          { id: "other-biomfg", label: "Other biomanufacturing" },
          { id: "academia", label: "Pure academia (no spin-off)" },
          { id: "other", label: "Other" },
        ],
      },
      pain: {
        label: "In one sentence, what's your biggest pain TODAY with the batch process?",
        placeholder:
          'e.g. "manual sampling 2×/day, if it crashes on weekends I find out Monday".',
        hint: "Max 200 chars. We'll anonymize if we quote you.",
      },
      solutions: {
        label: "What do you use today? (check all)",
        hint: "Be honest — no white-washing needed here.",
        options: [
          { id: "excel", label: "Excel / Google Sheets" },
          { id: "benchling", label: "Benchling" },
          { id: "jmp", label: "JMP" },
          { id: "modde", label: "MODDE" },
          { id: "simca", label: "SIMCA (Sartorius)" },
          { id: "eln-notion", label: "Custom ELN / Notion / similar" },
          { id: "notebook-paper", label: "Paper lab notebook" },
          { id: "dasware-eve-bioxpert", label: "DASware / eve / BioXpert (vendor)" },
          { id: "pioreactor-oss", label: "Pioreactor / open-source" },
          { id: "other", label: "Other" },
        ],
      },
      timeline: {
        label: "How fast can you make a decision if the tool fits?",
        options: [
          { id: "this-week", label: "This week (I decide alone, <$100/mo)" },
          { id: "2-4-weeks", label: "2–4 weeks (I convince the founder)" },
          { id: "1-3-months", label: "1–3 months (procurement / compliance review)" },
          { id: "3-plus", label: "3+ months (enterprise procurement)" },
          { id: "exploring", label: "Not actively looking — exploring" },
        ],
      },
      callIntent: {
        label: "Want 15 min with Manuela for honest feedback? (not a demo)",
        options: [
          { id: "yes-calendly", label: "Yes, let's schedule" },
          { id: "yes-email-first", label: "Yes, but email me first" },
          { id: "no-yet", label: "Not yet, just on the list" },
        ],
      },
    },
    next: "Next →",
    back: "← Back",
    submit: "Submit",
    submitting: "Submitting…",
    resultGreen: {
      h2: "Done. You're in — and one of the first Manuela will reach out to.",
      body: "If you picked 'yes, let's schedule', here's 15 min with her. Meanwhile, your inbox will have an email with 3 useful things today.",
      calendlyLabel: "Book 15 min with Manuela →",
      note: "Note: not a demo, a conversation. You'll talk 70% of the time.",
    },
    resultYellow: {
      h2: "Done, you're on the list.",
      body: "We'll send a weekly update (Fridays, 5 min) with what we learn from launch. If anything moves you, reply — Manuela on the other side.",
    },
    resultRed: {
      h2: "Thanks for signing up.",
      body: "Looks like your situation is different from the typical lab we're helping right now. We'll add you to the newsletter — the link to book will always be there if context changes.",
    },
    errorGeneric: "Something broke. Try again in a second.",
  },
};

export const MESSAGES: Record<Lang, Messages> = { es, en };
