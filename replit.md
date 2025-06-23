# SportyBet AI Prediction Dashboard

## Overview

This is a full-stack web application for virtual football prediction using AI/ML models. The system provides real-time predictions for virtual football matches across multiple betting platforms (SportyBet, Bet365, 1xBet) with user authentication, subscription management, and comprehensive analytics.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit OIDC with session-based auth
- **Session Storage**: PostgreSQL with connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle with type-safe schema definitions
- **Session Management**: PostgreSQL table for session persistence
- **Schema**: Comprehensive tables for users, matches, predictions, subscriptions, and analytics

## Key Components

### Authentication System
- **Provider**: Replit OIDC authentication
- **Session Management**: PostgreSQL-backed sessions with 7-day TTL
- **User Management**: Complete user profile with subscription tiers
- **Authorization**: Protected routes with middleware

### Prediction Engine
- **Match Data**: Virtual football matches from multiple platforms
- **ML Models**: Configurable prediction models with performance tracking
- **Real-time Predictions**: Live prediction generation and result tracking
- **Analytics**: Comprehensive accuracy metrics and performance analysis

### User Interface
- **Dashboard**: Modern dark theme with glass morphism effects
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent UI components
- **Real-time Updates**: TanStack Query for live data synchronization

### Platform Integration
- **Multi-platform Support**: SportyBet, Bet365, 1xBet integration
- **Status Monitoring**: Real-time platform availability tracking
- **API Management**: Centralized API status and health monitoring

## Data Flow

1. **User Authentication**: Users authenticate via Replit OIDC
2. **Match Data Ingestion**: Virtual football matches are fetched from betting platforms
3. **Prediction Generation**: ML models generate predictions for upcoming matches
4. **Real-time Updates**: Dashboard displays live predictions and results
5. **Analytics Processing**: Performance metrics are calculated and stored
6. **User Notifications**: Telegram bot integration for prediction alerts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **express**: Web server framework
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui**: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form management

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20
- **Database**: PostgreSQL 16 module
- **Port Configuration**: 5000 (internal) → 80 (external)
- **Hot Reload**: Vite dev server with HMR

### Production Deployment
- **Platform**: Replit Autoscale deployment
- **Build Process**: Vite build + esbuild for server bundling
- **Environment**: Production mode with optimized assets
- **Database**: Neon PostgreSQL with connection pooling

### Build Configuration
- **Client Build**: Vite handles React app bundling
- **Server Build**: esbuild bundles Express server
- **Asset Management**: Static files served from dist/public
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 23, 2025. Initial setup