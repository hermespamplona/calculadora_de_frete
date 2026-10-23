import { buscar } from "./dom.js";
const janela = buscar("#sent-dialog");
const numero = buscar("#sent-dialog-number");
// Mostra o popup de envio; aoFechar() roda quando a pessoa fecha (botão ou Esc).
export function mostrarAvisoEnviado(numeroOrcamento, aoFechar) {
    numero.textContent = numeroOrcamento;
    janela.addEventListener("close", aoFechar, { once: true });
    janela.showModal();
}
