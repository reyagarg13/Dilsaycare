# Scheduler Frontend

Modern React application for managing weekly recurring time slots with exception handling.

## Features

- 📅 **Weekly Calendar View**: Interactive weekly schedule display
- 🔄 **Recurring Slots**: Create and manage weekly recurring time slots
- ✏️ **Exception Handling**: Modify or delete specific dates without affecting the pattern
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Optimistic Updates**: Instant UI feedback with React Query
- 🎨 **Modern UI**: Clean design with TailwindCSS
- 🔍 **Infinite Scroll**: Load upcoming weeks dynamically

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Server state management and caching
- **Axios** - HTTP client for API calls
- **Date-fns** - Modern date utility library
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   └── schedule/           # Schedule-specific components
│       ├── WeekView.tsx    # Main weekly calendar
│       ├── DayColumn.tsx   # Individual day display
│       ├── SlotCard.tsx    # Time slot card
│       ├── CreateSlotModal.tsx
│       └── EditSlotModal.tsx
├── hooks/
│   └── useSchedule.ts      # React Query hooks for API
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── dateUtils.ts        # Date manipulation utilities
└── App.tsx                 # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Component Guide

### WeekView
Main component that displays the weekly calendar view with navigation and slot management.

### DayColumn
Represents a single day column showing all slots for that day with add/edit functionality.

### SlotCard
Individual time slot display with edit/delete actions and visual indicators for exceptions.

### Modals
- **CreateSlotModal**: Form for creating new recurring slots
- **EditSlotModal**: Form for editing/deleting specific slot instances

## API Integration

The application uses React Query for:
- **Caching**: Automatic caching of week data
- **Optimistic Updates**: Immediate UI updates before server confirmation
- **Error Handling**: Automatic retry and error management
- **Background Refetching**: Keep data fresh automatically

## Features in Detail

### Recurring Slots
- Create weekly recurring time slots
- Choose day of week and time range
- Automatic validation for time conflicts
- Maximum 2 slots per day limit

### Exception Handling
- Modify individual slot instances without affecting the pattern
- Delete specific occurrences
- Visual indicators for modified slots
- Revert exceptions to original pattern

### Time Management
- 30-minute interval time selection
- 12/24 hour format support
- Conflict detection and prevention
- Input validation

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layout for different screen sizes
- Optimized for both desktop and mobile usage

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your production backend URL
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA routing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
