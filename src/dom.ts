// Busca um elemento da página e avisa claramente se ele não existir no HTML.
export function buscar<T extends Element = HTMLElement>(seletor: string): T {
  const elemento = document.querySelector<T>(seletor);
  if (!elemento) {
    throw new Error(`Elemento não encontrado no HTML: ${seletor}`);
  }
  return elemento;
}
