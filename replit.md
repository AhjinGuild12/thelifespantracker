# Life In Weeks - 4,000 Weeks Visualization

## Overview

This is a full-stack web application that visualizes human life in weeks, inspired by Oliver Burkeman's book "Four Thousand Weeks." The app provides an interactive visualization showing users their life progress across different time scales - lifetime, yearly, and monthly views - to inspire action on what matters most.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with custom calculation logic
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Development Setup**: In-memory storage for development
- **API**: RESTful API structure (routes not yet implemented)

### Key Design Decisions

1. **Monorepo Structure**: The application uses a monorepo with shared TypeScript schemas between client and server
2. **Component-Based UI**: Leverages shadcn/ui for consistent, accessible components
3. **Database Abstraction**: Uses an interface pattern for storage to support both in-memory (development) and PostgreSQL (production)
4. **Custom CSS Variables**: Maintains design system consistency through CSS custom properties

## Key Components

### Frontend Components
- **LifeInWeeksPage**: Main page component that orchestrates the entire visualization
- **AgeInput**: Handles user age input with validation
- **ViewSelector**: Provides switching between lifetime, yearly, and monthly views
- **StatisticsCards**: Displays calculated statistics with animated progress bars
- **WeeksGrid**: Renders the main visualization grid
- **InspirationQuote**: Shows motivational quotes from Oliver Burkeman

### Backend Components
- **Express Server**: Handles API routes and serves static files
- **Storage Interface**: Abstraction layer for database operations
- **Vite Integration**: Development server with HMR support
- **Route Registration**: Placeholder for API endpoint registration

### Shared Components
- **Database Schema**: Centralized schema definitions using Drizzle
- **Type Definitions**: Shared TypeScript interfaces

## Data Flow

1. **User Input**: Age input triggers calculation updates
2. **Calculations**: Custom hook computes weeks lived, remaining, and percentages
3. **Visualization**: Grid components render visual representation based on calculations
4. **View Switching**: Different visualization modes (lifetime/yearly/monthly)
5. **Statistics Display**: Real-time updates of progress indicators

### Calculation Logic
- Total life assumption: 4,160 weeks (80 years × 52 weeks)
- Current date context: July 14, 2025
- Progress tracking for 2025 year view
- Monthly breakdown for detailed views

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with extensive Radix UI components
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icon library
- **Utilities**: class-variance-authority, clsx for styling utilities
- **Dates**: date-fns for date manipulation

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Validation**: zod with drizzle-zod integration

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for TypeScript execution, runtime error overlay

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Development**: Uses in-memory storage and Vite dev server
- **Production**: Serves static files from Express with PostgreSQL backend

### Scripts
- `dev`: Development server with TypeScript execution
- `build`: Production build for both frontend and backend
- `start`: Production server execution
- `db:push`: Database schema synchronization

The application is designed to be deployed on platforms that support Node.js with PostgreSQL databases, with particular optimization for Replit's environment through specialized plugins and configuration.