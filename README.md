# Namthar-Smart-AI-Grocery-Delivery-in-15-min
Namthar is a well-structured, production-ready e-commerce web application that demonstrates proficiency across the full spectrum of modern frontend development. It integrates a component-based architecture with React and TypeScript, a performant build pipeline through Vite and Bun, a fully managed backend via Supabase.
The project leverages a modern JavaScript ecosystem with a focus on developer productivity and application performance.

Layer	Technology	Purpose
Frontend Framework	React (TSX)	Component-based UI development
Language	TypeScript	Type-safe JavaScript for reliability
Build Tool	Vite	Fast HMR, optimized bundling
Runtime / Package Mgr	Bun	Ultra-fast JavaScript runtime & package manager
Backend / Database	Supabase	Auth, real-time DB, storage (BaaS)
Styling	CSS (App.css, index.css)	Global and component-level styles
Routing	React Router (Pages)	Client-side navigation
Version Control	Git (.gitignore, bun.lock)	Source control & dependency locking

4. Project Architecture & File Structure
The application follows a standard Vite + React project layout with well-separated concerns across components, pages, hooks, integrations, and utility libraries.

Directory / File	Description
src/components/	Reusable UI components (product cards, navbar, etc.)
src/pages/	Top-level route pages rendered by React Router
src/hooks/	Custom React hooks for shared logic
src/integrations/	External service connectors (Supabase client)
src/lib/	Utility functions and shared helpers
src/App.tsx	Root application component and router setup
src/main.tsx	Application entry point; mounts React to #root
src/App.css / index.css	Global and app-level stylesheets
supabase/	Supabase project configuration and migrations
index.html	HTML shell with SEO meta tags and OG tags
vite-env.d.ts	Vite environment type declarations
.env	Environment variables (API keys, Supabase URL)

