"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/site";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Esc fecha o menu mobile
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <a href="#conteudo" className={styles.headerSkip}>
        Pular para o conteúdo
      </a>

      <Link href="/" className={styles.headerLogo}>
        welinton<span className={styles.headerLogoDot}>.</span>
        <em>carmelo</em>
      </Link>

      <button
        type="button"
        className={styles.headerToggle}
        aria-expanded={isOpen}
        aria-controls="menu-principal"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <nav
        id="menu-principal"
        aria-label="Navegação principal"
        className={`${styles.headerNav} ${isOpen ? styles["headerNav--open"] : ""}`}
      >
        <ul className={styles.headerList}>
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.headerLink} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
