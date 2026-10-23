import { buscar } from "./dom.js";
import { formatarDistancia, formatarMoeda, formatarPercentual } from "./formatacao.js";
import type { DadosFormulario, ResultadoOrcamento } from "./tipos.js";

const VAZIO = "—";

// Escreve o resultado do cálculo no painel "Orçamento".
export function mostrarResumo(dados: DadosFormulario, resultado: ResultadoOrcamento): void {
  const r = resultado;
  const mostrarValor = (mostrar: boolean, valor: number) => (mostrar ? formatarMoeda(valor) : VAZIO);

  const rota = [
    r.temCidades ? `${dados.origem.cidade} → ${dados.destino.cidade}` : null,
    r.temDistancia ? `${formatarDistancia(dados.distancia!)} km` : null,
    r.temComodos ? `${dados.comodos} ${dados.comodos === 1 ? "cômodo" : "cômodos"}` : null,
  ].filter(Boolean);
  texto("#route-summary", rota.length > 0
    ? rota.join(" · ")
    : "Preencha o formulário para ver os valores.");

  texto("#room-base-price", mostrarValor(r.temComodos, r.valorComodos));
  texto("#transport-price", mostrarValor(r.temFrete, r.valorFrete));

  texto("#services-price", formatarMoeda(r.valorServicos));
  esconder("#services-row", r.servicosSelecionados.length === 0);
  texto("#selected-services", r.servicosSelecionados
    .map(({ nome, valor }) => `${nome} (${formatarMoeda(valor)})`)
    .join(", "));
  esconder("#selected-services-row", r.servicosSelecionados.length === 0);

  texto("#gross-price", mostrarValor(r.temAlgumValor, r.valorBruto));

  if (r.percentualDesconto > 0) {
    texto("#discount-label", `Desconto (${formatarPercentual(r.percentualDesconto)})`);
    texto("#discount-amount", `− ${formatarMoeda(r.valorDesconto)}`);
  }
  esconder("#discount-row", r.percentualDesconto === 0);

  texto("#subtotal-price", mostrarValor(r.temAlgumValor, r.subtotal));

  texto("#floor-fee", formatarMoeda(r.valorTaxaAndar));
  esconder("#floor-fee-row", r.valorTaxaAndar === 0);
  texto("#second-subtotal-price", mostrarValor(r.temAlgumValor, r.subtotalComAndar));
  esconder("#second-subtotal-row", !dados.fimDeSemana || r.valorTaxaAndar === 0);

  if (dados.fimDeSemana) {
    texto("#weekend-fee", mostrarValor(r.temAlgumValor, r.valorFimDeSemana));
  }
  esconder("#weekend-fee-row", !dados.fimDeSemana);

  texto("#final-price", mostrarValor(r.temAlgumValor, r.total));
}

function texto(seletor: string, conteudo: string): void {
  buscar(seletor).textContent = conteudo;
}

function esconder(seletor: string, esconde: boolean): void {
  buscar(seletor).hidden = esconde;
}
