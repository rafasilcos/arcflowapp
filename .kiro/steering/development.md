# ArcFlow - Development Guidelines

## Code Standards

### TypeScript
- Use strict mode with proper typing
- Avoid `any` type - use proper interfaces
- Create reusable types in shared directories
- Use generic types for flexibility

### React/Next.js
- Use App Router for all new pages
- Prefer server components when possible
- Use client components only when needed (interactivity, hooks)
- Follow component composition patterns
- Use proper error boundaries

### Styling
- Use Tailwind CSS utility classes
- Create reusable component variants
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

## File Organization

### Frontend Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group
│   ├── briefing/          # Briefing pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── shared/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
└── stores/               # Zustand stores
```

### Backend Structure
```
src/
├── routes/               # API endpoints
├── middleware/           # Auth, validation
├── config/              # Database, Redis config
├── types/               # TypeScript interfaces
└── server.ts            # Main server file
```

## Naming Conventions

### Files and Directories
- Use kebab-case for files: `user-profile.tsx`
- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `formatCurrency.ts`

### Variables and Functions
- Use camelCase: `userName`, `getUserData()`
- Use PascalCase for components: `UserCard`
- Use UPPER_CASE for constants: `API_BASE_URL`

### Database
- Use snake_case for table/column names: `user_profiles`
- Use descriptive names: `created_at`, `updated_at`
- Include proper foreign key naming: `user_id`

## API Design

### REST Conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Use plural nouns for resources: `/api/users`
- Use nested routes for relationships: `/api/projects/:id/briefings`
- Return consistent response formats

### Error Handling
- Use proper HTTP status codes
- Return structured error responses
- Include error codes for client handling
- Log errors with context

### Authentication
- Use JWT tokens with proper expiration
- Implement refresh token rotation
- Include proper CORS headers
- Validate all protected routes

## Performance Guidelines

### Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Use Suspense for code splitting
- Optimize images with Next.js Image component

### Backend
- Use database indexes for frequent queries
- Implement caching with Redis
- Use connection pooling
- Paginate large data sets

### Database
- Use proper indexes on foreign keys
- Avoid N+1 queries with Prisma includes
- Use database-level constraints
- Implement soft deletes for audit trails

## Security Best Practices

### Input Validation
- Validate all user inputs
- Use Zod or similar for schema validation
- Sanitize data before database operations
- Implement rate limiting

### Authentication
- Hash passwords with bcrypt
- Use secure JWT secrets
- Implement proper session management
- Add CSRF protection

### Data Protection
- Use HTTPS in production
- Implement proper CORS policies
- Sanitize sensitive data in logs
- Follow LGPD compliance requirements

## Testing Strategy

### Unit Tests
- Test utility functions
- Test component logic
- Test API endpoints
- Use Jest and React Testing Library

### Integration Tests
- Test API workflows
- Test database operations
- Test authentication flows
- Use Supertest for API testing

### E2E Tests
- Test critical user journeys
- Test cross-browser compatibility
- Use Playwright or Cypress
- Run in CI/CD pipeline

## Deployment

### Environment Management
- Use proper environment variables
- Separate dev/staging/production configs
- Never commit secrets to version control
- Use proper secret management

### CI/CD
- Run tests on every PR
- Use automated deployments
- Implement proper rollback strategies
- Monitor deployment health

## AEC Domain Knowledge

### Briefing System
- Understand building typologies (residential, commercial, industrial, institutional, urban)
- Follow NBR standards and Brazilian construction practices
- Implement adaptive questioning based on project type
- Support multiple measurement units (m², m³, etc.)

### Project Management
- Support AEC-specific project phases
- Implement proper role-based permissions (architect, engineer, designer)
- Handle complex approval workflows
- Support document version control

### Brazilian Market
- Support Brazilian currency (Real)
- Follow Brazilian regulations and standards
- Use proper Portuguese terminology
- Support regional variations in construction practices