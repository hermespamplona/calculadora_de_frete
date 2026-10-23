import { formatarDistancia, formatarMoeda, formatarPercentual } from "./formatacao.js";
import type { Valores } from "./tipos.js";

const formatadores: Record<string, (valor: number) => string> = {
  moeda: formatarMoeda,
  percentual: formatarPercentual,
  numero: formatarDistancia,
};

// Preenche os textos da página marcados com data-valor="caminho.no.valores.json".
// data-formato (moeda, percentual ou numero) diz como mostrar números.
// Ex.: <span data-valor="servicosExtras.embalagem.valor" data-formato="moeda">
export function preencherTextos(valores: Valores): void {
  for (const elemento of document.querySelectorAll<HTMLElement>("[data-valor]")) {
    const caminho = elemento.dataset.valor ?? "";
    const valor = lerCaminho(valores, caminho);
    const formatar = formatadores[elemento.dataset.formato ?? ""];

    if (typeof valor === "number" && formatar) {
      elemento.textContent = formatar(valor);
    } else if (typeof valor === "string" && !elemento.dataset.formato) {
      elemento.textContent = valor;
    } else {
      console.warn(`data-valor inválido no HTML: "${caminho}"`, elemento);
    }
  }
}

function lerCaminho(objeto: unknown, caminho: string): unknown {
  return caminho.split(".").reduce<unknown>(
    (atual, chave) =>
      atual !== null && typeof atual === "object" ? (atual as Record<string, unknown>)[chave] : undefined,
    objeto,
  );
}
