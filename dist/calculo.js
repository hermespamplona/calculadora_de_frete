// Contas do orçamento. Não acessa a página: recebe dados e valores, devolve o resultado.
export function calcularOrcamento(dados, valores) {
    const temCidades = dados.origem.cidade !== "" && dados.destino.cidade !== "";
    const temDistancia = Number.isFinite(dados.distancia) && dados.distancia >= 0;
    const temComodos = Number.isInteger(dados.comodos) && dados.comodos >= 1;
    const distancia = temDistancia ? dados.distancia : 0;
    // O frete depende da distância e de saber se as cidades são iguais.
    const mesmaCidade = temCidades &&
        normalizarCidade(dados.origem.cidade) === normalizarCidade(dados.destino.cidade);
    const temFrete = temDistancia && temCidades;
    const { kmPorBloco, valorBlocoMesmaCidade, valorBlocoOutraCidade } = valores.frete;
    const valorBloco = mesmaCidade ? valorBlocoMesmaCidade : valorBlocoOutraCidade;
    const valorFrete = temFrete ? Math.ceil(distancia / kmPorBloco) * valorBloco : 0;
    const valorComodos = temComodos ? obterValorBaseComodos(dados.comodos, valores) : 0;
    const servicosSelecionados = dados.servicos.map((chave) => ({
        chave,
        ...valores.servicosExtras[chave],
    }));
    const valorServicos = somar(servicosSelecionados);
    // Sem elevador, cobra-se um valor por andar (origem e destino somados).
    const taxasAndar = [dados.origem, dados.destino]
        .filter(({ andar, elevador }) => andar !== null && andar > 0 && !elevador)
        .map(({ rotuloAndar, andar }) => ({
        rotulo: rotuloAndar,
        andar: andar,
        valor: andar * valores.valorPorAndarSemElevador,
    }));
    const valorTaxaAndar = somar(taxasAndar);
    const temAlgumValor = temFrete || temComodos || servicosSelecionados.length > 0 ||
        valorTaxaAndar > 0;
    const valorBruto = valorFrete + valorComodos + valorServicos;
    const regraDesconto = mesmaCidade ? valores.descontos.mesmaCidade : valores.descontos.outraCidade;
    const percentualDesconto = temFrete && distancia >= regraDesconto.distanciaMinima
        ? regraDesconto.percentual
        : 0;
    const valorDesconto = valorBruto * percentualDesconto;
    const subtotal = valorBruto - valorDesconto;
    // A taxa de andar entra depois do desconto, mas recebe o acréscimo de fim de semana.
    const subtotalComAndar = subtotal + valorTaxaAndar;
    const percentualFimDeSemana = valores.taxaFimDeSemana;
    const valorFimDeSemana = dados.fimDeSemana ? subtotalComAndar * percentualFimDeSemana : 0;
    const total = subtotalComAndar + valorFimDeSemana;
    return {
        temCidades,
        temDistancia,
        temComodos,
        temFrete,
        temAlgumValor,
        valorComodos,
        valorFrete,
        servicosSelecionados,
        valorServicos,
        taxasAndar,
        valorTaxaAndar,
        valorBruto,
        percentualDesconto,
        valorDesconto,
        subtotal,
        subtotalComAndar,
        percentualFimDeSemana,
        valorFimDeSemana,
        total,
    };
}
function obterValorBaseComodos(comodos, valores) {
    const tabela = valores.valoresBaseComodos;
    if (comodos === 1)
        return tabela.umComodo;
    if (comodos === 2)
        return tabela.doisComodos;
    if (comodos === 3)
        return tabela.tresComodos;
    if (comodos === 4)
        return tabela.quatroComodos;
    return tabela.cincoOuMaisComodos;
}
function normalizarCidade(cidade) {
    return cidade
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim()
        .toLocaleLowerCase("pt-BR");
}
function somar(itens) {
    return itens.reduce((total, { valor }) => total + valor, 0);
}
