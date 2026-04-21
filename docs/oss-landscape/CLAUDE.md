# Landscape OSS — Apalancamiento de código abierto

Mapa de 18 repos OSS (multi-idioma: EN, ES-Colombia/Argentina, PT-Brasil, DE-Jülich, FR-EPFL) para acelerar el desarrollo de BioSync Studio sin reinventar la rueda.

Reporte detallado (con estrellas, commits recientes, licencias): `../research/oss-landscape.md`.

## Licencias

- **12/18 permisivas** (MIT/Apache/BSD) — compatibles con modelo comercial.
- **4 GPL** (cobrapy, CADET, DWSIM, iBioSim) — aislar como servicios o microservicios, no compilar-linkar.
- Validar siempre licencia antes de forkear.

## Apalancables directos (9 repos — fork o integrar)

| Repo | Para qué | Licencia |
|------|----------|----------|
| [Pioreactor](https://github.com/Pioreactor/pioreactor) | Hardware + software de biorreactor DIY, release 26.4.x activo | MIT |
| [PyLabRobot](https://github.com/PyLabRobot/pylabrobot) | Hardware-agnostic lab automation — elimina vendor lock-in (Hamilton/Tecan/Opentrons) | MIT |
| [Flower](https://github.com/flwrlabs/flower) | Federated learning (5k stars) — core para la Red de Bio-Conocimiento | Apache 2.0 |
| [cobrapy](https://github.com/opencobra/cobrapy) | Metabolic flux analysis — simulación de rutas metabólicas | LGPL (aislar) |
| [Opentrons](https://github.com/Opentrons/opentrons) | Robots de pipeteo — integración para labs pequeños | Apache 2.0 |
| [pytfa](https://github.com/EPFL-LCSB/pytfa) | Thermodynamics flux analysis | Apache 2.0 |
| [fermentation-mpc](https://github.com/biosustain/fermentation-mpc) | Model Predictive Control académicamente probado | MIT |
| [Stiff-PINN](https://github.com/DENG-MIT/Stiff-PINN) | PINN para ODEs stiff — semilla del gemelo digital | MIT |
| [GAFerm](https://github.com/juanmggb/GAFerm) | Genetic algorithm para fermentación | MIT |

## Inspiración (UX/patterns, no código)

- **NREL BiRD** (CFD biorreactores)
- **Raissi PINN** (canonical implementation)
- **DWSIM** (UX de process simulation, comunidad PT-Brasil)
- **iBioSim** (synbio CAD)
- **CesarGarech/Biocontrol** (contenido didáctico ES)

## Ecosistemas/comunidades a seguir

- **opencobra** — toda la comunidad metabolic modeling
- **biosustain** (DTU Dinamarca) — fermentation benchmarks
- **EPFL-LCSB** — flux analysis
- **NREL** — CFD + digital twin
- **CABBIO/LATAM** — redes biotec LATAM
- **Flower Labs** — federated learning

## Gaps de OSS (oportunidad para BioSync)

1. **Federated learning biotech-específico**: hay Flower (genérico) + FL4Health (salud) — ninguno biomanufacturing. BioSync puede ser el referente.
2. **Poca presencia OSS en JP/ZH**: Sartorius y otros proveedores dominan con software cerrado en Asia.
3. **Integración Hamilton/Tecan**: mejor via **PyLabRobot** que forkeando código propietario.

## Top 3 acciones recomendadas

1. **Fork Pioreactor + PyLabRobot + Flower** como stack base (hardware + automation + federación).
2. **Añadir cobrapy, pytfa, opentrons** como dependencias Python del backend cuando haga cómputo metabolic.
3. **Usar Stiff-PINN + fermentation-mpc** como semilla del simulador/gemelo digital — ambos académicamente probados.

## Cómo usar este doc

- Antes de escribir un algoritmo nuevo de bioprocesos, **busca aquí primero**. El 80% de la ciencia dura ya está implementada.
- Mantener la lista viva: añadir/mover repos cada trimestre cuando cambie estado (activo → archivado).
- Si forkeamos, documentar en un archivo propio del repo forkeado qué le añadimos y por qué — facilita contribuir upstream.
