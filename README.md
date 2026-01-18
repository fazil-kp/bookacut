# BookACut - Frontend

Multi-Tenant SaaS Beauty Parlour & Barber Shop Management System - Frontend Application

## Tech Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **TanStack Query (React Query)** - Data fetching and caching
- **Zustand** - State management
- **Date-fns** - Date utilities
- **React Hot Toast** - Notifications
- **Recharts** - Charts (for future dashboard enhancements)

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/         # Buttons, Inputs, Modals, etc.
│   │   └── layout/         # Header, Sidebar, Footer, etc.
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── super-admin/    # Super admin pages
│   │   ├── client-admin/   # Client admin pages
│   │   ├── staff/          # Staff pages
│   │   └── customer/       # Customer pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── store/              # State management (Zustand)
│   ├── utils/              # Utility functions
│   ├── constants/          # Constants and config
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   VITE_APP_NAME=BookACut
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

### Authentication
- Login with email/password
- Registration for customers
- JWT token management
- Protected routes based on user roles
- Auto-logout on token expiry

### User Roles

#### 1. Platform Super Admin
- Platform dashboard with statistics
- Tenant management (create, view, update)
- Payment recording
- Tenant subscription management

#### 2. Client Admin (Shop Owner)
- Shop dashboard
- Shop management (create, edit shops)
- Staff management (add, edit, remove staff)
- Service management (create, edit, delete services)
- Slot management (generate, block/unblock slots)
- Shop settings configuration
- Invoice viewing

#### 3. Staff
- Staff dashboard with today's bookings
- View all bookings for assigned shop
- Create walk-in bookings
- Mark bookings as arrived
- Start and complete services
- Invoice management

#### 4. Customer (Online)
- Browse available services
- View available slots
- Book appointments
- View booking history
- Cancel bookings

## API Integration

The frontend integrates with the backend API at `http://localhost:3000/api`. All API calls are made through service functions in the `src/services/` directory:

- `authService.js` - Authentication endpoints
- `superAdminService.js` - Super admin endpoints
- `clientAdminService.js` - Client admin endpoints
- `staffService.js` - Staff endpoints
- `customerService.js` - Customer endpoints

### API Configuration

Base API URL and Socket.IO URL are configured in `.env`:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_SOCKET_URL` - Socket.IO server URL

## Real-time Features (Socket.IO)

Socket.IO integration is implemented for real-time updates:

- Slot availability updates
- Booking status changes
- Slot capacity changes

The Socket.IO connection is established on app load and shop rooms are joined when viewing shop-specific data.

## State Management

- **Auth Store (Zustand)** - User authentication state, token management
- **Shop Store (Zustand)** - Selected shop for staff/client admin
- **React Query** - Server state management, caching, data fetching

## Routing

Protected routes are implemented based on user roles:

- `/login` - Public login page
- `/register` - Public registration page
- `/super-admin/*` - Super admin routes (protected)
- `/client-admin/*` - Client admin routes (protected)
- `/staff/*` - Staff routes (protected)
- `/customer/*` - Customer routes (protected)

## Styling

The application uses Tailwind CSS for styling. Custom utility classes are defined in `src/index.css`:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles
- `.input`, `.label` - Form input styles
- `.card` - Card container style
- `.badge`, `.badge-success`, `.badge-warning`, etc. - Badge styles

## Form Handling

Forms are handled using React Hook Form with validation:

- Client-side validation
- Error message display
- Integration with API mutations

## Error Handling

- Global error handling via Axios interceptors
- User-friendly error messages via toast notifications
- 401 errors trigger automatic logout
- Loading states for all async operations

## Development Guidelines

1. **Components**: Place reusable components in `src/components/common/`
2. **Pages**: Create page components in `src/pages/[role]/`
3. **Services**: Add API service functions in `src/services/`
4. **Hooks**: Custom hooks go in `src/hooks/`
5. **Utils**: Utility functions in `src/utils/`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:3000` |
| `VITE_APP_NAME` | Application name | `BookACut` |

## Production Deployment

1. Update environment variables for production
2. Build the application: `npm run build`
3. Deploy the `dist` directory to your hosting service
4. Configure your web server to serve the built files
5. Ensure backend API URL is accessible from the frontend domain

## Troubleshooting

### API Connection Issues
- Verify backend API is running on `http://localhost:3000`
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

### Authentication Issues
- Verify JWT token is stored in localStorage
- Check token expiry
- Clear localStorage and login again if needed

### Socket.IO Connection Issues
- Verify Socket.IO server is running
- Check `.env` file has correct `VITE_SOCKET_URL`
- Check browser console for connection errors

## License

This project is part of the BookACut Multi-Tenant SaaS platform.

