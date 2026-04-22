# BioCycle Replit Bundle — guía paste-ready para T-3

> Archivo único para Manuela/Justin que contiene TODO el scaffolding necesario para levantar el MVP de Impulso BioCycle en Replit en 2–4 horas.
>
> **Base:** `Proyectos_investigacion/REPLIT_FINAL/` (los prompts ya estaban escritos pero nunca se ejecutaron). Este bundle los reúne + aplica el hedging del stones-audit (§4 refra.4 del plan).
>
> **Resultado esperado:** URL pública Streamlit tipo `impulso-biocycle.replit.app` con 4 páginas: Descubrimientos · Diseñador de Consorcios · Portal Cliente · Asesoría IA.

---

## Checklist de ejecución (ordenado)

- [ ] **Paso 0** — login en Replit con cuenta personal de Manu (ya paga plan). Create Repl → Python template → nombre `impulso-biocycle`.
- [ ] **Paso 1** — abrir Replit Agent (ícono chat). Copiar bloque `PROMPT 1` (abajo) y pegar. Esperar 5–15 min.
- [ ] **Paso 2** — crear archivo `ml_model.py`. Pegar literal el contenido de `Proyectos_investigacion/REPLIT_FINAL/PASO3_ML_MODEL.py` (no parafrasear — es código funcional, 365 líneas).
- [ ] **Paso 3** — volver a Replit Agent. Decirle: *"In page 2 (Consortium Designer), import get_predictor from ml_model and use predictor.predict_timeline() to generate the degradation chart instead of hardcoded curves. Show model info in an expander."*
- [ ] **Paso 4** — run → verificar que las páginas 1–2 funcionan.
- [ ] **Paso 5 (si el tiempo alcanza)** — pegar bloque `PROMPT 2` en Replit Agent para páginas 3–4.
- [ ] **Paso 6** — polish: ajustar colores si es necesario. Grabar video backup 90s.
- [ ] **Paso 7** — anotar la URL pública en papel + verificar que funciona desde otra laptop.

---

## Hedging aplicado (vs scaffolding original)

Las reformulaciones del stones-audit YA están presentes en los prompts originales (PIVOTE_BIOCYCLE_REALISTA.md fue aplicado). Verificar que estos puntos están OK:

1. **NO mencionar "playas" como caso de uso principal** ✓ (ya removido)
2. **Plásticos → biorreactor** (no in-situ) ✓ (warning explícito en Step 2 página Diseñador)
3. **In-situ → hidrocarburos, suelos agrícolas, aguas** ✓ (donde hay precedente 30+ años)
4. **Resultado de plásticos = TPA + EG monómeros vendibles** (no "desaparición") ✓
5. **Probabilidad de Éxito bajada honesta** para PP (10–25%), PVC (5–15%), PFAS (15–30%) ✓
6. **Sección "Limitaciones" con 5 disclaimers** ✓ (Result I)
7. **Todos los organismos BSL-1 / GRAS** (nunca P. aeruginosa) ✓

Si al ejecutar el Replit Agent el código generado contiene frases sobre "limpiar playas", "degradar plástico in-situ en el mar", o similar — **editar antes de deploy**.

---

## PROMPT 1 · Páginas 1–2 (copy-paste LITERAL a Replit Agent)

