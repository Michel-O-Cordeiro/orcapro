# OrçaPro

Aplicação web da OrçaPro para gerenciamento de orçamentos voltada para prestadores de serviços (pedreiros, eletricistas, pintores, hidráulicos e muito mais). O objetivo do OrçaPro é centralizar, organizar e disponibilizar uma solução completa para criação, edição e acompanhamento de orçamentos, além de gerenciamento de clientes.

## Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS (com CSS variables)
- shadcn/ui para componentização (base em `src/components/ui`)
- class-variance-authority + clsx + tailwind-merge (composição de classes)
- lucide-react (ícones)
- Zustand (estado)
- Poppins (@fontsource/poppins)

## shadcn/ui

Este projeto usa shadcn/ui como base de componentes reutilizáveis.

- **Configuração:** `components.json`
- **Componentes:** `src/components/ui/*`
- **Estilos/Tokens:** `src/index.css` + `tailwind.config.js`

Quando precisar de novos componentes, priorize adicionar via shadcn/ui. Se um componente não existir, implemente seguindo o mesmo padrão de componentização (tipado, reutilizável e alinhado ao Tailwind).

## Funcionalidades

- **Autenticação:** Tela de login com e-mail e senha, e recuperação de senha
- **Dashboard:** Visualização de estatísticas (total de clientes, total de orçamentos, aprovados e faturamento) e últimos itens adicionados
- **Clientes:** CRUD completo (criar, editar, visualizar e deletar)
- **Orçamentos:** CRUD completo, com status (rascunho, enviado, aprovado, recusado), itens do orçamento, cálculo automático do total e impressão/geração de PDF (via `window.print()`)

## Requisitos

- Node.js (recomendado: LTS)
- pnpm

## Comandos

- **Instalar dependências:** `pnpm install`
- **Rodar em desenvolvimento:** `pnpm dev`
- **Build de produção:** `pnpm build`
- **Pré-visualizar build:** `pnpm preview`
- **Checagem de tipos:** `pnpm check`
- **Lint:** `pnpm lint`

## Estrutura de Pastas

```
src/
├── app/                # Arquivos de entrada da aplicação
├── pages/              # Páginas da aplicação
├── layouts/            # Layouts da aplicação
├── components/
│   ├── ui/             # Componentes shadcn/ui
│   └── shared/         # Componentes compartilhados (se houver)
├── stores/             # Estado global (Zustand)
├── types/              # Tipos TypeScript
├── lib/                # Utilitários e helpers (incluindo cn)
├── assets/             # Recursos estáticos (imagens, ícones, etc.)
└── main.tsx            # Arquivo de entrada do React
```

## Responsividade

A aplicação é completamente responsiva, adaptando-se a celulares, tablets e desktops:
- Tela de login: Imagem de fundo apenas em telas grandes, formulário centralizado em todas as resoluções
- Dashboard, Clientes e Orçamentos: Layout adaptado para diferentes tamanhos de tela
