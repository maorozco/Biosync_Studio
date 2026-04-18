# Landing Page Spec — BioSync Studio

> Landing bilingüe EN+ES para launch 2026-04-22. Sinek-driven (why→how→what), movement framing, build-in-public embebido. Copy validado contra `.research-synthesis.md` + `AVATAR-IDEAL.md`.

---

## 1 · Decisión de formato

**Elegido:** **Movement-driven landing + founder-led video + waitlist con scoring.**

| Formato | ¿Aplica? | Por qué |
|---|---|---|
| VSL (video sales letter largo) | ❌ | El avatar senior huye de VSL coaching-style en <5s. Además 4 días no alcanza para producirlo. |
| Enterprise landing (features × 12, pricing tiers complejos, testimonios corporativos) | ❌ | Pre-clientes, pre-logos. Testimonios fabricados = death. Además el ICP SMB no busca enterprise polish. |
| **Movement-driven + build-in-public** | ✅ | Manuela tiene voz fundacional ("momentum ciencia + tecnología"). Avatar respeta transparencia. Build-in-public = skin in the game. |

**Decisión video:** founder-led mobile-recorded (iPhone + LAV + luz natural, ~$30 setup). No animación, no AI-generated. El avatar senior detecta producción falsa en 2 segundos. Ver `VIDEO-SCRIPT.md` para guión.

---

## 2 · Arquitectura — 10 secciones

```
┌─────────────────────────────────────────┐
│ 0. Nav mínimo (logo · ES/EN toggle · CTA)│
├─────────────────────────────────────────┤
│ 1. HERO (email-only, single CTA)        │
├─────────────────────────────────────────┤
│ 2. SOCIAL PROOF (pre-launch: counter    │
│    waitlist real + 3 quotes anonimizados│
│    del form)                            │
├─────────────────────────────────────────┤
│ 3. PROBLEM (por qué el status quo duele)│
├─────────────────────────────────────────┤
│ 4. DREAM (cómo se ve el mundo después)  │
├─────────────────────────────────────────┤
│ 5. HOW (3 pasos concretos)              │
├─────────────────────────────────────────┤
│ 6. WHAT / MOAT (stack técnico honesto)  │
├─────────────────────────────────────────┤
│ 7. FOUNDER (Manuela, voz + foto)        │
├─────────────────────────────────────────┤
│ 8. BUILD-IN-PUBLIC (embed LinkedIn +    │
│    counter signups daily)               │
├─────────────────────────────────────────┤
│ 9. FINAL CTA (repite hero + urgency real│
│    "primeros 50 labs beta gratis")      │
├─────────────────────────────────────────┤
│ 10. FOOTER (links + privacy + contact)  │
└─────────────────────────────────────────┘
```

**Una sola CTA visible:** *Join waitlist* con email. Sin menu nav tradicional (Features/Pricing/About). El usuario lee top→bottom y convierte en hero o en final CTA.

---

## 3 · Copy sección por sección (ES + EN paralelo)

### 0. Nav

```
ES:  [BioSync logo] ···················· [ES|EN]  [Lista de espera →]
EN:  [BioSync logo] ···················· [ES|EN]  [Join waitlist →]
```

### 1. HERO

**ES (H1):** No pierdas otro lote por muestrear una vez al día.

**ES (Sub):** BioSync Studio alerta de deriva de batch en menos de 60 minutos, reduce 6 meses de OFAT a 3 semanas de DoE híbrido, y cuesta $99/mes por reactor. Para labs de 2 a 15 personas que no van a pagar Sartorius.

**ES (CTA input):** Tu email de trabajo → [Quiero probarlo]

**EN (H1):** Don't lose another batch to once-a-day sampling.

**EN (Sub):** BioSync Studio flags batch drift in under 60 minutes, compresses 6 months of OFAT into 3 weeks of hybrid DoE, and costs $99/mo per reactor. For 2–15 FTE labs that won't pay Sartorius.

**EN (CTA input):** Your work email → [Let me in]

**Nota H1:** NO menciona "IA" — el avatar ya desconfía. Mencionamos el JTBD ("no pierdas otro lote"), que es el pain P1+P3 combinado.