```
Build a multi-page Streamlit web app called "Impulso BioCycle" — an AI platform for designing microbial consortia for biodegradation of pollutants. The app is in SPANISH.

## DESIGN
- Colors: primary deep green #1B5E20, background white, accent emerald #00C853, sidebar dark #0A1F0A
- Modern cards with box-shadow, rounded corners, hover effects
- page_config: title="Impulso BioCycle", icon="🧬", layout="wide"
- Sidebar: "🧬 Impulso BioCycle" logo text, navigation, bottom: "Finalista Capital Semilla Nacional 2026 | Hecho en Colombia 🇨🇴"
- ALL text in Spanish
- Add .streamlit/config.toml:
  [theme]
  primaryColor="#00C853"
  backgroundColor="#FFFFFF"
  secondaryBackgroundColor="#F1F8E9"
  textColor="#1B4332"
  font="sans serif"

---

## PAGE 1: "🏠 Descubrimientos"

Top stats: "🔬 10 descubrimientos | 🧫 50+ microorganismos catalogados | 📚 2,000+ papers indexados | 🌍 12 países"

Filter buttons row: "Todas", "Enzimas", "Bacterias", "Consorcios", "Proyectos", "IA"

Cards in 2-column grid. Each card: colored category badge, title, year, institution, 2-sentence description, bold key result, "Ver paper →" link (opens new tab).

Cards data (CRITICAL: incluir estos 10 literal, no inventar):

1. FAST-PETase | Enzima | 2022 | U. Texas Austin
"Enzima diseñada por machine learning que degrada PET post-consumo a temperatura ambiente (condiciones de biorreactor)."
Result: "51 productos PET degradados en 1 semana a <50°C"
Link: https://www.nature.com/articles/s41586-022-04599-z

2. LCC-ICCG | Enzima | 2021 | INRAE/Carbios
"Variante cuádruple de cutinasa de compost. Benchmark industrial para reciclaje enzimático de PET."
Result: ">90% PET post-consumo degradado en 10 horas a 72°C"
Link: https://www.nature.com/articles/s41586-020-2149-4

3. Ideonella sakaiensis | Bacteria | 2016 | Inst. Tecnológico Kyoto
"Primera bacteria descubierta que usa PET como fuente de carbono y energía."
Result: "Degrada PET con PETase + MHETase en cascada (condiciones de laboratorio)"
Link: https://www.science.org/doi/10.1126/science.aad6359

4. Consorcio Pseudomonas-Bacillus-Acinetobacter | Consorcio | 2022
"Consorcio de tres especies con roles complementarios para hidrocarburos complejos."
Result: ">80% degradación en 60 días vs <40% con especie individual"
Link: https://www.sciencedirect.com/science/article/pii/S0301479723003

5. Deepwater Horizon — Alcanivorax | Proyecto | 2010 | DOE Lawrence Berkeley
"Tras el mayor derrame de la historia, bacterias marinas nativas degradaron la mayoría del petróleo subsuperficial. Caso real de biorremediación in-situ para hidrocarburos."
Result: ">90% de HC subsuperficiales degradados en ~1 semana por bacterias nativas"
Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC3155281/

6. AlphaFold + ProteinMPNN | IA | 2024 | Premio Nobel Química
"Modelos de diseño computacional de proteínas. Revolucionan la ingeniería de enzimas degradadoras."
Result: "89% precisión en clasificación de enzimas degradadoras de plástico"
Link: https://www.nobelprize.org/prizes/chemistry/2024/

7. Proyecto EiCLaR | Proyecto | 2024 | Comisión Europea (18 socios)
"4 tecnologías de biorremediación in situ probadas en 12 sitios de campo en Europa y China. Aplica a suelos + hidrocarburos (no plásticos)."
Result: "Todas las tecnologías listas para mercado en próximos 3 años"
Link: https://cordis.europa.eu/project/id/101037492

8. Encapsulación alginato para HC | Consorcio | 2023 | Springer
"Bacterias inmovilizadas en alginato-carbón activado superan a células libres para degradación de crudo."
Result: "75.1% degradación crudo en 7 días vs ~40% células libres. 1000x mayor supervivencia"
Link: https://link.springer.com/article/10.1007/s10532-021-09930-5

9. Biorremediación Colombia — Revisión | Proyecto | 2022 | PMC
"Revisión sistemática de 37 estudios colombianos sobre bacterias degradadoras de hidrocarburos (1996-2021). Precedente regional."
Result: "Pseudomonas y Bacillus son los géneros más estudiados en Colombia"
Link: https://pmc.ncbi.nlm.nih.gov/articles/PMC8913561/

10. Allonnia — Biorremediación comercial | Proyecto | 2025 | Ginkgo Bioworks ($40M)
"Primera empresa en comercializar biorremediación microbiana avanzada en campo (químicos eternos)."
Result: "99% degradación de 1,4-dioxano en campo abierto"
Link: https://allonnia.com

---

## PAGE 2: "🧪 Diseñador de Consorcios"

Subtitle: "Diseña el tratamiento biológico óptimo para tu residuo o contaminante"
Small hedge below subtitle: "Recomendación basada en 2,000+ papers revisados por pares. Requiere validación experimental antes de despliegue de campo."

### STEP 1: "¿Qué quieres tratar?" (styled card)

**Categoría** — selectbox:
["Plásticos", "Hidrocarburos y petróleo", "Suelos agrícolas contaminados", "Aguas residuales industriales", "Contaminantes químicos"]

**Sub-tipo** — changes per category:
If Plásticos: ["PET (botellas, envases) — en biorreactor", "HDPE (envases rígidos) — en biorreactor", "LDPE (bolsas, film) — en biorreactor", "PS/Icopor (vasos, empaques) — en biorreactor", "PLA (biodegradable) — compostaje", "Mezcla de plásticos — en biorreactor"]
If Hidrocarburos: ["Petróleo crudo / derrames", "Diésel / combustibles", "PAHs (hidrocarburos aromáticos policíclicos)", "Aceites industriales usados"]
If Suelos agrícolas: ["Organofosforados (clorpirifos, malatión)", "Organoclorados (DDT, endosulfán, lindano)", "Glifosato y AMPA", "Carbamatos (carbofurán, carbaril)", "Herbicidas (atrazina, 2,4-D)"]
If Aguas residuales: ["Colorantes textiles azo", "Colorantes reactivos", "Metales pesados (Cr, Pb, Cd)", "Fenoles industriales", "Residuos farmacéuticos"]
If Contaminantes químicos: ["PFAS (químicos eternos)", "Tintes industriales", "Solventes clorados"]

### STEP 2: "¿Cómo se va a tratar?" (styled card)

**Modo de aplicación** — selectbox:
"🔬 Biorreactor de laboratorio (condiciones controladas)"
"🏭 Biorreactor industrial (planta de tratamiento)"
"🌿 In situ — suelo (aplicación directa con cápsulas)"
"💧 In situ — cuerpo de agua"
"🏗️ Compostaje industrial"

CRITICAL warning (mostrar si user selecciona plástico + in-situ):
"⚠️ La degradación de plásticos requiere biorreactor con condiciones controladas (50–78°C). El escenario 'in-situ en playa/océano' NO es viable técnicamente hoy — las enzimas requieren temperaturas >50°C para actividad relevante. Para in-situ, recomendamos hidrocarburos, suelos agrícolas o aguas residuales donde hay 30+ años de precedente."

**If plastic selected, show pretreatment section:**
"Pretratamiento del residuo plástico"
- Trituración: selectbox ["Sin triturar", "Gruesa (>5mm)", "Fina (1-5mm)", "Micronizada (<1mm)"]
- Limpieza: selectbox ["Sin lavar", "Lavado básico agua", "Lavado industrial", "Limpieza química + amorfización"]

### STEP 3: "Condiciones del entorno" (styled card)

- **Temperatura (°C)** — slider 5 to 80, default 30
- **pH** — slider 3.0 to 10.0, step 0.1, default 7.0
- **Tipo de medio** — selectbox: ["Acuoso (sumergido en agua/buffer)", "Suelo húmedo (40-60% humedad)", "Suelo seco (<20% humedad)", "Agua salada (marina/estuario)", "Medio industrial controlado"]
- **Contaminación mixta (%)** — slider 0 to 80, default 20, helper: "Relleno sanitario: 40-60% | Planta reciclaje: 5-15% | Suelo agrícola: 10-30%"
- **Volumen a tratar** — number_input, default 100, label changes per category: "toneladas" for plastics, "m³ de suelo" for soils, "m³ de agua" for water

### BIG BUTTON
"🧬 Diseñar Consorcio Óptimo" — large, green, centered

### LOADING SIMULATION (sequential, dramatic)
When clicked:
- (2s) "🔍 Analizando contaminante y condiciones ambientales..."
- (2s) "🧫 Consultando base de datos de 847 microorganismos catalogados..."
- (1.5s) "🔗 Verificando compatibilidad entre especies candidatas..."
- (2s) "🧬 Optimizando proporciones del consorcio con modelo ML..."
- (1.5s) "💊 Seleccionando formulación de cápsula para el entorno..."
- (1.5s) "📊 Generando predicción de degradación basada en 2,000+ papers..."
- (1s) "✅ ¡Consorcio diseñado exitosamente!"

Green banner: "✅ Consorcio de {N} microorganismos diseñado para {subtype} en {application_mode}. Todos los organismos son BSL-1 o GRAS (seguros para humanos)."

### RESULT A: "🧫 Receta del Consorcio"

Styled table. Each row shows: Microorganismo | 🟢 BSL-1/GRAS badge | Rol | Enzima principal | Proporción % | Rango óptimo

DATA BY CATEGORY (usar las tablas COMPLETAS del archivo original — demasiadas para reproducir acá; ver `Proyectos_investigacion/REPLIT_FINAL/PASO1_PROMPT_PRINCIPAL.md` líneas 148–188 para datos literales de PET, Hidrocarburos, PAHs, Organofosforados, Glifosato, Colorantes, Metales pesados).

Para las categorías no listadas (HDPE, LDPE, PP, PS, PLA, mezcla plásticos, organoclorados, carbamatos, herbicidas, colorantes reactivos, fenoles, farmacéuticos, PFAS): crear tablas similares usando organismos de la base de datos. Use SOLO BSL-1 o GRAS. Nunca use Pseudomonas aeruginosa.

### RESULT B: "📊 Probabilidad de Éxito"

Show a big gauge/progress bar (0-100%) with colors:
- Red: 0-30% "Baja — Requiere investigación adicional"
- Yellow: 30-60% "Moderada — Viable con optimización"
- Green: 60-100% "Alta — Evidencia científica sólida"

Values by scenario (HEDGED — no sobre-prometer):
- PET biorreactor + trituración fina + lavado + temp 50-72°C: 85-95%
- PET biorreactor + sin pretratamiento + temp 30°C: 30-50%
- Hidrocarburos in situ + consorcio: 60-75%
- Organofosforados in situ: 70-85%
- Glifosato in situ: 65-80%
- Colorantes textiles biorreactor: 80-95%
- Metales pesados (bioacumulación): 70-90%
- HDPE/LDPE biorreactor: 20-35% (HONESTO: eficiencia baja)
- PP biorreactor: 10-25% (HONESTO: aún muy difícil)
- PVC: 5-15% (HONESTO: problema aún no resuelto)
- PFAS: 15-30% (HONESTO: frontera de investigación)

Adjust: if temp < 20°C: -20%. If contamination > 50%: -25%. If in situ: -15% vs biorreactor. If no pretreatment (plastics): -30%.

Show text: "Basado en {N} publicaciones científicas revisadas por pares + modelo ML entrenado con 43 muestras de literatura."

### RESULT C: "🔗 Compatibilidad del Consorcio"
(Mismo contenido que el archivo original — ver líneas 215–225.)

### RESULT D: "💊 Formulación de Cápsula"
(Mismo contenido que el archivo original — ver líneas 229–244. Hedging: recordar que "IA-optimizada" = selección de organismos, no de material — encapsulación usa protocolos estándar TRL 7–8.)

### RESULT E: "📈 Predicción de Degradación"
(Plotly line chart como en el archivo original — ver líneas 248–256.)

### RESULT F: "📦 Resultado del Proceso"

Dynamic based on category:

If plastics:
"📦 Productos: Ácido tereftálico (TPA) + Etilenglicol (EG) en solución acuosa"
"💰 Valor comercial: TPA ~$680-850/ton | EG ~$500-650/ton"
"🔄 Uso: Re-síntesis de plástico reciclado grado virgen, o venta como materia prima"
"⚠️ IMPORTANTE: los monómeros están en solución. Requiere separación/purificación downstream (no incluida en este scope) para valorización comercial."

If hydrocarbons: (contenido original)
If agricultural soil: (contenido original)
If textile wastewater: (contenido original)
If heavy metals: (contenido original)

### RESULT G: "💰 Comparación de Costos"
(Usar las tablas del archivo original — líneas 292–320.)

### RESULT H: "📋 Protocolo de Despliegue" (expandible)
(Mismo contenido que el archivo original.)

### RESULT I: "⚠️ Limitaciones y Notas"

st.expander con 5 disclaimers HONESTOS:
"1. Las predicciones se basan en publicaciones revisadas por pares y un modelo ML entrenado con 43 muestras. Resultados reales pueden variar ±20–40%.
2. Para plásticos: la degradación produce monómeros en solución, no elimina masa directamente. Para valorización se requiere separación downstream.
3. La probabilidad de éxito es una ESTIMACIÓN. Se recomienda validación experimental en piloto (5% del volumen, 90 días) antes de escalar.
4. Cualquier aplicación de campo requiere permisos de la autoridad competente (ANLA/CAR en Colombia, EPA en USA, ICMBio en Brasil).
5. Todos los microorganismos son BSL-1/GRAS pero se recomienda manejo con buenas prácticas de laboratorio.
6. PFAS, PP y PVC tienen eficiencias actualmente BAJAS (<30%). Son áreas de investigación activa — no prometemos resultados comerciales."

### DOWNLOAD BUTTON
"📥 Descargar reporte" — muestra toast "Disponible en versión completa"

---

## TECHNICAL
- streamlit >= 1.30, plotly, pandas, scikit-learn (para ml_model.py)
- No external APIs
- Responsive, mobile-friendly
- All hardcoded data (no database needed)
- Use st.session_state para storing results entre interactions
- Use time.sleep para loading simulation
- Sidebar navigation with st.page_link o selectbox
```

