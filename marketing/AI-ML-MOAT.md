# AI-ML Moat — BioSync Studio

> Mapa honesto del stack ML 2026 de BioSync: qué construimos sobre qué, con qué TRL, con qué riesgo regulatorio, y dónde está el defensible moat.
>
> **Regla:** nada aquí es aspiracional. Todo mapea a componentes OSS existentes + licencias verificadas. Si aparece `[no verificado]` se aclara.

---

## 1 · Stack frontera mapeado al producto

| Tecnología | Owner | Año | Aplicación concreta en BioSync | Acceso / costo | TRL | Riesgo Annex 22 |
|---|---|---|---|---|---|---|
| **Gradient Boosting (XGBoost / LightGBM)** | Open OSS | 2014+ | Predicción titer/yield a partir de features de corrida histórica (pH, DO, feed, glucosa, inóculo) | Apache 2.0 · gratis | 9 | **Bajo** — determinista, versionable |
| **PINN (Stiff-PINN + HongtaoZhu23/PINN)** | MIT DENG / Zhu (2020, 2025) | 2020, 2025 | Residuos Monod — el modelo físico corre, el PINN captura lo que Monod no explica | MIT · gratis | 5–6 | **Bajo** si se congela post-training |
| **Flower 1.29 federated learning** | Flower Labs | abr 2026 | Red de Bio-Conocimiento: labs comparten pesos, no data cruda. Whitespace biomanufacturing confirmado | Apache 2.0 · gratis | 7–8 infra · 4–5 aplicación | **Medio — opera OFF decisión GMP-crítica** (capa de mejora continua) |
| **Claude Opus 4.7 1M / GPT-5.4** | Anthropic / OpenAI | 2025–26 | Página `/asistente` — razonamiento sobre logs de batch, generación hipótesis, doc auto | API pública · $5 in / $25 out por 1M (Opus) | 9 | **Alto si adaptativo GMP** — solo uso R&D / educational |
| **Llama 4 Maverick (self-host)** | Meta open weights | 2026 | Alternativa on-prem compliance-friendly vs Claude/GPT | Llama license · Groq $0.20/$0.60 por 1M · 25× más barato que Opus | 9 | **Bajo — recomendado** para cliente GMP |
| **RFdiffusion3** | Baker Lab / IPD UW | dic 2025 | Modo "Enzyme Design" (futuro 3–9m) — diseño de novo de enzimas para target substrate | Open source · GPU compute | 6–7 | **Bajo** — diseño pre-producción |
| **Boltz-2** | MIT Jameel + Recursion | 2025 | Screening sustratos + binding affinity ~1000× más rápido que FEP | MIT license · GPU ~15–30s por predicción | 6–7 | **Bajo** — determinista si se congela |
| **ESM3 embeddings** | EvolutionaryScale | 2024 | Features de proteína para pipeline Gradient Boosting downstream | API Forge beta `[pricing no verificado]` · AWS SageMaker · NIM | 7 | **Bajo** — embeddings fijos |
| **Pioreactor hardware stack** | Pioreactor OSS | activo 2024–26 | Reference platform open — BioSync lee Pioreactor MQTT first-class | MIT · hardware $299 | 9 | N/A (hardware) |
| **RamanSPy** | Imperial/Barahona group | 2024–25 | Soft-sensor Raman (Pro tier, cuando add-on Raman se vende) | BSD-3 · gratis | 6 | **Bajo** |

---

## 2 · Aplicaciones concretas (NO genéricas)

### Página `/dashboard` — Monitor en vivo
- **Input:** CSV upload de logs de corrida (Eppendorf DASware / INFORS eve REST / Pioreactor MQTT / Sartorius Ambr via Kepware).
- **Output:** 4 KPIs (OD600 actual vs predicho, pH, DO%, tasa crecimiento) + alerta de deriva <60 min.
- **Stack:** Gradient Boosting entrenado por organismo (*K. phaffii*, *S. cerevisiae*, *E. coli*, *B. subtilis*, *Trichoderma*).
- **Honestidad:** requiere ≥20 batches etiquetados por organismo para alcanzar precisión útil. Por debajo, modo "asistente de vigilancia" — no predicción.

