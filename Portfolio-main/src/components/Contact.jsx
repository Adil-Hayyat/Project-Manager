import { useEffect, useRef, useState } from "react";
import { contact, contactItems } from "../data.js";
import {
  MailIcon,
  WhatsAppIcon,
  PinIcon,
  PaperPlaneIcon,
  CheckCircleIcon,
} from "./icons.jsx";

const ITEM_ICONS = { mail: MailIcon, whatsapp: WhatsAppIcon, pin: PinIcon };

const EMPTY = { name: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const update = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  function onSubmit(e) {
    e.preventDefault();
    const { name, email, message } = values;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSent(true);

    // Reference behaviour: show the success panel, then reset after 5s.
    timerRef.current = setTimeout(() => {
      setValues(EMPTY);
      setSent(false);
    }, 5000);
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header fade-up">
          <span className="section-label">{contact.label}</span>
          <h2>{contact.title}</h2>
          <p>{contact.subtitle}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel fade-up">
            <h3>{contact.panelTitle}</h3>
            <p>{contact.panelDesc}</p>

            <div className="contact-info-list">
              {contactItems.map((item) => {
                const Icon = ITEM_ICONS[item.icon] || MailIcon;
                const body = (
                  <>
                    <span className="ci-icon">
                      <Icon width="15" height="15" />
                    </span>
                    <div>
                      <span className="label">{item.label}</span>
                      <span className="value">{item.value}</span>
                    </div>
                  </>
                );

                return item.href ? (
                  <a
                    className="contact-info-item"
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="contact-info-item" key={item.label}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-form-panel fade-up stagger-1">
            <h3>
              <PaperPlaneIcon width="16" height="16" /> Send a Message
            </h3>

            <form onSubmit={onSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={update}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={values.email}
                  onChange={update}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={values.message}
                  onChange={update}
                />
              </div>

              {!sent && (
                <button type="submit" className="form-submit">
                  <PaperPlaneIcon width="15" height="15" /> Send Message
                </button>
              )}

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              {sent && (
                <div className="form-success" role="status">
                  <span className="tick">
                    <CheckCircleIcon width="36" height="36" />
                  </span>
                  <p>Thanks! I'll get back to you shortly.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
