# Email Dashboard - Frontend

Production-grade React application with TypeScript, OAuth authentication, and modern UI.

## Ì∫Ä Features

- React 19 + TypeScript + Vite
- Tailwind CSS for styling
- React Router v7 for navigation
- Axios with automatic token refresh
- Google OAuth 2.0 integration
- Context API for state management
- DOMPurify for XSS protection
- Responsive 3-column layout

## Ìª†Ô∏è Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Ì¥ê Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## ÔøΩÔøΩ Dependencies

### Core
- react, react-dom - UI library
- react-router-dom - Routing
- axios - HTTP client
- @react-oauth/google - Google OAuth

### Utilities
- date-fns - Date formatting
- dompurify - HTML sanitization
- lucide-react - Icon library

## Ì∫Ä Deploy

See main project README for deployment instructions.
