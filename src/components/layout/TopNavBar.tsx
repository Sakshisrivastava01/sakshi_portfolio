"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#intelligence" },
  { label: "Projects", href: "#innovation-lab" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Achievements", href: "#achievements" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function TopNavBar() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resumeUrl] = useState("/Sakshi_Srivastava_Resume.pdf");
  const router = useRouter();

  const handleLogoClick = useCallback(() => {
    scrollTo("#home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(href: string) {
    setIsMobileMenuOpen(false);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl transition-all duration-500 rounded-full",
          isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-lg border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3" : "bg-transparent py-5"
        )}
      >
        <div className="px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <span className="text-xl font-bold font-heading tracking-tighter">
              Sakshi<span className="text-accent-pink">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-300 group"
                >
                  <span className={cn(
                    "relative z-10 transition-colors duration-300",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )}>
                    {link.label}
                  </span>
                  
                  {/* Hover indicator */}
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 bg-accent-lavender scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/5"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href={resumeUrl}
              download="Sakshi_Srivastava_Resume.pdf"
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-accent-pink/50 hover:bg-white/10 text-white text-sm font-medium transition-all duration-300 shadow-[0_0_15px_rgba(255,182,193,0.1)] hover:shadow-[0_0_20px_rgba(255,182,193,0.3)] group"
            >
              Resume
              <Download className="w-4 h-4 text-accent-pink group-hover:translate-y-0.5 transition-transform" />
            </a>

            <button
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[#050505]/95 backdrop-blur-xl lg:hidden flex flex-col pt-32 px-6 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-4 items-center w-full">
              {NAV_LINKS.map((link) => (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "text-xl font-heading w-full text-center py-4 border-b border-white/5 transition-colors",
                    activeSection === link.href.substring(1) ? "text-accent-pink font-bold" : "text-gray-400"
                  )}
                >
                  {link.label}
                </motion.button>
              ))}
              
              <motion.a
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                href={resumeUrl}
                download="Sakshi_Srivastava_Resume.pdf"
                className="mt-8 flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 border border-accent-pink/30 text-white font-semibold"
              >
                Download Resume
                <Download className="w-5 h-5 text-accent-pink" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
