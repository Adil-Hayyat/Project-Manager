import { useEffect, useState } from "react";
import { profile, navLinks } from "../data.js";
import { HamburgerIcon, CloseIcon } from "./icons.jsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Header gets a solid background + border once the page scrolls past 50px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`} id="header">
        <div className="header-inner">
          {/* Matches the footer brand: full name + teal dot. */}
          <a href="#home" className="logo" onClick={() => setOpen(false)}>
            {profile.name}
            <span>.</span>
          </a>

          <nav className="nav-links" aria-label="Main">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="header-cta">
            Let's Work Together
          </a>

          <button
            className="hamburger"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon width="20" height="20" /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      <div
        className={`mobile-nav-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div className={`mobile-nav ${open ? "open" : ""}`} id="mobileNav">
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
