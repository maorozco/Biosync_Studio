# BioSync Studio - OSS Landscape: Bioprocess / Bioreactor / Digital Twin

**Fecha:** 2026-04-18
**Autor:** Justin Diaz (justinalejandro369@gmail.com)
**Alcance:** Repos activos en GitHub/GitLab/Codeberg sobre bioprocesos, biorreactores, digital twins, simulacion cinetica, flujo metabolico, IoT de laboratorio, federated learning y automatizacion. Busqueda multi-idioma (EN/ES/PT/DE/JP/ZH).

---

## Inventario de repositorios (18)

### 1. Pioreactor / pioreactor
- **URL:** https://github.com/Pioreactor/pioreactor
- **Idioma/Pais:** Python, EN, Canada
- **Estado:** Muy activo (release 26.4.x en abril 2026), ~500 stars
- **Licencia:** MIT
- **Que resuelve:** Plataforma HW+SW de biorreactor de bajo costo sobre Raspberry Pi: control OD, temperatura, stirring, dosificacion, web UI.
- **Valor BioSync:** **Fork directo**. Base HW/SW ideal para nuestros nodos fisicos. Integrar su web UI (`pioreactorui`) como referencia para dashboards.

### 2. opencobra / cobrapy
- **URL:** https://github.com/opencobra/cobrapy
- **Idioma/Pais:** Python, EN, comunidad internacional
- **Estado:** Muy activo, ~900 stars, commits mensuales
- **Licencia:** LGPL/GPL-compatible (GPL v2)
- **Que resuelve:** Constraint-based modeling de redes metabolicas (FBA, FVA, gene deletion) en Python.
- **Valor BioSync:** **Integracion directa** como dependencia para modulo de analisis metabolico. Ecosistema con SBML/JSON interop.

### 3. Opentrons / opentrons
- **URL:** https://github.com/Opentrons/opentrons
- **Idioma/Pais:** Python/TS, EN, USA
- **Estado:** Muy activo, ~470 stars, commits diarios
- **Licencia:** Apache 2.0
- **Que resuelve:** SW para programar protocolos en OT-2/Flex (liquid handling, PCR, cultivo).
- **Valor BioSync:** **Integracion directa** via Python API. Conector para labs que ya usan OT-2.

### 4. PyLabRobot / pylabrobot
- **URL:** https://github.com/PyLabRobot/pylabrobot
- **Idioma/Pais:** Python, EN, USA/NL
- **Estado:** Activo, ~350 stars
- **Licencia:** MIT
- **Que resuelve:** SDK hardware-agnostic para Hamilton STAR, Tecan EVO, Opentrons OT-2 con mismo codigo.
- **Valor BioSync:** **Fork/adaptar**. Elimina vendor lock-in - clave para estrategia multi-hardware de BioSync.

### 5. flwrlabs / flower
- **URL:** https://github.com/flwrlabs/flower
- **Idioma/Pais:** Python, EN, DE/UK
- **Estado:** Muy activo, ~5k stars
- **Licencia:** Apache 2.0
- **Que resuelve:** Framework de federated learning agnostico (PyTorch, TF, sklearn, JAX).
- **Valor BioSync:** **Integracion directa** para labs distribuidos con datos sensibles. Base de nuestra capa federada.

### 6. VectorInstitute / FL4Health
- **URL:** https://github.com/VectorInstitute/FL4Health
- **Idioma/Pais:** Python, EN, Canada
- **Estado:** Activo, ~150 stars
- **Licencia:** Apache 2.0
- **Que resuelve:** Capa sobre Flower con patrones especificos para salud (privacy, heterogeneidad).
- **Valor BioSync:** **Inspiracion + fork parcial**. Patterns de compliance aplicables a biotech.

