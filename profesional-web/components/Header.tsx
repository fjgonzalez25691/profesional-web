"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Inicio", href: "#hero" },
  { label: "Casos", href: "#cases" },
  { label: "Metodología", href: "#methodology" },
  { label: "Contacto", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "fjgaparicio.es";
  const brand = useMemo(() => {
    return <span className="text-text-primary">{businessName}</span>;
  }, [businessName]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isScrolled
        ? "border-surface-700/40 bg-surface-950 shadow-lg"
        : "border-surface-700/20 bg-surface-950/80 backdrop-blur-md"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Brand */}
        <Link
          href="#hero"
          className="text-2xl font-extrabold tracking-tight text-text-primary transition-colors hover:text-accent-gold-500 md:text-3xl"
        >
          {brand}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-bold text-text-secondary transition-all duration-200 hover:text-text-primary relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-text-primary transition-colors hover:bg-surface-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold-500 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          <span className="sr-only">Alternar menú</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen ? (
        <div
          data-testid="mobile-nav"
          className="border-t border-surface-700/30 bg-surface-950/95 backdrop-blur-lg md:hidden"
        >
          <nav className="flex flex-col px-6 py-6 space-y-2" aria-label="Navegación móvil">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="rounded-lg px-4 py-3 text-lg font-semibold text-text-primary transition-colors hover:bg-surface-800/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
