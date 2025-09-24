# Backend Debugging Steps

## 1. Check PostgreSQL Status
Before starting the backend, ensure PostgreSQL is running:

```powershell
# Check if PostgreSQL service is running
Get-Service -Name "*postgres*"

# Or check if port 5432 is listening
netstat -ano | findstr :5432
```

## 2. Create Database (if not exists)
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE scheduler_db;
```

## 3. Test Database Connection
```powershell
# Test connection with psql
psql -h localhost -U postgres -d scheduler_db
```

## 4. Run Migrations
```powershell
cd D:\dilsaycare\scheduler-system\backend
npx knex migrate:latest
```

## 5. Start Backend with Debug
```powershell
cd D:\dilsaycare\scheduler-system\backend
node start-debug.js
```

## 6. Test API Endpoints
```powershell
# Test simple route (no database)
Invoke-RestMethod "http://localhost:3001/api/test"

# Test health check
Invoke-RestMethod "http://localhost:3001/api/health"

# Test database connection
Invoke-RestMethod "http://localhost:3001/api/test-db"
```

## 7. Frontend Test Request
Create this test in browser console or a new file:

```javascript
// Test API call from frontend
fetch('http://localhost:3001/api/test')
  .then(response => response.json())
  .then(data => console.log('✅ API Response:', data))
  .catch(error => console.error('❌ API Error:', error));
```

## Common Issues & Solutions

### 1. PostgreSQL Not Running
- **Error**: `connect ECONNREFUSED 127.0.0.1:5432`
- **Solution**: Start PostgreSQL service or install PostgreSQL

### 2. Database Does Not Exist
- **Error**: `database "scheduler_db" does not exist`
- **Solution**: Create the database using createdb or pgAdmin

### 3. CORS Issues
- **Error**: `Access-Control-Allow-Origin` header
- **Solution**: Verify FRONTEND_URL in .env matches frontend port (5174)

### 4. Port Already in Use
- **Error**: `EADDRINUSE :::3001`
- **Solution**: Kill existing process on port 3001

```powershell
netstat -ano | findstr :3001
taskkill /F /PID [PID_NUMBER]
```