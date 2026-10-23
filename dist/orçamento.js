// Carrega a tabela de preços e taxas usada no cálculo.
export async function carregarValores() {
    const resposta = await fetch("valores.json");
    if (!resposta.ok) {
        throw new Error(`Não foi possível carregar valores.json (${resposta.status}).`);
    }
    return Object.freeze((await resposta.json()));
}
