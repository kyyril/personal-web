# Personal Website

A high-performance personal web application featuring a project portfolio, technical blog, guestbook, and an interactive AI chat interface.

**Live Site:** [kiril.is-a.dev](https://kiril.is-a.dev)

---

## Key Highlights & Features

- **High-Performance Portfolio & MDX Blog Engine:** Built with a custom MDX blog engine to publish articles on backend development, system design, and software architecture, achieving a **99+ Lighthouse score**.
- **AI Chatbot Assistant:** Integrated an interactive AI chat interface featuring **streaming responses**, **multi-turn context**, and **cost-optimized prompt engineering**.
- **Guestbook Service:** Shipped a high-performance guestbook service powered by **Bun** and **Elysia** with **PostgreSQL** persistence.
- **Technical Blog:** Dedicated space for sharing notes and guides on backend engineering, system design, and software architecture.

---

## Architecture

```mermaid
flowchart LR
    Client["Browser / Client"] --> NextApp["Next.js Frontend\n(Vercel)"]
    NextApp --> MDX["Custom MDX Blog Engine"]
    NextApp --> ChatAPI["AI Chat API\n(Streaming + Context)"]
    ChatAPI --> LLM["LLM Provider"]
    NextApp --> BackendAPI["Bun + Elysia API\n(Railway)"]
    BackendAPI --> DB[("PostgreSQL")]

```

---

## Database Schema

```mermaid
erDiagram
    users {
        string id PK
        string username
        string avatarUrl
        string email
        string firebaseUid UK
        datetime createdAt
        datetime updatedAt
    }

    guestbook_entries {
        string id PK
        string message
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    messages {
        string id PK
        string content
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    replies {
        string id PK
        string content
        string authorId FK
        string guestbookEntryId FK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    likes {
        string id PK
        string emote
        string userId FK
        string messageId FK
        datetime createdAt
    }

    users ||--o{ guestbook_entries : posts
    users ||--o{ messages : authors
    users ||--o{ replies : "writes (ReplyAuthor)"
    users ||--o{ replies : "targets (ReplyUser)"
    users ||--o{ likes : reacts
    guestbook_entries ||--o{ replies : receives
    messages ||--o{ likes : receives

```

---

## Tech Stack

* **Frontend:** Next.js, TypeScript, MDX, Tailwind CSS
* **Backend:** Bun, Elysia, PostgreSQL, Prisma
* **AI & Infrastructure:** LLM Integration, Serverless, Docker
* **Deployment:** Vercel (Frontend), Railway (Backend)

---

## Project Structure

```text
├── backend/    # Bun/Elysia server, Prisma schema, and API routes
└── frontend/   # Next.js application, MDX blog engine, AI chat, and UI components

```

---

## License

This project is licensed under the MIT License.