---

## Paso 2 · Crear `ml_model.py` manualmente

1. En Replit, click ícono de archivos (📁) → `+ New file` → nombrarlo exactamente `ml_model.py`.
2. Abrir `Proyectos_investigacion/REPLIT_FINAL/PASO3_ML_MODEL.py` en tu laptop.
3. Copiar TODO el contenido (365 líneas, empieza con `import pandas as pd` y termina con `get_predictor()`).
4. Pegar en el archivo `ml_model.py` de Replit.
5. Save (Ctrl+S).

Luego decirle al Replit Agent:

> *"In page 2 (Consortium Designer), import get_predictor from ml_model and use predictor.predict_timeline() to generate the degradation chart instead of hardcoded curves. Show model info in an expander showing number of training samples and R² score."*

---

## PROMPT 2 · Páginas 3–4 (copy-paste LITERAL a Replit Agent después del Paso 4)

```
Add two more pages to the existing Impulso BioCycle app:

## PAGE 3: "🏭 Portal del Cliente"

Subtitle: "Soluciones listas para empresas y operadores"
Smaller text: "Seleccione su operación y reciba un plan de tratamiento inmediato. Los planes son estimados basados en literatura — un piloto de 90 días valida antes de escalar."

### INPUT:
- **Tipo de operación** — selectbox: ["Planta de reciclaje de plásticos", "Relleno sanitario", "Empresa petrolera / remediación", "Planta textil / tintorería", "Empresa agrícola", "Consultora ambiental", "Laboratorio de investigación"]
- **Residuo principal** — selectbox based on operation type
- **Volumen mensual** — number_input (ton or m³)
- **Ubicación** — selectbox: Colombian cities + "Otro LATAM"

Green button: "📋 Generar Plan de Tratamiento"

### OUTPUT:

**"Producto BioCycle Recomendado"** — big card:
- Product name generated: "BioCycle {contaminant}-{climate}"
- "{N} microorganismos pre-optimizados para {residue}"
- Application frequency

**"Plan Operativo"** — timeline:
- Mes 1: Diagnóstico + piloto (5% del volumen)
- Mes 2-3: Escalamiento a 30%
- Mes 4-6: Operación completa
- Mes 7+: Monitoreo + optimización

**"Impacto Financiero"** — 3 big st.metric con caveat al final: "*Estimación basada en literatura. ROI real validado en piloto.*"

**"Impacto Ambiental"** — 3 metrics.

**"Cumplimiento Normativo"** — card específica por industria (Resolución 631/2015 textil, Decreto 1076/2015 hidrocarburos, MinAgricultura suelos).

Button: "📞 Solicitar asesoría → Página 💬"

---

## PAGE 4: "💬 Asesoría IA"

Chat interface with st.chat_message and st.chat_input.

6 suggested questions buttons:
- "¿Qué bacterias degradan PET?"
- "¿Cuánto cuesta el tratamiento por tonelada?"
- "¿Es seguro para el medio ambiente?"
- "¿Cómo funciona para empresas textiles?"
- "¿Qué diferencia a BioCycle de otros?"
- "¿Cómo empiezo un piloto?"

Keyword-based responses (no API needed — ver Proyectos_investigacion/REPLIT_FINAL/PASO2_PROMPT_PAGINAS_3_4.md líneas 63–94 para respuestas literales).

IMPORTANTE: cada respuesta debe terminar con una fuente (paper, regulación, o "nuestra simulación ML"). No inventar números sin anclar.
```

