# Guia de Configuração - Zim Imóveis

Este é um aplicativo React + Vite para catálogo de imóveis. Siga os passos abaixo para configurar e rodar o projeto.

## Pré-requisitos

- **Node.js** (versão 18 ou superior)  
  Verifique se está instalado: `node --version`

- **npm** (vem com o Node.js)  
  Verifique: `npm --version`

## Passo 1: Instalar dependências

No terminal, na pasta do projeto (`ZimImoveis`), execute:

```bash
npm install
```

Isso instala React, React Router, Vite, react-icons, react-select e as demais dependências.

## Passo 2: Rodar em modo desenvolvimento

Para abrir o app no navegador com atualização em tempo real:

```bash
npm run dev
```

O app estará disponível em: **http://localhost:5173**

- **Home** → `http://localhost:5173/` ou `/home`
- **Catálogo** → `/catalogo`
- **Cadastro de imóveis** → `/cadastroimoveis`
- **Detalhes do imóvel** → `/detalhes/:id`

## Outros comandos

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run build`| Gera versão para produção em `dist/` |
| `npm run preview` | Servidor local para testar o build |
| `npm run lint` | Executa o ESLint no código         |

## Estrutura do projeto

- `src/` — Código fonte (páginas, componentes, estilos)
- `public/` — Imagens e arquivos estáticos (Logo, imagens de imóveis)
- `vite.config.js` — Configuração do Vite (porta 5173, host 0.0.0.0)

## Configuração do Vite (já definida)

No `vite.config.js` estão configurados:

- **Porta:** 5173
- **Host:** 0.0.0.0 (acessível na rede local, útil para testar em celular/tablet)

Para mudar a porta, edite o valor de `port` em `server` dentro de `vite.config.js`.

## Resumo rápido

1. Abra o terminal na pasta `ZimImoveis`.
2. Execute: `npm install`
3. Depois: `npm run dev`
4. Acesse no navegador: http://localhost:5173

Se algo falhar, verifique se o Node.js está instalado e se nenhum outro programa está usando a porta 5173.
