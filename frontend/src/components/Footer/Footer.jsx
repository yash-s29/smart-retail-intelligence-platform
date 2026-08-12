import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  ChevronUp,
  Sparkles,
  Check,
} from "lucide-react";

import logo from "../../assets/images/logo.png";
import "./Footer.css";

/* ============================================================
   SOCIAL ICONS
============================================================ */

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.11-2.28-.11-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle
      cx="17.5"
      cy="6.5"
      r="1"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.6 7.2c-.25-.94-.98-1.68-1.92-1.93C18 4.8 12 4.8 12 4.8s-6 0-7.68.47c-.94.25-1.67.99-1.92 1.93C2 8.88 2 12 2 12s0 3.12.4 4.8c.25.94.98 1.65 1.92 1.9C6 19.17 12 19.17 12 19.17s6 0 7.68-.47c.94-.25 1.67-.96 1.92-1.9.4-1.68.4-4.8.4-4.8s0-3.12-.4-4.8zM10 15.02V8.98L15.5 12 10 15.02z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 3H21.7l-6.1 7 7.2 9.7h-5.6l-4.4-5.8-5 5.8H4.9l6.5-7.5L4.5 3h5.7l4 5.3L18.9 3zm-1 15.2h1.5L8.2 4.7H6.6l11.3 13.5z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.94 8.5H4.06v11.03h2.88V8.5zM5.5 4a1.67 1.67 0 100 3.34A1.67 1.67 0 005.5 4zM19.94 19.53h-2.87v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7H10.2V8.5h2.75v1.51h.04c.38-.72 1.32-1.49 2.72-1.49 2.91 0 3.45 1.92 3.45 4.4v6.61z" />
  </svg>
);

/* ============================================================
   INTERSECTION OBSERVER
============================================================ */

const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

/* ============================================================
   FOOTER
============================================================ */

