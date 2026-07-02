import SectionTitle from "@/components/ui/SectionTitle";
import testimonials from "@/data/testimonials.json";

interface Review {
  name: string;
  role: string;
  text: string;
  stars: number;
}

const reviews: Review[] = (testimonials.reviews as Review[]).filter(
  (r) => r.stars >= 4
);

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="14"
          height="14"
          className="text-white"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Depoimentos() {
  const fromGoogle = testimonials.source === "google-places";

  return (
    <section className="py-20 border-t border-white/10" style={{ background: "#0d0d0d" }} id="depoimentos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionTitle
            eyebrow="Depoimentos"
            title="O que dizem meus alunos"
            subtitle="Histórias reais de pessoas que decidiram investir em si mesmas."
          />
          {fromGoogle && testimonials.placeRating && (
            <p className="mt-4 text-gray-400 text-sm">
              <span className="text-white font-semibold">{Number(testimonials.placeRating).toFixed(1)} ★</span>
              {" "}no Google · {testimonials.totalReviews} avaliações
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((dep, index) => (
            <div
              key={index}
              className="border border-white/10 p-8 flex flex-col hover:border-white/30 transition-colors duration-300"
              style={{ background: "#111" }}
            >
              <StarRating count={dep.stars} />
              <blockquote className="text-gray-300 text-sm leading-relaxed flex-1 mb-6 italic font-light">
                &ldquo;{dep.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {dep.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{dep.name}</p>
                  <p className="text-gray-500 text-xs">{dep.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
