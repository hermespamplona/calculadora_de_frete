// Formato do valores.json. Percentuais em decimal (0.15 = 15%).
export interface Valores {
  valoresBaseComodos: {
    umComodo: number;
    doisComodos: number;
    tresComodos: number;
    quatroComodos: number;
    cincoOuMaisComodos: number;
  };
  servicosExtras: Record<string, { nome: string; valor: number }>;
  frete: {
    kmPorBloco: number;
    valorBlocoMesmaCidade: number;
    valorBlocoOutraCidade: number;
  };
  descontos: {
    mesmaCidade: RegraDesconto;
    outraCidade: RegraDesconto;
  };
  valorPorAndarSemElevador: number;
  taxaFimDeSemana: number;
}

export interface RegraDesconto {
  distanciaMinima: number;
  percentual: number;
}

export interface Local {
  cidade: string;
  cep: string;
  /** null quando o andar não foi informado. */
  andar: number | null;
  elevador: boolean;
  rotuloAndar: string;
}

// O que foi digitado no formulário. Campos numéricos vazios ficam null.
export interface DadosFormulario {
  origem: Local;
  destino: Local;
  distancia: number | null;
  comodos: number | null;
  fimDeSemana: boolean;
  /** Chaves dos serviços marcados (iguais às de valores.servicosExtras). */
  servicos: string[];
}

export interface ServicoSelecionado {
  chave: string;
  nome: string;
  valor: number;
}

export interface TaxaAndar {
  rotulo: string;
  andar: number;
  valor: number;
}

export interface ResultadoOrcamento {
  temCidades: boolean;
  temDistancia: boolean;
  temComodos: boolean;
  temFrete: boolean;
  temAlgumValor: boolean;
  valorComodos: number;
  valorFrete: number;
  servicosSelecionados: ServicoSelecionado[];
  valorServicos: number;
  taxasAndar: TaxaAndar[];
  valorTaxaAndar: number;
  valorBruto: number;
  percentualDesconto: number;
  valorDesconto: number;
  subtotal: number;
  subtotalComAndar: number;
  percentualFimDeSemana: number;
  valorFimDeSemana: number;
  total: number;
}
