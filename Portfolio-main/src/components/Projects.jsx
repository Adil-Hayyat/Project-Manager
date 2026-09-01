import { projects } from "../data.js";
import { CheckCircleIcon, ArrowRightIcon } from "./icons.jsx";

const STAGGER = ["", "stagger-1", "stagger-2", "stagger-3"];

export default function Projects() {
  return (
    <section className="projects-section section" id="projects">
      <div className="container">
        <div className="section-head-center">
          <span className="section-label">{projects.label}</span>
          <h2 className="section-title section-title--center">
            <span className="solid">{projects.titleSolid}</span>
            <span className="outline">{projects.titleOutline}</span>
          </h2>
          <p className="section-subtitle">{projects.subtitle}</p>
        </div>

        <div className="projects-grid">
          {projects.items.map((p, i) => (
            <div className={`project-card fade-up ${STAGGER[i % 4]}`} key={p.title}>
              <span className="project-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-meta">
                {p.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="project-outcome">
                <CheckCircleIcon width="14" height="14" /> {p.outcome}
              </div>
              <a href={p.href} className="project-link">
                View Project <ArrowRightIcon width="14" height="14" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
