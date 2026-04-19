# Q&A Cheatsheet — Pitch T-0 2026-04-22

> **Uso:** memorizar las 10 respuestas. Practicar cada una en ≤45 seg durante el drill T-1.
>
> **Principio:** admitir + prometer + volver al hecho defendible. Nunca inventar. Nunca overclaim. Anchor verbal: *"Te prometo que..."*.

---

## Las 5 BOMBAS del audit científico (prioridad 1)

### Q1 · "Ustedes dicen 'alerta de deriva en <60 minutos'. ¿Con qué cadencia de sensor? ¿Han validado con data real?"

**[Tipo: juez PhD técnico]**

> **"Excelente pregunta. Te prometo precisión:
>
> La alerta en <60 minutos requiere data de pH, DO y temperatura en tiempo real con cadencia menor a 5 minutos.
>
> En data mock validamos <60 min. En data de cliente la latencia real depende del hardware — un biorreactor con sensores legacy que reporta cada hora va a tener latencia de una hora más los cálculos nuestros.
>
> Lo que no prometemos: detectar deriva en un biorreactor que solo se mide manualmente una vez al día. Para ese caso la promesa cambia a 'pronóstico de fin de semana', no 'alerta de 60 min'."**

---

### Q2 · "Su IA usa Gradient Boosting + PINN. ¿Cuántos batches necesita para funcionar? ¿Han hecho cross-validation?"

**[Tipo: juez ML engineer]**

> **"Gradient Boosting funciona bien con al menos veinte batches etiquetados por organismo.
>
> Debajo de veinte — que es donde viven la mayoría de labs pequeños — usamos Bayesian optimization más transfer learning. Hay un paper de bioRxiv 2024 que muestra 3 a 30 veces menos experimentos para llegar al óptimo con este enfoque.
>
> PINN lo usamos como capa de recomendación, no como modelo primario. El loss-weighting de PINN puede enmascarar simplificaciones — un paper de 2025 lo documenta. No prometemos que PINN reemplaza tu Monod; prometemos que sugiere experimentos mejores.
>
> Cross-validation: en riboflavina con *B. subtilis* predecimos yield con 8% RMSE en 10 runs de test. Con el próximo cliente arranco a acumular data real."**

---

### Q3 · "Su claim de 'Annex 22-ready frozen-mode' — eso no es término oficial en el draft. ¿Están sobre-interpretando?"

**[Tipo: juez regulatorio / compliance]**

> **"Tienes razón — 'frozen-mode' es coinage informal de la industria, no aparece literal en el draft de julio 2025.
>
> Lo que sí dice el draft es: **'adaptive and generative models are explicitly prohibited in GMP-critical decisions'**. La frase está citada textual en la documentación de Epista y en el mismo PDF de la EMA.
>
> Nuestra interpretación — que el mercado empieza a adoptar — es que necesitas: modelo con weights fijos, audit trail ALCOA+, re-train off-production.
>
> Si la regla final de Q2 2026 dice otra cosa, adaptamos en semanas. No es un moat permanente — es una ventaja de posicionamiento de 18 meses pre-enforcement. Lo que sí es cierto es que los vendors que pre-anunciaron 'agentic AI' — como Aizon en octubre — chocan frontal con el draft."**

---

### Q4 · "BioCycle dice 'in-situ degradación de plásticos'. ¿Cómo lo hacen sin Carbios-scale bioreactor?"

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

### Q5 · "Su 'federated biomanufacturing' — ¿no existe MELLODDY de Novartis?"

**[Tipo: juez investor con memoria larga]**

> **"MELLODDY es federated **drug discovery** — liderado por Novartis, 2021 a 2024. Es química farmacéutica, no procesos de fermentación.
>
> He revisado los tres candidatos: MELLODDY (drug discovery), Owkin (clínica), y MIT Initiative for New Manufacturing (manufactura genérica, no FL específico).
>
> Ninguno hace federated learning entre biorreactores en plantas distintas. La razón estructural: drug discovery tiene IP química unificable en SMILES. Biomanufacturing tiene IP heterogénea — cada cepa, cada medio, cada reactor es único.
>
> Nosotros estamos resolviendo ese 'schema federation problem'. No sé si vamos a ganar — sé que somos los primeros en intentarlo con el stack comercial, sobre Flower 1.29. Si descubres otro proyecto, dímelo, lo agrego al research."**

---

## 5 BOMBAS operacionales (prioridad 2)

### Q6 · "¿Quién paga $99/mes hoy? ¿Tienen clientes?"

> **"Hoy, cero pagadores. Cuarenta y siete en la lista de espera, doce con call agendado, cinco ya dijeron 'yes' verbal al beta.
>
> No voy a inflar números. Somos pre-revenue. Lo que te ofrezco es exactamente lo que estás buscando acá: **plataforma construida, demanda validada vía waitlist, ausencia de revenue pagado — porque NO hemos lanzado el paywall todavía.**
>
> El lanzamiento es esta semana. Tendré los primeros ACH en los próximos 15 días."**

### Q6 · "¿Quién paga BioCycle?"

> **"Tres conversaciones abiertas con operadores de residuos en Bogotá. Cero contratos firmados.
>
> BioCycle es MVP de dos semanas — literal, hoy te estoy mostrando la plataforma porque **quiero que seas el primero en validarla conmigo**.
>
> Te prometo que en junio tengo piloto firmado con CGR Doña Juana o vuelvo acá y lo reconozco sin excusa."**

### Q7 · "¿Por qué no la adquiere Sartorius mañana?"

> **"Porque Sartorius vende a top-20 pharma con contratos de 7 cifras. Nuestro ICP — labs de 2 a 15 personas con presupuesto menor a 20 mil al año — es un segmento que Sartorius no atiende y no le interesa. La teoría de disrupción de Christensen en vivo.
>
> Además: nuestro precio de 99 dólares no canibaliza su negocio. Los canibaliza cuando subamos a tier empresarial — en tres años, con product-market fit demostrado."**

### Q8 · "¿Cómo se diferencian de Algocell, Invert, Basetwo?"

> **"Los tres son enterprise, quote-based, 50 mil a 250 mil al año. Funcionan bien para Series B+.
>
> Nuestro lane es SMB biotech, LATAM-first. Precio público. Onboarding self-serve en días, no meses.
>
> No competimos en Boston con un lab de 150 personas que ya tiene Algocell. Competimos en Rosario con un lab de 9 personas que hoy usa Excel. Eso es mercado 10× más grande en cantidad de labs, 10× más chico en ACV. Algocell no lo va a atacar."**

### Q9 · "El equipo es solo usted. ¿Cómo va a construir esto sola?"

> **"Solo yo, sí. Cinco años de ciencia de datos + investigación biológica, trabajando con Justin en implementación.
>
> Los primeros 500 mil son exactamente para resolver esto: contratar un ML engineer senior y un sales engineer LATAM. Runway de 12 meses.
>
> Si el jurado piensa que el equipo es débil — coinvirtamos con un co-founder técnico y arranco el día uno con equipo. Estoy abierta a eso."**

### Q10 · "¿Y si la regulación Annex 22 se suaviza?"

> **"Pierdo una parte del moat, no todo.
>
> Los otros dos elementos del moat — precio público y LATAM-native — son estructurales, no regulatorios.
>
> Si Annex 22 se suaviza, mi narrativa cambia a 'cumplimos AUNQUE no sea obligatorio' — lo cual sigue siendo señal de seriedad para clientes GMP aspiracionales."**

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
