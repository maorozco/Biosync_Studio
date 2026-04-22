# Q&A Cheatsheet v2 — Pitch T-0 2026-04-22 · 42 preguntas

> **Uso:** memorizar primero las 15 más probables (Q11–Q20 del mentor + Q1, Q6a, Q7, Q14, Q16). Practicar cada una en ≤45 seg durante el drill T-1.
>
> **Principio:** admitir + prometer + volver al hecho defendible. Nunca inventar. Nunca overclaim. Anchor verbal: *"Te prometo que..."* (máximo 3 veces en todo el Q&A).
>
> **v2 agrega 32 preguntas nuevas** desde el feedback del mentor (audio 2026-04-21) + preguntas de panel colombiano de seed capital.

---

## PARTE 1 · Las 10 bombas originales

### A. BOMBAS científicas (prioridad 1)

#### Q1 · "Ustedes dicen 'alerta de deriva en <60 minutos'. ¿Con qué cadencia de sensor? ¿Han validado con data real?"

**[Tipo: juez PhD técnico]**

> **"Excelente pregunta. Te prometo precisión:
>
> La alerta en <60 minutos requiere data de pH, DO y temperatura en tiempo real con cadencia menor a 5 minutos.
>
> En data mock validamos <60 min. En data de cliente la latencia real depende del hardware — un biorreactor con sensores legacy que reporta cada hora va a tener latencia de una hora más los cálculos nuestros.
>
> Lo que no prometemos: detectar deriva en un biorreactor que solo se mide manualmente una vez al día. Para ese caso la promesa cambia a 'pronóstico de fin de semana', no 'alerta de 60 min'."**

---

#### Q2 · "Su IA usa Gradient Boosting + PINN. ¿Cuántos batches necesita para funcionar? ¿Han hecho cross-validation?"

**[Tipo: juez ML engineer]**

> **"Gradient Boosting funciona bien con al menos veinte batches etiquetados por organismo.
>
> Debajo de veinte — que es donde viven la mayoría de labs pequeños — usamos Bayesian optimization más transfer learning. Hay un paper de bioRxiv 2024 que muestra 3 a 30 veces menos experimentos para llegar al óptimo con este enfoque.
>
> PINN lo usamos como capa de recomendación, no como modelo primario. El loss-weighting de PINN puede enmascarar simplificaciones — un paper de 2025 lo documenta. No prometemos que PINN reemplaza tu Monod; prometemos que sugiere experimentos mejores.
>
> Cross-validation: en riboflavina con *B. subtilis* predecimos yield con 8% RMSE en 10 runs de test. Con el próximo cliente arranco a acumular data real."**

---

#### Q3 · "Su claim de 'Annex 22-ready frozen-mode' — eso no es término oficial en el draft. ¿Están sobre-interpretando?"

**[Tipo: juez regulatorio / compliance]**

> **"Tienes razón — 'frozen-mode' es coinage informal de la industria, no aparece literal en el draft de julio 2025.
>
> Lo que sí dice el draft es: **'adaptive and generative models are explicitly prohibited in GMP-critical decisions'**. La frase está citada textual en la documentación de Epista y en el mismo PDF de la EMA.
>
> Nuestra interpretación — que el mercado empieza a adoptar — es que necesitas: modelo con weights fijos, audit trail ALCOA+, re-train off-production.
>
> Si la regla final de Q2 2026 dice otra cosa, adaptamos en semanas. No es un moat permanente — es una ventaja de posicionamiento de 18 meses pre-enforcement. Lo que sí es cierto es que los vendors que pre-anunciaron 'agentic AI' — como Aizon en octubre — chocan frontal con el draft."**

---

#### Q4 · "BioCycle dice 'in-situ degradación de plásticos'. ¿Cómo lo hacen sin Carbios-scale bioreactor?"

**[Tipo: juez biotech industrial]**

> **"No lo hacemos. Ese framing era del pitch inicial — ya lo pivotamos.
>
> BioCycle tiene dos escenarios:
>
> **Uno:** biorreactores distribuidos, operador-managed, para plástico. Convierten PET en TPA más etilenglicol — monómeros que se venden a 680 y 500 dólares por tonelada respectivamente. Esto NO es in-situ — requiere biorreactor a 50–78 grados. Igual que Carbios, pero descentralizado.
>
> **Dos:** in-situ para hidrocarburos y suelos agrícolas. Ahí hay 30 años de precedente — Exxon Valdez, Deepwater Horizon, Ecopetrol en Colombia.
>
> Plástico in-situ en playa — como se planteaba originalmente — es TRL 2, aspiracional. Lo sacamos del pitch actual. Te prometo transparencia en eso."**

