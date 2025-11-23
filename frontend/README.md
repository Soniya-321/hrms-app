# HRMS Frontend

A modern, responsive Human Resource Management System frontend built with React.js.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [UI Components](#ui-components)
- [Build for Production](#build-for-production)

##  Features

- **Authentication System**: Secure login and registration with JWT
- **Employee Management**: Add, edit, delete, and view employees with pagination
- **Team Management**: Create teams, assign members, and manage team details
- **Activity Logs**: View all system activities with detailed information
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful gradient designs with smooth animations
- **Real-time Updates**: Instant data refresh after CRUD operations
- **Form Validation**: Client-side validation for all forms
- **Confirmation Modals**: User-friendly delete confirmations

##  Tech Stack

- **Framework**: React.js (v18+)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern gradients and animations
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Authentication**: JWT token-based with Context API

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:5000`

##  Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

##  Configuration

### 1. API Configuration

The application is configured to connect to the backend API. Update the API base URL if needed:

Open `src/services/api.js` and verify the base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 2. Environment Variables (Optional)

Create a `.env` file in the root directory for custom configurations:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=HRMS
```

##  Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

Or with yarn:
```bash
yarn start
```

The application will open automatically at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)


##  Available Pages

### 1. **Login Page** (`/login`)
- User authentication
- Email and password fields with validation
- Password visibility toggle
- Link to registration page
- Gradient background with modern design

### 2. **Registration Page** (`/register`)
- New organization registration
- Creates admin user automatically
- Fields: Organization name, Admin name, Email, Password, Confirm Password
- Password strength validation
- Modern UI with animations

### 3. **Dashboard** (`/dashboard`)
- Welcome screen after login
- Quick navigation to:
  - Employees
  - Teams
  - Activity Logs
- User greeting with organization context
- Navigation cards with icons

### 4. **Employees Page** (`/employees`)
Features:
- View all employees in a responsive table
- Add new employees with a modal form
- Edit employee details
- Delete employees with confirmation
- Assign employees to teams
- Pagination (10 items per page)
- Mobile-responsive (hides Teams column on small screens)

Table Columns:
- Name
- Email
- Phone
- Teams (with badges)
- Actions (Edit/Delete menu)

### 5. **Teams Page** (`/teams`)
Features:
- View all teams with members
- Create new teams
- Edit team details
- Delete teams with confirmation
- Add/remove team members
- Pagination support
- Mobile-responsive (hides Members column on small screens)

Table Columns:
- Name
- Description
- Members (with badges)
- Actions (Edit/Delete menu)

### 6. **Activity Logs** (`/logs`)
Features:
- View all system activities
- Filter logs by action type
- Real-time activity tracking
- User information for each action
- Timestamp display
- Pagination support

Log Types:
- User login/logout
- Employee created/updated/deleted
- Team created/updated/deleted
- Team assignments

##  UI Components

### ActionMenu
Dropdown menu for Edit and Delete actions on table rows.

### DeleteConfirmationModal
Reusable modal for confirming delete operations with item details.

### EmployeeForm
Modal form for creating and editing employees with validation.

### TeamForm
Modal form for creating and editing teams with member selection.

### Pagination
Reusable pagination component with page navigation and item count display.

### Navbar
Top navigation bar with:
- Application logo and title
- User profile display
- Logout button

### ProtectedRoute
Route wrapper that ensures user authentication before accessing protected pages.

##  Design Features

### Color Scheme
- **Primary Gradient**: Purple to Pink (`#667eea` to `#764ba2`)
- **Employee Actions**: Blue (`#2563eb`)
- **Team Actions**: Green (`#10b981`)
- **Danger Actions**: Red (`#dc2626`)
- **Background**: Light gray (`#f9fafb`)

### Responsive Breakpoints
- **Desktop**: > 1024px (Full table with all columns)
- **Tablet**: 768px - 1024px (Adjusted column widths)
- **Mobile**: < 768px (Hidden Teams/Members columns)

### Animations
- Slide-up animation for modals and cards
- Smooth fade-in for page transitions
- Hover effects on buttons and table rows
- Loading spinners for async operations
- Shake animation for error messages

##  Build for Production

### 1. Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### 2. Test Production Build Locally

Install a simple HTTP server:
```bash
npm install -g serve
```

Serve the build:
```bash
serve -s build
```

The production app will be available at `http://localhost:3000`

### 3. Deploy

Deploy the `build/` folder to your hosting platform:
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your Git repository
- **AWS S3**: Upload to S3 bucket with static hosting
- **Heroku**: Use heroku-buildpack-static

## Troubleshooting

### API Connection Issues

**Problem**: Cannot connect to backend API  
**Solution**: 
1. Ensure backend server is running on `http://localhost:5000`
2. Check CORS settings in backend
3. Verify API_BASE_URL in `src/services/api.js`

### Authentication Issues

**Problem**: Token expired or invalid  
**Solution**:
1. Log out and log in again
2. Check JWT_SECRET matches between frontend and backend
3. Clear browser localStorage: `localStorage.clear()`

### Styling Issues

**Problem**: Styles not loading properly  
**Solution**:
1. Clear browser cache
2. Restart development server
3. Check CSS import statements in components

## Mobile Responsiveness

The application is fully responsive:

- **Mobile (< 768px)**: 
  - Simplified tables with essential columns
  - Stack navigation vertically
  - Touch-friendly buttons and menus
  
- **Tablet (768px - 1024px)**:
  - Adjusted column widths
  - Optimized spacing
  
- **Desktop (> 1024px)**:
  - Full table view
  - Maximum content visibility

---
