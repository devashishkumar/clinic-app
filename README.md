# Clinic Management System

A comprehensive web application for managing clinic operations, built with Angular 15. This application provides a complete solution for healthcare facilities to manage patients, appointments, medical records, and staff.

## Features

- **Authentication & Authorization**: Secure login system with role-based access control
- **Patient Management**: Register and manage patient information
- **Appointment Scheduling**: Book, view, and manage appointments with calendar integration
- **Clinic Management**: Manage multiple clinics and their assignments
- **Medical Records**: Maintain detailed patient medical histories
- **User Management**: Administer staff accounts and permissions
- **Dashboard**: Overview of clinic operations and statistics
- **Responsive Design**: Mobile-friendly interface using Angular Material and Tailwind CSS

## Tech Stack

- **Frontend**: Angular 15
- **UI Framework**: Angular Material, PrimeNG
- **Styling**: Tailwind CSS
- **State Management**: NgRx Store
- **Calendar**: Angular Calendar
- **Text Editor**: Quill
- **Alerts**: SweetAlert2
- **Forms**: Angular Reactive Forms with ngx-mask
- **Build Tool**: Angular CLI

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clinic-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `environments/environment.ts` and configure your API endpoints and keys

## Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Building

Build the application for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

Run unit tests:
```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   ├── guards/               # Route guards
│   ├── helpers/              # Utility helpers
│   ├── interfaces/           # TypeScript interfaces
│   ├── models/               # Data models
│   ├── pages/                # Main application pages
│   │   ├── appointments/     # Appointment management
│   │   ├── clinics/          # Clinic management
│   │   ├── patients/         # Patient management
│   │   ├── users/            # User management
│   │   └── medical-record/   # Medical records
│   ├── services/             # Angular services
│   ├── shared/               # Shared components
│   └── store/                # NgRx state management
├── assets/                   # Static assets
└── environments/             # Environment configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request