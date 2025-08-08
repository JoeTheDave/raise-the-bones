# 🦴 Raise the Bones

A CLI tool to bootstrap full-stack React + Express + Prisma applications with TypeScript, Tailwind CSS, and Docker support.

## Quick Start

Create a new project with:

```bash
npx raise-the-bones my-project
cd my-project
npm run dev
```

## What's Included

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL with Docker Compose for development
- **Development**: Hot reload for both client and server
- **Production**: Fly.io deployment configuration
- **Code Quality**: ESLint configuration

## Project Structure

```
my-project/
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── server/              # Express backend
│   └── src/
│       ├── index.ts     # Express server
│       ├── lib/         # Database connection
│       └── prisma/      # Prisma schema & migrations
├── docker-compose.yml   # PostgreSQL for development
├── fly.toml            # Fly.io deployment config
└── package.json        # Root project config
```

## Development Workflow

### 1. Start Development Environment

```bash
# First time setup (starts database, runs migrations, seeds data)
npm run dev:setup

# Regular development (starts both client and server with hot reload)
npm run dev
```

The development server will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: PostgreSQL on localhost:5432

### 2. Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Seed database with test data
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

### 3. Building for Production

```bash
# Build both client and server
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Fly.io Deployment (Recommended)

The project includes Fly.io configuration for easy deployment:

#### Prerequisites

1. **Install Fly CLI**: https://fly.io/docs/getting-started/installing-flyctl/
2. **Sign up for Fly.io**: https://fly.io/docs/getting-started/sign-up-sign-in/
3. **Authenticate**: `fly auth login`

#### Deploy Steps

1. **Create Fly App**:
   ```bash
   fly apps create your-app-name
   ```

2. **Update `fly.toml`**:
   ```toml
   app = "your-app-name"  # Use your actual app name
   ```

3. **Set Environment Variables**:
   ```bash
   # Required for production database
   fly secrets set DATABASE_URL="your-production-database-url"
   
   # Optional: other environment variables
   fly secrets set NODE_ENV="production"
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

#### Production Database

You'll need to set up a production database. Options include:

- **Fly PostgreSQL**: `fly postgres create`
- **Supabase**: Free tier available
- **Railway**: Free tier available
- **PlanetScale**: MySQL-compatible option

#### Environment Variables

Set these secrets in Fly.io:

```bash
fly secrets set DATABASE_URL="postgresql://user:pass@host:port/dbname"
fly secrets set NODE_ENV="production"
```

### Alternative Deployments

The project structure supports various deployment platforms:

- **Vercel**: Frontend + Serverless functions
- **Railway**: Full-stack deployment
- **DigitalOcean App Platform**: Container deployment
- **AWS/GCP/Azure**: Container or serverless deployment

## Manual Setup Steps

After using `raise-the-bones`, you may need to:

1. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` if needed
   - Update database URLs for production

2. **Set up Deployment**:
   - Choose deployment platform (Fly.io recommended)
   - Configure production database
   - Set environment variables

3. **Customize Project**:
   - Update `package.json` metadata
   - Add your git remote: `git remote add origin <your-repo>`
   - Configure domain/DNS if needed

## CLI Options

```bash
npx raise-the-bones <project-name> [options]

Options:
  -d, --directory <dir>  Directory to create project in (default: current directory)
  -h, --help            Display help
  -V, --version         Display version
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker is running: `docker --version`
2. Start database manually: `npm run docker:up`
3. Check database status: `npm run docker:logs`

### Port Already in Use

If ports 3001 (server) or 5173 (client) are in use:
1. Kill processes using these ports
2. Or modify ports in `server/src/index.ts` and `client/vite.config.ts`

### TypeScript Errors

Run type checking: `npx tsc --noEmit` in both `client/` and `server/` directories.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development environment |
| `npm run dev:setup` | First-time development setup |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run docker:up` | Start database container |
| `npm run docker:down` | Stop database container |
| `npm run db:*` | Database management commands |

## Contributing

Issues and pull requests welcome at: https://github.com/your-username/raise-the-bones

## License

MIT