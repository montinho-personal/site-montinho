"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  articleTitle: string;
  slug: string;
  category: string;
}

/**
 * article_read: dispara 1x quando scroll >= 80% E tempo >= 60s
 * (ambas as condições). Montado apenas em páginas de artigo.
 */
export default function ArticleReadTracker({ articleTitle, slug, category }: Props) {
  const stateRef = useRef({ scrollOk: false, timeOk: false, fired: false });

  useEffect(() => {
    const state = stateRef.current;
    state.scrollOk = false;
    state.timeOk = false;
    state.fired = false;

    function maybeFire() {
      if (state.fired || !state.scrollOk || !state.timeOk) return;
      state.fired = true;
      trackEvent("article_read", {
        article_title: articleTitle,
        slug,
        categoria: category,
      });
      window.removeEventListener("scroll", onScroll);
    }

    function onScroll() {
      if (state.scrollOk) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.8) {
        state.scrollOk = true;
        maybeFire();
      }
    }

    const timer = window.setTimeout(() => {
      state.timeOk = true;
      maybeFire();
    }, 60_000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [articleTitle, slug, category]);

  return null;
}
