# 🔬 BioSync Studio

**El cerebro digital de la biofabricación**

Plataforma de inteligencia artificial que optimiza bioprocesos en tiempo real con monitoreo continuo, predicción ML, y una red global de conocimiento para que ningún laboratorio empiece de cero.

---

## Descripción

BioSync Studio es una aplicación web SaaS diseñada para pequeños y medianos laboratorios de biofabricación. Simula una plataforma real de monitoreo de biorreactores, predicciones de rendimiento con machine learning, gemelos digitales y una red global de bio-conocimiento.

**Objetivo:** Democratizar la inteligencia artificial para bioprocesos — llevar la tecnología de Pfizer ($500K+) al alcance de cualquier laboratorio desde $99/mes.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + Vite |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Gráficas | Recharts |
| Animaciones | Framer Motion |
| Routing | Wouter |
| Monorepo | pnpm Workspaces |
| Node.js | v24 |

---

## Estructura del proyecto

```
artifacts/
├── biosync-studio/          # App principal (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Inicio.tsx           # Página de inicio / landing
│   │   │   ├── Dashboard.tsx        # Monitor de biorreactor en tiempo real
│   │   │   ├── RedConocimiento.tsx  # Red global de protocolos
│   │   │   ├── Simulador.tsx        # Simulador de bioprocesos (gemelo digital)
│   │   │   └── Asistente.tsx        # Chatbot experto en bioprocesos
│   │   ├── App.tsx                  # Layout principal + sidebar + routing
│   │   └── index.css                # Tema y variables de diseño
│   ├── package.json
│   └── vite.config.ts
└── api-server/              # Servidor Express (backend base)
```

---

## Páginas y funcionalidades

### 🏠 Inicio (`/`)
Página de bienvenida con:
- Hero con imagen de laboratorio y overlay teal
- Sección comparativa "Laboratorio HOY vs con BioSync"
- Catálogo de 6 productos biofabricables (vitaminas, proteínas, pigmentos, enzimas, bioplásticos, aromas)
- Métricas clave: 10x reducción de costos, 3-30x menos experimentos, 2,880x más datos, $99 precio starter
- Pasos de funcionamiento (Conecta → Aprende → Optimiza)
- Referencias científicas y footer

### 📊 Dashboard de Biorreactor (`/dashboard`)
Monitor en tiempo real con datos simulados de un cultivo de *E. coli* para producción de Vitamina B12:
- 4 métricas en vivo: pH, O₂ disuelto, temperatura, rendimiento predicho
- 5 gráficas de series temporales (72 horas): pH, DO, temperatura, glucosa, densidad celular OD600
- Curvas generadas con ruido realista y cinética bacteriana simulada
- Panel de recomendaciones de IA con alertas codificadas por colores (alerta, optimización, estado, predicción, comparación)
- Detalles del modelo ML (Gradient Boosting + PINN, R²=0.89)
- Sliders de setpoints interactivos con recálculo dinámico de eficiencia

### 🌐 Red de Bio-Conocimiento (`/red`)
Red global de protocolos optimizados:
- Estadísticas: 234 protocolos, 89 laboratorios, 18 países
- Búsqueda en tiempo real por texto libre
- Filtros por categoría: Vitaminas, Proteínas, Enzimas, Pigmentos, Bioplásticos
- 8 tarjetas de protocolos reales (Colombia, Brasil, México, Israel, Suiza, Argentina, Dinamarca)
- Explicación del aprendizaje federado

### 🧪 Simulador de Bioprocesos (`/simulador`)
Gemelo digital interactivo:
- Selección de 8 organismos (E. coli, B. subtilis, S. cerevisiae, L. plantarum, P. pastoris, C. glutamicum, C. necator)
- Productos dinámicos según organismo seleccionado
- Configuración de volumen (250 mL a 500 L), medio de cultivo, temperatura, pH, DO, duración
- Animación de carga por fases (Monod kinetics simulation)
- Curvas de simulación: biomasa, sustrato y producto
- Resultados predichos: rendimiento, productividad, conversión, tiempo óptimo
- Sugerencias de optimización de IA por parámetro
- Estimación de costos con comparativa BioSync (ahorro 10x)
- Protocolo paso a paso descargable

