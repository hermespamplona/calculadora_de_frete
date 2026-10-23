import { buscar } from "./dom.js";
const form = buscar("#freight-form");
const mensagemErro = buscar("#form-error");
const andares = {
    origem: {
        checkbox: buscar("#has-origin-floor"),
        campo: buscar("#origin-floor-field"),
        input: buscar("#origin-floor"),
        elevador: buscar("#origin-elevator"),
    },
    destino: {
        checkbox: buscar("#has-destination-floor"),
        campo: buscar("#destination-floor-field"),
        input: buscar("#destination-floor"),
        elevador: buscar("#destination-elevator"),
    },
};
export function configurarFormulario() {
    form.addEventListener("submit", (event) => event.preventDefault());
    for (const { checkbox, campo, input, elevador } of Object.values(andares)) {
        checkbox.addEventListener("change", () => {
            campo.hidden = !checkbox.checked;
            input.disabled = !checkbox.checked;
            input.required = checkbox.checked;
            elevador.disabled = !checkbox.checked;
            if (!checkbox.checked) {
                input.value = "";
                elevador.checked = false;
            }
        });
    }
}
// Trava ou libera a edição sem apagar o que foi digitado.
export function bloquearFormulario(bloqueado) {
    for (const fieldset of form.querySelectorAll("fieldset")) {
        fieldset.disabled = bloqueado;
    }
}
export function aoMudarFormulario(callback) {
    form.addEventListener("input", callback);
    form.addEventListener("change", callback);
}
// Devolve os dados digitados. Campos numéricos vazios viram null.
export function lerFormulario(chavesServicos) {
    return {
        origem: lerLocal("origin", andares.origem),
        destino: lerLocal("destination", andares.destino),
        distancia: lerNumero("#distance"),
        comodos: lerNumero("#room-count"),
        fimDeSemana: buscar("#weekend").checked,
        servicos: chavesServicos.filter((chave) => buscar(`[name="${chave}"]`).checked),
    };
}
export function formularioValido() {
    return form.checkValidity();
}
// Usado antes de enviar: destaca os campos faltando e mostra o aviso.
export function confirmarFormularioCompleto() {
    if (form.checkValidity())
        return true;
    form.reportValidity();
    mostrarErro("Preencha todos os campos obrigatórios para enviar o orçamento.");
    return false;
}
export function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.hidden = false;
}
export function esconderErro() {
    mensagemErro.hidden = true;
}
function lerLocal(prefixo, { checkbox, input, elevador }) {
    return {
        cidade: buscar(`#${prefixo}-city`).value.trim(),
        cep: buscar(`#${prefixo}-zip`).value.trim(),
        andar: checkbox.checked ? Number(input.value) : null,
        elevador: elevador.checked,
        rotuloAndar: input.labels?.[0]?.textContent ?? "",
    };
}
function lerNumero(seletor) {
    const valor = buscar(seletor).value;
    return valor === "" ? null : Number(valor);
}
