"use client";
import { useTranslations } from '@/lib/localize';
import { useLocale } from 'next-intl';
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { locales } from "@/config";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // мобильный drawer
  const [isDesktopLangMenuOpen, setIsDesktopLangMenuOpen] = useState(false); // десктопный язык
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] = useState(false);   // мобильный язык

  const t = useTranslations("Header");
  const locale = useLocale();
  const currentPathname = usePathname();

  const getNewHref = (targetLocale: string) => {
    let pathWithoutLocale = currentPathname;
    if (pathWithoutLocale.startsWith(`/${locale}`)) {
      pathWithoutLocale = pathWithoutLocale.slice(`/${locale}`.length) || "/";
    }

    if (pathWithoutLocale === "/") {
      return `/${targetLocale}`;
    }
    return `/${targetLocale}${pathWithoutLocale}`;
  };

  // Закрытие desktop языкового меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".desktop-lang-button") && !target.closest(".desktop-lang-list")) {
        setIsDesktopLangMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section
      className="pt-8 pb-10 bg-site"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        <header
          className="
            bg-navbar
            h-[100px]
            rounded-[25px]
            shadow-md
            w-full
            max-w-[1854px]
            flex
            items-center
            justify-between
            overflow-visible
            px-4 sm:px-6 md:px-8
          "
        >
          {/* logo  */}
          <span className="text-[#E0E0E0] font-semibold text-[20px] sm:text-[22px] md:text-[24px]">
            <a href="/">{t("grapelab")}</a>
          </span>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium text-[#E0E0E0]">
            <div className="flex space-x-4 lg:space-x-8">
              <a
                href="/portfolio"
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("cases")}
              </a>
              <a
                href="/team"
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("team")}
              </a>
              <a
                href="/contacts"
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("contacts")}
              </a>
            </div>
            {/* Desktop Language Button */}
            <div className="relative ml-4 lg:ml-10">
              <button
                className="desktop-lang-button flex items-center gap-1 transition-transform duration-200 transform hover:scale-105 hover:text-white"
                onClick={() => setIsDesktopLangMenuOpen(!isDesktopLangMenuOpen)}
              >
                {locale.toUpperCase()}
                <span className={`inline-block transition-transform duration-200 ${isDesktopLangMenuOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>

              {isDesktopLangMenuOpen && (
                <ul className="desktop-lang-list absolute right-0 mt-2 w-24 bg-white border-2 border-[#58427c] rounded-md shadow-lg z-50">
                  {locales.map(lng => (
                    <li key={lng}>
                      <a
                        href={getNewHref(lng)}
                        className={`block px-4 py-2 text-buttons hover:bg-[#ffffff22] ${lng === locale ? 'font-extrabold' : 'font-regular'}`}
                        onClick={() => setIsDesktopLangMenuOpen(false)}
                      >
                        {lng.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#E0E0E0] text-3xl focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
          >
            &#9776; {/* hamburger icon */}
          </button>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[250px] bg-navbar z-50 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#ffffff33]">
          <span className="text-[#E0E0E0] font-semibold text-[22px]">
            {t("grapelab")}
          </span>
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-white text-lg">
          <div className="flex flex-col gap-6 p-6 text-white text-lg">
            <a href="/portfolio" onClick={() => setIsMenuOpen(false)}>
              {t("cases")}
            </a>
            <a href="/team" onClick={() => setIsMenuOpen(false)}>
              {t("team")}
            </a>
            <a href="/contacts" onClick={() => setIsMenuOpen(false)}>
              {t("contacts")}
            </a>

            {/* Mobile Language Button */}
            <div className="relative">
              <button className="w-full flex justify-between items-center" onClick={() => setIsMobileLangMenuOpen(!isMobileLangMenuOpen)}>
                {locale.toUpperCase()}
                <span className={`inline-block transition-transform duration-200 ${isMobileLangMenuOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
              </button>
              {isMobileLangMenuOpen && (
                <ul className="mt-2 w-full bg-white border border-[#58427c] rounded-md shadow-lg z-50">
                  {locales.map(lng => (
                    <li key={lng}>
                      <a
                        href={getNewHref(lng)}
                        className={`block px-4 py-2 text-buttons hover:bg-[#ffffff22] ${lng === locale ? 'font-extrabold' : 'font-regular'}`}
                        onClick={() => { setIsMenuOpen(false); setIsMobileLangMenuOpen(false); }}
                      >
                        {lng.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default Header;