const Footer = () => {
  const theme = useTheme();

  const year = new Date().getFullYear();

  const mode =
    theme.palette.mode === "dark"
      ? "dark"
      : "light";

  const [footerRef, isVisible] = useInView({
    threshold: 0.08,
  });

  const [showTopBtn, setShowTopBtn] = useState(false);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* ----------------------------------------------------------
     Scroll listener
  ---------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ----------------------------------------------------------
     Back to top
  ---------------------------------------------------------- */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ----------------------------------------------------------
     Newsletter
  ---------------------------------------------------------- */

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);

    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  /* ==========================================================
     LINKS
  ========================================================== */

  const productLinks = [
    {
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      label: "Products",
      to: "/products",
    },
    {
      label: "Inventory",
      to: "/inventory",
    },
    {
      label: "Sales",
      to: "/sales",
    },
    {
      label: "Forecasting",
      to: "/forecasting",
    },
    {
      label: "Reports",
      to: "/reports",
    },
  ];

  const companyLinks = [
    {
      label: "About Us",
      to: "/about",
    },
    {
      label: "Blog",
      to: "/blog",
    },
    {
      label: "Contact",
      to: "/contact",
    },
  ];

  const supportLinks = [
    {
      label: "Help Center",
      to: "/help",
    },
    {
      label: "Documentation",
      to: "/docs",
    },
    {
      label: "API Status",
      to: "/status",
    },
    {
      label: "FAQs",
      to: "/faq",
    },
  ];

  const legalLinks = [
    {
      label: "Privacy Policy",
      to: "/privacy",
    },
    {
      label: "Terms of Service",
      to: "/terms",
    },
    {
      label: "Cookie Policy",
      to: "/cookies",
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: FacebookIcon,
      className: "social-facebook",
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: InstagramIcon,
      className: "social-instagram",
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: YoutubeIcon,
      className: "social-youtube",
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      icon: TwitterIcon,
      className: "social-twitter",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: LinkedinIcon,
      className: "social-linkedin",
    },
  ];

  return (
    <footer
      ref={footerRef}
      data-theme={mode}
      className={`footer ${
        isVisible ? "footer-visible" : ""
      }`}
    >
      {/* ======================================================
          BACKGROUND DECORATION
      ======================================================= */}

      <div className="footer-background-decoration">
        <span className="footer-orb footer-orb-one" />
        <span className="footer-orb footer-orb-two" />
        <span className="footer-orb footer-orb-three" />
        <div className="footer-grid-pattern" />
      </div>

      {/* ======================================================
          CTA
      ======================================================= */}

      <section className="footer-cta">
        <div className="footer-container footer-cta-content">

          <div className="footer-cta-text">

            <div className="footer-cta-badge">
              <Sparkles size={14} />
              <span>Intelligent Retail Management</span>
            </div>

            <h2>
              Ready to grow your
              <span> retail business?</span>
            </h2>

            <p>
              Manage inventory, monitor sales, forecast demand
              and make smarter business decisions using one
              intelligent dashboard.
            </p>
          </div>

          <div className="footer-cta-actions">

            <Link
              to="/dashboard"
              className="footer-btn footer-btn-primary"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="footer-btn footer-btn-secondary"
            >
              Contact Sales
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN FOOTER
      ======================================================= */}

      <div className="footer-top">
        <div className="footer-container footer-main-grid">

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="footer-brand-col">

            <Link
              to="/dashboard"
              className="footer-logo"
            >
              <span className="footer-logo-mark">
                <img
                  src={logo}
                  alt="Smart Retail logo"
                />
              </span>

              <span className="footer-logo-text">
                Smart Retail

                <span className="footer-logo-sub">
                  Intelligence Platform
                </span>
              </span>
            </Link>

            <p className="footer-tagline">
              Smart Retail Intelligence Platform helps
              retailers streamline inventory, monitor sales
              performance, forecast demand, and gain actionable
              insights through one centralized dashboard built
              for modern businesses.
            </p>

            <div className="footer-divider" />

            {/* Newsletter */}

            <form
              className="footer-newsletter"
              onSubmit={handleNewsletterSubmit}
            >
              <label
                htmlFor="footer-email"
                className="footer-newsletter-label"
              >
                Stay Updated
              </label>

              <p className="footer-newsletter-description">
                Get product updates, feature releases, AI
                improvements and platform announcements.
              </p>

              <div
                className={`footer-newsletter-input-wrap ${
                  subscribed
                    ? "newsletter-success"
                    : ""
                }`}
              >
                {subscribed ? (
                  <div className="newsletter-success-message">
                    <Check size={17} />
                    <span>
                      You're subscribed!
                    </span>
                  </div>
                ) : (
                  <>
                    <input
                      id="footer-email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      placeholder="Enter your email address"
                      className="footer-newsletter-input"
                    />

                    <button
                      type="submit"
                      className="footer-newsletter-btn"
                      aria-label="Subscribe"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* ==================================================
              LINKS
          ================================================== */}

          <div className="footer-links-grid">

            <div className="footer-col">
              <h4 className="footer-col-title">
                Product
              </h4>

              <ul>
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>
                      <span>{link.label}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">
                Company
              </h4>

              <ul>
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>
                      <span>{link.label}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">
                Resources
              </h4>

              <ul>
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>
                      <span>{link.label}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col footer-contact-col">
              <h4 className="footer-col-title">
                Contact
              </h4>

              <ul className="footer-contact-list">

                <li>
                  <span className="footer-contact-icon">
                    <Mail size={16} />
                  </span>

                  <a href="mailto:support@smartretail.com">
                    support@smartretail.com
                  </a>
                </li>

                <li>
                  <span className="footer-contact-icon">
                    <Phone size={16} />
                  </span>

                  <a href="tel:+911234567890">
                    +91 12345 67890
                  </a>
                </li>

                <li>
                  <span className="footer-contact-icon">
                    <MapPin size={16} />
                  </span>

                  <span>
                    Mumbai,
                    <br />
                    Maharashtra,
                    <br />
                    India
                  </span>
                </li>

              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================
          BOTTOM FOOTER
      ======================================================= */}

      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">

          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {year} Smart Retail Intelligence Platform.
              All rights reserved.
            </p>

            <span className="footer-made">
              Built for smarter retail decisions.
            </span>
          </div>

          <ul className="footer-legal-links">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="footer-right">
            <div className="footer-socials">
              {socialLinks.map(
                ({
                  label,
                  href,
                  icon: Icon,
                  className,
                }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`footer-social-icon ${className}`}
                  >
                    <Icon
                      width={18}
                      height={18}
                    />
                  </a>
                )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================
          BACK TO TOP
      ======================================================= */}

      <button
        type="button"
        className={`footer-top-btn ${
          showTopBtn ? "is-visible" : ""
        }`}
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showTopBtn ? 0 : -1}
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
