import { profile, reach, socials, footerBlurb, footerNav } from "../data.js";
import {
  GitHubIcon,
  LinkedInIcon,
  XIcon,
  FacebookIcon,
  MailIcon,
  WhatsAppIcon,
  PinIcon,
  ArrowUpIcon,
} from "./icons.jsx";

const SOCIAL_ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
  Facebook: FacebookIcon,
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              {profile.first}
              <span>.</span>
            </div>
            <p className="footer-desc">{footerBlurb}</p>
            <div className="footer-socials">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.name];
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <nav className="footer-nav-col" aria-label="Footer">
            <div className="footer-heading">Navigate</div>
            <ul className="footer-nav">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-contact-col">
            <div className="footer-heading">Get in Touch</div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <MailIcon />
              </div>
              <div>
                <span className="footer-contact-label">Email Me</span>
                <a className="footer-contact-value" href={`mailto:${reach.email}`}>
                  {reach.email}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <WhatsAppIcon />
              </div>
              <div>
                <span className="footer-contact-label">WhatsApp</span>
                <a
                  className="footer-contact-value"
                  href={reach.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {reach.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <PinIcon />
              </div>
              <div>
                <span className="footer-contact-label">Location</span>
                <span className="footer-contact-value">{reach.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>Designed &amp; built by {profile.name}</p>
          <a href="#home" className="back-to-top">
            Back to Top <ArrowUpIcon width="13" height="13" />
          </a>
        </div>
      </div>
    </footer>
  );
}