---

## Paso 6 · Polish + video backup

Una vez que las 4 páginas funcionan:

1. **Ajustar colores** si es necesario — decirle al Agent:
   > "Update .streamlit/config.toml with primaryColor=#00C853, backgroundColor=#FFFFFF, secondaryBackgroundColor=#F1F8E9, textColor=#1B4332. Make all Plotly charts use a clean template with height=400, white background, and green color scheme."

2. **Header del top** — decirle:
   > "Add a header with '🧬 Impulso BioCycle' in large bold green text and subtitle 'Biorremediación Inteligente con IA' in smaller gray text. Include the tagline: 'Diseñamos consorcios. Los operadores los ejecutan.'"

3. **Grabar video backup 90s** — QuickTime screen record de:
   - abrir app → Descubrimientos
   - click card "FAST-PETase" → abre Nature
   - ir a Diseñador → seleccionar Hidrocarburos + in-situ + 30°C
   - click "Diseñar Consorcio" → ver loading dramatic
   - mostrar tabla + probabilidad + predicción + costos
   - cerrar en Portal Cliente con plan operativo
   Voiceover de Manu: *"Lo que acaban de ver son 2,000 papers destilados en 30 segundos. Le damos a los operadores la receta optimizada + la predicción de éxito antes de gastar un dólar."*

