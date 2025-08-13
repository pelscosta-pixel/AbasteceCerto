# Overview

This is a full-stack fuel efficiency calculator application built with React and Express. The app helps users manage multiple vehicles and determine whether gasoline or ethanol is more cost-effective based on each vehicle's consumption rates and current fuel prices. It features a mobile-first design with database storage for multiple named vehicles, vehicle selection interface, and quick price calculation workflow.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, using modern development practices:

- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **State Management**: Local state with React hooks and localStorage for persistence
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

The application follows a component-based architecture with clear separation of concerns:
- Page components handle routing and high-level state
- Feature components manage specific functionality (vehicle setup, price calculation, results)
- UI components provide reusable design system elements

## Backend Architecture
The server is built with Node.js and Express in a minimal REST API pattern:

- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js for HTTP server and middleware
- **Development**: tsx for TypeScript execution in development
- **Storage**: In-memory storage with interface abstraction for future database integration
- **API Design**: RESTful endpoints with /api prefix (currently minimal implementation)

The backend uses a storage abstraction pattern that allows easy switching between in-memory and database storage implementations.

## Data Storage
Uses PostgreSQL database with Drizzle ORM for vehicle management:

- **Production Storage**: DatabaseStorage class with PostgreSQL backend via Neon Database
- **Vehicle Management**: Full CRUD operations for multiple named vehicles
- **Schema Management**: Centralized schema definitions in shared directory with Drizzle tables
- **Migrations**: Drizzle Kit for database schema management
- **Data Persistence**: Vehicle data stored in database, calculations performed in real-time

## Data Validation and Schemas
Shared validation schemas using Zod ensure type safety across the full stack:

- **Vehicle Data**: Consumption rates for gasoline/ethanol and tank capacity
- **Price Input**: Current fuel prices for both fuel types  
- **Calculation Results**: Best fuel recommendation with cost analysis

## External Dependencies

### Core Frontend Libraries
- React ecosystem (React, React DOM, React Router via Wouter)
- shadcn/ui and Radix UI for component primitives and accessibility
- TanStack Query for data fetching and caching
- React Hook Form with Zod resolvers for forms

### Styling and UI
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- Lucide React for consistent iconography
- date-fns for date manipulation

### Backend and Database
- Express.js for server framework
- Drizzle ORM with PostgreSQL dialect
- Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- connect-pg-simple for PostgreSQL session storage

### Development Tools
- TypeScript for type safety
- Vite for frontend bundling and development server
- esbuild for backend bundling
- Replit-specific plugins for development environment integration

### Validation and Utilities
- Zod for schema validation and type inference
- nanoid for unique ID generation
- clsx and tailwind-merge for conditional styling