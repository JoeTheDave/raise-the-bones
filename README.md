# 🦴 Raise the Bones

A CLI tool to bootstrap full-stack React + Express + Prisma applications with TypeScript, Tailwind CSS, and Docker support.

## Quick Start

Create a new project with:

```bash
npx raise-the-bones my-project
```

## Dev

You'll need docker up and running as the postgres database is stood up in a docker container for dev

```bash
npm run dev
```

## Deployment

### Fly.io Deployment

The project includes Fly.io configuration for easy deployment:

#### Prerequisites

1. **Install Fly CLI**: https://fly.io/docs/getting-started/installing-flyctl/
2. **Sign up for Fly.io**: https://fly.io/docs/getting-started/sign-up-sign-in/
3. **Authenticate**: `fly auth login`

#### Production Database

You'll need to set up a production database. Options include:

- **Fly PostgreSQL**: `fly postgres create`

#### Deploy

```bash
npm run deploy
```

This will ask for your postgres instance connection string.

## Troubleshooting

### Fly.io App Name Already Taken

If you get an error during deployment that the app name is already taken:

1. Open `fly.toml` in your project root
2. Change the `app = "your-project-name"` line to a unique name
3. Run `npm run deploy` again

## License

MIT