# Tendencias 2026–2030 — Roadmap long-term

Reporte detallado: `../research/future-trends.md` (950 palabras, URLs por tema).

## Señales de mercado (números duros)

| Categoría | 2024 | 2029–2030 | CAGR |
|-----------|------|-----------|------|
| Synthetic Biology | $12.3B | $31.5B | 20.6% |
| Digital twins biotech | $3.1B | $48B (2026) | — |
| Wearable biosensors | — | $74.8B (2035) | — |
| LATAM ag-biotech VC | baseline 2020 | +2,000% a 2024 | — |

## Milestone regulatorio crítico

**EMA Annex 22 adoptado 2026** — para GMP permite sólo IA **estática/determinista**; adaptiva/generativa **prohibida explícitamente**. FDA + EMA publicaron 10 principios GxP-AI conjuntos enero 2026.

> **Implicación para BioSync:** features ML deben ser **congelables** en un snapshot certificable. Mantener modo "frozen mode" para clientes GMP — separado del modo "live learning" para clientes de R&D.

## Breakthroughs técnicos

- **RFdiffusion2**: resuelve 41/41 benchmarks de diseño de enzimas (vs 16/41 previo).
- **RFdiffusion3**: ~10× más rápido, la mitad de parámetros que AlphaFold3.
- → **Diseño de enzimas es problema semi-resuelto**. Cuello de botella se movió a **validación en wet-lab** — oportunidad para una plataforma SaaS que orqueste el ciclo completo.

## Whitespace para BioSync

1. **No hay vendor SaaS de bioprocesos LATAM-native**.
2. **SMB digital twins** (<$50K/año) están desatendidos — Siemens/Merck sólo target enterprise.
3. **Federated biomanufacturing** (vs federated drug discovery) es **whitespace total**.
4. **Edge AI bioreactor kit** — Jetson Orin 2026 + multi-modal sensors bajo **$2K BOM** ya es viable.

## 5 big bets (3–5 años)

1. **GMP-ready Digital Twin OS** — certificable, con frozen-mode switch, multi-tenant.
2. **Federated Biomanufacturing Network** — red de labs compartiendo pesos de modelos, no data cruda.
3. **Edge AI Bioreactor Kit** — Jetson + sensores Raman low-cost + SDK para integrarlo a cualquier biorreactor.
4. **AI Enzyme Studio for LATAM biodiversity** — diseño de enzimas a partir de cepas nativas (café, cacao, pesca, biomas únicos).
5. **Sustainability-as-a-Service** — módulo para cuantificar LCA (life cycle assessment) y CO₂e por producto biofabricado, monetizable para certificaciones.

## 3 wild cards (bajos probabilidad, alto impacto)

1. **Cloud-lab commoditization** (Culture Bio/Emerald baja precio 10×) → BioSync pivotea a **agent orchestrator** sobre cloud labs de terceros.
2. **Adaptive-AI flip regulatorio post-2028** — si FDA/EMA permiten modelos que aprenden en prod con ciertos controles, BioSync lidera por tener arquitectura lista.
3. **Wearable humano → home fermentation D2C loop** — el nombre "BioSync" literal sugiere sincronización biológica humana. Conectar dispositivos wearable (Oura, Whoop) + fermentación casera de nutrientes a medida. Loco pero el nombre lo pide.

## Cómo usar este doc

- **Planning trimestral:** elegir 1 big bet a progresar; validar con clientes actuales + pipeline.
- **Due diligence de inversores:** usar las señales de mercado + whitespace como parte del pitch.
- **Compliance review:** Annex 22 se activa ya — cualquier feature ML en roadmap necesita snapshot/frozen mode arquitectónicamente.
- **Revisar cada 6 meses:** CAGRs, breakthroughs, y regulación cambian rápido en este dominio.