### Página `/simulador` — Gemelo digital
- **Input:** organismo + producto target (B12, astaxantina, proteína X, bioplástico PHB) + condiciones iniciales.
- **Output:** curvas Monod proyectadas + estimación costo batch + sensibilidad a 3 variables clave.
- **Stack:** Monod + extensión PINN para residuos no-Monod (stiff regime, product inhibition).
- **Honestidad:** simulador educativo/directional. NO reemplaza wet-lab — lo documentamos explícito en la UI.

### Página `/red` — Red de Bio-Conocimiento
- **Input:** opt-in del cliente (explícito, firmado).
- **Output:** acceso a modelo entrenado federadamente — pesos actualizados con contribuciones de todos los labs opt-in.
- **Stack:** Flower 1.29 sobre Gradient Boosting por-organism (FedAvg + secure aggregation).
- **Honestidad:** solo modelos de **recomendación**, NUNCA modelos de decisión GMP-crítica. Cliente GMP puede ejecutar BioSync completo SIN red federada si prefiere.

### Página `/asistente` — Chatbot
- **Input:** pregunta libre del usuario sobre su corrida.
- **Output:** respuesta con citas a papers + trace de logs del propio cliente.
- **Stack:** Claude Opus 4.7 (premium) + Llama 4 Maverick (self-host opción para GMP).
- **Honestidad:** asistente de razonamiento + literatura. NUNCA da orden ejecutable en biorreactor sin confirmación humana.

---

## 3 · Roadmap de integración (0–3 / 3–9 / 9–18 meses)

### Horizonte 0–3 meses (mayo–jul 2026)

- **Gradient Boosting por-organism** — con ≥20 batches etiquetados pre-seed (benchmarks públicos + 2 pilots opt-in).
- **CSV ingest universal** — Pioreactor MQTT + DASware CSV + eve REST + template manual.
- **Simulador Monod** determinista (sin PINN todavía — modo "educational").
- **LLM asistente** Claude Opus 4.7 1M via API, con prompt caching para costos <$0.50/user/día.
- **Mock mode** para demo sin DB (regla no-negociable del launch-blueprint).

### Horizonte 3–9 meses (ago 2026–ene 2027)

- **PINN residuos** — entrena con corridas de la pre-seed, publica whitepaper metodología (moat técnico + SEO).
- **Flower 1.29 federated** — primer MVP con 3–5 labs opt-in firmados. Entrega pesos, no raw data.
- **Frozen-mode export** — primer cliente GMP-interested recibe versión congelada firmada digitalmente. Whitepaper "BioSync + Annex 22".
- **Llama 4 self-host option** para clientes GMP/on-prem.
- **Integración Sartorius Ambr** via Kepware (premium tier — cuesta $5K+ por side).

### Horizonte 9–18 meses (feb 2027–oct 2027)

- **Enzyme Design module** — RFdiffusion3 + Boltz-2 cloud service para diseñar variantes de cepa. Inicia LATAM nativo: diseño de enzimas sobre biodiversidad regional (café, cacao, Amazonas, Patagonia).
- **Edge AI kit** — Jetson Orin + Pioreactor + Atlas DO/pH, BOM ~$1,100 sin Raman, $6K con Raman (Pro tier).
- **LCA / CO₂e module** — sostenibilidad exportable (driver: COP30 Brasil + Bioeconomy Challenge 2028).
- **Compliance pack** ALCOA+ — batch records firmados, retention 7 años, audit trail inmutable.

---

## 4 · Comparación honesta vs incumbentes

| Dimensión | BioSync 2026 | Sartorius SIMCA | Benchling | Aizon |
|---|---|---|---|---|
| **Pricing público** | $99/mes/reactor | **No** (contact sales, histórico $5K–15K licencia + maintenance) | **No** ($246K/2 años reportado 2023) | **No** ("custom enterprise") |
| **Onboarding** | **5 días self-serve** | 6–12 meses consultoría | 3–6 meses | 6–12 meses |
| **ML híbrido (física + data)** | **Sí (PINN + GBDT)** | Parcial (PLS, PCA) | No | Parcial (proprietary) |
| **Federated learning** | **Sí (Flower 1.29)** | No | No | No |
| **Annex 22-ready frozen mode** | **Sí nativo** | Sí (histórico) | N/A | **No — pre-anunció Agentic AI 2026 (colisión)** |
| **Bilingüe ES/EN** | **Sí nativo** | No (EN + DE) | No (EN only) | No |
| **Edge AI <$2K BOM** | **Sí (sin Raman)** | No (equipo propio $$$) | No | No |
| **Plantillas verticales** (B12, astaxantina, PHB, etc.) | **Sí** | No (genérico CHO mAb) | Genérico | Genérico |
| **Moat técnico verificable OSS** | **Sí** (todo el stack open) | No (cerrado) | No (cerrado) | No (cerrado) |

