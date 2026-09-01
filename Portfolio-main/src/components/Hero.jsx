import { hero } from "../data.js";
import { ArrowRightIcon } from "./icons.jsx";

/* Wire paths for the 560x330 pipeline canvas: two inputs converge on the
   agent node, which fans out to two outputs. `d2`/`d3` stagger the flow. */
const WIRES = [
  { d: "M120 62 C 200 62, 210 132, 268 148", delay: "" },
  { d: "M120 268 C 200 268, 210 186, 268 168", delay: "d2" },
  { d: "M348 158 C 410 158, 420 84, 462 74", delay: "d3" },
  { d: "M348 158 C 410 158, 420 236, 462 248", delay: "" },
];

export default function Hero() {
  return (
    <section className="hc" id="home">
      <div className="hc-glow" aria-hidden="true" />
      <div className="hc-gridbg" aria-hidden="true" />

      <div className="container">
        <div className="hc-body">
          <div className="hc-copy fade-up">
            <span className="hx-eyebrow">
              <span className="hx-dot" aria-hidden="true" />
              {hero.badge}
            </span>

            <h1 className="hc-h1">
              <span className="hc-name">
                {hero.titleLead} <span className="dim">{hero.titleDim}</span>
              </span>
              <span className="mono">{hero.titleMono}</span>
            </h1>

            <p className="hc-lede">
              {hero.desc}
              {hero.descBold && <b>{hero.descBold}</b>}
              {hero.descTail}
            </p>

            <div className="hc-cta">
              <a href="#projects" className="btn btn-primary">
                See my work <ArrowRightIcon width="15" height="15" />
              </a>
              <a
                href={hero.resume}
                className="btn btn-outline"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
              </a>
            </div>

            <div className="hc-stack">
              {hero.tech.map((t, i) => (
                <span
                  key={t}
                  className={`tag ${i === 0 ? "tag-outline" : "tag-neutral"}`}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="hc-metrics">
              {hero.highlights.map((h) => (
                <div key={h.label}>
                  <span className="ha-num">{h.value}</span>
                  <span className="ha-lab">{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hc-panel fade-up stagger-1">
            <div className="hc-phead">
              <span>{hero.panel.title}</span>
              <span className="live">
                <span className="hb-pulse" aria-hidden="true" />
                {hero.panel.status}
              </span>
            </div>

            <div className="hc-canvas">
              <svg viewBox="0 0 560 330" preserveAspectRatio="none" aria-hidden="true">
                {WIRES.map((w) => (
                  <path key={`wire-${w.d}`} className="hc-wire" d={w.d} />
                ))}
                {WIRES.map((w) => (
                  <path key={`flow-${w.d}`} className={`hc-flow ${w.delay}`} d={w.d} />
                ))}
              </svg>

              {hero.panel.nodes.map((n) => (
                <div
                  key={n.kind}
                  className={`hc-node ${n.hot ? "hot" : ""}`}
                  /* Right-hand nodes anchor to the right edge so they inset
                     symmetrically instead of overflowing the panel. */
                  style={
                    n.x > 380
                      ? { right: "4%", top: `${(n.y / 330) * 100}%` }
                      : { left: `${(n.x / 560) * 100}%`, top: `${(n.y / 330) * 100}%` }
                  }
                >
                  <span className="nk">{n.kind}</span>
                  <span className="nv">
                    {n.hot && <span className="hx-dot" aria-hidden="true" />}
                    {n.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="hc-log">
              {hero.panel.log.map((l) => (
                <div key={l.text}>
                  <span className="ok">✓</span> {l.text}
                </div>
              ))}
              <div className="cur">{hero.panel.cursor}</div>
            </div>
          </div>
        </div>

        <div className="hx-rule" aria-hidden="true" />
      </div>
    </section>
  );
}
