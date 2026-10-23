# Spec — Divisão de responsabilidades do JavaScript

**Data:** 20/10/2026
**Status:** implementado

## Problema

Quase toda a lógica da calculadora ficava em `script.js` (cerca de 265 linhas): ler o
formulário, calcular, mostrar o resumo, montar a mensagem do WhatsApp e funções
auxiliares. Além disso, várias regras de preço estavam escritas direto no código, fora
do `valores.json`:

- preço por bloco de distância (R$ 10 na mesma cidade, R$ 8 entre cidades);
- tamanho do bloco (5 km);
- descontos (5% a partir de 30 km na mesma cidade; 10% a partir de 50 km entre cidades);
- taxa de fim de semana (15%);
- nomes dos serviços extras.

## Objetivo

1. Cada arquivo com **uma responsabilidade**.
2. **Todos** os valores e taxas do cálculo no `valores.json`.
3. O resultado do orçamento (valores na tela e mensagem do WhatsApp) **não muda**.

## Arquivos

| Arquivo | Responsabilidade | Mexe na página? |
|---|---|---|
| `valores.json` | Todos os preços, taxas e nomes dos serviços. | — |
| `tipos.ts` | Tipos do TypeScript (formato dos valores, dados e resultado). | — |
| `dom.ts` | `buscar()`: acha elementos do HTML com erro claro se faltar. | — |
| `textos.ts` | Preenche os preços e taxas que aparecem nos textos da página (`data-valor`). | Sim |
| `orçamento.ts` | Busca o `valores.json` com `fetch` e devolve os valores. | Não |
| `calculo.ts` | Faz as contas: recebe dados + valores e devolve o resultado. | Não |
| `formulario.ts` | Lê os campos, controla os campos de andar, validação e mensagem de erro. | Sim |
| `resumo.ts` | Escreve o resultado no painel "Orçamento". | Sim |
| `whatsapp.ts` | Monta a mensagem e atualiza o botão do WhatsApp. | Sim |
| `formatacao.ts` | Formata moeda, distância e percentual. | Não |
| `script.ts` | "Maestro": carrega os valores e liga tudo na ordem certa. | — |

## Fluxo

```
valores.json → orçamento.js ──────────────┐
                                          ▼
formulario.js ── dados ──→ calculo.js ── resultado ──→ resumo.js
                                                    └→ whatsapp.js

script.js: a cada mudança no formulário →
  ler formulário → calcular → mostrar resumo → atualizar WhatsApp
```

## Decisões

- **Módulos JavaScript** (`import`/`export`). O `index.html` carrega só
  `<script type="module" src="script.js">`; cada arquivo importa o que usa. Isso evita
  variáveis globais e problemas de ordem entre scripts.
- **`calculo.ts` não acessa a página.** Recebe objetos e devolve objetos, então dá para
  testar as contas isoladamente e mudar o visual sem risco de quebrar o cálculo.
- **Percentuais no JSON ficam em decimal** (`0.15` = 15%).
- É preciso abrir o site **por um servidor** (Live Server ou `iniciar-servidor.bat`).
  Tanto o `fetch` quanto os módulos não funcionam abrindo o arquivo direto (`file://`).

## TypeScript (adicionado depois)

O código fica em **`src/*.ts`** e é compilado para **`dist/*.js`**, que é o que o
navegador carrega (`<script type="module" src="dist/script.js">`).

- **Nunca edite `dist/`** — ele é gerado. Edite `src/` e compile.
- `npm run build` compila uma vez; `npm run dev` recompila sozinho a cada alteração;
  `iniciar-servidor.bat` compila e liga o servidor.
- `src/tipos.ts` descreve o formato do `valores.json`, dos dados do formulário e do
  resultado. Se mudar o `valores.json`, atualize a interface `Valores` também.
- `src/dom.ts` tem `buscar()`, que acha um elemento do HTML e dá erro claro se ele
  não existir.
- Nos imports, a extensão é `.js` (ex.: `import ... from "./calculo.js"`), mesmo o
  arquivo sendo `.ts` — é o nome que o arquivo terá depois de compilado.
- O `servidor.js` continua em JavaScript (é ferramenta, não roda no navegador).

## Formato do `valores.json`

```json
{
  "valoresBaseComodos": { "umComodo": 450, "doisComodos": 700, "tresComodos": 980,
                          "quatroComodos": 1300, "cincoOuMaisComodos": 1650 },
  "servicosExtras": { "desmontagem": { "nome": "Desmontagem", "valor": 280 }, "...": {} },
  "frete": { "kmPorBloco": 5, "valorBlocoMesmaCidade": 10, "valorBlocoOutraCidade": 8 },
  "descontos": {
    "mesmaCidade": { "distanciaMinima": 30, "percentual": 0.05 },
    "outraCidade": { "distanciaMinima": 50, "percentual": 0.10 }
  },
  "valorPorAndarSemElevador": 30,
  "taxaFimDeSemana": 0.15
}
```

A chave de cada serviço em `servicosExtras` precisa ser igual ao `name` do checkbox
no `index.html` (ex.: `name="item_pesado"`).

## Regras do cálculo (para referência)

1. **Frete:** `arredondar para cima(distância ÷ kmPorBloco) × valor do bloco`. O valor
   do bloco depende de origem e destino serem a mesma cidade (ignora acentos e
   maiúsculas).
2. **Valor-base:** pela quantidade de cômodos (5 ou mais usam o mesmo valor).
3. **Valor bruto** = frete + valor-base + serviços extras.
4. **Desconto** sobre o valor bruto, conforme a distância mínima de cada caso.
5. **Taxa de andar** (só sem elevador): `andar × valorPorAndarSemElevador`, somando
   origem e destino. Entra **depois** do desconto.
6. **Fim de semana:** `taxaFimDeSemana` sobre (subtotal + taxa de andar).
7. **Total** = subtotal + taxa de andar + taxa de fim de semana.

## Como mudar algo no futuro

- **Preço ou taxa** → `valores.json`.
- **Regra de cálculo** → `src/calculo.ts`.
- **O que aparece no painel** → `src/resumo.ts` (e o HTML).
- **Texto do WhatsApp** → `src/whatsapp.ts`.
- **Novo serviço extra** → adicionar em `valores.json` **e** um checkbox no
  `index.html` com o mesmo `name` (copie um existente e troque a chave nos `data-valor`).

## Preços nos textos da página

Nenhum preço fica escrito à mão no `index.html`. Cada valor é um elemento marcado com
o caminho dele no `valores.json`, e o `textos.ts` preenche quando o JSON carrega:

```html
<span data-valor="servicosExtras.embalagem.valor" data-formato="moeda">—</span>
<span data-valor="taxaFimDeSemana" data-formato="percentual">—</span>
<span data-valor="frete.kmPorBloco" data-formato="numero">—</span>
<span data-valor="servicosExtras.embalagem.nome">Embalagem</span>
```

- `data-formato`: `moeda` (R$ 10,00), `percentual` (0.15 → 15%) ou `numero` (5).
  Sem `data-formato`, o valor é usado como texto (ex.: nome do serviço).
- Se o caminho estiver errado, aparece um aviso no console do navegador.
- Para mostrar um valor novo num texto, basta usar um `<span data-valor="...">`.
