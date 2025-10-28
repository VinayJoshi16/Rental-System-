# PedalSync - Modern Bike Rental System

A modern, responsive bike rental application built with React, TypeScript, and Supabase.

## Features

- **Real-time Bike Availability**: Check bike availability in real-time
- **Secure Booking System**: Secure user authentication and booking management
- **Admin Dashboard**: Complete admin panel for bike and user management
- **Responsive Design**: Mobile-first design with modern UI components
- **User Management**: User registration, authentication, and rental history

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd pedal-sync-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BikeCard.tsx    # Bike display component
│   └── Navbar.tsx      # Navigation component
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Bikes.tsx       # Bike listing page
│   ├── Auth.tsx        # Authentication page
│   ├── Admin.tsx       # Admin dashboard
│   └── MyRentals.tsx   # User rentals page
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
└── lib/                # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment

The application can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

For production deployment:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Open a Pull Request

