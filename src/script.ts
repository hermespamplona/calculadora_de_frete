import { carregarValores } from "./orçamento.js";
import { calcularOrcamento } from "./calculo.js";
import { mostrarAvisoEnviado } from "./aviso.js";
import {
  aoMudarFormulario,
  bloquearFormulario,
  configurarFormulario,
  confirmarFormularioCompleto,
  esconderErro,
  formularioValido,
  lerFormulario,
  mostrarErro,
} from "./formulario.js";
import { mostrarResumo } from "./resumo.js";
import { preencherTextos } from "./textos.js";
import { aoClicarNoWhatsapp, atualizarWhatsapp, bloquearWhatsapp } from "./whatsapp.js";

configurarFormulario();

// Depois do envio, trava tudo até a pessoa fechar o popup; os dados continuam no formulário.
aoClicarNoWhatsapp(confirmarFormularioCompleto, (numero) => {
  bloquearFormulario(true);
  bloquearWhatsapp(true);
  mostrarAvisoEnviado(numero, () => {
    bloquearFormulario(false);
    bloquearWhatsapp(false);
  });
});

// Os valores vêm de valores.json; o cálculo só começa depois que eles chegam.
carregarValores()
  .then((valores) => {
    preencherTextos(valores);
    const chavesServicos = Object.keys(valores.servicosExtras);
    const atualizarOrcamento = () => {
      esconderErro();
      const dados = lerFormulario(chavesServicos);
      const resultado = calcularOrcamento(dados, valores);
      mostrarResumo(dados, resultado);
      atualizarWhatsapp(dados, resultado, formularioValido());
    };
    aoMudarFormulario(atualizarOrcamento);
    atualizarOrcamento();
  })
  .catch((error: unknown) => {
    console.error(error);
    mostrarErro("Não foi possível carregar a tabela de valores. Tente novamente mais tarde.");
  });
