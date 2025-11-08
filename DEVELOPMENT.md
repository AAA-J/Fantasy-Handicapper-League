# Development Guide

This guide helps developers and AI agents understand the codebase structure and how to extend it.

## Quick Start for New Developers

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd Fantasy-Handicapper-League
   ./setup.sh
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Architecture Overview

### Backend (`/server`)
- **Framework**: Express.js
- **Database**: SQLite (file-based, no external dependencies)
- **Structure**: RESTful API with modular routes
- **Key Files**:
  - `src/index.js` - Server entry point
  - `src/db/database.js` - Database setup and schema
  - `src/routes/` - API endpoints

### Frontend (`/client`)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: React Context for user management
- **Key Files**:
  - `src/App.jsx` - Main app component with routing
  - `src/pages/` - Page components
  - `src/services/api.js` - API service layer
  - `src/contexts/` - React contexts

## Database Schema

### Tables
- `users` - User accounts with separate coin balances
- `market_contracts` - Binary prediction contracts
- `market_bets` - Bets on market contracts
- `prop_bets` - Prop betting opportunities
- `fantasy_bets` - Bets on prop bets

### Key Relationships
- Users have separate `prediction_coins` and `fantasy_coins`
- Market contracts are binary (yes/no) with 2x payout
- Prop bets have custom odds with multiplier payouts
- Currency systems are completely separate

## API Endpoints

### Market Contracts
- `GET /api/market-contracts` - List contracts with betting stats
- `POST /api/market-contracts` - Create new contract
- `POST /api/market-contracts/:id/bet` - Place bet (yes/no)
- `POST /api/market-contracts/:id/resolve` - Resolve contract
- `GET /api/market-contracts/users/:id/balance` - Get prediction coins

### Prop Bets
- `GET /api/prop-bets` - List prop bets with betting stats
- `POST /api/prop-bets` - Create new prop bet
- `POST /api/prop-bets/:id/bet` - Place bet
- `POST /api/prop-bets/:id/resolve` - Resolve prop bet
- `GET /api/prop-bets/users/:id/balance` - Get fantasy coins

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details

## Adding New Features

### 1. New API Endpoints
1. Create route file in `server/src/routes/`
2. Add route to `server/src/index.js`
3. Update API service in `client/src/services/api.js`
4. Add UI components in `client/src/pages/` or `client/src/components/`

### 2. Database Changes
1. Modify schema in `server/src/db/database.js`
2. Update seed data if needed
3. Test with fresh database (delete `server/database.sqlite`)

### 3. New UI Pages
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add navigation link if needed
4. Update API service for data fetching

## Common Patterns

### Error Handling
- Backend: Try-catch with appropriate HTTP status codes
- Frontend: Axios error handling with user-friendly messages

### State Management
- User context for global user state
- Local state for component-specific data
- API calls for data fetching

### Styling
- Tailwind CSS utility classes
- Responsive design with mobile-first approach
- Consistent color scheme (blue for market, green for fantasy)

## Testing

### Manual Testing
1. Start both servers: `npm run dev`
2. Test user flows:
   - Create contracts/prop bets
   - Place bets with different users
   - Resolve contracts/bets
   - Verify currency separation

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test market contracts
curl http://localhost:3000/api/market-contracts

# Test prop bets
curl http://localhost:3000/api/prop-bets
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in `vite.config.js` and `server/src/index.js`
2. **Database locked**: Stop server, delete `database.sqlite`, restart
3. **Import errors**: Check file paths and exports
4. **CORS issues**: Verify proxy configuration in `vite.config.js`

### Debug Mode
- Backend: Add `console.log` statements
- Frontend: Use browser dev tools and React DevTools
- Database: Use SQLite browser to inspect data

## Deployment Considerations

### Production Setup
1. Use PostgreSQL instead of SQLite
2. Add authentication middleware
3. Implement proper error logging
4. Add rate limiting
5. Use environment variables for configuration

### Scaling
- Add Redis for session management
- Implement WebSocket for real-time updates
- Add database connection pooling
- Use CDN for static assets

## Code Style

### JavaScript/React
- Use functional components with hooks
- Prefer const/let over var
- Use template literals for strings
- Consistent indentation (2 spaces)

### API Design
- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- Input validation

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Follow code style guidelines

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Vite Documentation](https://vitejs.dev/)
