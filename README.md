# DilsayCare Scheduler System

A modern full-stack web application for managing weekly recurring time slots with exception handling. Built for efficient scheduling with an intuitive calendar interface.

## 🎯 Project Overview

This scheduler system enables users to:
- Create weekly recurring time slots (up to 2 per day)
- Modify specific dates without affecting the recurring pattern
- Delete individual slot occurrences
- Navigate through weeks with infinite scroll
- Manage schedules with an intuitive calendar interface

Perfect for appointment scheduling, class timetables, or any recurring time-based activities.

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **React Query** for state management
- **Vite** for build tooling
- **Axios** for API communication

### Backend
- **Node.js** with TypeScript
- **Express.js** REST API
- **PostgreSQL** database
- **Knex.js** for migrations and queries
- **Joi** for validation

## 🏗 Architecture

```
scheduler-system/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   └── dist/             # Built application
└── backend/           # Node.js TypeScript API
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   └── services/      # Business logic
    └── migrations/       # Database migrations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd scheduler-system
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create database
createdb scheduler_db

# Run migrations
npm run migrate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment file
cp .env.example .env
# Edit .env with backend URL (already configured for local development)

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📱 Features

### 📅 Weekly Calendar View
- Clean, intuitive weekly calendar interface
- Navigation between weeks
- Visual indicators for different slot states

### 🔄 Recurring Slot Management
- Create weekly recurring time slots
- Choose day of week and time range
- Automatic conflict detection
- Maximum 2 slots per day enforcement

### ✏️ Exception Handling
- Modify individual slot instances
- Delete specific occurrences
- Visual distinction for modified slots
- Maintain recurring pattern integrity

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes

### ⚡ Real-time Updates
- Optimistic UI updates
- Automatic data synchronization
- Error handling with rollback

## 🗄 Database Schema

### Schedules Table
Stores the recurring pattern definitions:
- Weekly recurring time slots
- Day of week, start/end times
- Active status tracking

### Schedule Exceptions Table
Manages date-specific modifications:
- Links to parent schedule
- Exception type (modified/deleted)
- Modified times for specific dates

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots/week/:date` | Get slots for a specific week |
| POST | `/api/slots` | Create new recurring slot |
| PUT | `/api/slots/:id/date/:date` | Update slot for specific date |
| DELETE | `/api/slots/:id/date/:date` | Delete slot for specific date |
| DELETE | `/api/slots/:id` | Delete entire recurring schedule |

## 🎨 UI Components

### WeekView
Main calendar component with week navigation and slot display.

### DayColumn
Individual day display with add/edit functionality.

### SlotCard
Time slot representation with action buttons and status indicators.

### Modals
- **CreateSlotModal**: Form for new recurring slots
- **EditSlotModal**: Form for modifying/deleting instances

## 🚀 Deployment

### Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   FRONTEND_URL=https://your-frontend-url.com
   ```

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set framework preset to "Vite"
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
4. Deploy automatically on push

### Database (Neon/Railway)
1. Create PostgreSQL database
2. Run migrations: `npm run migrate`
3. Update DATABASE_URL in backend environment

## 🛠 Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Database Operations
```bash
# Create new migration
npm run migrate:make migration_name

# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Seed database
npm run seed
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📈 Performance Features

- **Optimistic Updates**: Instant UI feedback
- **Caching**: React Query automatic caching
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Vite build optimizations
- **Database Indexing**: Optimized queries

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/scheduler_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scheduler_db
DB_USER=username
DB_PASSWORD=password
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Backend README](./backend/README.md) - API documentation and setup
- [Database Schema](./backend/migrations/) - Database structure and migrations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

Built by [Your Name] for DilsayCare Internship Application

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the environment variable configuration
3. Ensure PostgreSQL is running
4. Check the console for error messages

### Troubleshooting

**Backend not starting:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb scheduler_db`

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors in IDE
- Verify API URL in environment variables

**Database connection issues:**
- Test connection with: `psql -h localhost -U username -d scheduler_db`
- Verify DATABASE_URL format
- Check firewall settings

---

**Live Demo:** [Coming Soon]  
**Repository:** [GitHub Repository]  
**Documentation:** [API Docs]