---

#### Q5 · "Su 'federated biomanufacturing' — ¿no existe MELLODDY de Novartis?"

**[Tipo: juez investor con memoria larga]**

> **"MELLODDY es federated **drug discovery** — liderado por Novartis, 2021 a 2024. Es química farmacéutica, no procesos de fermentación.
>
> He revisado los tres candidatos: MELLODDY (drug discovery), Owkin (clínica), y MIT Initiative for New Manufacturing (manufactura genérica, no FL específico).
>
> Ninguno hace federated learning entre biorreactores en plantas distintas. La razón estructural: drug discovery tiene IP química unificable en SMILES. Biomanufacturing tiene IP heterogénea — cada cepa, cada medio, cada reactor es único.
>
> Nosotros estamos resolviendo ese 'schema federation problem'. No sé si vamos a ganar — sé que somos los primeros en intentarlo con el stack comercial, sobre Flower 1.29. Si descubres otro proyecto, dímelo, lo agrego al research."**

---

### B. BOMBAS operacionales (prioridad 2)

#### Q6a · "¿Quién paga $99/mes hoy? ¿Tienen clientes?"

> **"Hoy, cero pagadores. Cuarenta y siete en la lista de espera, doce con call agendado, cinco ya dijeron 'yes' verbal al beta.
>
> No voy a inflar números. Somos pre-revenue. Lo que te ofrezco es exactamente lo que estás buscando acá: **plataforma construida, demanda validada vía waitlist, ausencia de revenue pagado — porque NO hemos lanzado el paywall todavía.**
>
> El lanzamiento es esta semana. Tendré los primeros ACH en los próximos 15 días."**

#### Q6b · "¿Quién paga BioCycle?"

> **"Tres conversaciones abiertas con operadores de residuos en Bogotá. Cero contratos firmados.
>
> BioCycle es MVP de dos semanas — literal, hoy te estoy mostrando la plataforma porque **quiero que seas el primero en validarla conmigo**.
>
> Te prometo que en junio tengo piloto firmado con CGR Doña Juana o vuelvo acá y lo reconozco sin excusa."**

---

#### Q7 · "¿Por qué no la adquiere Sartorius mañana?"

> **"Porque Sartorius vende a top-20 pharma con contratos de 7 cifras. Nuestro ICP — labs de 2 a 15 personas con presupuesto menor a 20 mil al año — es un segmento que Sartorius no atiende y no le interesa. La teoría de disrupción de Christensen en vivo.
>
> Además: nuestro precio de 99 dólares no canibaliza su negocio. Los canibaliza cuando subamos a tier empresarial — en tres años, con product-market fit demostrado."**

---

#### Q8 · "¿Cómo se diferencian de Algocell, Invert, Basetwo?"

> **"Los tres son enterprise, quote-based, 50 mil a 250 mil al año. Funcionan bien para Series B+.
>
> Nuestro lane es SMB biotech, LATAM-first. Precio público. Onboarding self-serve en días, no meses.
>
> No competimos en Boston con un lab de 150 personas que ya tiene Algocell. Competimos en Rosario con un lab de 9 personas que hoy usa Excel. Eso es mercado 10× más grande en cantidad de labs, 10× más chico en ACV. Algocell no lo va a atacar."**

---

#### Q9 · "El equipo es solo usted. ¿Cómo va a construir esto sola?"

> **"No sola — Justin y yo, cinco años de ciencia de datos + investigación biológica + software, trabajando juntos.
>
> Los primeros 500 mil son exactamente para resolver el cuello de botella: contratar un ML engineer senior y un sales engineer LATAM. Runway de 12 meses.
>
> Si el jurado piensa que el equipo es débil — coinvirtamos con un co-founder técnico y arranco el día uno con equipo. Estoy abierta a eso."**

---

#### Q10 · "¿Y si la regulación Annex 22 se suaviza?"

> **"Pierdo una parte del moat, no todo.
>
> Los otros dos elementos del moat — precio público y LATAM-native — son estructurales, no regulatorios.
>
> Si Annex 22 se suaviza, mi narrativa cambia a 'cumplimos AUNQUE no sea obligatorio' — lo cual sigue siendo señal de seriedad para clientes GMP aspiracionales."**

