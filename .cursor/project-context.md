# Project Context

## Tech Stack
- Next.js 15 (App Router), TypeScript strict mode
- Forms: Conform + Zod validation
- UI: shadcn/ui components, Tailwind CSS
- Database: Drizzle ORM, Auth: Clerk
- Infrastructure: SST (Serverless Stack)
- Package Manager: pnpm workspaces

## Monorepo Structure
```
packages/
├── core/        # Database schema, shared utilities
├── functions/   # AWS Lambda functions (webhooks)
└── web/         # Next.js application
```

## File Organization
```
app/[feature]/
├── page.tsx              # Layout only (< 50 lines)
├── actions.ts            # Server actions
└── _components/
    └── feature-form.tsx  # Complete form logic (200-400 lines OK)
```

- Co-locate page components in `_components/`
- Server actions in `actions.ts` next to pages
- Schemas in `lib/schemas/`
- Shared utilities in `lib/`

## Component Extraction Guidelines

**Extract when:**
- Reused across multiple pages (create/edit)
- Truly independent and reused elsewhere
- Exceeds ~500 lines with clear boundaries
- Provides significant domain logic

**Don't extract when:**
- < 50 lines
- Just passing props to generic components
- Only used in one place
- No additional business logic

## Code Style
- Use "use client" only when needed (Server Components by default)
- Server Actions for mutations
- Use `useActionState` over `useFormState`
- Use `cn()` for conditional classes
- Error styling: `border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50`

