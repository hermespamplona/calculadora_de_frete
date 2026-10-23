import { buscar } from "./dom.js";
import type { DadosFormulario, Local } from "./tipos.js";

interface CamposAndar {
  checkbox: HTMLInputElement;
  campo: HTMLElement;
  input: HTMLInputElement;
  elevador: HTMLInputElement;
}

const form = buscar<HTMLFormElement>("#freight-form");
const mensagemErro = buscar("#form-error");
const andares: Record<"origem" | "destino", CamposAndar> = {
  origem: {
    checkbox: buscar<HTMLInputElement>("#has-origin-floor"),
    campo: buscar("#origin-floor-field"),
    input: buscar<HTMLInputElement>("#origin-floor"),
    elevador: buscar<HTMLInputElement>("#origin-elevator"),
  },
  destino: {
    checkbox: buscar<HTMLInputElement>("#has-destination-floor"),
    campo: buscar("#destination-floor-field"),
    input: buscar<HTMLInputElement>("#destination-floor"),
    elevador: buscar<HTMLInputElement>("#destination-elevator"),
  },
};

export function configurarFormulario(): void {
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
export function bloquearFormulario(bloqueado: boolean): void {
  for (const fieldset of form.querySelectorAll("fieldset")) {
    fieldset.disabled = bloqueado;
  }
}

export function aoMudarFormulario(callback: () => void): void {
  form.addEventListener("input", callback);
  form.addEventListener("change", callback);
}

// Devolve os dados digitados. Campos numéricos vazios viram null.
export function lerFormulario(chavesServicos: string[]): DadosFormulario {
  return {
    origem: lerLocal("origin", andares.origem),
    destino: lerLocal("destination", andares.destino),
    distancia: lerNumero("#distance"),
    comodos: lerNumero("#room-count"),
    fimDeSemana: buscar<HTMLInputElement>("#weekend").checked,
    servicos: chavesServicos.filter((chave) =>
      buscar<HTMLInputElement>(`[name="${chave}"]`).checked),
  };
}

export function formularioValido(): boolean {
  return form.checkValidity();
}

// Usado antes de enviar: destaca os campos faltando e mostra o aviso.
export function confirmarFormularioCompleto(): boolean {
  if (form.checkValidity()) return true;
  form.reportValidity();
  mostrarErro("Preencha todos os campos obrigatórios para enviar o orçamento.");
  return false;
}

export function mostrarErro(texto: string): void {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

export function esconderErro(): void {
  mensagemErro.hidden = true;
}

function lerLocal(prefixo: "origin" | "destination", { checkbox, input, elevador }: CamposAndar): Local {
  return {
    cidade: buscar<HTMLInputElement>(`#${prefixo}-city`).value.trim(),
    cep: buscar<HTMLInputElement>(`#${prefixo}-zip`).value.trim(),
    andar: checkbox.checked ? Number(input.value) : null,
    elevador: elevador.checked,
    rotuloAndar: input.labels?.[0]?.textContent ?? "",
  };
}

function lerNumero(seletor: string): number | null {
  const valor = buscar<HTMLInputElement>(seletor).value;
  return valor === "" ? null : Number(valor);
}
