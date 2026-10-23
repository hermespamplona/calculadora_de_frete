// Busca um elemento da página e avisa claramente se ele não existir no HTML.
export function buscar(seletor) {
    const elemento = document.querySelector(seletor);
    if (!elemento) {
        throw new Error(`Elemento não encontrado no HTML: ${seletor}`);
    }
    return elemento;
}
