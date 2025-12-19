# Cloudflare Workers React Template

[![Deploy to Cloudflare]([cloudflarebutton])]([cloudflarebutton])

A production-ready full-stack application template built on Cloudflare Workers. This template provides a seamless developer experience with a modern React frontend, Hono-powered API backend, Durable Objects for stateful storage, and shadcn/ui for beautiful, accessible components. Perfect for building scalable, edge-deployed applications.

## Features

- **Edge-Native Backend**: Lightning-fast API routes using Hono on Cloudflare Workers
- **Persistent State**: Durable Objects for counters, data storage, and real-time coordination
- **Modern React Frontend**: Vite-powered React 18 app with TypeScript, TanStack Query, and React Router
- **Beautiful UI**: shadcn/ui components with Tailwind CSS, dark mode, and animations
- **Type-Safe**: End-to-end TypeScript with shared types between frontend and backend
- **Development Workflow**: Hot reload for frontend, live preview with `bun dev`, one-command deployment
- **Production Ready**: Error handling, logging, CORS, health checks, and client error reporting
- **Demo Endpoints**: Built-in counter and demo items API showcasing Durable Objects

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- **Data**: TanStack Query, Zustand, React Hook Form, Zod
- **UI/UX**: Framer Motion, Tailwind Animate, Sonner (toasts), Headless UI
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript
- **Additional**: Recharts (charts), Embla Carousel, React Resizable Panels

## Quick Start

1. **Prerequisites**
   - [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
   - [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest auth login`)

2. **Clone & Install**
   ```bash
   git clone <your-repo-url>
   cd sentinel-vault-sim-nvfxunsqsrhy7s22h-szy
   bun install
   ```

3. **Development**
   ```bash
   bun run dev
   ```
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/health
   - Edit `src/pages/HomePage.tsx` for UI, `worker/userRoutes.ts` for API routes

4. **Type Generation**
   ```bash
   bunx wrangler types
   ```

## Development

### Project Structure
```
├── src/                 # React frontend (Vite)
├── worker/              # Cloudflare Worker backend (Hono + Durable Objects)
├── shared/              # Shared TypeScript types & mock data
└── wrangler.jsonc       # Deployment config
```

### Key Files to Customize
- **`src/pages/HomePage.tsx`**: Replace the demo homepage with your app
- **`worker/userRoutes.ts`**: Add your API routes (imports shared types)
- **`worker/durableObject.ts`**: Extend Durable Object storage methods
- **`src/components/layout/AppLayout.tsx`**: Sidebar layout (optional)
- **`tailwind.config.js`**: Customize theme, animations, colors

### Scripts
| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (frontend + worker preview) |
| `bun run build` | Build frontend assets |
| `bun lint` | Run ESLint |
| `bun run cf-typegen` | Generate Worker types |
| `bun run preview` | Preview production build |

### API Examples
Test endpoints at `/api/*`:

```bash
# Health check
curl http://localhost:3000/api/health

# Demo counter (Durable Object)
curl http://localhost:3000/api/counter
curl -X POST http://localhost:3000/api/counter/increment

# Demo items
curl http://localhost:3000/api/demo
```

Frontend fetches data automatically in `TemplateDemo` component.

## Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun run deploy
```

Or manually:
1. `bun run build` (builds frontend assets)
2. `npx wrangler deploy`

**SPA Routing**: Automatically handles client-side routing via `assets` config in `wrangler.jsonc`.

[![Deploy to Cloudflare]([cloudflarebutton])]([cloudflarebutton])

### Environment Variables
Set secrets via Wrangler dashboard or CLI:
```bash
wrangler secret put YOUR_SECRET
```

### Custom Domain
```bash
wrangler deploy --var CUSTOM_DOMAIN:yourdomain.com
```

## Customization Guide

1. **Update Project Name**: Edit `package.json` and `wrangler.jsonc`
2. **Branding**: Replace logos, colors in `tailwind.config.js` and `src/index.css`
3. **shadcn/ui**: Add components via `npx shadcn-ui@latest add <component>`
4. **Routes**: Extend router in `src/main.tsx`
5. **State**: Use Durable Objects for user-specific storage (get stub via `idFromName(userId)`)

## Contributing

1. Fork the repo
2. `bun install`
3. Create feature branch
4. `bun run dev` for testing
5. Submit PR

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [shadcn/ui](https://ui.shadcn.com/)

Built with ❤️ for Cloudflare Developers. Issues? Open a GitHub issue.