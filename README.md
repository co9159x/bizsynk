# SalonSync

SalonSync is a modern web application designed to streamline salon management operations. It provides a comprehensive solution for managing staff, services, inventory, and client records.

## Features

### Staff Management
- Staff registration and authentication
- Role-based access control (Admin/Staff)
- Staff attendance tracking
- Performance metrics and analytics

### Service Management
- Service catalog with pricing
- Service record tracking
- Revenue analytics
- Client service history

### Inventory Management
- Real-time inventory tracking
- Low stock alerts
- Usage tracking
- Category-based organization

### Client Management
- Client profiles
- Service history
- Appointment tracking
- Notes and preferences

### Dashboard
- Real-time revenue tracking
- Staff performance metrics
- Attendance monitoring
- Service analytics
- Interactive charts and graphs

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Charts**: Chart.js
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form
- **UI Components**: Headless UI

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/co9159x/salonsync.git
cd salonsync
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
- Create a new Firebase project
- Enable Authentication and Firestore
- Add your Firebase configuration to `src/lib/firebase/config.ts`

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
salonsync/
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/           # Firebase configuration and services
│   ├── pages/         # Application pages
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static assets
└── firebase/          # Firebase configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/co9159x/salonsync](https://github.com/co9159x/salonsync) 