---

## PARTE 2 · 32 preguntas nuevas (v2)

### C. Business model / ask (del mentor)

#### Q11 · "¿Cómo distribuyen los $500K? ¿70% producto, 25% sueldos, 5% legal?"

> *[Respuesta que el mentor dijo que "si la dan, ahí los patas saben que la tienen clara"]*
>
> **"Exacto la fórmula:**
> - **Setenta por ciento en producto y adquisición de clientes** — ML engineer senior, infra Azure/Replit, ads en inglés y español, influencers biotech LATAM.
> - **Veinticinco por ciento en sueldos** — sales engineer LATAM base, mi salario al mínimo viable.
> - **Cinco por ciento en legal y compliance** — constitución SAS Colombia + entidad US para eventual raise Series A, NDAs con los 47 de la waitlist, asesoría Annex 22.
>
> Runway doce meses hasta veinte mil MRR. Después Series A."**

---

#### Q12 · "¿Por qué ESTE momento? ¿Por qué es el tiempo correcto para esta startup?"

> **"Hace dos años esto era imposible. Hoy tres cosas chocaron al mismo tiempo:**
>
> **Uno — la IA agéntica se volvió commodity.** Claude, Llama, GPT. Un biólogo le pregunta al chat y responde. Google pasó a segundo plano — hoy todos chateamos con la solución.
>
> **Dos — la regulación apunta hacia nosotros.** EMA Annex 22, draft julio 2025, regla final junio 2026. Prohíbe IA adaptativa en producción GMP. Nosotros nacimos 'frozen-mode'. Aizon, que pre-anunció 'agentic AI', acaba de chocar frontal.
>
> **Tres — Sanofi FDA warning enero 2025.** Veinte por ciento de batches rechazados. Inspecciones FDA en Latam subieron cuarenta por ciento. Si no tenés audit trail automatizado, no exportás a Estados Unidos en 2026.
>
> **Ventana de dieciocho meses antes de que los gigantes reaccionen."**

---

#### Q13 · "¿Cuál es el problema? ¿Cómo saben que existe?"

> **"El problema es que un lab pequeño pierde quinientos a cinco mil dólares cada batch fallido. Y pierde uno de cada cinco.**
>
> **Sanofi — Sanofi, la farmacéutica — perdió veinte por ciento de batches entre enero 2022 y julio 2024. FDA warning letter pública.**
>
> **Nosotros scrapeamos Reddit, foros de biotech y LinkedIn. Cuarenta y dos labs mencionan OFAT, batch failure, tribal knowledge. No son quejas inventadas — están ahí arriba en el widget del dashboard, time-stamped.**
>
> **Y el año pasado hablé con nueve fermentation engineers en México, Argentina y Colombia. Todos me dijeron la misma frase: 'sé que hay IA pero no es para mí, es para Pfizer'. Esa frase es el problema."**

---

#### Q14 · "¿Cómo adquieren clientes?"

> **"Tres canales, validados en los últimos diez días:**
>
> **Uno — ads digitales bilingüe.** Prueba en Meta + LinkedIn: presupuesto diez dólares al día, un día de campaña, más de cien interesados. Setenta por ciento de la tracción vino de español — LATAM-native es un gap real.
>
> **Dos — content build-in-public.** Llevamos tres meses publicando research en LinkedIn — ciento ochenta seguidores, ingeniero de Sartorius preguntó por beta la semana pasada.
>
> **Tres — partnerships académicas.** Conversando con grupos de biorremediación de Javeriana y UNAL — los profesores son el puente al mercado industrial colombiano.
>
> **Sabemos dónde buscar el público porque llevamos cinco años en biotech y yo misma soy el avatar hace tres años."**

---

#### Q15 · "¿Cómo validaron el producto? (Lean Startup)"

> **"Dos vías, paralelas:**
>
> **Uno — validación científica.** Ninguna recomendación que da BioSync es inventada. Cada consorcio microbiano, cada setpoint, cada rango óptimo viene de papers peer-reviewed con DOI trazable. La IA cruza la literatura — no la extrapola. Si un paper dice que *Pseudomonas putida* degrada hidrocarburos a veintiocho grados, eso es lo que decimos. Nada sobre algo que no exista o no esté aprobado en laboratorio o campo.
>
> **Dos — validación de demanda.** Cuarenta y siete labs en waitlist pre-paywall. Doce calls agendadas. Cinco 'sí' verbales para beta. Y una encuesta de seis preguntas con rúbrica de scoring — los que salen tier-verde (disposición a pagar y urgencia) son los que llamamos primero.
>
> **Lo que NO tenemos: revenue pagado. Porque el paywall se lanza esta semana.**"**

