# Fantasy Handicapper League

A local betting application with two separate systems using different currencies:

- **Market Prediction Contracts**: Binary yes/no predictions using Prediction Coins
- **Fantasy Handicapper League**: Prop betting with odds using Fantasy Coins

## Features

### Market Prediction Contracts
- Create binary prediction contracts (yes/no)
- Place bets using Prediction Coins
- Resolve contracts and distribute payouts (2x for winning bets)
- View betting statistics and contract history

### Fantasy Handicapper League
- Create prop bets with custom odds
- Place bets using Fantasy Coins
- Resolve prop bets and distribute payouts (odds-based)
- View betting statistics and prop bet history

### Key Features
- **Currency Separation**: Two completely separate coin systems
- **Real-time Updates**: Live balance updates after betting
- **Admin Controls**: Create and resolve contracts/bets
- **User Management**: Multiple demo users for testing
- **Modern UI**: Clean, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite (no external dependencies)
- **Styling**: Tailwind CSS
- **API**: RESTful endpoints

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

#### Option 1: Quick Setup (Recommended)
```bash
git clone <repository-url>
cd Fantasy-Handicapper-League
./setup.sh
```

#### Option 2: Manual Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fantasy-Handicapper-League
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Or install separately**
   ```bash
   # Backend
   cd server && npm install && cd ..
   
   # Frontend
   cd client && npm install && cd ..
   ```

### Running the Application

#### Option 1: Run Both Servers (Recommended)
```bash
npm run dev
```
This starts both backend (port 3000) and frontend (port 5173) simultaneously.

#### Option 2: Run Servers Separately
1. **Start the backend server** (Terminal 1)
   ```bash
   npm run dev:server
   ```
   Backend runs on: http://localhost:3000

2. **Start the frontend server** (Terminal 2)
   ```bash
   npm run dev:client
   ```
   Frontend runs on: http://localhost:5173

3. **Open your browser**
   Navigate to http://localhost:5173

4. **Test the setup** (Optional)
   ```bash
   npm test
   ```
   This runs a test script to verify everything is working correctly.

## Usage

### Getting Started
1. The app loads with 3 demo users (admin, player1, player2)
2. Each user starts with 1000 Prediction Coins and 1000 Fantasy Coins
3. Select a user from the top navigation to start betting

### Market Prediction Contracts
1. Go to "Market Contracts" page
2. View existing contracts or create new ones
3. Place YES/NO bets on open contracts
4. Resolve contracts to distribute payouts

### Fantasy Handicapper League
1. Go to "Fantasy League" page
2. View existing prop bets or create new ones
3. Place bets with custom amounts
4. Resolve prop bets to distribute payouts

### Creating New Items
- **Market Contracts**: Click "Create Contract" button
- **Prop Bets**: Click "Create Prop Bet" button
- Both require a title and optional description
- Prop bets can have custom odds (default 1.0x)

## API Endpoints

### Market Contracts
- `GET /api/market-contracts` - List all contracts
- `POST /api/market-contracts` - Create new contract
- `POST /api/market-contracts/:id/bet` - Place bet
- `POST /api/market-contracts/:id/resolve` - Resolve contract
- `GET /api/market-contracts/users/:id/balance` - Get prediction coin balance

### Prop Bets
- `GET /api/prop-bets` - List all prop bets
- `POST /api/prop-bets` - Create new prop bet
- `POST /api/prop-bets/:id/bet` - Place bet
- `POST /api/prop-bets/:id/resolve` - Resolve prop bet
- `GET /api/prop-bets/users/:id/balance` - Get fantasy coin balance

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID

## Database Schema

The SQLite database includes these tables:
- `users` - User accounts with separate coin balances
- `market_contracts` - Binary prediction contracts
- `market_bets` - Bets placed on market contracts
- `prop_bets` - Prop betting opportunities
- `fantasy_bets` - Bets placed on prop bets

## Development

### Developer Resources
- **`DEVELOPMENT.md`** - Comprehensive development guide
- **`requirements.txt`** - All dependencies with versions
- **`setup.sh`** - Automated setup script
- **`env.example`** - Environment variables template
- **`.gitignore`** - Git ignore patterns

### Project Structure
```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Shared components
│   │   ├── pages/         # Market Contracts & Fantasy League pages
│   │   ├── services/      # API calls
│   │   └── contexts/      # React contexts
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── db/            # SQLite setup
│   │   └── index.js       # Server entry point
│   ├── database.sqlite    # SQLite database file
│   └── package.json
└── README.md
```

### Adding Features
The architecture is designed for easy upgrades:
- Add authentication by implementing auth middleware
- Switch to PostgreSQL by changing database connection
- Add real-time features with WebSocket integration
- Implement advanced scoring systems
- Add leaderboards and statistics

## License

This project is for educational and demonstration purposes.
