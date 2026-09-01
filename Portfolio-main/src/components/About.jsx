import { useState } from "react";
import { profile, about } from "../data.js";
import {
  UserIcon,
  RobotIcon,
  CodeIcon,
  ServerIcon,
  LaptopCodeIcon,
  PlugIcon,
  CloudIcon,
} from "./icons.jsx";

const DO_ICONS = {
  robot: RobotIcon,
  code: CodeIcon,
  server: ServerIcon,
  laptop: LaptopCodeIcon,
  plug: PlugIcon,
  cloud: CloudIcon,
};

export default function About() {
  // Fall back to the icon if the photo path is unset or fails to load.
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(profile.photo) && !photoFailed;

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-left fade-up">
            <div className="about-photo">
              {showPhoto ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <UserIcon width="80" height="80" />
              )}
            </div>
            {/* Experience box and tagline sit side by side beneath the photo. */}
            <div className="about-foot">
              <div className="about-experience-box">
                <div className="about-exp-number">{profile.years}</div>
                <div className="about-exp-label">
                  {profile.yearsLabel.map((line, i) => (
                    <span key={line}>
                      {line}
                      {i < profile.yearsLabel.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
              <div className="about-signature">{profile.signature}</div>
            </div>
          </div>

          <div className="about-right fade-up stagger-1">
            <div className="about-title-wrap">
              <div className="about-kicker">{about.kicker}</div>
              <h2 className="section-title">
                <span className="solid">{about.titleSolid}</span>
                <span className="outline">{about.titleOutline}</span>
              </h2>
              <div className="about-divider" />
            </div>

            <div className="about-desc">
              {about.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.lead}
                  {p.strong && <strong>{p.strong}</strong>}
                  {p.rest}
                </p>
              ))}
            </div>

            <div className="what-i-do">
              <div className="what-i-do-title">WHAT I DO</div>
              <div className="what-i-do-grid">
                {about.whatIDo.map((item) => {
                  const Icon = DO_ICONS[item.icon] || RobotIcon;
                  return (
                    <div className="what-i-do-item" key={item.label}>
                      <span className="icon">
                        <Icon width="15" height="15" />
                      </span>
                      <span className="text">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