---

#### Q16 · "¿Cuál es el tamaño del mercado?"

> *[CRÍTICA — mentor min 200–210 · NUNCA decir "no sé exactamente"]*
>
> **"TAM combinado cuarenta y seis mil millones de dólares al 2030 — mercado de optimización de bioprocesos más fermentación de precisión más reciclaje enzimático.**
>
> **SAM — el slice que yo puedo servir realmente: dos mil trescientos a cuatro mil seiscientos millones. Son los laboratorios con dos a quince FTE en LATAM más Europa más sureste asiático.**
>
> **SOM a tres años: cien millones. Mil clientes pagando cien dólares al mes. Cero punto cero cuatro por ciento del SAM.**
>
> **Colombia específico — cinco punto uno tres por ciento CAGR en gestión de residuos, el crecimiento más rápido de Sudamérica. LATAM biotech startup funding 2024: cuatro mil quinientos millones, y biotech apenas tres por ciento. Subatendido en infraestructura IA."**

---

#### Q17 · "¿Dónde quieren llegar con todo esto?" (visión a 10 años)

> **"Misma estrategia que usó Tesla. Primero productos premium: Roadster, Model S. Después democratización: Model 3, Model Y.**
>
> **Nosotros igual. Año uno a tres: laboratorios que ya tienen presupuesto — nueve a veinte mil al año. Año tres a cinco: universidades públicas de LATAM, institutos de investigación en India, África. Año cinco a diez: la persona común que quiere saber cómo compostar en su casa, qué bacteria mete en su acuario, cómo su restaurante recicla los residuos.**
>
> **El chat que hoy es herramienta para un PhD, en diez años es como Google — cualquiera lo usa para tomar decisiones biológicas. La ciencia tiene las respuestas. Nosotros las sacamos del PDF al mundo real.**
>
> **No vamos a parar a Trump de tirar misiles. Pero podemos mover la balanza un grado. Con el tiempo, la distancia es abismal."**

**Nota crítica:** NUNCA decir "no te prometo cambiar el mundo" (mentor prohibido min 300). Siempre el "1% de la brújula" framing.

---

#### Q18 · "¿La empresa está constituida?"

> *[Mentor min 392 · "en proceso" es la respuesta que NO podés dar]*
>
> **"Sí — SAS Colombia, para operar en el mercado local con mis clientes LATAM.**
>
> **Para recibir capital semilla internacional estamos estructurando holding Delaware C-Corp en paralelo — es el vehículo estándar para seed/Series A en Estados Unidos. Cuando el capital cae, cae en Delaware; el contrato de servicios entre Delaware y SAS Colombia es IP transfer + transfer pricing.**
>
> **Si el jurado pide el paperwork, lo mando mañana."**

**[PENDIENTE T-1:** confirmar con contador si ya está el RUT pedido o al menos cédula de Cámara. Si no está, esta respuesta es compromiso futuro, no declaración — honra, no mientas.**]**

---

#### Q19 · "¿Qué porcentaje tiene cada socio?"

> *[Mentor min 381 · warning contra 50/50 con pareja]*
>
> **"Yo, sesenta por ciento. Justin, treinta por ciento. Diez por ciento reservado a option pool para el ML engineer y el sales engineer que contratamos con este capital.**
>
> **El split no es cincuenta-cincuenta porque yo lideré la tesis científica y la IP inicial. Justin lidera producto y tecnología — su aporte es crítico. Pero la responsabilidad de decisión final en ciencia es mía, y el cap table lo refleja.**
>
> **Vesting cuatro años con cliff de uno para ambos. Si alguno se va, el equity no se queda con él gratis — eso protege al inversionista."**

**[PENDIENTE T-1:** decidir el split real HOY antes del pitch. Si es otro número (70/20/10, 55/35/10), ajustar esta respuesta. NO 50/50.**]**

---

#### Q20 · "¿Solo son ustedes dos en el equipo?"

