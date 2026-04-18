# Waitlist Form — BioSync Studio

> Form del thank-you post-submit del hero. 6 preguntas Mom-Test compliant, scoring automático 🟢🟡🔴, segmentación que dice a quién llama Manuela primero.

---

## 1 · Filosofía

- **Completion rate objetivo:** ≥55% (form típico B2B = 15–20%).
- **Señal > volumen.** Preferimos 50 submits con data accionable que 300 vacíos.
- **Scoring automático** server-side, invisible al usuario.
- **Cero preguntas hipotéticas** ("¿pagarías?" / "¿te gustaría?") — solo comportamiento pasado u observable.
- **Ancho progresivo:** arranca simple (rol), cierra con opt-in explícito de llamada.

---

## 2 · Las 6 preguntas

### P1 · Rol (multiple choice + "otro")

**ES:** ¿Cuál es tu rol?
**EN:** What's your role?

- [ ] PD Scientist (I / II / Sr)
- [ ] Fermentation Engineer
- [ ] Research Associate
- [ ] Founder / CEO / PI
- [ ] CTO / Asesor científico
- [ ] Otro: _______ (text free)

### P2 · País + sector

**ES (dos selects):**
País: [curated list → `lib/countries.ts` · orden: MX, CO, AR, BR, CL, ES, US, CA, UK, DE, NL, DK, IN, SG, otro]
Sector: [select]
- Precision fermentation / alt-protein
- Vitaminas / aminoácidos / ingredientes
- Pigmentos / colorantes / fragancias
- Enzimas industriales
- Bioplásticos / materiales
- Probióticos / nutracéuticos
- Otro biomanufacturing
- Academia pura (sin spin-off)
- Otro

**EN:** Country + Sector (same lists, EN labels)

### P3 · Pain (open text — la joya)

**ES:** En una frase, ¿cuál es tu mayor dolor HOY con el proceso de batch?
*Ejemplo: "muestreo manual 2 veces al día, el fin de semana si se cae me entero el lunes".*

**EN:** In one sentence, what's your biggest pain TODAY with the batch process?
*Example: "manual sampling 2×/day, if it crashes on weekends I find out Monday."*

[textarea 200 chars max, placeholder = ejemplo]

**Por qué la pregunta clave:** goldmine para ADS-HOOKS v2. Cada respuesta es un quote anonimizable. Las primeras 30 dicen qué ángulo gana para ads del día 3.

### P4 · Soluciones actuales (checkbox múltiple)

**ES:** ¿Qué usás hoy? (podés marcar varios)
**EN:** What do you use today? (multiple)

- [ ] Excel / Google Sheets
- [ ] Benchling
- [ ] JMP
- [ ] MODDE
- [ ] SIMCA (Sartorius)
- [ ] ELN propio / Notion / similar
- [ ] Cuaderno de laboratorio (papel)
- [ ] DASware / eve / BioXpert (propietario del reactor)
- [ ] Pioreactor / open-source
- [ ] Otro: _______

### P5 · Timeline (single choice)

**ES:** ¿En cuánto tiempo tomás una decisión si la herramienta encaja?
**EN:** How fast can you make a decision if the tool fits?

- [ ] Esta semana (decido sola, <$100/mes)
- [ ] 2–4 semanas (convenzo al founder)
- [ ] 1–3 meses (procurement / compliance review)
- [ ] 3+ meses (enterprise procurement)
- [ ] No estoy buscando — explorando

### P6 · Call intent (single + conditional Calendly)

**ES:** ¿Querés 15 min con Manuela para feedback honesto de tu proceso? (no es demo, es conversación)
**EN:** Want 15 min with Manuela for honest feedback on your process? (not a demo, a conversation)

- [ ] Sí, quiero agendar → [redirect Calendly]
- [ ] Sí, pero que me escriba por mail primero
- [ ] No todavía, solo estoy en la lista

---

## 3 · Scoring logic (server-side)

