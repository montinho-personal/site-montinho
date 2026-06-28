"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface Props {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogList({ posts, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered = active === "Todos"
    ? posts
    : posts.filter((p) => p.category.toLowerCase() === active.toLowerCase());

  return (
    <>
      {/* Categories */}
      <section className="py-8 bg-black border-b border-white/10 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex-shrink-0 text-xs font-semibold tracking-[0.1em] uppercase px-4 py-2 border transition-colors duration-200 ${
                  active === cat
                    ? "border-white text-white bg-white/10"
                    : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-16">Nenhum artigo nesta categoria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((post) => (
                <article
                  key={post.slug}
                  className="border border-white/10 group hover:border-white/30 transition-colors duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 border border-white/10 px-2 py-1">
                        {post.category}
                      </span>
                      <span className="text-gray-600 text-xs">{post.readTime} de leitura</span>
                    </div>

                    <h2
                      className="text-white text-xl font-bold leading-snug mb-3 group-hover:text-gray-200 transition-colors duration-200"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs">
                        {new Date(post.date).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-white text-sm font-medium group-hover:gap-3 flex items-center gap-2 transition-all duration-200">
                        Ler artigo
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="group-hover:translate-x-1 transition-transform duration-200"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
