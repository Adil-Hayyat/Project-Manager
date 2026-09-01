import { education } from "../data.js";
import { GraduationCapIcon, BookOpenIcon, PinIcon } from "./icons.jsx";

const EDU_ICONS = { cap: GraduationCapIcon, book: BookOpenIcon };

const STAGGER = ["", "stagger-1"];

export default function Education() {
  return (
    <section className="education-section section" id="education">
      <div className="container">
        <div className="edu-header section-head-center fade-up">
          <span className="section-label">{education.label}</span>
          <h2 className="section-title section-title--center section-title--tight">
            <span className="solid">{education.titleSolid}</span>
            <span className="outline">{education.titleOutline}</span>
          </h2>
          <div className="edu-divider" />
          <p className="edu-subtitle">{education.subtitle}</p>
        </div>

        <div className="edu-grid">
          {education.items.map((item, i) => {
            const Icon = EDU_ICONS[item.icon] || GraduationCapIcon;
            return (
              <div className={`edu-card fade-up ${STAGGER[i % 2]}`} key={item.title}>
                <div className="edu-card-top">
                  <div className="edu-card-icon">
                    <Icon width="18" height="18" />
                  </div>
                  <span className="edu-date">{item.date}</span>
                </div>
                <h3 className="edu-card-title">{item.title}</h3>
                <p className="edu-card-location">
                  <PinIcon width="14" height="14" /> {item.location}
                </p>
                <p className="edu-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