```ts
// lib/scoring.ts — pseudocódigo
function computeScore(response) {
  let score = 0;

  // P1 · rol
  if (['PD Scientist', 'Fermentation Engineer'].includes(response.role)) score += 3;
  if (['Founder', 'CTO'].includes(response.role)) score += 2;
  if (response.role === 'Research Associate') score += 1;

  // P2 · país primario vs secundario
  if (['MX','CO','AR','BR','CL','ES'].includes(response.country)) score += 2; // LATAM ES-first
  if (['US','CA','UK','DE','NL','DK'].includes(response.country)) score += 1;

  // P2 · sector
  if (['precision-fermentation','vitamins','pigments','enzymes','bioplastics','probiotics'].includes(response.sector)) score += 3;
  if (response.sector === 'other-biomfg') score += 1;
  if (response.sector === 'academia-pura') score -= 2; // penaliza

  // P3 · pain — heurística por keywords ES+EN
  const painKeys = ['ofat','perder','lote','batch failed','scale','scale-up','muestreo','manual','tribal','knowledge','benchling','sartorius','simca','modde','annex 22'];
  const painHits = painKeys.filter(k => response.pain.toLowerCase().includes(k)).length;
  score += Math.min(painHits, 3);

  // P4 · soluciones actuales
  if (response.solutions.includes('benchling')) score += 2; // pain confirmado
  if (response.solutions.includes('simca') || response.solutions.includes('modde')) score += 2;
  if (response.solutions.includes('excel') && response.solutions.length === 1) score += 1; // excel-only = ICP puro
  if (response.solutions.includes('notebook-paper')) score -= 1; // edge — requires education

  // P5 · timeline
  if (response.timeline === 'this-week') score += 4;
  if (response.timeline === '2-4-weeks') score += 3;
  if (response.timeline === '1-3-months') score += 1;
  if (response.timeline === '3-plus' || response.timeline === 'exploring') score += 0;

  // P6 · call intent
  if (response.call === 'yes-calendly') score += 3;
  if (response.call === 'yes-email-first') score += 1;

  return {
    score,
    tier: score >= 12 ? 'green' : score >= 6 ? 'yellow' : 'red'
  };
}
```

**Tiers:**
- 🟢 **Green (≥12):** ICP puro con timeline <4 semanas + intent alto. Manuela llama en 48h.
- 🟡 **Yellow (6–11):** ICP con fricciones. Newsletter build-in-public + email manual 1×/semana.
- 🔴 **Red (<6):** fuera de ICP o exploración. Agradecer y no follow-up individual.

---

## 4 · Mensajes post-submit condicionales

### 🟢 Green — Success panel + Calendly