### 7. EPFL-LCSB / pytfa
- **URL:** https://github.com/EPFL-LCSB/pytfa
- **Idioma/Pais:** Python, EN/FR, Suiza (EPFL)
- **Estado:** Mantenido, ~60 stars
- **Licencia:** Apache 2.0
- **Que resuelve:** Thermodynamics-based Flux Analysis sobre COBRApy con datos metabolomicos.
- **Valor BioSync:** **Integracion** para modulo avanzado de analisis termodinamico.

### 8. biosustain / fermentation-mpc
- **URL:** https://github.com/biosustain/fermentation-mpc
- **Idioma/Pais:** Python, EN, Dinamarca (DTU)
- **Estado:** Mantenido (academico)
- **Licencia:** MIT/Apache (verificar)
- **Que resuelve:** Model Predictive Control para fermentaciones fed-batch con balances de masa.
- **Valor BioSync:** **Fork** como base de modulo MPC. Respaldo academico solido.

### 9. NREL / BioReactorDesign (BiRD)
- **URL:** https://github.com/NREL/BioReactorDesign
- **Idioma/Pais:** Python/OpenFOAM, EN, USA (NREL)
- **Estado:** Activo
- **Licencia:** BSD-3
- **Que resuelve:** Toolbox CFD de simulacion de disenos de biorreactor en OpenFOAM.
- **Valor BioSync:** **Inspiracion + integracion** para digital twin de alta fidelidad (CFD).

### 10. cadet / CADET
- **URL:** https://github.com/cadet
- **Idioma/Pais:** C++/Python, EN, Alemania (Forschungszentrum Julich)
- **Estado:** Muy activo
- **Licencia:** GPL-3
- **Que resuelve:** Modelado de procesos cromatograficos y bioprocesos con calibracion, optimizacion, UQ.
- **Valor BioSync:** **Integracion** para downstream processing.

### 11. maziarraissi / PINNs
- **URL:** https://github.com/maziarraissi/PINNs
- **Idioma/Pais:** Python, EN, USA
- **Estado:** Referencia canonica (~9k stars)
- **Licencia:** MIT
- **Que resuelve:** Implementacion fundacional de Physics-Informed Neural Networks.
- **Valor BioSync:** **Inspiracion** para PINN de cinetica Monod/Logistic hibrida.

### 12. DENG-MIT / Stiff-PINN
- **URL:** https://github.com/DENG-MIT/Stiff-PINN
- **Idioma/Pais:** Python, EN, USA (MIT)
- **Estado:** Mantenido
- **Licencia:** MIT
- **Que resuelve:** PINN para cineticas quimicas stiff (ODEs rigidas).
- **Valor BioSync:** **Fork** - las ODEs de biorreactor son stiff. Directamente aplicable.

### 13. DrCod / bioreactor-modelling
- **URL:** https://github.com/DrCod/bioreactor-modelling
- **Idioma/Pais:** Python, EN
- **Estado:** Referencia
- **Licencia:** MIT
- **Que resuelve:** Fed-batch bioreactor modeling con redes neuronales + Tellurium.
- **Valor BioSync:** **Inspiracion** para arquitectura hibrida mecanicista+ML.

### 14. juanmggb / GAFerm
- **URL:** https://github.com/juanmggb/GAFerm
- **Idioma/Pais:** Python/R Shiny, ES, Colombia/LATAM
- **Estado:** Activo
- **Licencia:** MIT
- **Que resuelve:** App Shiny con 6+ modelos cineticos de crecimiento y algoritmos geneticos para optimizar fed-batch.
- **Valor BioSync:** **Fork + inspiracion UX**. Repo hispanohablante, comunidad LATAM, buena UX.

### 15. CesarGarech / Biocontrol_modeling_project
- **URL:** https://github.com/CesarGarech/Biocontrol_modeling_project
- **Idioma/Pais:** Python/Jupyter, ES, Argentina (CABBIO)
- **Estado:** Activo
- **Licencia:** MIT (verificar)
- **Que resuelve:** Material didactico de modelado y control de bioprocesos (Batch, Fed-Batch, Continuo) con fermentacion alcoholica.
- **Valor BioSync:** **Inspiracion** - didactica ideal para onboarding. Comunidad CABBIO clave en LATAM.

