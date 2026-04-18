# Launch Plan — 4 días (comprimido del launch-blueprint 7d)

> Objetivo: llegar al **martes 2026-04-22** con landing viva, ≥100 signups cualificados, y data real para el pitch. Ventana dura: **4 días desde 2026-04-18 (viernes)**.

---

## 1 · Embudo

```
┌────────────────────────────────────────────────────────────────┐
│  ORGANIC (LinkedIn + X, EN+ES)                                 │
│  • Manuela posts diarios build-in-public                       │
│  • DMs 1:1 a ICP cualificado (50/día)                          │
│  • Video 30s (Reels/X/Shorts EN+ES)                            │
│                                                                 │
│                      ──┬──                                      │
│                        ▼                                        │
│  PAID (budget $5–10/día · 4 días · total $20–40)               │
│  • LinkedIn Text Ads LATAM ES                                  │
│  • X Promoted 1 post EN                                        │
│                                                                 │
│                      ──┬──                                      │
│                        ▼                                        │
│  LANDING (bilingüe ES-default / EN toggle)                     │
│  • Hero: email-only CTA                                        │
│  • Mock mode ON hasta que la DB esté wired                     │
│                                                                 │
│                      ──┬──                                      │
│                        ▼                                        │
│  WAITLIST FORM (6 preguntas, Mom-Test compliant)                │
│  • Scoring server-side 🟢🟡🔴                                    │
│                                                                 │
│                      ──┬──                                      │
│                        ▼                                        │
│  OUTREACH                                                       │
│  🟢 → 15-min call con Manuela (Calendly) <48h                   │
│  🟡 → newsletter semanal viernes                                │
│  🔴 → newsletter, no 1:1                                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 2 · KPIs — 3 escenarios

| Métrica | Conservador | Realista | Stretch |
|---|---|---|---|
| **Signups al T-0 (22-abr)** | 50 | 100 | 250 |
| **Form completion %** | 40% | 55% | 70% |
| **🟢 greens** | 8 | 20 | 50 |
| **Calls agendadas (de 🟢)** | 3 | 10 | 25 |
| **Impresiones LinkedIn orgánico** | 10K | 35K | 100K |
| **CTR ads** | 0.5% | 1.5% | 3% |
| **CAC orgánico** | n/a | n/a | n/a |
| **CAC pagado** | $0.80 | $0.40 | $0.16 |

**Umbral mínimo "launch fue un éxito":** 100 signups + 20 🟢 + 10 calls agendadas + 3 quotes usables para pitch.

---

## 3 · Día por día

### T-4 · viernes 2026-04-18 — Foundation

- [x] Research dual completo (`.research-synthesis.md` + `.research-external.md`) ✅
- [x] Avatar + mensajes + video script (Fases 2+3 marketing/*.md) ✅
- [x] Landing build funcional con mock mode (`artifacts/landing/`) ✅
- [ ] Manuela lee script de video, pide ajustes si algo no le sale natural
- [ ] Dominio real confirmado (pendiente input) y configurado en Replit
- [ ] Calendly slot abierto para lun–vie próximo, 4 slots de 15 min/día
- [ ] LinkedIn perfil de Manuela actualizado con `BioSync Studio` + link a landing
- **Post del día (LinkedIn ES, 18:00 GMT-5):** "Mañana empiezo a grabar el video de BioSync. 4 días al launch. Pueden ver la landing beta acá: [URL]. Feedback brutal bienvenido."

### T-3 · sábado 2026-04-19 — Content day

- [ ] 10am–12pm: grabación 75s ES + 75s EN + 30s ES + 30s EN (4 takes c/u)
- [ ] 12pm–14pm: edición CapCut, subtítulos burned-in ES+EN
- [ ] 14pm: deploy landing a Replit (handoff doc abajo)
- [ ] 15pm–17pm: Manuela manda 20 DMs LATAM ES (scripts en `CUSTOMER-DISCOVERY-INTERVIEW.md` §1)
- **Post del día (LinkedIn ES, 9am):** 30s video ES + texto "El lunes lanzo esto. 4 años pensándolo. 4 días desde que decidí build-in-public. Link abajo — feedback > likes."
- **Post del día (X, 14pm):** 30s video EN + "Launching Tuesday. Landing live, build in public. CERO adaptive AI — built frozen-mode for EMA Annex 22. [link]"

### T-2 · domingo 2026-04-20 — Activation

- [ ] Smoke test final landing en producción (5 URLs del handoff)
- [ ] 5 DMs a warm contacts LATAM (referidos de Manuela / network previo)
- [ ] 10 DMs a PD Scientists cold USA (LinkedIn Sales Navigator free trial si aplica)
- [ ] LinkedIn ads campaign en **draft** (no publicada aún — se activa T-0)
- **Post del día (LinkedIn ES, 9am):** quote del 1er feedback recibido (anonimizado) + CTA al hero
- **Post del día (X, 18pm):** "24h until launch. If you run 2–8 bioreactors and haven't joined the waitlist, you're literally the person I built this for."

### T-1 · lunes 2026-04-21 — Pre-launch surge

- [ ] 9am: newsletter a toda la lista acumulada "mañana, 9am hora LATAM, se activa el beta"
- [ ] Embed del 75s ES en el hero de la landing como video opcional
- [ ] 30 DMs LATAM + 20 DMs USA
- [ ] Activar cron de counter / backup del DB
- [ ] Manuela duerme 8 horas (regla dura — mañana necesita voz clara)
- **Post del día (LinkedIn ES, 9am):** "Mañana a las 9am (GMT-5) activo BioSync Studio. 50 primeros labs entran al beta gratis 90 días. Si ya estás en la waitlist, mañana recibís el link. Si no, hoy es tu último día."

### T-0 · martes 2026-04-22 — LAUNCH

- [ ] 8am: último smoke test end-to-end
- [ ] 9am GMT-5: activar LinkedIn ads ($5 ES LATAM + $5 EN US)
- [ ] 9am: publicar **75s video ES** como anuncio principal LinkedIn
- [ ] 9:30am: email a toda waitlist "el beta está activo, primeros 50 entran, acá está tu link"
- [ ] Todo el día: responder comentarios LinkedIn + X en <4h
- [ ] 12pm–14pm: Manuela pitch (si es ese día) con slides + captura live de signups
- [ ] 18pm: LinkedIn post con métricas reales del día (signups reales, NO inflados)
- [ ] 21pm: ir a dormir — el día T+1 importa tanto como T-0

**Post del día (LinkedIn ES, 9am):** video 75s ES + texto "Live. Link abajo. Primeros 50 labs al beta. Vamos."

---

## 4 · Templates de posts build-in-public

### LinkedIn ES — formato plantilla (diario)

```
[Hook específico del día — no formulaic]

