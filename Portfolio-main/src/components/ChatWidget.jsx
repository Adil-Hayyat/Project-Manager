import { useEffect, useRef, useState } from "react";
import { profile, reach } from "../data.js";
import { BotIcon, WhatsAppIcon, SendIcon, CloseIcon } from "./icons.jsx";

const firstName = profile.first;

/* DUMMY: simple rule-based demo assistant. Wire this to a real
   LLM endpoint (OpenAI/Claude API via a small backend) later. */
function botReply(text) {
  const t = text.toLowerCase();

  if (/\b(hi|hello|hey|salam|assalam)\b/.test(t)) {
    return `Hi! 👋 Ask me about ${firstName}'s services, experience, or how to hire him.`;
  }
  if (/(price|cost|rate|charge|budget|quote)/.test(t)) {
    return `Pricing depends on the scope. The fastest way to get a quote is a quick message on WhatsApp (${reach.whatsappDisplay}) or an email to ${reach.email}.`;
  }
  if (/(service|automation|agent|build|offer|do you|can you)/.test(t)) {
    return `${firstName} builds AI automations and full-stack systems: n8n workflows, AI agents, RAG and LLM integrations, CRM and GoHighLevel automation, document processing pipelines, and custom React/FastAPI apps.`;
  }
  if (/(experience|work|job|company|background)/.test(t)) {
    return `${firstName} works as an AI Automation & Full-Stack AI Engineer, and previously worked as a Python Developer at Enigmatix. Scroll to the Experience section for details.`;
  }
  if (/(contact|email|reach|hire|whatsapp|phone|number)/.test(t)) {
    return `You can reach ${firstName} at ${reach.email} or on WhatsApp at ${reach.whatsappDisplay}. He usually replies within a day.`;
  }
  return `I'm a simple demo assistant, so I might not have that answer — but ${firstName} does! Email ${reach.email} or tap the WhatsApp button above.`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    {
      from: "bot",
      text: `Hey, I'm ${firstName}'s AI assistant 🤖 Ask me about his services, experience, or how to get in touch.`,
    },
  ]);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timerRef.current);
    };
  }, []);

  function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: botReply(text) }]);
      setTyping(false);
    }, 800);
  }

  return (
    <div className="chat">
      {open && (
        <div className="chat__panel" role="dialog" aria-label="AI assistant chat">
          <header className="chat__head">
            <span className="chat__head-icon"><BotIcon width="18" height="18" /></span>
            <div>
              <p className="chat__title">AI Assistant</p>
              <p className="chat__sub"><span className="chat__dot" /> Online</p>
            </div>
            <button className="chat__close" onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </header>

          <a
            className="chat__wa"
            href={reach.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Chat on WhatsApp instead
          </a>

          <div className="chat__msgs" ref={scrollRef}>
            {msgs.map((m, i) => (
              <p key={i} className={`msg msg--${m.from}`}>{m.text}</p>
            ))}
            {typing && (
              <p className="msg msg--bot msg--typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </p>
            )}
          </div>

          <form className="chat__form" onSubmit={send}>
            <input
              className="chat__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
            />
            <button className="chat__send" type="submit" aria-label="Send">
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        className="chat__launch"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <BotIcon />
        <span className="chat__status" aria-hidden="true" />
      </button>
    </div>
  );
}