**ES:**
> **Listo.** Estás en la lista y (por lo que nos contaste) sos de los primeros a los que Manuela va a escribir.
>
> Si marcaste "sí, quiero agendar", acá tenés 15 min con ella:
> [Calendly embed · https://calendly.com/manuela-orozco/biosync-feedback]
>
> **Mientras tanto:** en tu inbox vas a ver un mail con 3 cosas útiles hoy (no spam, prometido).

**EN:** Done. You're in, and based on what you told us, you're one of the first Manuela will reach out to. ...

### 🟡 Yellow — Nurture panel

**ES:**
> **Listo, estás en la lista.**
>
> Te vamos a mandar un update semanal con lo que aprendemos del launch: señales del mercado, feedback real de otros labs, lo que rompemos y lo que funciona. Si algo te mueve a hablar, respondé el mail — es Manuela del otro lado.

**EN:** Done, you're on the list. ...

### 🔴 Red — Polite close

**ES:**
> **Gracias por registrarte.**
>
> Parece que tu situación es distinta al lab típico que estamos ayudando ahora. Te sumamos al newsletter — si en algún momento tu contexto cambia, el link para agendar con Manuela siempre va a estar ahí.

**EN:** Thanks for signing up. ...

---

## 5 · Email de bienvenida (ES + EN)

### ES — inmediato post-submit

**Subject:** Bienvenide a BioSync — 3 cosas útiles hoy

**Body:**

> Hola [nombre],
>
> Gracias por sumarte a la waitlist. Te cuento rápido qué viene:
>
> **1. Lo que vas a recibir:** un update por semana los viernes (5 min de lectura), con señales concretas del launch — nada de newsletter inflado.
>
> **2. Lo que YO hago esta semana:** entrevisto 8 PD scientists + fermentation engineers como vos. Si te interesa 15 min con audio sin compromiso, respondé este mail con "sí" y te mando 2 slots.
>
> **3. Lo que construyo mientras tanto:** la landing que acabás de ver va a ir cambiando todos los días. El código está abierto en https://github.com/... (se publica en fase 5). Si sabés TypeScript, tus PRs son bienvenidos.
>
> — Manuela Orozco
> Ingeniera Biológica + Analytics Engineer
> BioSync Studio
>
> P.S. Si te sumaste por error o te arrepentiste, un clic acá y te saco: [unsubscribe]

### EN — immediate post-submit

**Subject:** Welcome to BioSync — 3 useful things today

**Body:** (adaptación EN directa, no traducción mecánica — mismo tono honest, 1st person, no corporate-speak)

---

## 6 · Herramienta recomendada

| Opción | Pro | Contra | Veredicto |
|---|---|---|---|
| **Tally** | Free tier sólido, logic conditional, Tally→webhook directo, limpio visual | EN-only UI | **✅ Recomendado** |
| Typeform | Elegante | $$$ caro ($35+/mes), feel "salesy" al avatar | ❌ |
| Google Forms | Gratis | Fealdad agresiva, conditional logic pobre | ❌ |
| **Custom Next.js form** | Control total, scoring server-side nativo, mock mode | Más código | **✅ también viable — el launch-blueprint recomienda este camino** |

**Decisión para el launch:** **custom Next.js form** (en `thank-you/page.tsx`) — consistente con stack, scoring server-side protegido, control total. Tally queda como plan B si el tiempo apremia.

---

## 7 · Tracking sheet — estructura Airtable (o Notion)

**Tabla `waitlist`:**

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `email` | email | unique |
| `lang` | enum (`es`/`en`) | de la URL |
| `created_at` | timestamp | |
| `status` | enum (`pending_form`/`completed`/`contacted`/`customer`) | flujo |

**Tabla `waitlist_responses`:**

| Campo | Tipo | Notas |
|---|---|---|
| `waitlist_id` | FK | |
| `role` | text | P1 |
| `country` | text | P2 |
| `sector` | text | P2 |
| `pain_text` | text 200ch | P3 **goldmine** |
| `solutions` | array | P4 |
| `timeline` | enum | P5 |
| `call_intent` | enum | P6 |
| `score` | int | computed |
| `tier` | enum (`green`/`yellow`/`red`) | computed |
| `created_at` | timestamp | |

**Drizzle schema en Fase 4** — ver `LANDING-PAGE-SPEC.md` §5 arquitectura.

**Queries útiles (Fase 5 launch ops):**
```sql
-- Greens del día para follow-up 48h
SELECT email, role, country, pain_text FROM waitlist w JOIN waitlist_responses r ON w.id=r.waitlist_id WHERE r.tier='green' AND w.status='completed' AND w.created_at > NOW() - INTERVAL '2 days';

-- Top 10 pain_text más repetidos (goldmine copy v2)
SELECT pain_text, COUNT(*) FROM waitlist_responses GROUP BY pain_text ORDER BY 2 DESC LIMIT 10;

-- Distribución por país
SELECT country, COUNT(*) FROM waitlist_responses GROUP BY country ORDER BY 2 DESC;
```

---

## 8 · Compliance + privacy mínimo

- **Legal basis:** legitimate interest (B2B outreach) + opt-in explícito en P6 para call.
- **Double opt-in** para newsletter: NO (B2B no lo requiere y baja conversion). Solo single opt-in.
- **Unsubscribe link** en TODOS los mails (obligatorio CAN-SPAM + GDPR-lite).
- **Retention:** 24 meses post-último-engagement. Purge auto.
- **No sharing con terceros.** Manuela es la única que ve el sheet.
- **GDPR requests:** `privacy@biosync.studio` responde en <30 días. Plantilla en `/docs/legal/` (post-launch).

**Conteo:** ~1,420 palabras.
