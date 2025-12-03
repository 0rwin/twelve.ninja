# GEMINI.md

## Project Overview

This project, named "Twelve Ninja," is a web-based game built with a modern technology stack. The client is a single-page application built with React, Vite, and TypeScript, and styled with Tailwind CSS. The backend is powered by Supabase, utilizing its Postgres database, Edge Functions for server-authoritative game logic, and authentication.

The game appears to involve world exploration, resource gathering, and combat, with a strong emphasis on a secure and auditable game state. All significant game actions are processed on the server to prevent cheating.

## Building and Running

### Prerequisites

- Node.js and npm
- Supabase account and a project set up

### Installation

1.  Install the dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env.local` file by copying `.env.example` and fill in your Supabase project's URL and anon key.

### Development

To run the development server:

```bash
npm run dev
```

This will start a hot-reloading development server, usually on `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the optimized production assets.

### Linting

To check the code for any linting errors:

```bash
npm run lint
```

## Development Conventions

The project follows a strict set of development conventions outlined in the `IMPLEMENTATION_DOCTRINE.md` file. Key conventions include:

-   **Server-authoritative game logic**: All game state changes are handled by the server (Supabase Edge Functions).
-   **TypeScript**: All code is written in TypeScript.
-   **File Naming**: `kebab-case` for files.
-   **Component Naming**: `PascalCase` for React components.
-   **Styling**: Tailwind CSS utility classes are used directly in the markup.
-   **Commit Messages**: Conventional Commits standard (e.g., `feat(game): ...`).
-   **Database Migrations**: SQL migration files are located in the `sql/migrations` directory.
-   **API Calls**: Supabase API calls are wrapped in functions in `src/lib/api.ts` and `src/lib/gameActions.ts`.
-   **State Management**: A centralized state management solution like Zustand is recommended for global state.
