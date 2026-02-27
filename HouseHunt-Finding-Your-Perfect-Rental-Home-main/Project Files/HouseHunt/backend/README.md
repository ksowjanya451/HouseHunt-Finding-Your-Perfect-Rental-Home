# HouseHunt Backend

Backend API for HouseHunt rental property management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/househuntDB
JWT_SECRET=househunt_secret_key_123
```

3. Start MongoDB

4. Run server:
```bash
npm run dev  # Development
npm start    # Production
```

## API Base URL
`http://localhost:5000/api`