### 2. SOCIAL PROOF

**ES:** *"Ya somos [counter=Math.max(real,25)] labs en la lista de espera · LATAM, EE.UU. y Europa"*

3 quotes anonimizados del waitlist form (rotativos cada 24h):

> "Perdimos 3 lotes este mes por no ver el pH derivar a tiempo. El cuarto no queremos perderlo."
> — Fermentation engineer, startup alt-protein, MX

> "Benchling cotizó $42K. Somos 6 personas. Eso es imposible."
> — PD Scientist, spin-off universitario, BR

> "Sartorius quiere 9 meses de onboarding. Mi Series A es en 7."
> — Founder, precision fermentation, AR

**EN:** *"Already [counter] labs on the waitlist · LATAM, US & EU"*
(mismo formato, quotes ES se muestran con traducción cálida no mecánica si el usuario elige EN)

### 3. PROBLEM

**ES — H2:** Los laboratorios pequeños no pierden por mala ciencia. Pierden por herramientas diseñadas para Pfizer.

**ES — 3 bullets con data verificable:**
- Sanofi rechazó el **20% de sus lotes de biorreactor** en su planta Framingham entre enero 2022 y julio 2024 (FDA, 2025). Sanofi tiene $80B de revenue. Tú no.
- Un **batch industrial fallido cuesta $1–2M**. Un batch de lab cuesta $500–$5,000 en reactivos. Cualquiera duele.
- Benchling cotizó **$246K en 24 meses** a una biotech pequeña en 2023. El 60% de las Series A biotech queman eso en 4 meses de software.

**ES — cierre:** Tu lab necesita detección de deriva, no un contrato enterprise.

**EN — H2:** Small labs don't lose because of bad science. They lose because tools are built for Pfizer.

**EN — bullets:** (mismo data, tono KPI-driven EN)

### 4. DREAM

**ES — H2:** Imaginá abrir tu laptop el lunes y ver esto:

**ES — narrativa (≤120 palabras):**
El reactor 3 está derivando — el pH bajó 0.15 puntos en 40 minutos. BioSync te mandó un SMS a las 2:47am. El bot sugirió bajar RPM a 400 y añadir 2 mL de antifoam. Abriste el dashboard desde la cama, aprobaste, te volviste a dormir. A las 8am el pH está estable. El lote sigue vivo.

El simulador ya tiene tu proyección hasta las 72h. La Red de Bio-Conocimiento sugiere que, con tu cepa de Trichoderma, podrías ganar 12% de yield ajustando el perfil de feed a partir de la hora 18.

No es futurismo. Es BioSync, corriendo ahora.

**EN — H2:** Imagine opening your laptop on Monday and seeing this:
(narrativa equivalente, adaptada al registro EN más directo)

### 5. HOW — 3 pasos

**ES — H2:** Cómo funciona, en 3 pasos.

```
1.  CONECTÁ                 2.  APRENDE             3.  ACTÚA
    Subí CSV de 5 corridas     Te generamos un       Alertas SMS/Slack
    (DASbox, eve, Pioreactor,  digital twin de       <60 min antes del
    Ambr — o manual).          tu organismo + un     crash. DoE híbrido
    48h y ya tenés baseline.   PINN para los         que reduce 6 meses
                               residuos no-Monod.    de OFAT a 3 semanas.
```

**EN:** (mismo flujo, nombres EN: Connect, Learn, Act)

### 6. WHAT / MOAT

**ES — H2:** No es "IA mágica". Es ciencia abierta.

**ES — 4 bullets honestos (cross-ref a `AI-ML-MOAT.md`):**
- **Gradient Boosting + PINN:** ecuaciones Monod que corre tu CPU + red neuronal que corrige los residuos que Monod no explica. Código auditable.
- **Flower 1.29 federated learning:** tu lab comparte pesos, nunca data cruda. MELLODDY hizo drug discovery. Nosotros hacemos fermentación — categoría sin dueño.
- **Annex 22-ready desde día uno:** modelo frozen-export firmado + audit trail ALCOA+. Tu vendor actual que promete "IA adaptativa" va a tener problemas en 2027.
- **Plantillas verticales:** B12, B2, astaxantina, PHB, probióticos, proteínas recombinantes. No otra suite CHO-mAb genérica.

