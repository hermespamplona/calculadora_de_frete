import type { Valores } from "./tipos.js";

// Carrega a tabela de preços e taxas usada no cálculo.
export async function carregarValores(): Promise<Readonly<Valores>> {
  const resposta = await fetch("valores.json");
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar valores.json (${resposta.status}).`);
  }
  return Object.freeze((await resposta.json()) as Valores);
}
