# {{PROJECT_NAME_PASCAL}}

Full-stack application built with React, Express, TypeScript, and Prisma.

## Development

### First-time setup

```bash
# Start database and run initial setup
npm run dev:setup
```

### Daily development

```bash
# Start both frontend and backend with hot reload
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: PostgreSQL on localhost:5432

## Database

```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Open database browser
npm run db:studio

# Reset database
npm run db:reset
```

## Building

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

This project is configured for Fly.io deployment.

### Prerequisites

1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Sign up: https://fly.io/docs/getting-started/sign-up-sign-in/
3. Login: `fly auth login`

### Deploy

1. Create app: `fly apps create {{PROJECT_NAME}}`
2. Set secrets: `fly secrets set DATABASE_URL="your-db-url"`
3. Deploy: `npm run deploy`

### Production Database

Set up a production database (recommended options):
- Fly PostgreSQL: `fly postgres create`
- Supabase
- Railway
- PlanetScale

## Project Structure

```
{{PROJECT_NAME}}/
├── client/              # React frontend
├── server/              # Express backend
├── docker-compose.yml   # Development database
└── fly.toml            # Deployment config
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Development**: Docker Compose
- **Deployment**: Fly.io