### 16. HarveyBates / Phenobottle
- **URL:** https://github.com/HarveyBates/Phenobottle
- **Idioma/Pais:** Python/C++, EN, Australia
- **Estado:** Mantenido
- **Licencia:** MIT
- **Que resuelve:** Fotobiorreactor open-source basado en Raspberry Pi para microalgas.
- **Valor BioSync:** **Fork** si entramos a segmento algas/fotosintesis.

### 17. DanWBR / dwsim
- **URL:** https://github.com/DanWBR/dwsim
- **Idioma/Pais:** VB.NET/C#, EN/PT, Brasil
- **Estado:** Muy activo
- **Licencia:** GPL-3
- **Que resuelve:** Simulador de procesos quimicos steady-state y dinamico, CAPE-OPEN, soporta fermentacion.
- **Valor BioSync:** **Inspiracion + integracion** via `dwsimopt` (Python). Referente lusofono.

### 18. MyersResearchGroup / iBioSim
- **URL:** https://github.com/MyersResearchGroup/iBioSim
- **Idioma/Pais:** Java, EN, USA
- **Estado:** Mantenido
- **Licencia:** Apache 2.0
- **Que resuelve:** CAD para circuitos geneticos (SBML/SBOL).
- **Valor BioSync:** **Inspiracion** para modulo de diseno synbio.

---

## Agrupacion estrategica

### A) Apalancables directamente (fork / integracion)
1. **Pioreactor** - HW/SW de biorreactor completo (MIT)
2. **cobrapy** - analisis metabolico
3. **Opentrons** - liquid handling
4. **PyLabRobot** - abstraccion multi-vendor
5. **Flower + FL4Health** - federated learning
6. **pytfa** - analisis termodinamico
7. **fermentation-mpc** - MPC base
8. **Stiff-PINN** - PINN para ODEs stiff
9. **GAFerm** - modelos cineticos + optimizacion

### B) Fuentes de inspiracion (patterns, UX, arquitectura)
10. **NREL/BiRD** - CFD digital twin
11. **maziarraissi/PINNs** - framework PINN canonico
12. **DrCod/bioreactor-modelling** - hibrido ML+mecanicista
13. **CesarGarech** - didactica bioprocesos (ES)
14. **DWSIM** - UX de simulador industrial
15. **iBioSim** - CAD synbio

### C) Comunidades / ecosistemas a seguir
- **opencobra** (org): cobrapy, memote, cobra.jl - estandar metabolico global
- **biosustain** (DTU, DK): fermentation-mpc, multitfa - bioprocesos industriales
- **EPFL-LCSB** (CH): pytfa, etfl - termodinamica
- **NREL** (USA): BiRD + biorefinery tools - energia/biocombustibles
- **Opentrons + PyLabRobot**: estandar de-facto de lab automation
- **Pioreactor forum**: DIY biohackers / educacion
- **CABBIO / LATAM (CesarGarech, juanmggb)**: comunidad hispanohablante
- **awesome-synthetic-biology**, **awesome-pinns**: listas curadas
- **Flower Labs (Berlin/UK)**: federated AI en produccion

---

## Recomendaciones de accion (prioridad)

1. **Fork inmediato:** Pioreactor (HW), PyLabRobot (automation), Flower (federacion)
2. **Dependencia en pyproject:** cobrapy, pytfa, opentrons
3. **Adaptacion:** Stiff-PINN + fermentation-mpc como base del gemelo digital
4. **Engagement:** contribuir en cobrapy + PyLabRobot (visibilidad tecnica)
5. **Watch list:** NREL/BiRD (CFD), DWSIM (mercado LATAM/PT)

**Nota de licencias:** 12/18 son MIT/Apache/BSD (permisivas, compatibles con modelo comercial). 4 son GPL (cobrapy, CADET, DWSIM, iBioSim) - requieren aislamiento como servicios separados para no contaminar nucleo propietario.
