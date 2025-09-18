# AI-Hire
# 🎯 AI-Hire: AI-Powered Interview Platform

<div align="center">

![AI-Hire Logo](public/logo.jpg)

**Intelligent interview platform that automates candidate assessment using advanced AI technology**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-purple?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Vapi AI](https://img.shields.io/badge/Vapi-AI%20Voice-orange?style=for-the-badge)](https://vapi.ai/)

[Live Demo](https://ai-hire-interview-platform-r76aar4cz.vercel.app/) • [Documentation](#documentation) • [Features](#features) • [Tech Stack](#tech-stack)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

AI-Hire is a comprehensive AI-powered interview platform that revolutionizes the hiring process by automating candidate assessments through intelligent voice interactions. The platform combines cutting-edge AI technology with a user-friendly interface to provide seamless interview experiences for both recruiters and candidates.

### Key Highlights

- **🎤 Voice-Based Interviews**: Real-time AI-powered voice conversations
- **🤖 Intelligent Assessment**: Automated candidate evaluation and feedback
- **💳 Integrated Payments**: Stripe-powered credit system for interview sessions
- **📊 Analytics Dashboard**: Comprehensive interview insights and candidate tracking
- **🔐 Secure Authentication**: Google OAuth integration with Supabase
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX

## ✨ Features

### Core Functionality

- **Interview Creation**: Customizable interview sessions with multiple question types
- **Real-time Voice Interaction**: Powered by Vapi AI for natural conversation flow
- **AI Feedback Generation**: Automated candidate assessment using Google Generative AI
- **Credit Management System**: Monthly credit allocation with automatic resets
- **Payment Integration**: Secure Stripe checkout for credit purchases
- **Interview Scheduling**: Flexible timing options (5-60 minutes)
- **Candidate Management**: Track interview history and performance metrics

### User Experience

- **Intuitive Dashboard**: Clean, modern interface for easy navigation
- **Real-time Progress**: Live interview status and timer functionality
- **Comprehensive Analytics**: Detailed interview reports and candidate insights
- **Mobile Responsive**: Optimized for all device sizes
- **Error Handling**: Robust error boundaries and user feedback systems

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 18.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **AI Services**: 
  - Vapi AI (Voice interactions)
  - Google Generative AI (Feedback generation)
- **Payments**: Stripe API
- **Deployment**: Vercel

### Development Tools
- **Language**: JavaScript/JSX
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Supabase account
- Stripe account
- Vapi AI account
- Google Cloud Console project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShubhamLohar01/AI-Hire-Ai-powered-Interview-Platform-.git
   cd AI-Hire-Ai-powered-Interview-Platform-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (See [Environment Setup](#environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Vapi AI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_PRIVATE_KEY=your_vapi_private_key

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Schema

The application uses the following Supabase tables:

- **Users**: User profiles and credit management
- **Interviews**: Interview sessions and metadata
- **InterviewFeedback**: AI-generated candidate assessments

See `ENVIRONMENT_SETUP.md` for detailed database schema.

## 📁 Project Structure

```
ai-interview/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── components/           # Reusable UI components
│   │   ├── dashboard/            # Dashboard pages
│   │   └── schedule-interview/   # Interview scheduling
│   ├── api/                      # API routes
│   │   ├── checkout_session/     # Stripe payment processing
│   │   └── update_credits/       # Credit management
│   ├── auth/                     # Authentication pages
│   └── Interview/                # Interview flow pages
├── components/                   # Shared UI components
├── lib/                         # Utility functions
├── context/                     # React context providers
├── hooks/                       # Custom React hooks
└── public/                      # Static assets
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/login` - Google OAuth login
- `GET /auth/callback` - OAuth callback handler

### Interview Management

- `POST /api/interviews` - Create new interview
- `GET /api/interviews/[id]` - Get interview details
- `POST /api/interviews/[id]/feedback` - Generate AI feedback

### Payment Processing

- `POST /api/checkout_session` - Create Stripe checkout session
- `POST /api/update_credits` - Update user credits after payment

### AI Services

- `POST /api/ai/feedback` - Generate candidate feedback
- `POST /api/ai/model` - AI model interactions

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Supabase credentials
- Stripe keys
- Vapi AI keys
- Google AI API key
- Application URL

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shubham Lohar**
- GitHub: [@ShubhamLohar01](https://github.com/ShubhamLohar01)
- Project: [AI-Hire Platform](https://github.com/ShubhamLohar01/AI-Hire-Ai-powered-Interview-Platform-)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for backend services
- [Stripe](https://stripe.com/) for payment processing
- [Vapi AI](https://vapi.ai/) for voice AI capabilities
- [Google AI](https://ai.google.dev/) for generative AI features
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[Report Bug](https://github.com/ShubhamLohar01/AI-Hire-Ai-powered-Interview-Platform-/issues) • [Request Feature](https://github.com/ShubhamLohar01/AI-Hire-Ai-powered-Interview-Platform-/issues) • [Live Demo](https://ai-hire-interview-platform-r76aar4cz.vercel.app/)

</div>
