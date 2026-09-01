import { experience } from "../data.js";
import { BoltIcon, BrainIcon, CodeIcon } from "./icons.jsx";

/* The reference has no Experience block, so this reuses the reference's own
   card vocabulary (icon tile + date pill + title + description). */
const EXP_ICONS = { bolt: BoltIcon, brain: BrainIcon, code: CodeIcon };

const STAGGER = ["", "stagger-1", "stagger-2"];

export default function Experience() {
  return (
    <section className="experience-section section" id="experience">
      <div className="container">
        <div className="exp-header section-head-center fade-up">
          <span className="section-label">{experience.label}</span>
          <h2 className="section-title section-title--center section-title--tight">
            <span className="solid">{experience.titleSolid}</span>
            <span className="outline">{experience.titleOutline}</span>
          </h2>
          <div className="exp-divider" />
          <p className="exp-subtitle">{experience.subtitle}</p>
        </div>

        <ol className="exp-list">
          {experience.items.map((item, i) => {
            const Icon = EXP_ICONS[item.icon] || BoltIcon;
            return (
              <li className={`exp-card fade-up ${STAGGER[i % 3]}`} key={item.title}>
                <div className="exp-card-top">
                  <div className="exp-card-icon">
                    <Icon width="18" height="18" />
                  </div>
                  <span className="exp-date">{item.date}</span>
                </div>
                <h3 className="exp-card-title">{item.title}</h3>
                <p className="exp-card-org">{item.org}</p>
                <p className="exp-card-desc">{item.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
