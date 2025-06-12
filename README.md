# Simulated LDI Interview

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/christain-watts-projects/v0-simulated-ldi-interview)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/RyOViZu9UrN)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Overview

A simulated interview application built with Next.js and TypeScript, designed to help users practice interview scenarios with AI-powered feedback.

## Features

- Interactive interview simulation
- Real-time feedback generation
- Multiple profession-specific question sets
- Responsive design for all devices
- Secure authentication (if applicable)

## Prerequisites

- Node.js 18+
- npm or pnpm
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Chris-matrix/v0-simulated-ldi-interview.git
cd v0-simulated-ldi-interview
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the required environment variables:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local` with your configuration.

### 4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                    # App router
├── components/             # Reusable components
├── lib/                    # Utility functions
├── public/                 # Static files
├── styles/                 # Global styles
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `test` - Run tests (if configured)

## Testing

To run tests:

```bash
npm test
# or
pnpm test
```

## Deployment

The application is set up for deployment on Vercel. Push your changes to the `main` branch to trigger automatic deployments.

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

List of required environment variables:

- `NEXT_PUBLIC_APP_URL` - The public URL of your application
- `DATABASE_URL` - Database connection string (if using a database)
- `OPENAI_API_KEY` - OpenAI API key (if using AI features)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.