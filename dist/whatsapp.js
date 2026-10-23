import { buscar } from "./dom.js";
import { formatarData, formatarDistancia, formatarMoeda, formatarPercentual } from "./formatacao.js";
const link = buscar("#whatsapp-link");
const NUMERO_WHATSAPP = "5565999811250";
// Cada envio ganha um número novo: OS2026 + mês, dia, hora, minuto e segundo.
let dataOrcamento = new Date();
let numeroOrcamento = gerarNumeroOrcamento(dataOrcamento);
let ultimoOrcamento = null;
let bloqueado = false;
// podeEnviar() decide se o clique segue para o WhatsApp; aoEnviar() roda depois que ele abre.
export function aoClicarNoWhatsapp(podeEnviar, aoEnviar) {
    link.addEventListener("click", (event) => {
        if (bloqueado || !podeEnviar() || !ultimoOrcamento) {
            event.preventDefault();
            return;
        }
        dataOrcamento = new Date();
        numeroOrcamento = gerarNumeroOrcamento(dataOrcamento);
        link.href = montarLink(ultimoOrcamento.dados, ultimoOrcamento.resultado);
        aoEnviar(numeroOrcamento);
    });
}
// Só libera o botão quando o formulário está completo e não há envio em andamento.
export function atualizarWhatsapp(dados, resultado, completo) {
    ultimoOrcamento = completo ? { dados, resultado } : null;
    link.href = completo ? montarLink(dados, resultado) : "#";
    atualizarEstadoBotao();
}
export function bloquearWhatsapp(valor) {
    bloqueado = valor;
    atualizarEstadoBotao();
}
function atualizarEstadoBotao() {
    const desabilitado = bloqueado || !ultimoOrcamento;
    link.classList.toggle("is-disabled", desabilitado);
    link.setAttribute("aria-disabled", String(desabilitado));
}
function montarLink(dados, resultado) {
    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(montarMensagem(dados, resultado))}`;
}
function gerarNumeroOrcamento(data) {
    const partes = [data.getMonth() + 1, data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds()];
    return `OS2026${partes.map((parte) => String(parte).padStart(2, "0")).join("")}`;
}
export function montarMensagem(dados, resultado) {
    const r = resultado;
    const listaServicos = r.servicosSelecionados
        .map(({ nome, valor }) => `${nome} (${formatarMoeda(valor)})`)
        .join(", ");
    const extras = [
        ...[dados.origem, dados.destino]
            .filter(({ andar }) => andar !== null)
            .map(({ rotuloAndar, andar, elevador }) => `${rotuloAndar}: ${andar} (${elevador ? "com" : "sem"} elevador)`),
        dados.fimDeSemana ? "Entrega no fim de semana" : null,
    ].filter(Boolean);
    return [
        "Olá! Gostaria de solicitar este frete:",
        `Orçamento nº ${numeroOrcamento} - ${formatarData(dataOrcamento)}`,
        `Origem: ${dados.origem.cidade} - CEP ${dados.origem.cep}`,
        `Destino: ${dados.destino.cidade} - CEP ${dados.destino.cep}`,
        `Distância sugerida: ${formatarDistancia(dados.distancia)} km`,
        `Cômodos: ${dados.comodos}`,
        `Valor-base do orçamento: ${formatarMoeda(r.valorComodos)}`,
        `Valor do frete: ${formatarMoeda(r.valorFrete)}`,
        ...(r.servicosSelecionados.length > 0
            ? [
                `Serviços extras: ${listaServicos}`,
                `Total dos serviços extras: ${formatarMoeda(r.valorServicos)}`,
            ]
            : []),
        ...(extras.length > 0 ? [`Informações extras: ${extras.join(", ")}`] : []),
        `Valor bruto: ${formatarMoeda(r.valorBruto)}`,
        ...(r.percentualDesconto > 0
            ? [`Desconto (${formatarPercentual(r.percentualDesconto)}): ${formatarMoeda(r.valorDesconto)}`]
            : []),
        `Subtotal: ${formatarMoeda(r.subtotal)}`,
        ...(r.valorTaxaAndar > 0
            ? [`Taxa de andar sem elevador: ${r.taxasAndar.map(({ rotulo, andar, valor }) => `${rotulo} ${andar} (${formatarMoeda(valor)})`).join(", ")} = ${formatarMoeda(r.valorTaxaAndar)}`]
            : []),
        ...(dados.fimDeSemana
            ? [
                ...(r.valorTaxaAndar > 0
                    ? [`Subtotal com taxa de andar: ${formatarMoeda(r.subtotalComAndar)}`]
                    : []),
                `Taxa de fim de semana (${formatarPercentual(r.percentualFimDeSemana)}): ${formatarMoeda(r.valorFimDeSemana)}`,
            ]
            : []),
        `Total do frete: ${formatarMoeda(r.total)}`,
    ].join("\n");
}
