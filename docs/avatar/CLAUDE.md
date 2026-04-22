# Avatar ideal — síntesis 2026

Esta es la versión refinada del ICP tras cruzar la investigación baseline de `Proyectos_investigacion/` con **research web abril 2026** sobre Reddit, foros, blogs técnicos y papers.

**Reporte detallado con 12 citas textuales:** `../research/avatar-web.md`

## Quién es (1 oración)

> *PD Scientist o Fermentation Engineer con MSc/PhD en bioingeniería/biotec/microbiología, 30–40 años, corriendo 2–8 biorreactores <20 L en un lab de 2–15 FTEs con presupuesto de software <$20K/año, que pierde 1 de cada 5 batches y tiene al founder/PI pidiéndole scale-up para Series A en 9 meses.*

## Demografía

| Dim | Valor |
|-----|-------|
| Rol | PD Scientist I/II (pico), Fermentation Engineer, PI/Postdoc traslacional, Director of Fermentation (seed/Series A), Research Associate |
| Edad | 30–38 pico, rango 27–45 |
| Educación | MSc o PhD en Bioingeniería, Biotecnología, Microbiología, Ing. Química |
| Geografía | EE.UU. 50% · Europa 25% · Asia 15% · LATAM 10% (MX, AR, BR, CO, CL) |
| Tamaño org | 2–15 FTEs |
| Budget SW | <$20K/año — **explícitamente fuera** del rango Sartorius/Siemens/Algocell |
| Herramientas hoy | Excel + cuaderno, JMP/MODDE (a veces pirateado), ELN ad hoc |

## Día en la vida (JTBD)

- **07:30** muestreo manual 6 biorreactores (45 min)
- **08:30** OD600 + HPLC + glucosa → Excel + cuaderno
- **11:00** decide feed "a ojo"
- **13:00** reunión "¿por qué falló el lote 27?" — nadie sabe
- **14:00** OFAT (cambia 1 variable) porque no tiene licencia MODDE
- **16:30** 2do muestreo
- **Fin de semana:** o viene al lab o pierde el batch

**JTBD core (qué intenta contratar a BioSync para hacer):**
1. "Saber si el batch se va a caer **antes** de perder $2K de media."
2. "Saber qué 3 condiciones importan de 20, sin 6 meses de OFAT."
3. "Que el conocimiento del proceso no viva en la laptop de Juan."

## Pain points (top 5, textuales)

1. *"Everyday you'll be manually processing samples … a very tired and frustrated scientist"* (synthace.com)
2. *"Turnaround time to results was 10 days … vs 0.16 days for the automated process"* (sigmaaldrich.com)
3. *"A single contaminated 100-cubic-metre fermenter represents millions in wasted raw materials"* (amazonfilters.com)
4. *"80–90% of their time is spent organizing and cleaning data instead of analysis"* (intuitionlabs.ai)
5. *"Pilot bioreactors … 'valley of death' for innovative synbio startups"* (synbiobeta.com)

7 citas adicionales + URLs en `../research/avatar-web.md`.

## Unmet needs (dónde competidores NO llegan)

1. **Pricing <$10K/año** para labs 2–15 personas — incumbentes arrancan $50K.
2. **Onboarding en días** — sube CSV de DASbox/Minifors/Applikon, recibe recomendaciones esa semana. No integración PI-OSIsoft de 6 meses.
3. **DoE + ML híbrido bilingüe EN/ES** con plantillas específicas para vitaminas, aminoácidos, probióticos, pigmentos — no otra suite CHO mAb genérica.
4. **Captura de tribal knowledge** (razonamiento detrás de cada decisión feed/pH), no texto libre inútil de ELN.
5. **Modo rescate de batch en vivo:** alerta 6–12 h antes del crash con **acción concreta** ("bajar rpm a 400, 2 mL antifoam"). Competidores dan dashboards; nadie da acciones.

## Lenguaje nativo (para copy/marketing)

"batch failed" · "lote perdido" · "dump the fermenter" · "OFAT" (pecado original) · "scale-up valley of death" · "tribal knowledge" · "babysitting the bioreactor" · "shake flask to 5 L gap" · "CPPs/CQAs" · "DoE" · "PAT" · "feeding strategy" · "titer/rate/yield" (triángulo sagrado) · "we can't afford Benchling" · "contamination event" · "DO crash".

## Canales donde vive

- **Reddit:** r/biotech, r/labrats, r/bioengineering, r/synbio, r/Biochemistry
- **Foros:** ResearchGate Q&A, BioStars, Homebrewtalk (muchos fermentation engineers brewean)
- **Industria:** SynBioBeta, AIChE SynBio Conference, ECI Cell Culture Engineering, iGEM
- **Blogs:** Culture Biosciences, INFORS HT, Eppendorf Lab Academy, BioProcess International
- **LinkedIn:** grupos "Bioprocessing Network", "Precision Fermentation"
- **LATAM:** UNAM, Tec de Monterrey, UBA, USP, CENEBA (MX), IndieBio LatAm, BioSantos Dumont

## Cómo aplicar este avatar

- **Copy/landing:** usar el lenguaje nativo arriba. No decir "optimización de procesos" — decir "no más 6 meses de OFAT".
- **Pricing page:** mostrar el número. No "contact sales". Eso *es* la señal diferenciadora para este ICP.
- **Onboarding:** demo-a-demo en 5 min, cuenta self-serve, CSV upload de sus corridas existentes.
- **Features roadmap:** priorizar las 5 unmet needs arriba; ignorar tentaciones de "enterprise parity" con Siemens.
- **Comunidad:** publicar en los canales arriba; patrocinar iGEM; plantar equipo en SynBioBeta.