**EN:** (mismo, tono técnico KPI-driven)

### 7. FOUNDER

**ES:**

> "Inicié esto porque no encontré mejor momentum para que la ciencia y la tecnología se unieran para encontrar lo que hace tanto tiempo estamos buscando como humanidad."

> — **Manuela Orozco**
> Ingeniera Biológica + Analytics Engineer
> 5 años en ciencia de datos + investigación biológica

[Foto Manuela — pendiente humano · flag en checklist]

**EN:** (adaptación del registro, no traducción mecánica — propuesta:)

> "I started this because I couldn't find a better moment for science and technology to finally converge on what humanity has been looking for for too long."

> — **Manuela Orozco**
> Biological Engineer + Analytics Engineer
> 5 years in data science + biology research

### 8. BUILD-IN-PUBLIC

**ES — H2:** Construyendo en vivo. Cada día. Con data real.

Embed LinkedIn widget de Manuela + counter diario "Signups hoy: [n]" + últimos 3 posts de LinkedIn (oEmbed o captura estática si falla).

**Texto:**
Publicamos todos los días: número de signups, feedback de entrevistas, lo que se rompió en producción, lo que funcionó. Si te gusta la transparencia, seguí el journey.

**EN:** Building in public. Every day. With real data. (mismo patrón)

### 9. FINAL CTA

**ES — H2:** Primeros 50 labs: beta gratis 90 días. El resto: $99/mes.

**ES — texto:**
Launch día 2026-04-22. Los 50 primeros labs de la waitlist entran al beta sin cargo hasta el 22 de julio 2026. Después de eso, $99 USD/mes por reactor. Sin "contact sales", sin procurement de 6 meses.

[input email → Entro a la lista]

**EN — H2:** First 50 labs: 90-day free beta. The rest: $99/mo.

**EN — texto:** Launch date April 22, 2026. First 50 labs on the waitlist get free beta access through July 22, 2026. After that, $99/mo per reactor. No "contact sales," no 6-month procurement.

### 10. FOOTER

```
ES:  BioSync Studio © 2026 · Hecho en Colombia 🇨🇴 con equipo remoto LATAM
     Privacidad · Términos · Contacto: hola@biosync.studio
     LinkedIn · X · GitHub (OSS research)

EN:  BioSync Studio © 2026 · Made in Colombia with a remote LATAM team
     Privacy · Terms · Contact: hello@biosync.studio
     LinkedIn · X · GitHub (OSS research)
```

---

## 4 · Reglas de tono

| Dimensión | ES | EN |
|---|---|---|
| Registro | Relacional, "vos/tú" directo, admite vulnerabilidad ("perdimos", "no sabía") | KPI-driven, data-first, stats en cada 2 bullets |
| Emojis | Solo 🇨🇴 en footer (seña LATAM) | Cero |
| Jerga | "OFAT", "scale-up", "batch", "yield", "DoE" permitida | Same + "titer/rate/yield triangle" |
| Cifras | Siempre con fuente inline o link footnote | Same |
| Humor | Directo, cálido (no sarcasmo gringo) | Seco, self-deprecating OK |
| Palabras banned | "sinérgico", "revolucionario", "disruptivo" | "synergistic", "revolutionary", "disruptive", "cutting-edge" |

**Ver también:** frases prohibidas en `ADS-HOOKS.md` §10.

---

## 5 · Stack técnico recomendado

**Default launch-blueprint:** Next.js 14 App Router + Tailwind + Drizzle + Server Actions + Zod. Deploy **Replit** (constraint del usuario, ver `launch_constraints.md` memory).

