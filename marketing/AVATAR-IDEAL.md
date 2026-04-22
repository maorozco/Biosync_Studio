# Avatar Ideal — BioSync Studio

> ICP accionable para launch abril 2026. Destilado de `.research-synthesis.md` + `docs/avatar/CLAUDE.md` + 22 quotes verificadas.
>
> **Regla de uso:** cualquier decisión de copy, feature o targeting valida contra este doc. Si una feature no sirve a ≥1 persona/región, se cuestiona.

---

## Mapa regional (4 segmentos)

| Segmento | % pipeline objetivo T-0 | Rol núcleo | Budget SW/año | Canal pago prioritario |
|---|---|---|---|---|
| **LATAM (primary)** — MX, CO, AR, BR, CL | **50%** | PD Scientist junior/mid, Fermentation Engineer en startups 2–8 FTE | $5–15K | LinkedIn LATAM (CPM 10× más barato) |
| **USA** (SF Bay, Boston, RTP NC) | 25% | PD Scientist I/II en precision fermentation Series A | $15–25K con flex | LinkedIn US + X técnico |
| **EU** (NL, DE, ES, DK) | 15% | Postdoc traslacional + fermentation engineer en spin-offs universitarias | €10–20K | LinkedIn EU + ResearchGate |
| **APAC** (India, Singapur) | 10% | Scientist en alt-protein + CDMOs regionales | $5–10K | LinkedIn APAC |

**Decisión crunch 4 días:** LATAM + USA cubren 75% del pipeline con 2 copy variants (ES + EN). EU/APAC piggyback con EN — no adaptaciones dedicadas antes del launch.

---

## Persona 1 · Daniela (ES, Michroma-like, Rosario AR)

- **Nombre:** Daniela Pereyra · **Edad:** 32 · **Cargo:** PD Scientist / Fermentation Lead · **Lugar:** Rosario, Argentina
- **Empresa:** startup precision fermentation de 9 FTE, serie semilla $1.8M, cepa Trichoderma para producir colorante rojo natural (ángulo alt-food).
- **Educación:** Lic. Biotecnología UNR + MSc Ing. Química UBA.
- **Salario:** ~$45K USD equivalente (buen salario LATAM biotec).
- **Rutina semanal:**
  - Lun–vie 8am muestreo manual 4 biorreactores DASbox 5L + 2 Pioreactor 20mL.
  - Mar y jue tarde bloque para DoE en Excel porque MODDE no hay budget.
  - Vie 4pm reporte al founder: "¿qué tal la cepa esta semana?".
  - Sábado 11am la llaman desde lab porque el pH del reactor 3 está derivando.
- **Lo que la presiona:** founder presentando a IDB Lab + Kaszek en 10 semanas. Necesita **titer 3 g/L estable en 50L** o no hay Serie A.
- **Lo que la asusta:** *"me voy a ir al pilot scale en 6 meses sin saber si mi DoE de shake flask predice algo"*. Segundo miedo: *"si Camila [colega que se fue a Europa] se lleva su laptop con las corridas 47-89, perdí 4 meses"*.
- **Idioma copy:** español rioplatense, tolera inglés técnico ("yield", "OFAT", "scale-up"), odia corporate-speak ("optimizamos tu proceso").
- **Herramientas hoy:** Excel, Google Sheets, WhatsApp group "lab-ops", 1 licencia JMP compartida entre 3.
- **Canales donde la alcanzo:** LinkedIn (muy activa, posts en español), grupo Telegram "Bioeconomía LatAm", SynBioBeta talks online, referida por IndieBio LatAm.

## Persona 2 · Evan (EN, 21st.BIO client lookalike, Boston)

