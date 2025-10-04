# 🚗 BLuxA Corp - Luxury Transportation Platform

A modern, full-stack luxury transportation booking platform built with Next.js 15, TypeScript, and Tailwind CSS. Experience premium transportation services with professional drivers and luxury vehicles in New York City.

![BLuxA Corp](https://img.shields.io/badge/BLuxA-Corp-blue?style=for-the-badge&logo=car)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **Luxury Vehicle Booking** - Executive sedans, luxury SUVs, and sprinter vans
- **Real-time Pricing** - Dynamic pricing based on vehicle type and duration
- **Secure Payments** - Stripe integration with PCI compliance
- **User Authentication** - Supabase-powered auth with session management
- **Responsive Design** - Mobile-first design with Tailwind CSS

### 🛡️ Enterprise Features
- **Error Boundaries** - Comprehensive error handling with graceful fallbacks
- **Loading States** - Skeleton loaders and smooth loading transitions
- **Environment Validation** - Robust configuration with helpful error messages
- **Type Safety** - Full TypeScript implementation with strict typing
- **Performance Optimized** - Turbopack integration for faster builds

### 🚀 Technical Highlights
- **Modern Stack** - Next.js 15 with App Router and React 19
- **Authentication** - Supabase Auth with JWT tokens
- **Payments** - Stripe Elements with secure card processing
- **Styling** - Tailwind CSS 4 with custom design system
- **Development** - ESLint, TypeScript, and modern tooling

## 🏗️ Architecture

```
bluxa-corp-nextjs/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── book/           # Booking pages
│   │   ├── payment/        # Payment pages
│   │   └── debug/          # Development tools
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── payment/        # Payment components
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingStates.tsx
│   └── lib/                # Utilities and configurations
│       ├── api.ts          # API client
│       ├── stripe.ts       # Stripe integration
│       ├── supabaseClient.ts
│       └── config.ts       # Environment configuration
├── public/                 # Static assets
└── .env.example           # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bluxa-corp-nextjs.git
   cd bluxa-corp-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |

### Getting API Keys

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your Project URL and anon key

#### Stripe Setup
1. Create an account at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy your publishable key (starts with `pk_test_`)

## 📱 Usage

### Booking Flow
1. **Select Vehicle** - Choose from executive sedan, luxury SUV, or sprinter van
2. **Enter Details** - Pickup location, destination, date, and time
3. **Customer Info** - Name, email, and phone number
4. **Review & Book** - Confirm details and create booking
5. **Secure Payment** - Complete payment with Stripe
6. **Confirmation** - Receive booking confirmation

### Vehicle Types
- **Executive Sedan** - Perfect for business meetings and airport transfers
- **Luxury SUV** - Spacious and elegant for special events
- **Sprinter Van** - Ideal for large groups and corporate events

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure

- **Pages**: Next.js App Router with server and client components
- **Components**: Reusable React components with TypeScript
- **API**: Server-side API routes for backend integration
- **Styling**: Tailwind CSS with custom design system
- **State**: React hooks and context for state management

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: Skeleton loaders for better UX

## 🚀 Recent Improvements

### High Priority Enhancements

1. **Environment Configuration**
   - Added comprehensive .env.example file
   - Enhanced environment validation with helpful error messages
   - Added feature flags and app environment detection

2. **Error Boundaries**
   - Implemented React Error Boundaries for better error handling
   - Specialized error boundaries for auth, payment, and booking flows
   - Development-friendly error details with production-safe fallbacks

3. **Loading States & Skeleton Loaders**
   - Comprehensive skeleton loaders for all major components
   - Enhanced loading buttons with spinner integration
   - Improved perceived performance with smooth loading transitions

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with database
- **AWS**: Use Amplify or custom EC2 setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🏆 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase** - For authentication and database services
- **Stripe** - For secure payment processing
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For hosting and deployment platform

---

<div align="center">
  <strong>Built with ❤️ for luxury transportation</strong>
  <br>
  <a href="https://bluxacorp.com">Website</a> •
  <a href="https://github.com/yourusername/bluxa-corp-nextjs/issues">Report Bug</a> •
  <a href="https://github.com/yourusername/bluxa-corp-nextjs/issues">Request Feature</a>
</div># Deployment trigger
