import { skills } from "../data.js";
import {
  WandIcon,
  CodeIcon,
  DatabaseIcon,
  ServerIcon,
  LaptopCodeIcon,
  RobotIcon,
  PlugIcon,
  CloudIcon,
  BrainIcon,
  BoltIcon,
} from "./icons.jsx";

const CARD_ICONS = {
  wand: WandIcon,
  code: CodeIcon,
  database: DatabaseIcon,
  server: ServerIcon,
  laptop: LaptopCodeIcon,
  robot: RobotIcon,
  plug: PlugIcon,
  cloud: CloudIcon,
  brain: BrainIcon,
  bolt: BoltIcon,
};

const STAGGER = ["", "stagger-1", "stagger-2", "stagger-3"];

export default function Skills() {
  return (
    <section className="skills-section section" id="skills">
      <div className="container">
        <div className="section-head-center">
          <span className="section-label">{skills.label}</span>
          <h2 className="section-title section-title--center">
            <span className="solid">{skills.titleSolid}</span>
            <span className="outline">{skills.titleOutline}</span>
          </h2>
          <p className="section-subtitle">{skills.subtitle}</p>
        </div>

        <div className="skills-grid">
          {skills.cards.map((card, i) => {
            // Fall back rather than render `undefined`, which crashes React.
            const Icon = CARD_ICONS[card.icon] || WandIcon;
            return (
              <div className={`skill-card fade-up ${STAGGER[i % 4]}`} key={card.title}>
                <Icon className="skill-icon" width="32" height="32" />
                <h3 className="skill-title">{card.title}</h3>
                <p className="skill-desc">{card.desc}</p>
                <span className="skill-stack-label">Tech Stack</span>
                <ul className="skill-list">
                  {card.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