[Dato real del día]
• Signups hoy: [n]
• 🟢 greens: [n]
• Pain point más mencionado: "[quote anónimo]"
• Lo que rompí: [1 frase honesta]

[Insight — qué aprendí o qué cambió la estrategia]

[CTA suave — link a landing o pregunta al lector]
```

Ejemplo T+2 real:

```
Día 2 post-launch. Data real:
• 43 signups (esperaba 25)
• 6 greens, 5 agendaron call
• Pain más mencionado: "scale-up sin saber si lab→pilot va a aguantar"
• Lo que rompí: el counter del hero se quedó en 0 por un null check. Fix pushado en 12 min gracias a @[dev].

Lo que me sorprendió: 70% de los signups ES son de MX/CO, no AR como pensé.
Ajusto copy del viernes.

Si corrés biorreactores y no estás en la waitlist, te dejo el link abajo.
```

### X EN — formato plantilla (diario, más seco)

```
[stat] [action]

[link]
```

Ejemplo:
```
43 signups day 1. 6 green-tier.
Biggest surprise: 70% of ES signups are MX/CO, not AR.
Adjusting Friday's copy.

[link]
```

---

## 5 · Decisión de stack técnico — confirmado

| Opción | Elegido | Razón |
|---|---|---|
| Next.js 14 standalone | ❌ | Monorepo usa Vite + React 19 + Tailwind v4 — Next introduce fricción |
| **Vite + React 19 + Wouter + Tailwind v4 (monorepo)** | ✅ | Consistente con `biosync-studio` MVP, un solo build, cero debug time |
| Framer no-code | ❌ | No ownership, no mock mode, no scoring custom |
| HTML estático + Tailwind CDN | ❌ | Sacrifica TypeScript strict + scoring server-side |
| Webflow | ❌ | Costo + fricción + no bilingüe real |

---

## 6 · Lo que NO hacemos (para caber en 4 días)

- ❌ Privacy + Terms pages reales — placeholder "por publicar post-launch"
- ❌ OG image dinámica custom — texto meta OK, imagen se suma T+3
- ❌ Plausible analytics — se activa T+7 cuando el baseline esté limpio
- ❌ Integración Stripe / pagos — beta 90d es gratis, pagos entran T+90
- ❌ DB real Postgres — **mock mode** primeras 48h, luego Replit DB wire-up
- ❌ Email transaccional real — SMTP placeholder, mails manuales durante beta
- ❌ Internacionalización 4 idiomas — ES+EN paralelo suficiente
- ❌ Compliance pack GMP / SOC 2 — roadmap Q3, no bloquea launch SMB
- ❌ Webhooks, API pública, SDK externo
- ❌ Mobile app nativa
- ❌ Blog / content hub

---

## 7 · Qué SÍ medimos · Qué NO

### SÍ (dashboard diario)

- Signups total + por idioma
- % scoring 🟢 / 🟡 / 🔴
- Calls agendadas vs asistidas
- Top 3 pain points libres (P3 del form)
- LinkedIn impresiones + click-through al landing
- Errores JS en producción (manualmente del Replit logs)

### NO (NO se mide esta semana)

- ❌ LTV / churn — no tenemos clientes pagos aún
- ❌ NPS — muy pronto, sesgaría
- ❌ Vanity metrics (seguidores, likes aislados)
- ❌ Bounce rate — con 100 visitas es ruido puro
- ❌ A/B test de copy — no hay N suficiente
- ❌ Cohort retention — need ≥30 días

---

## 8 · Riesgos + plan B

| # | Riesgo | Plan B |
|---|---|---|
| 1 | **Replit down en T-0** | Fallback: deploy estático de `dist/` a Cloudflare Pages o Vercel en <20min. `dist/index.html` es drop-in. |
| 2 | **LinkedIn bloquea la cuenta de Manuela** por DMs masivos | DMs a máx 15/hora, orgánico primero, pagado segundo. Si bloquean: X + correo directo. |
| 3 | **Mock mode persiste signups en localStorage** → usuario ve counter local, no global | Wire-up del api-server antes de T-0 (handoff Step 3). Si no da tiempo: accept — el counter crece en cada sesión, es UX-acceptable. |
| 4 | **Lemnisca (competidor India) lanza la misma semana** | Acelerar copy "LATAM-native + bilingüe + Annex 22" — nosotros ya tenemos eso, ellos están pre-product. |
| 5 | **El video 75s suena falso** al rewatch | T-3 tarde: Manuela re-graba SOLO el hook si suena forzado. No re-grabar entero. |
| 6 | **Emails rebotan** (typos en form) | Validar con `isValidEmail()` del cliente + confirmación explícita si sospechoso. |
| 7 | **Budget ads se agota en 24h** | Pausa auto a $40 total. Más allá = decisión consciente del founder. |
| 8 | **Pitch coincide con launch** y Manuela no puede estar en ambos | Prioridad = pitch. Launch queda en auto-piloto con posts pre-agendados. |

---

## 9 · Checklist go/no-go · T-0 9am

**Todos deben ser ✅ antes de anunciar "estamos live":**

- [ ] Landing responde 200 en `/es`, `/en`, `/es/gracias`, `/en/thank-you`, `/` (redirect)
- [ ] Form submit en mock mode funciona (email + 6 preguntas)
- [ ] Counter del hero muestra ≥25 (baseline) sin explotar
- [ ] Toggle ES/EN funciona bidireccional sin hard reload
- [ ] OG meta presente (share test con Facebook debugger o localmente)
- [ ] Calendly funciona al click del 🟢 panel
- [ ] 75s video ES embed o fallback imagen
- [ ] LinkedIn post scheduled (no improvisado a las 9am)
- [ ] Email a waitlist scheduled para 9:30am
- [ ] Manuela disponible 9am–18pm para responder en <4h

Si UNO falla, se posterga 3 horas. Si falla 2 → posterga 24h. No launch con infraestructura rota.

**Conteo:** ~1,820 palabras.