**Arquitectura:**
```
artifacts/landing/
├── app/
│   ├── layout.tsx + globals.css
│   ├── page.tsx                   → redirect a /[default-locale]
│   ├── actions.ts                 → Server Actions (signup + form + counter)
│   ├── opengraph-image.tsx
│   ├── icon.tsx
│   └── [lang]/
│       ├── layout.tsx
│       ├── page.tsx               → compone secciones
│       └── thank-you/page.tsx
├── components/
│   ├── sections/                  → Nav, Hero, SocialProof, Problem, Dream, How, What, Founder, BuildInPublic, FinalCta, Footer
│   ├── thank-you-form.tsx
│   └── ui/                        → Button, Input, Label, Progress
├── drizzle/schema.ts              → waitlist + waitlist_responses tables
├── lib/db.ts · scoring.ts · countries.ts · i18n.ts · utils.ts
├── messages/types.ts + es.ts + en.ts
├── .env.example
├── .replit + replit.nix
└── README.md + REPLIT-AGENT-HANDOFF.md
```

**Reglas no-negociables (del launch-blueprint):**
1. **Mock mode** en `lib/db.ts` — `isMockMode = true` si `DATABASE_URL` es placeholder/vacío. Server actions short-circuit. Testing UI sin DB.
2. **Una sola CTA visible** (join waitlist). Sin nav tradicional.
3. **Email-only en hero**. Info demográfica va al thank-you form.
4. **Bilingüe desde día 1** — `/[lang]/` routes, hreflang alternates, `Messages` type como single source.
5. **Mensajes como strings** con tokens `{n}`, `{total}` — NO funciones (no serializan Server→Client).
6. **Scoring server-side** (lógica no expuesta en bundle).
7. **Counter baseline** `Math.max(realCount, 25)` — nunca "0" antes del launch.
8. **TypeScript strict passes + next build passes + smoke test manual passes** antes de commit.

---

## 6 · SEO / OG metadata

| Tag | ES | EN |
|---|---|---|
| `<title>` | BioSync Studio — El cerebro digital de tu biorreactor | BioSync Studio — The digital brain for your bioreactor |
| `<meta description>` | ML híbrido que detecta deriva de batch en <60 min. $99/mes. Para labs de 2–15 FTE. Annex 22-ready. | Hybrid ML that flags batch drift in <60 min. $99/mo. For 2–15 FTE labs. Annex 22-ready. |
| `<meta og:title>` | Same as title | Same |
| `og:image` | Dynamic (opengraph-image.tsx edge) con H1 + logo · 1200×630 · dark teal #06191A + #00E5CC accent | Same, EN copy |
| `twitter:card` | summary_large_image | Same |
| `hreflang` | `<link rel="alternate" hreflang="es" href="/es/">` + `<link rel="alternate" hreflang="en" href="/en/">` + `hreflang="x-default"` → `/es/` | mismo |

**Structured data:** JSON-LD `Organization` + `SoftwareApplication` en `<head>`. `priceRange` = "$99-$1999/month".

---

## 7 · Checklist pre-publish (Fase 4 validation gate)

- [ ] `tsc --noEmit` exit 0
- [ ] `next build` genera bundle limpio, sin warnings de hydration
- [ ] `npm run dev` arranca sin errores
- [ ] Playwright E2E `/es` → submit email → `/es/thank-you` → form fill → scored green → Calendly CTA visible
- [ ] Playwright E2E `/en` mismo flow
- [ ] Screenshot en `.qa-screenshots/landing/*.png` — 5 resoluciones (mobile 375, tablet 768, desktop 1280, wide 1920)
- [ ] Toggle ES/EN 1-clic funciona desde cualquier sección (preserva scroll position)
- [ ] Counter `Math.max(real,25)` visible en hero + final CTA
- [ ] Mock mode OK si `DATABASE_URL=""` (CI test)
- [ ] Todas las frases prohibidas (`.research-synthesis.md` §6) ausentes — grep automatizado
- [ ] Foto Manuela + quote founder = placeholder humano en Fase 4, real antes de Fase 5
- [ ] OG image renderiza en `localhost:3000/opengraph-image`
- [ ] hreflang validado en Search Console preview
- [ ] Privacy + Terms placeholder pages (copiables de cualquier standard, no bloqueo launch)
- [ ] `hola@biosync.studio` / `hello@biosync.studio` funcionan (forward a Manuela)

**Conteo:** ~1,980 palabras.