> **"Core equipo: dos. Yo — Ingeniera Biológica más cinco años Analytics Engineering — tesis científica, relación con clientes. Justin — cinco años software, producto. Trabajamos juntos hace dos años.**
>
> **Equipo extendido: tres asesores. Un profesor de Javeriana en biorremediación, una PhD fermentación de UNAL, y un ex-CTO de una startup SaaS que exiteó. Cero equity aún — entran al option pool con este capital.**
>
> **No somos un consorcio grande. Ese es el feature, no el bug — sé exactamente cómo corre cada dólar."**

**[PENDIENTE:** si los asesores NO están confirmados con email, cambiar a "dos asesores" o "en conversación con asesores en Javeriana y UNAL".**]**

---

### D. Mercado / competencia

#### Q21 · "¿Quiénes son sus competidores directos? ¿Por qué no te va a copiar Benchling?"

> **"Tres categorías:**
>
> **Enterprise SaaS** — Benchling, Algocell, Invert, Basetwo, DataHow. Cincuenta a doscientos cincuenta mil al año, ventas enterprise, onboarding de seis a doce meses. Su cliente es Pfizer, no Daniela Martínez de Michroma.
>
> **Herramientas legacy** — Sartorius SIMCA, MODDE, JMP. Cinco a quince mil por seat, DoE solamente, sin IA generativa ni comunidad.
>
> **Open-source fragmentado** — Pioreactor, Biolector, repositorios GitHub. Libre pero requiere ingeniero full-time para integrar.
>
> **¿Por qué no Benchling?** Benchling es LIMS — registro de experimentos. No predice. No optimiza. Cincuenta y tres mil dólares al año por team pequeño. Su cliente es management, no fermentation scientist. Nos complementamos — Benchling registra, BioSync decide."**

---

#### Q22 · "¿Qué pasa si Sartorius lanza un producto similar en 6 meses?"

> **"Sartorius tardó dieciocho meses en integrar Ambr con su plataforma de analytics — y son diez mil empleados. Lanzar un competidor self-serve a noventa y nueve dólares significa canibalizar su propio negocio de cinco mil dólares por seat. No lo van a hacer voluntariamente.**
>
> **Si lo hacen: ventaja de dieciocho meses mía, más la data de comunidad que ya acumulé. Sartorius vende a Pfizer; yo tengo doscientos labs pequeños con pain points etiquetados.**
>
> **Además: si Sartorius lanza algo parecido, significa que acertamos el mercado. Eso es buena noticia para el cap table — se llama validation by copycat."**

---

#### Q23 · "Benchling tiene red de 100,000 científicos. Ustedes tienen 47. ¿Qué los hace creer que pueden escalar?"

> **"Benchling construyó esa red sobre diez años con trescientos millones de capital. Yo no voy a batirlos en ese juego.**
>
> **Mi juego es distinto: vertical deep — fermentación y bioprocesos, no bench chemistry general. LATAM-native — español, pesos, horarios de Buenos Aires. Self-serve — un lab se registra hoy, está corriendo una simulación mañana.**
>
> **Si conseguimos mil labs en tres años — cero punto uno por ciento de los científicos de Benchling — y cada uno paga cien dólares al mes, son cien mil MRR. Eso no le mueve el balance a Benchling; nosotros lo celebramos."**

---

### E. Investor / finanzas

#### Q24 · "¿Cuál es su CAC? ¿Su LTV?"

> **"Dato preliminar, CAC en ads: treinta y seis dólares por lead calificado. Conversion tier-verde a pago: estoy proyectando veinte por ciento → CAC real ~ciento ochenta.**
>
> **LTV: noventa y nueve dólares por mes, churn proyectado cinco por ciento mensual — eso da LTV de aproximadamente mil novecientos ochenta dólares. Ratio LTV/CAC: once. Por encima del tres sano de SaaS.**
>
> **Números que NO tengo: CAC real de cliente pagador, porque aún no lanzo paywall. Tendré los primeros en quince días. Si el número sube, ajusto pricing o canal."**

---

#### Q25 · "¿Cuál es su runway? ¿Burn mensual?"

> **"Runway actual con ahorros personales + los ingresos que trae Justin de consultoría: cuatro meses. Por eso este pitch. Sin capital semilla, en agosto entramos en modo supervivencia y paramos producto.**
>
> **Con quinientos mil: burn mensual cuarenta y un mil — incluye mi salario al mínimo, Justin al mínimo, ML engineer senior, sales engineer LATAM junior, infra cloud, ads. Doce meses clean. A los doce tengo veinte mil MRR como piso — suficiente para levantar Serie A o reach break-even."**

---

#### Q26 · "¿Qué valuation están poniendo? ¿Qué dilución?"

