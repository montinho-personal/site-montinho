"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-white/10 px-4 py-5 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
        <p className="text-gray-300 text-sm leading-relaxed flex-1">
          Usamos cookies para melhorar a sua experiência e analisar o tráfego
          do site (Google Analytics). Consulte a nossa{" "}
          <Link
            href="/lgpd"
            className="text-white underline underline-offset-2 hover:text-gray-200"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-gray-400 border border-white/20 hover:border-white/40 hover:text-white transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