4. **Guardar en `marketing/pitch-video-backup-biocycle.mp4`** + copia local + iCloud.

---

## Fallback si el Replit Agent falla

Si después de 3 intentos el Agent no genera código funcional:

1. **Plan B · Screenshots only:** tomar capturas del Replit de otros proyectos similares, pegarlas en el deck, narrar "así se ve el producto — demo interactivo post-pitch".
2. **Plan C · Streamlit Cloud:** copiar el código generado a un repo GitHub y deploy directo en Streamlit Community Cloud (free, más estable que Replit para Streamlit).
3. **Plan D · Sin demo:** el pitch SOBREVIVE con solo el storytelling + video backup + deck. Los jurados recuerdan la narrativa.

---

## Checklist antes del pitch T-0

- [ ] URL pública responde (`curl -I <url>`)
- [ ] 4 páginas cargan sin errores
- [ ] Filtros página 1 funcionan
- [ ] Diseñador página 2 completa los 8 loading steps
- [ ] ml_model genera chart de degradación
- [ ] Portal Cliente página 3 muestra plan operativo
- [ ] Chatbot página 4 responde 6 preguntas
- [ ] Video backup 90s grabado + en laptop local
- [ ] URL escrita en papel + laptop backup con URL favoritos

**Si todo falla T-0:** deck + video backup + narrativa memorizada = pitch sobrevive. **Nunca dependas 100% de la demo live.**
