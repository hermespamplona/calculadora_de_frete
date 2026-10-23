const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});
const formatadorDistancia = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
export function formatarMoeda(valor) {
    return formatadorMoeda.format(valor);
}
export function formatarDistancia(distancia) {
    return formatadorDistancia.format(distancia);
}
// 0.15 → "15%"
export function formatarPercentual(taxa) {
    return `${Number((taxa * 100).toFixed(2))}%`;
}
// 2026-10-22 → "22/10/2026"
export function formatarData(data) {
    return data.toLocaleDateString("pt-BR");
}
