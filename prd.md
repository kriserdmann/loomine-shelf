# PRD: Loomine Shelf (Reference & Curation Manager)

## 1. Overview
A link curation system focused on design, development, and AI tools. The goal is to centralize the "Second Brain" of Loomine's references and teaching workflow, allowing the public to access what is selected, while maintaining total control in the administrative area.

## 2. Target Audience
- **Public:** Systems students and design/dev enthusiasts.
- **Admin:** You (and possibly your team in the future).

## 3. Technical Architecture (Stack)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Database & Auth:** Supabase (PostgreSQL + RLS + Storage)
- **Language:** TypeScript
- **API:** OpenAI/Anthropic (for automatic metadata generation via agents)

## 4. Functional Requirements

### A. Public Area (Landing Page)
- **Reference Feed:** Grid listing (cards) with filters by categories and subcategories.
- **Search:** Text search field by name, tag, or description.
- **Individual View:** Modal or details page showing the link, a brief AI-generated description, and tags.
- **Sharing:** Button to copy direct link.

### B. Administrative Area (Dashboard)
- **Authentication:** Login via Magic Link or Google (Supabase Auth).
- **Link Management (CRUD):**
  - URL input.
  - **Smart Autofill:** Upon pasting a link, the system uses an Edge Function to fetch metadata (og:image, title) and suggests categories/tags.
- **Category Management:** Create, edit, and delete categories and subcategories (e.g., Design -> Inspiration).
- **Visibility Status:** Option to keep a link as "Draft" or "Public".

## 5. Data Model (Supabase/PostgreSQL)

| Table | Main Fields |
| --- | --- |
| **profiles** | id, full_name, avatar_url, role (admin/user) |
| **categories** | id, name, slug, parent_id (for subcategories) |
| **bookmarks** | id, url, title, description, image_url, category_id, is_public, created_at |
| **tags** | id, name |
| **bookmark_tags** | bookmark_id, tag_id |

## 6. AI Agent Flow (Automation)
To make the system "smart" as planned:
1. The user pastes the URL in the Admin area.
2. An agent (via OpenAI API) receives the website content (scraping).
3. The agent returns a JSON with: Optimized Title, 2-sentence Summary, Category Suggestion, and 3 to 5 Tags.

## 7. Business Rules
- **Security:** Only users with `role: admin` in the profiles table can access `/admin/*` routes.
- **Performance:** Use ISR (Incremental Static Regeneration) or Server Components with cache to make the public area extremely fast.
- **Internationalization:** Code and database in English, but interface and content can be in Portuguese.