### 💬 Asistente BioSync (`/asistente`)
Chatbot experto en bioprocesos disponible 24/7:
- 6 preguntas sugeridas como acceso rápido
- Respuestas basadas en keywords: pH, rendimiento, scale-up, costos, sensores, B12, organismos, plataforma
- Respuestas con referencias a literatura científica (Nature, Biotechnology & Bioengineering, bioRxiv)
- Interfaz de chat estilo mensajería con timestamps

---

## Sistema de diseño

| Elemento | Valor |
|---------|-------|
| Fondo principal | `#06191A` |
| Fondo secundario | `#0A2E2E` |
| Color primario (teal) | `#0D4F4F` |
| Acento cian | `#00E5CC` |
| Tipografía | `system-ui, -apple-system, sans-serif` |
| Estética | "Mission control" — NASA para biología |
| Cards | Glassmorphism con bordes cian semi-transparentes |
| Idioma | Español (100%) |

---

## Cómo ejecutar localmente

### Requisitos
- Node.js v24+
- pnpm v9+

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd workspace

# Instalar dependencias
pnpm install
```

### Desarrollo

```bash
# Iniciar la app BioSync Studio
pnpm --filter @workspace/biosync-studio run dev

# Iniciar el servidor API (opcional)
pnpm --filter @workspace/api-server run dev
```

La aplicación estará disponible en `http://localhost:<PORT>/`

### Build de producción

```bash
pnpm --filter @workspace/biosync-studio run build
```

---

## Datos simulados

Toda la data del biorreactor es generada en tiempo real con JavaScript usando:

- **Cinética bacteriana realista** — curvas sigmoidales para OD600, decaimiento exponencial para glucosa
- **Ruido gaussiano** — `Math.random()` con distribución normal aproximada para realismo
- **Modelo Monod simplificado** — para el simulador de bioprocesos
- **Sin APIs externas** — toda la generación de datos es del lado del cliente

---

## Ciencia detrás del proyecto

BioSync Studio está inspirado en investigación real:

- **Pfizer MI Edge** (AWS) — Plataforma interna de IA para bioprocesos
- **Algocell** — Software de optimización de bioprocesos
- **Proyecto BALANCE** (Canadá-UK, $2M, 2025) — Escalado de bioprocesos
- **bioRxiv 2024** — Reducción 3-30x en experimentos con ML
- **Biotechnology & Bioengineering** — Rangos óptimos de pH por organismo
- **Nature / Science** — Producción microbiana de vitaminas y proteínas recombinantes

---

## Productos biofabricables soportados

| Categoría | Ejemplos |
|-----------|---------|
| Vitaminas | B12, B2 (riboflavina), ácido fólico |
| Proteínas recombinantes | Insulina, GFP, colágeno |
| Pigmentos naturales | Astaxantina, betacaroteno |
| Enzimas industriales | Amilasa, lipasa, proteasa |
| Bioplásticos | PHB, PHA, PLA |
| Aromas y fragancias | Vanilina biosintética |
| Ácidos orgánicos | Ácido láctico, succínico |
| Aminoácidos | L-lisina, L-glutamato, L-treonina |

---

## Organismos soportados en el simulador

- *Escherichia coli* K-12
- *Escherichia coli* BL21 (DE3)
- *Bacillus subtilis*
- *Saccharomyces cerevisiae*
- *Lactobacillus plantarum*
- *Pichia pastoris*
- *Corynebacterium glutamicum*
- *Cupriavidus necator*

---

## Licencia

MIT — Proyecto desarrollado para Red Bull Basement.

**BioSync Studio © 2026 | Democratizando la biofabricación mundial**
