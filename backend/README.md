# Scheduler Backend API

Node.js + TypeScript backend for the scheduler system with recurring weekly slots.

## Features

- 🔄 **Recurring Schedules**: Create weekly recurring time slots
- 📅 **Exception Handling**: Modify or delete specific dates without affecting the pattern
- 🔒 **Validation**: Comprehensive input validation with Joi
- 🗄️ **PostgreSQL**: Robust database with automatic schema setup
- 🛡️ **Security**: Helmet, CORS, and proper error handling
- 📝 **TypeScript**: Full type safety and modern development

## API Endpoints

### Health Check
- `GET /` - Server health check
- `GET /api/health` - API health check

### Slots Management
- `GET /api/slots/week/:date` - Get slots for a specific week (YYYY-MM-DD)
- `POST /api/slots` - Create new recurring slot
- `PUT /api/slots/:id/date/:date` - Update slot for specific date
- `DELETE /api/slots/:id/date/:date` - Delete slot for specific date
- `DELETE /api/slots/:id` - Delete entire recurring schedule

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
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
   
   Update `.env` with your database credentials:
   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://username:password@localhost:5432/scheduler_db
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=scheduler_db
   DB_USER=username
   DB_PASSWORD=password
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database setup**
   ```bash
   # Create database
   createdb scheduler_db
   
   # Database tables are created automatically on server start
   
   # Sample data is seeded automatically on server start
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Schedules Table
- `id` - Primary key
- `day_of_week` - Integer (0=Sunday, 6=Saturday)
- `start_time` - String (HH:MM format)
- `end_time` - String (HH:MM format)
- `is_active` - Boolean
- `created_at`, `updated_at` - Timestamps

### Schedule Exceptions Table
- `id` - Primary key
- `schedule_id` - Foreign key to schedules
- `exception_date` - Date (YYYY-MM-DD)
- `start_time` - String (nullable for deletions)
- `end_time` - String (nullable for deletions)
- `exception_type` - Enum ('modified', 'deleted')
- `created_at`, `updated_at` - Timestamps

## Request/Response Examples

### Create Recurring Slot
```json
POST /api/slots
{
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "11:00"
}
```

### Update Slot for Specific Date
```json
PUT /api/slots/1/date/2024-01-15
{
  "start_time": "10:00",
  "end_time": "12:00"
}
```

### Get Week Slots
```json
GET /api/slots/week/2024-01-15

Response:
{
  "success": true,
  "data": [
    {
      "date": "2024-01-14",
      "slots": []
    },
    {
      "date": "2024-01-15",
      "slots": [
        {
          "id": 1,
          "start_time": "10:00",
          "end_time": "12:00",
          "is_exception": true,
          "schedule_id": 1,
          "exception_id": 1
        }
      ]
    }
  ]
}
```

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- Database tables are created automatically on server startup

### Testing
- Test API endpoints using Postman or similar tools
- Database operations are wrapped in transactions for consistency
- Comprehensive error handling and validation

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
FRONTEND_URL=https://your-frontend-domain.com
```

### Build and Deploy
```bash
npm run build
npm start
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error