> **"Valuation pre-money dos millones. Quinientos mil por veinte por ciento dilución. Post-money dos punto cinco millones.**
>
> **Esa valuation sale de tres comparables LATAM seed biotech 2024 — rango uno punto ocho a tres millones pre-money para equipos pre-revenue con tracción similar. Puedo mandar el cap table cuando quieran."**

**[PENDIENTE T-1:** verificar si $500K + 20% = $2M pre-money es congruente con el ticket real del programa. Capital Semilla Nacional típicamente es $50K–$200K. Si es menor, ajustar en vivo.**]**

---

#### Q27 · "¿Han invertido capital propio? ¿Cuánto?"

> **"Juntos, veintiún mil dólares de bolsillo — ahorros, consultoría que pausamos, créditos de cloud que compramos.**
>
> **Si no creyera en esto no hubiera puesto mis ahorros adentro. Te prometo que para mí esto no es un side project."**

**[PENDIENTE:** ajustar el número real según lo que Manu+Justin decidan declarar. NO mentir — panel puede pedir facturas.**]**

---

#### Q28 · "¿Cuál es su estrategia de exit?"

> **"Tres escenarios, honesto:**
>
> **Uno — Series A en doce a dieciocho meses.** Con veinte mil MRR y quinientos labs, a Ventech o MassVentures.
> **Dos — adquisición estratégica en tres a cinco años.** Sartorius, Thermo Fisher o Danaher — el patrón en biotech tools es consolidación. Benchling se quedó independiente; Aizon se vendió a Honeywell.
> **Tres — escala bootstrapped.** A los mil clientes somos cien mil MRR — rentable, sin forzar venta.
>
> **Lo que NO es exit: IPO — somos una empresa de tools, no de fármacos. Los múltiplos no dan."**

---

### F. Producto / tecnología

#### Q29 · "¿Qué hace ChatGPT que ustedes no hagan? ¿Y viceversa?"

> **"ChatGPT es modelo generalista sin contexto. Un biólogo le pregunta por un setpoint y recibe una respuesta que parece correcta pero no cita fuentes — alucina.**
>
> **BioSync usa retrieval-augmented generation: agarra la pregunta, busca en nuestro corpus curado de papers peer-reviewed, y responde con citaciones. Cero alucinación. Si la respuesta no está en la literatura, respondemos 'no sé, pero puedo diseñar un experimento'.**
>
> **Nosotros NO entrenamos un LLM. Llevamos GPT-4o, Claude, o Llama 4 — el que mejor rinda ese mes. El moat no es el modelo, es la curaduría del corpus y el workflow."**

---

#### Q30 · "¿Qué pasa si OpenAI/Anthropic suben el precio 10x?"

> **"Fallback Llama 4 self-hosted. Veinticinco veces más barato. Lo probamos en staging — calidad noventa y cinco por ciento de Claude para nuestros casos de uso. Si OpenAI cobra lo que cobra Azure por GPU, cambio proveedor en una semana.**
>
> **El costo de token por usuario activo hoy es cuarenta centavos al mes. Aunque suba diez veces es cuatro dólares — cuatro por ciento del ARPU. Margen sigue siendo rentable."**

---

#### Q31 · "¿Cómo protegen la data de sus clientes? Un lab de biotech es sensible."

> **"Tres capas:**
>
> **Uno — tenant isolation.** Cada lab tiene schema separado en Postgres. Ninguna query cruza tenants sin token explícito.
>
> **Dos — opt-in federated learning.** Si un lab quiere contribuir su data a la comunidad, firma un acuerdo de uso anónimo. Los insights que devolvemos son agregados, no individuales. Esto es el feature core de BioSync — la 'Red de Bio-Conocimiento'.
>
> **Tres — cumplimiento.** GDPR compatible. SOC 2 Type I proyectado mes seis post-funding."**

---

#### Q32 · "¿Tienen propiedad intelectual? Patentes?"

> **"Cero patentes propias hoy — somos software, no moléculas. Las patentes en software son debatibles; preferimos velocidad.**
>
> **IP real: el corpus curado (doscientos papers etiquetados con ontología propia), los prompts ingenierilmente afinados, los embeddings vectoriales de la comunidad, y los pesos del modelo Gradient Boosting entrenado con la data que acumulemos.**
>
> **Competidores pueden copiar la interfaz. No pueden copiar los dos años de aprendizaje acumulado mientras yo hablaba con laboratorios todos los días."**

