---
trigger: always_on
---

PRD: RefVault (Gerenciador de Referências & Curadoria)
======================================================

1\. Visão Geral
---------------

Um sistema de curadoria de links focado em design, desenvolvimento e ferramentas de IA. O objetivo é centralizar o "Second Brain" de referências da **Loomine** e do seu fluxo como professor, permitindo que o público acesse o que você seleciona, mas mantendo o controle total na área administrativa.

2\. Público-Alvo
----------------

-   **Público:** Alunos de sistemas e entusiastas de design/dev.

-   **Admin:** Você (e possivelmente sua equipe no futuro).

3\. Arquitetura Técnica (Stack)
-------------------------------

-   **Framework:** Next.js 15 (App Router)

-   **Estilização:** Tailwind CSS 4

-   **Banco de Dados & Auth:** Supabase (PostgreSQL + RLS + Storage)

-   **Linguagem:** TypeScript

-   **API:** OpenAI/Anthropic (para geração automática de metadados via agentes)

* * * * *

4\. Requisitos Funcionais
-------------------------

### A. Área Pública (Landing Page)

-   **Feed de Referências:** Listagem em grid (cards) com filtros por categorias e subcategorias.

-   **Busca:** Campo de busca textual por nome, tag ou descrição.

-   **Visualização Individual:** Modal ou página de detalhes mostrando o link, uma breve descrição gerada por IA e as tags.

-   **Compartilhamento:** Botão para copiar link direto.

### B. Área Administrativa (Dashboard)

-   **Autenticação:** Login via Magic Link ou Google (Supabase Auth).

-   **Gestão de Links (CRUD):**

    -   Input para URL.

    -   **Autofill Inteligente:** Ao colar o link, o sistema usa uma **Edge Function** para buscar metadados (og:image, title) e sugere categorias/tags.

-   **Gestão de Categorias:** Criar, editar e deletar categorias e subcategorias (ex: Design -> Inspiração).

-   **Status de Visibilidade:** Opção de manter link como "Rascunho" ou "Público".

* * * * *

5\. Modelo de Dados (Supabase/PostgreSQL)
-----------------------------------------

| **Tabela** | **Campos Principais** |
| --- | --- |
| **profiles** | id, full_name, avatar_url, role (admin/user) |
| **categories** | id, name, slug, parent_id (para subcategorias) |
| **bookmarks** | id, url, title, description, image_url, category_id, is_public, created_at |
| **tags** | id, name |
| **bookmark_tags** | bookmark_id, tag_id |

* * * * *

6\. Fluxo do Agente de IA (Automação)
-------------------------------------

Para tornar o sistema "inteligente" como você planeja:

1.  O usuário cola a URL no Admin.

2.  Um agente (via OpenAI API) recebe o conteúdo do site (scraping).

3.  O agente retorna um JSON com: **Título Otimizado**, **Resumo de 2 sentenças**, **Sugestão de Categoria** e **3 a 5 Tags**.

7\. Regras de Negócio
---------------------

-   **Segurança:** Apenas usuários com `role: admin` na tabela de profiles podem acessar rotas `/admin/*`.

-   **Performance:** Uso de `ISR` (Incremental Static Regeneration) ou `Server Components` com cache para que a área pública seja extremamente rápida.

-   **Internacionalização:** Conforme suas diretrizes, código e banco em **Inglês**, mas interface e conteúdo podem ser em Português.