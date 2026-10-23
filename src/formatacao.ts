const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatadorDistancia = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function formatarMoeda(valor: number): string {
  return formatadorMoeda.format(valor);
}

export function formatarDistancia(distancia: number): string {
  return formatadorDistancia.format(distancia);
}

// 0.15 → "15%"
export function formatarPercentual(taxa: number): string {
  return `${Number((taxa * 100).toFixed(2))}%`;
}

// 2026-10-22 → "22/10/2026"
export function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}
