/**
 * Busca avaliações do Google Business Profile (Places API New) e salva
 * em data/testimonials.json para renderização estática no build.
 *
 * Uso:
 *   GOOGLE_MAPS_API_KEY=xxx GOOGLE_PLACE_ID=ChIJ... node scripts/fetch-reviews.mjs
 *
 * Comportamento fail-soft: sem credenciais ou com erro de rede, o arquivo
 * existente é mantido e o build continua normalmente.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../data/testimonials.json");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const MIN_STARS = 4;

function keepExisting(reason) {
  console.log(`[fetch-reviews] ${reason} — mantendo data/testimonials.json atual.`);
  process.exit(0);
}

if (!API_KEY || !PLACE_ID) {
  keepExisting("GOOGLE_MAPS_API_KEY/GOOGLE_PLACE_ID não configurados");
}

const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=pt-BR`;

try {
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews",
    },
  });

  if (!res.ok) {
    keepExisting(`Places API respondeu ${res.status}: ${await res.text()}`);
  }

  const place = await res.json();
  const reviews = (place.reviews ?? [])
    .filter((r) => (r.rating ?? 0) >= MIN_STARS)
    .map((r) => ({
      name: r.authorAttribution?.displayName ?? "Aluno(a)",
      role: `Avaliação no Google · ${r.relativePublishTimeDescription ?? ""}`.trim(),
      text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      stars: r.rating ?? 5,
    }))
    .filter((r) => r.text.length > 0);

  if (reviews.length === 0) {
    keepExisting("Nenhuma avaliação 4-5 estrelas com texto retornada");
  }

  const previous = JSON.parse(readFileSync(OUT, "utf8"));
  const payload = {
    source: "google-places",
    fetchedAt: new Date().toISOString(),
    placeRating: place.rating ?? previous.placeRating,
    totalReviews: place.userRatingCount ?? previous.totalReviews,
    reviews,
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(
    `[fetch-reviews] OK — ${reviews.length} avaliações salvas (nota média ${payload.placeRating}, ${payload.totalReviews} avaliações no total).`
  );
} catch (err) {
  keepExisting(`Erro de rede/execução: ${err.message}`);
}
