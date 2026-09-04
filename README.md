This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Quality and delivery

Before proposing a delivery change, validate the application locally:

    npm run lint
    npm test -- --runInBand
    npm run build

The repository includes a GitHub Actions quality workflow that executes the same required checks for the Stage 07 delivery branch and for pull requests targeting main.

### Environment setup

Copy .env.example to .env.local and provide the environment-specific values locally.

.env.example documents variable names only. Environment-specific values must not be committed.

### Deployment status

Stage 07 is preparing the repository delivery foundation. A successful local build or CI run does not by itself mean that the application has been published to a production environment.