---

### G. Network effects / moat

#### Q33 · "¿Dónde están los network effects en su modelo?"

> *[Mentor min 440+ lo pidió con Uber/Facebook analogy]*
>
> **"Tres clases, en orden de fuerza:**
>
> **Uno — data network effect.** Cada lab que entra contribuye data anonimizada (opt-in). Más labs = mejor modelo = mejor recomendación = más labs. Uber tiene esto con conductores y pasajeros. Nosotros con cepas y procesos.
>
> **Dos — conocimiento colectivo.** Un biólogo en Rosario pregunta por contaminación con *B. subtilis* — nuestra IA agarra la respuesta validada que ya le dimos a uno en Boston el mes pasado. Facebook tiene esto con contenido. Nosotros con protocolos.
>
> **Tres — marketplace de consorcios.** En fase dos, laboratorios comparten recetas validadas en biorremediación — cada consorcio nuevo suma valor al catálogo. Airbnb tiene esto con listings. Nosotros con microorganismos.
>
> **El moat de verdad NO es el modelo. Es que después de mil labs, la comunidad se defiende sola."**

---

### H. Regulación / compliance

#### Q34 · "¿FDA les tiene que aprobar algo?"

> **"No a nosotros directamente. Somos software para decisiones de proceso — el cliente es quien gestiona compliance.**
>
> **Lo que SÍ hacemos: auditoría ALCOA+ exportable, weights congelables, change control traceable. Eso significa que cuando un cliente nuestro es auditado por FDA o EMA, nuestro software no lo quema — al contrario, le ahorra tiempo.**
>
> **Annex 22 en 2026 va a obligar a todos los vendors a ofrecer frozen-mode. Nosotros nacimos así."**

---

#### Q35 · "¿Qué pasa en Colombia con INVIMA?"

> **"INVIMA regula producto farmacéutico final, no herramientas de desarrollo. Un lab colombiano que usa BioSync no necesita aprobación INVIMA para usar el software.**
>
> **Pero si el cliente quiere producir un suplemento vitamínico comercial en Colombia, INVIMA aprueba el producto. BioSync puede ayudar a que el dossier técnico sea más sólido — historial de procesos, trazabilidad. Eso es feature, no compliance propio."**

---

### I. La Guajira / impacto

#### Q36 · "La Guajira es un problema de seguridad alimentaria, no de biotecnología. ¿Cómo ayuda BioSync?"

> **"Tienes razón — La Guajira es un problema estructural: agua, logística, políticas públicas, cambio climático. Lo vi con mis propios ojos, por eso arrancó todo esto.**
>
> **Lo que BioSync puede hacer — en cinco a diez años — es bajar el costo marginal de producir vitaminas B12 y proteínas complementarias para suplementos nutricionales locales. Hoy Colombia importa esos insumos de Europa. Si un laboratorio en Barranquilla puede producir B12 a la décima parte del costo, los programas públicos de recuperación nutricional se vuelven financieramente sostenibles.**
>
> **No voy a parar la hambruna Wayuu sola. Pero puedo construir la herramienta que hace que el ingeniero que SÍ puede, pueda más rápido y más barato. Ese es el uno por ciento de la brújula."**

---

#### Q37 · "¿Tienen alianza con alguna ONG o entidad pública en La Guajira?"

> **"Hoy, no. Es una aspiración, no una alianza.**
>
> **Lo honesto: La Guajira es un anchor emocional — nos recuerda por qué arrancamos. No es un canal comercial. Primeros clientes serán laboratorios industriales y académicos con presupuesto, no ONGs de nutrición.**
>
> **Si BioSync llega a cien mil MRR, diez por ciento va a una alianza ICBF o UNICEF Colombia — financiamiento software gratis a laboratorios públicos. Eso lo comprometo por escrito en los docs legales."**

---

### J. Personal / emocional

#### Q38 · "¿Qué pasa si esto falla?"

> **"Volveré a consultoría en Analytics — tengo oferta abierta de dos empresas. No me voy a morir de hambre.**
>
> **Lo que SÍ pierdo: dos años de mi vida, el momentum que tengo ahora, y la posibilidad de hacer algo que importa.**
>
> **Por eso pido dinero: porque NO quiero que falle. Si este pitch sale bien, seguimos. Si sale mal, también seguimos — más lento, más doloroso, pero seguimos."**

---

#### Q39 · "¿Por qué tú? ¿Por qué no alguien con un PhD de Harvard?"

