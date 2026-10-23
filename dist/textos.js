import { formatarDistancia, formatarMoeda, formatarPercentual } from "./formatacao.js";
const formatadores = {
    moeda: formatarMoeda,
    percentual: formatarPercentual,
    numero: formatarDistancia,
};
// Preenche os textos da página marcados com data-valor="caminho.no.valores.json".
// data-formato (moeda, percentual ou numero) diz como mostrar números.
// Ex.: <span data-valor="servicosExtras.embalagem.valor" data-formato="moeda">
export function preencherTextos(valores) {
    for (const elemento of document.querySelectorAll("[data-valor]")) {
        const caminho = elemento.dataset.valor ?? "";
        const valor = lerCaminho(valores, caminho);
        const formatar = formatadores[elemento.dataset.formato ?? ""];
        if (typeof valor === "number" && formatar) {
            elemento.textContent = formatar(valor);
        }
        else if (typeof valor === "string" && !elemento.dataset.formato) {
            elemento.textContent = valor;
        }
        else {
            console.warn(`data-valor inválido no HTML: "${caminho}"`, elemento);
        }
    }
}
function lerCaminho(objeto, caminho) {
    return caminho.split(".").reduce((atual, chave) => atual !== null && typeof atual === "object" ? atual[chave] : undefined, objeto);
}
