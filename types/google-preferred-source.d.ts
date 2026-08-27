/**
 * O botão oficial de Fontes Preferidas é ativado por um atributo sem valor
 * (`google-add-preferred-source-btn`) que o TypeScript não conhece. Declarar
 * aqui evita `any` no componente e mantém o atributo escrito de um jeito só —
 * se alguém digitar errado, o build reclama em vez de renderizar uma div vazia.
 */
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    "google-add-preferred-source-btn"?: string;
    "data-theme"?: string;
    "data-lang"?: string;
  }
}