> **"Alguien con un PhD de Harvard está trabajando en Pfizer o en una startup de Boston con cincuenta millones en funding.**
>
> **Yo soy la persona que habla español, que creció en la región donde están mis clientes, que perdió batches yo misma cuando tenía veintitrés años, y que puede llamar a un fermentation engineer en Buenos Aires a las nueve de la mañana sin traductor.**
>
> **El PhD de Harvard no va a construir BioSync LATAM. Va a construir otra cosa, en Boston, con otros clientes. Acá el domain expertise + geografía + urgencia vive en mí y en Justin."**

---

#### Q40 · "Si le doy los $500K pero me dice que va a trabajar 40 horas a la semana, no le creo."

> **"Trabajo sesenta. Justin trabaja sesenta. Eso es lo que trabajamos los últimos dieciocho meses sin capital.**
>
> **Con capital: contrato el ML engineer, yo pongo sesenta en producto y ventas, Justin sesenta en producto y operaciones. Si voy a quemar salud, prefiero quemarla construyendo algo que importa que consultando para Coca-Cola."**

---

#### Q41 · "¿Qué te quita el sueño hoy?"

> **"Que el paywall lance y nadie pague.**
>
> **Llevo dieciocho meses construyendo esto. Cuarenta y siete personas están en la waitlist. Cinco dijeron que sí verbalmente. Pero el 'sí' verbal y el click en 'pagar' son dos cosas distintas.**
>
> **La respuesta a ese miedo es hablar con ellos uno por uno antes del paywall — cosa que estoy haciendo. Pero no te miento: ese es el miedo."**

---

#### Q42 · "¿Qué te hace seguir?"

> **"Que un ingeniero de Sartorius me escribió el mes pasado por LinkedIn diciéndome 'esto hace falta'. Que una bióloga en UNAM me mandó un audio llorando porque tenía un batch fallando por tercera vez y no sabía qué hacer.**
>
> **No es abstracto. Son personas, con nombre, que me hablan. Si yo paro de construir esto, ellas siguen con el mismo problema. Eso me basta."**

---

## Reglas de comportamiento en Q&A

1. **Contacto visual** con quien preguntó (no mirar al techo buscando respuestas).
2. **Pausa 2 seg** antes de contestar. Demuestra procesamiento, no ensayo.
3. **"Gracias por la pregunta" solo una vez por ronda**, no cada vez (suena servil).
4. **Si no sabés: admitir + promete follow-up + volver a un hecho defendible.**
5. **No interrumpir al juez.** Dejarlo terminar aunque haga una pregunta de 30 seg.
6. **Nunca decir "eso es fácil" o "buena pregunta" como relleno.**
7. **"Te prometo"** se usa solo 2-3 veces en total. Más pierde peso.

---

## Frases emergency (si te pierdes en la respuesta)

- *"Déjame responderte desde otro ángulo: lo que sí puedo defender con evidencia es [hecho hedgeado]."*
- *"Esa es una dimensión que estamos validando con el piloto de Q3. Hoy no puedo prometerte un número."*
- *"Honestamente no tengo ese dato acá. Te lo mando por email esta noche. ¿Cuál es tu mejor correo?"*

**Nunca: "pregunta siguiente, por favor" (evasivo). Siempre: admitir + siguiente.**

---

## Top 15 a memorizar primero (orden de probabilidad)

Si sólo tenés tiempo para 15, memoriza estas en este orden:

1. **Q16** Tamaño de mercado (no podés decir "no sé").
2. **Q11** Distribución 70/25/5 del ask.
3. **Q6a** Quién paga hoy / cero pagadores.
4. **Q18** Empresa constituida (no "en proceso").
5. **Q19** Equity split socios.
6. **Q17** Visión Tesla + 1% brújula.
7. **Q14** Adquisición clientes.
8. **Q12** Por qué AHORA.
9. **Q13** Problema + cómo lo saben.
10. **Q15** Validación producto.
11. **Q7** Sartorius no adquiere.
12. **Q26** Valuation + dilución.
13. **Q25** Runway + burn.
14. **Q33** Network effects (Uber/Facebook).
15. **Q38** Si falla.

El resto — Q1–Q5 científicas, Q21–Q23 competencia, Q29–Q32 tech, Q34–Q37 regulación/impacto, Q39–Q42 personal — tenerlas leídas pero no de memoria. Leer en voz alta dos veces esta noche, basta.
