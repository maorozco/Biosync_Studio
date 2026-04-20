import type { Citation } from "../lib/api";

interface Props {
  citations: Citation[];
  query?: string;
}

/**
 * Citation Graph — radial viz showing query as center + N citations in arc.
 * Line stroke-width = relevance score. Click = open URL nuevo tab.
 *
 * Single-responsibility, no deps new (pure SVG). ~150 líneas.
 */
export default function CitationGraph({ citations, query }: Props) {
  if (citations.length === 0) return null;

  const R = 80; // radius of citation nodes ring
  const W = 240;
  const H = 220;
  const cx = W / 2;
  const cy = H / 2;

  // Compute positions — distribute en arco superior (-120° to -60°) para mejor legibilidad
  const startAngle = -Math.PI * 0.85;
  const endAngle = -Math.PI * 0.15;
  const spread = endAngle - startAngle;

  const nodes = citations.slice(0, 5).map((c, i) => {
    const angle =
      citations.length === 1
        ? -Math.PI / 2
        : startAngle + (i / (citations.length - 1)) * spread;
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    return { citation: c, x, y, angle };
  });

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "rgba(4, 20, 30, 0.6)",
        border: "1px solid var(--bs-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--bs-border-subtle)" }}>
        <p className="text-xs font-semibold" style={{ color: "var(--bs-accent)" }}>
          🕸️ Grafo de citas · relevance = grosor de línea
        </p>
        <span className="bs-mono text-[10px]" style={{ color: "var(--bs-text-muted)" }}>
          {citations.length} fuentes
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ maxHeight: 240 }}
        role="img"
        aria-label={`Grafo de ${citations.length} citas`}
      >
        {/* Glow filter para el nodo central */}
        <defs>
          <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Lines desde central → cada cita */}
        {nodes.map(({ citation, x, y }, i) => {
          const strokeWidth = 1 + citation.similarity * 4;
          const opacity = 0.4 + citation.similarity * 0.6;
          return (
            <line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--bs-accent)"
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinecap="round"
            />
          );
        })}

        {/* Glow + central node (query) */}
        <circle
          cx={cx}
          cy={cy}
          r="22"
          fill="rgba(0, 229, 204, 0.15)"
          filter="url(#glow-teal)"
        />
        <circle
          cx={cx}
          cy={cy}
          r="16"
          fill="var(--bs-accent)"
          stroke="var(--bs-accent-hover)"
          strokeWidth="2"
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--bs-bg-1)"
        >
          ?
        </text>

        {/* Citation nodes */}
        {nodes.map(({ citation, x, y }, i) => (
          <g key={`node-${i}`}>
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <circle
                cx={x}
                cy={y}
                r="11"
                fill="rgba(10, 46, 46, 0.9)"
                stroke="var(--bs-accent)"
                strokeWidth="1.5"
                style={{ cursor: "pointer" }}
              >
                <title>
                  [{i + 1}] {citation.source_name} (sim {citation.similarity.toFixed(2)})
                </title>
              </circle>
              <text
                x={x}
                y={y + 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--bs-accent)"
                style={{ pointerEvents: "none" }}
              >
                {i + 1}
              </text>
            </a>
          </g>
        ))}

        {/* Query label bajo el centro */}
        {query && (
          <text
            x={cx}
            y={cy + 40}
            textAnchor="middle"
            fontSize="9"
            fill="var(--bs-text-muted)"
            style={{ pointerEvents: "none" }}
          >
            {query.length > 34 ? query.slice(0, 34) + "…" : query}
          </text>
        )}
      </svg>

      {/* Leyenda scroll de citas */}
      <div className="px-3 pb-3 pt-1 space-y-1">
        {nodes.map(({ citation }, i) => (
          <a
            key={`legend-${i}`}
            href={citation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs py-1 hover:bg-white/5 rounded px-1 transition-colors"
            style={{ color: "var(--bs-text-secondary)" }}
          >
            <span
              className="bs-mono w-4 text-center flex-shrink-0 font-bold"
              style={{ color: "var(--bs-accent)" }}
            >
              [{i + 1}]
            </span>
            <span className="flex-1 truncate">{citation.source_name}</span>
            <span
              className="bs-mono text-[10px] flex-shrink-0"
              style={{ color: "var(--bs-text-muted)" }}
            >
              sim {citation.similarity.toFixed(2)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
