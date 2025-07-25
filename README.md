# MANDLACX Security Dashboard

A comprehensive Next.js 15 security monitoring and incident management system with real-time camera feeds, incident tracking, and 3D product visualization.

## Features

### 🔐 Security Dashboard
- **Real-time Camera Feeds**: Live monitoring with multiple camera views
- **Incident Management**: Track and resolve security incidents
- **Interactive Timeline**: 24-hour incident visualization with draggable scrubber
- **Optimistic UI**: Instant feedback for user actions

### 🎯 Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (with Docker Compose setup)
- **3D Graphics**: React Three Fiber for 3D product showcase
- **State Management**: TanStack Query for server state
- **UI Components**: Custom components with Radix UI primitives

### 📊 Database Models
- **Camera**: Security camera information and locations
- **Incident**: Security incidents with timestamps and resolution status

## Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose (for PostgreSQL)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Start the PostgreSQL database**:
```bash
docker-compose up -d
```

3. **Set up the database**:
```bash
npm run db:push
npm run db:seed
```

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### GET /api/incidents
Fetch incidents with optional filtering:
- `?resolved=false` - Get only unresolved incidents

### PATCH /api/incidents/[id]/resolve
Mark an incident as resolved

## Features Overview

### 🎮 Main Dashboard
- **Camera Feed Player**: Large video display with thumbnail previews
- **Incident List**: Real-time incident tracking with resolve functionality
- **Interactive Timeline**: 24-hour incident visualization

### 🎨 3D Product Showcase
Visit `/3d-model` for an interactive 3D product demonstration featuring:
- Animated 3D models with rotation and scaling
- Interactive camera controls
- Professional lighting and shadows
- Environment mapping

### 👤 User Profile
- **Name**: Tanmay Singh
- **Email**: tanmaysingh08580@gmail.com

## Database Schema

### Camera Model
```prisma
model Camera {
  id        String     @id @default(uuid())
  name      String
  location  String
  incidents Incident[]
}
```

### Incident Model
```prisma
model Incident {
  id           String   @id @default(uuid())
  cameraId     String
  camera       Camera   @relation(fields: [cameraId], references: [id])
  type         String
  tsStart      DateTime
  tsEnd        DateTime
  thumbnailUrl String
  resolved     Boolean  @default(false)
}
```

## Development Notes

- **Optimistic UI**: Incident resolution provides immediate visual feedback
- **Real-time Updates**: Uses TanStack Query for efficient data fetching and caching
- **Responsive Design**: Fully responsive layout matching the Figma design
- **Type Safety**: Full TypeScript implementation with Prisma-generated types
- **Modern Architecture**: Next.js 15 App Router with server and client components

## Production Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Set up production database**:
Update `DATABASE_URL` in `.env` for your production PostgreSQL instance

3. **Run migrations**:
```bash
npm run db:migrate
```

4. **Start production server**:
```bash
npm run start
```

## Contributing

This project follows modern React and Next.js best practices with a focus on type safety, performance, and user experience.