- **Nombre:** Evan Chen · **Edad:** 35 · **Cargo:** Senior PD Scientist II · **Lugar:** Boston, MA
- **Empresa:** Series A alt-protein, 24 FTE, cepa *Komagataella phaffii* para mycoprotein, $22M raised 2024.
- **Educación:** PhD Chem Eng MIT.
- **Salario:** $165K base + 0.1% equity.
- **Rutina semanal:**
  - Runs Ambr 250 + Applikon MyControl 3L paralelos; data va a BioXpert XP.
  - 2 all-hands /semana con CEO que le pregunta "cuándo scale a 2,000L".
  - Viernes 6pm sigue debuggeando por qué la corrida 212 creció 30% menos que la 210.
- **Presión:** Series B en 7 meses, milestone técnico = **15 g/L titer en 250L con yield ≥0.35**.
- **Miedo:** "we lost $80K in reagents in Q4, CEO noticed". Segundo: "I haven't had a clean contamination-free run in 5 weeks and I don't know why".
- **Idioma:** inglés directo técnico, odia buzzwords ("synergy", "AI-powered"), responde a data.
- **Herramientas:** Benchling (equipo paga $60K/año), JMP, Python notebooks personales, Slack `#bioproc-debug`.
- **Canales:** LinkedIn US biotech, r/biotech (lee no postea), SynBioBeta in-person, BioProcess International webinars.

---

## Avatar secundario — Usuario diario ≠ decisor

| Rol | Relación con el producto | Qué pregunta al evaluar |
|---|---|---|
| **Usuario diario (Daniela/Evan)** | Usa la app todos los días: dashboard, simulador, logs | "¿me ahorra tiempo hoy? ¿lo puedo probar sin pedir permiso?" |
| **Decisor económico (founder/PI)** | Firma el cheque de $99–$499/mes | "¿cuál es el ROI defendible en 90 días? ¿el vendor sigue vivo en 18 meses?" |
| **Influencer técnico (CTO/asesor científico)** | Revisa si "no es snake oil" | "¿el PINN es real o marketing? ¿el federated learning es auditable?" |

**Implicación:** la landing habla a Daniela/Evan. La página de pricing + FAQ técnico habla al founder + CTO. Ambos caminos conectados con un solo CTA (join waitlist).

---

## Demografía verificable (fuentes)

- **LATAM biotec FTE:** MX+BR+AR+CO+CL ≈ 2,100 labs con 2–15 FTE según baseline `Investigacion_Contexto_Colombia_LATAM.md`. IndieBio LatAm, Kaszek, Leap Forward Ventures son señales activas.
- **USA precision fermentation:** 140+ startups 2024 (GFI state of industry). Boston/SF concentran 60%.
- **Budget SW:** reviews Capterra Benchling + quotes Geertz-Hansen confirman que <$20K/año es la realidad hasta Series B.

---

## Jobs-to-be-done

### Cross-region (5)

1. **"Saber si el batch se va a caer antes de perder $500–$5K"** — JTBD primario universal.
2. **"Saber qué 3 variables importan de 20, sin 6 meses de OFAT"** — aceleración DoE.
3. **"Que el conocimiento del proceso no viva en la laptop de quien renunció"** — anti-tribal knowledge.
4. **"Convencer al founder/board con data, no con anécdotas"** — legitimación política interna.
5. **"Llegar al pilot scale con confianza de que la física va a sostenerse"** — reducir valley-of-death.

### LATAM específicos (2)

6. **"Mostrar a IDB/Kaszek que competimos con Boston sin pagar Sartorius"** — validación ante VC regional.
7. **"Tener compliance Annex 22 listo cuando ANVISA/COFEPRIS lo exijan en 2027"** — seguro regulatorio.

### USA específicos (2)

8. **"Defender el spend ante un board que compara con SIMCA a $50K"** — comparativa anti-incumbente.
9. **"Escalar de shake flask a 250L sin contratar un consultor Sartorius de $150K"** — self-service scale-up.

---

## Eventos gatillo (por región, accionables)

