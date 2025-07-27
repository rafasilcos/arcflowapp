# ArcFlow - Technical Architecture

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Animations**: Framer Motion
- **UI Components**: Custom design system

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and performance
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io WebSockets
- **Logging**: Winston structured logging

## Architecture Principles

### Multi-tenancy
- Tenant isolation at database level
- Shared infrastructure with data separation
- Role-based access control (RBAC)
- Scalable to 10k+ simultaneous users

### Performance
- Response time target: <200ms for 95% of requests
- Cache-first strategy with Redis
- Database connection pooling
- Optimized queries with proper indexing

### Security
- JWT authentication with blacklist
- Rate limiting (1000 req/15min per IP)
- CORS protection
- Input validation and sanitization
- SQL injection protection via Prisma
- Password hashing with bcrypt (12 rounds)

### Scalability
- Horizontal scaling ready
- Microservices architecture planned
- CDN integration for static assets
- Auto-scaling capabilities

## Project Structure

```
sistema-arcflow/
├── frontend/           # Next.js application
│   ├── src/app/       # App Router pages
│   ├── src/shared/    # Shared components
│   └── src/stores/    # Zustand stores
├── backend/           # Express.js API
│   ├── src/routes/    # API endpoints
│   ├── src/middleware/# Auth & validation
│   └── prisma/        # Database schema
├── briefings/         # Briefing templates
└── tipologias/        # Building typologies
```

## Development Standards

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Conventional commits
- Feature-based organization
- Component-driven development