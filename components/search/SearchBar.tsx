"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/search";

interface Props {
  /** Compact mode: shows just the icon that expands on click (header desktop) */
  compact?: boolean;
  /** Always visible field (blog page, mobile menu) */
  placeholder?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-transparent text-white font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SearchBar({
  compact = false,
  placeholder = "Pesquisar artigos, treinos, suplementos...",
  onClose,
  autoFocus = false,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus when expanded
  useEffect(() => {
    if ((open || autoFocus) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, autoFocus]);

  // Debounced search for autocomplete
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.results ?? []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActive(-1);
    fetchSuggestions(val);
  };

  const navigate = (slug?: string) => {
    setSuggestions([]);
    if (slug) {
      router.push(`/blog/${slug}`);
    } else if (query.trim().length >= 2) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
    setQuery("");
    if (compact) {
      setOpen(false);
      onClose?.();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => Math.min(v + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => Math.max(v - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && suggestions[active]) {
        navigate(suggestions[active].slug);
      } else {
        navigate();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      if (compact) {
        setOpen(false);
        onClose?.();
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
        if (compact) setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [compact]);

  const showDropdown = suggestions.length > 0 || (loading && query.length >= 2);

  // ── COMPACT MODE (header desktop) ─────────────────────────────────────
  if (compact) {
    return (
      <div ref={containerRef} className="relative flex items-center">
        {/* Icon button — always visible */}
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setSuggestions([]);
            setQuery("");
          }}
          aria-label="Pesquisar"
          className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </button>

        {/* Expanding input */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "w-56 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-white/5 border border-white/15 text-white text-sm placeholder-gray-500 px-3 py-1.5 outline-none focus:border-white/40 transition-colors duration-200"
            />
            {loading && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin text-gray-500"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Dropdown */}
        {open && showDropdown && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-black border border-white/15 shadow-xl z-50">
            <DropdownContent
              suggestions={suggestions}
              loading={loading}
              query={query}
              active={active}
              onSelect={navigate}
              onViewAll={() => navigate()}
            />
          </div>
        )}
      </div>
    );
  }

  // ── FULL MODE (blog page, mobile menu) ───────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate();
        }}
        role="search"
        className="relative flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="absolute left-4 text-gray-500 pointer-events-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          className="w-full bg-white/5 border border-white/15 text-white text-sm placeholder-gray-500 pl-10 pr-10 py-3 outline-none focus:border-white/40 transition-colors duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-gray-500 hover:text-white transition-colors"
            aria-label="Limpar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && !query && (
          <span className="absolute right-3">
            <svg className="animate-spin text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
            </svg>
          </span>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-0.5 bg-black border border-white/15 shadow-xl z-50">
          <DropdownContent
            suggestions={suggestions}
            loading={loading}
            query={query}
            active={active}
            onSelect={navigate}
            onViewAll={() => navigate()}
          />
        </div>
      )}
    </div>
  );
}

function DropdownContent({
  suggestions,
  loading,
  query,
  active,
  onSelect,
  onViewAll,
}: {
  suggestions: SearchResult[];
  loading: boolean;
  query: string;
  active: number;
  onSelect: (slug: string) => void;
  onViewAll: () => void;
}) {
  if (loading && suggestions.length === 0) {
    return (
      <div className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
        <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
        </svg>
        Buscando...
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="px-4 py-3 text-gray-500 text-sm">
        Nenhum resultado para &ldquo;{query}&rdquo;
      </div>
    );
  }

  return (
    <>
      {suggestions.map((s, i) => (
        <button
          key={s.slug}
          type="button"
          onClick={() => onSelect(s.slug)}
          className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 transition-colors duration-150 ${
            i === active ? "bg-white/10" : "hover:bg-white/5"
          }`}
        >
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="shrink-0 mt-0.5 text-gray-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium leading-snug line-clamp-1">
                <Highlight text={s.title} query={query} />
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{s.category} · {s.readTime}</p>
            </div>
          </div>
        </button>
      ))}
      <button
        type="button"
        onClick={onViewAll}
        className="w-full text-left px-4 py-3 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150 flex items-center gap-1.5"
      >
        Ver todos os resultados para &ldquo;{query}&rdquo;
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </>
  );
}
