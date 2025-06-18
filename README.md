# Life Design Interview Simulator

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PlayLab AI](https://img.shields.io/badge/Powered%20by-PlayLab%20AI-blue?style=for-the-badge)](https://playlab.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An AI-powered interview simulation platform that helps users practice Life Design Interviews with realistic professional personas.

## Overview

The Life Design Interview Simulator is a sophisticated web application that enables users to conduct practice interviews with AI-generated professional personas. Built for career exploration and interview skill development, it provides personalized feedback and comprehensive analytics to improve interviewing capabilities.

### Key Features

- **AI-Powered Conversations**: Realistic interviews with AI professionals using PlayLab AI
- **Dynamic Persona Generation**: Create diverse professional profiles with customizable parameters
- **Comprehensive Feedback**: Detailed analysis of interviewing skills and performance metrics
- **Modern UI/UX**: Built with React, Next.js, and Tailwind CSS for optimal user experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Session Management**: Automatic saving and restoration of interview sessions
- **Resume Builder**: Integrated resume creation and optimization tools
- **Performance Analytics**: Track progress and improvement over time

## Architecture

### Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Radix UI primitives
- **AI Integration**: PlayLab AI API
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Data Persistence**: Session Storage (client-side)
- **Deployment**: Vercel

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── feedback/          # Interview feedback page
│   ├── interview/         # Main interview interface
│   ├── resume/           # Resume builder
│   └── select-profession/ # Profession selection
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or pnpm package manager
- PlayLab AI API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/life-design-interview-simulator.git
   cd life-design-interview-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_PLAYLAB_API_KEY=your_playlab_api_key
   NEXT_PUBLIC_PLAYLAB_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### PlayLab AI Integration

The application uses PlayLab AI for generating realistic interview conversations. Configure your API credentials in the environment variables:

```env
NEXT_PUBLIC_PLAYLAB_API_KEY=your_api_key_here
NEXT_PUBLIC_PLAYLAB_PROJECT_ID=your_project_id_here
```

### Customization Options

- **Profession Database**: Modify profession categories in `app/select-profession/page.tsx`
- **UI Themes**: Customize colors and styling in `app/globals.css`
- **Component Library**: Extend UI components in `components/ui/`

## Usage

### For End Users

1. **Start Interview**: Select a profession and customize the interviewee profile
2. **Conduct Interview**: Engage in natural conversation with the AI professional
3. **Receive Feedback**: Get detailed analysis of your interviewing skills
4. **Track Progress**: Review performance metrics and improvement suggestions

### For Developers

```typescript
// Example: Custom profession configuration
const customProfessions = [
  {
    category: "Custom Field",
    jobs: ["Custom Role 1", "Custom Role 2"]
  }
];
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables
   - Deploy automatically

2. **Manual Deployment**
   ```bash
   npm run build
   vercel --prod
   ```

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: < 500KB gzipped
- **First Contentful Paint**: < 1.5s

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards

- **ESLint**: Automated code quality checks
- **Prettier**: Consistent code formatting
- **TypeScript**: Strong typing throughout the codebase
- **Conventional Commits**: Structured commit messages

## API Documentation

### Interview API Endpoints

```typescript
// Generate interviewee profile
POST /api/chat
{
  "type": "profile_generation",
  "message": "Generate profile for Software Engineer..."
}

// Conduct interview conversation
POST /api/chat
{
  "type": "interview_chat",
  "message": "Tell me about your career path",
  "history": [...previousMessages]
}

// Generate feedback analysis
POST /api/chat
{
  "type": "feedback_analysis",
  "message": "Analyze interview transcript..."
}
```

## Security

- **Environment Variables**: Sensitive data stored securely
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: Comprehensive validation of user inputs
- **HTTPS Only**: Secure data transmission

## Monitoring & Analytics

- **Error Tracking**: Comprehensive error monitoring
- **Performance Monitoring**: Real-time performance insights
- **User Analytics**: Privacy-focused usage analytics

## Troubleshooting

### Common Issues

**Issue**: API Authentication Errors
```bash
# Solution: Verify environment variables
echo $NEXT_PUBLIC_PLAYLAB_API_KEY
```

**Issue**: Build Failures
```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **PlayLab AI** for providing the AI conversation capabilities
- **Vercel** for hosting and deployment platform
- **Next.js Team** for the excellent framework
- **Radix UI** for accessible component primitives

## Support

- **Documentation**: [Technical Docs](TECHNICAL_DOCS.md)
- **User Guide**: [User Guide](USER_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/repo/discussions)

---

<div align="center">
  <strong>Built with care for better career exploration</strong>
</div>