| Región | Evento gatillo | Cómo explotarlo en copy |
|---|---|---|
| **LATAM** | Inspecciones FDA a plantas LATAM +40% en 2025 (BioPharmaAPAC) | "Si no tienes audit trail ALCOA+, no exportás a EE.UU. en 2026" |
| **LATAM** | ANMAT QR codes obligatorios 19-may-2026 | "Track-and-trace digital obligatorio — BioSync te lo genera auto" |
| **USA** | Sanofi Framingham 20% batches rechazados (FDA warning ene 2025) | "Sanofi con $80B revenue pierde 20%. ¿Cuántos pierdes muestreando 1×/día?" |
| **USA/EU** | 40+ alt-protein companies cerradas sep24–ago25 (GreenQueen) | "Los sobrevivientes tienen OEE en vivo. $99/mes/reactor." |
| **EU** | EMA Annex 22 draft jul 2025, final mid-2026 | "Tu vendor actual aún promete 'AI continuous learning' — Annex 22 lo prohíbe." |
| **Todas** | 5,916 biologics recalls 2015–2025 (PMC review) | "1 de cada 600 lotes termina en recall. Detección temprana es el ROI más obvio." |

---

## Presupuesto y autoridad de compra

| Tier | Rango | Autoridad | Ciclo decisión | Proof necesario |
|---|---|---|---|---|
| **Self-serve $99/mes** | <$1,200/año | PD Scientist decide sola (nivel cafetería) | <1 semana | Demo + free trial 14 días |
| **Team $499/mes** | <$6K/año | PD Scientist propone, founder aprueba en 1:1 | 2–4 semanas | Case study 1 cliente + ROI básico |
| **Lab $1,999/mes** | <$24K/año | Founder/CEO firma tras approval técnico del asesor científico | 4–8 semanas | Referencia de lab similar + compliance pack |

**Load-bearing:** el avatar LATAM entra por self-serve. El avatar USA entra por Team tier. NUNCA tier "Lab" en los primeros 90 días — requiere case studies que aún no existen.

---

## Anti-avatar — quién NO vendemos

| Segmento | Por qué no | Señal para descartar rápido |
|---|---|---|
| **Top-20 pharma** (Pfizer, Novartis, Roche) | Ya tienen SIMCA/SIMATIC/UNICORN. Procurement 12m. Annex 22 con ellos requiere SOC 2 + ISO 27001 que no tenemos. | Sitio web con "investor relations" section. |
| **Drug discovery labs** (Recursion, Insitro, Chai) | Otro ICP — small molecule/protein design, no fermentación. Confunden el mensaje. | Pitch dice "AI for drug discovery". |
| **Homebrewers / hobbyists** | No compran software SaaS. Foro Homebrewtalk no es canal. | Buscan "beer fermentation monitoring". |
| **Academia pura sin plan comercial** | Budget cero, ciclo eterno, no validan mercado. | Web termina en `.edu` y no hay startup spin-off. |
| **Centros de investigación gubernamentales** | Ciclo de compra 18m, licitación pública, no scale. | URL `.gov` / requiere RFP. |
| **Cannabis/CBD fermentation** | Regulación volátil (aunque fermentan). Reputacional + legal. | Producto mencionado es cannabinoid. |

---

## Cómo aplicar este avatar (checklist para Fases 3–5)

- [ ] Toda sección de la landing debe contestar un JTBD explícito de la lista 1–9.
- [ ] Toda ad debe nombrar un trigger event concreto con fuente.
- [ ] Todo hero no menciona la palabra "IA" en el H1 — menciona **resultado del JTBD**.
- [ ] Toda foto de persona es o Manuela o [placeholder humano] — NUNCA stock de lab con guantes azules.
- [ ] Toda referencia a precio dice **$99/mes/reactor** explícito — jamás "starting at".
- [ ] Todo CTA ofrece valor antes que "book a demo" (ver ADS-HOOKS.md para los 10 CTAs).

**Conteo:** ~1,240 palabras.