**Lo que NO hacemos mejor (honesto):**
- Sartorius tiene **20+ años de data histórica** y SIMCA corre producciones de $B. BioSync es **nuevo** — eso es liability hasta 2027 mínimo.
- Benchling tiene **ecosistema ELN robusto** (sample tracking, inventory, collab notes). BioSync no compite ahí — complementamos.
- Aizon tiene **ISO 27001 + SOC 2** que no tenemos. No vamos a top-20 pharma hasta Q4 2027.

---

## 5 · Riesgos + qué NO prometer todavía

### Riesgos estructurales

1. **Cold-start data** — sin ≥20 batches etiquetados por organism, GBDT no rinde. Mitigación: piloto 2–3 labs con data histórica donada, benchmarks públicos (BioProcess Intl, NREL).
2. **Annex 22 final puede cambiar vs draft** — si endurece requisitos post-oct 2025, frozen-mode puede ser insuficiente. Mitigación: seguir consultas PIC/S + plan B "air-gap deployment".
3. **Lemnisca (India) misma tesis** — si ganan visibilidad global antes que BioSync, batalla de awareness. Mitigación: velocidad + LATAM-native + $99 público.
4. **Costos LLM** — si Claude/GPT suben 3× los tokens, modelo económico se estresa. Mitigación: Llama 4 self-host como fallback pre-instrumentado.
5. **Dependencia OSS** — si Flower pivota a closed-source o Pioreactor se archiva, riesgo de fork obligatorio. Mitigación: mantener forks internos activos.

### 12 frases prohibidas (mismas que `.research-synthesis.md`, recordatorio)

Ver `.research-synthesis.md` §6. No duplicar aquí — fuente única de verdad.

---

## 6 · 3 mensajes plug-and-play para sales (cross-ref a ADS-HOOKS.md)

### Mensaje 1 — Moat técnico (Ángulo E)

**ES:** "PINN + Gradient Boosting: no es 'IA mágica'. Son ecuaciones Monod con red neuronal corrigiendo los residuos. Te mostramos el código. Publicamos un whitepaper en Q3 con los benchmarks." (→ hook E1)

**EN:** "PINN + Gradient Boosting: not 'magic AI'. Monod equations with a neural net correcting residuals. Code is open for inspection. Whitepaper with benchmarks drops Q3." (→ hook E1)

### Mensaje 2 — Categoría unowned (Ángulo E)

**ES:** "Aprendizaje federado en biomanufacturing: MELLODDY hizo drug discovery. Owkin hizo clínica. **Nadie hizo fermentación — somos los primeros.**" (→ hook E2)

**EN:** "Federated learning for biomanufacturing: MELLODDY did drug discovery. Owkin did clinical. **No one did fermentation — we're the first.**" (→ hook E2)

### Mensaje 3 — Compliance-ready (Ángulo A)

**ES:** "Annex 22 mid-2026 prohíbe IA adaptativa en GMP. Aizon pre-anunció Agentic AI que choca frontal. BioSync nace frozen-mode — Annex 22-ready desde el día uno." (→ hook A1 + E4)

**EN:** "Annex 22 mid-2026 bans adaptive AI in GMP. Aizon pre-announced Agentic AI that crashes head-on. BioSync is born frozen-mode — Annex 22-ready from day one." (→ hook A1 + E4)

---

## 7 · Conexión a otros docs

- **Para copy derivado:** `ADS-HOOKS.md` (los mensajes 1–3 son refinamientos de hooks E1, E2, A1).
- **Para TRL y "no prometer":** `.research-synthesis.md` §5–§6.
- **Para verificación técnica externa:** `.research-external.md` §C.
- **Para landing:** refs de moat en sección "What/Moat" (siguiente fase).

**Conteo:** ~1,210 palabras.
