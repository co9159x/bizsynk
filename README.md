# BizSynk

BizSynk is a comprehensive salon management system designed to streamline operations for both staff and administrators.

## Features

### Staff Features
- **Service Records Management**
  - Create and manage service records
  - Track client information
  - Record multiple services per client
  - Automatic staff name assignment
  - Payment method tracking

- **Attendance Tracking**
  - Clock in/out functionality
  - View attendance history
  - Track working hours

- **Inventory Management**
  - View available inventory items
  - Track item usage
  - Monitor stock levels
  - Record item consumption

### Admin Features
- **Dashboard**
  - Real-time revenue tracking
  - Staff performance metrics
  - Service popularity analytics
  - Inventory status overview

- **Staff Management**
  - Add new staff members
  - Manage staff roles and permissions
  - View staff attendance records
  - Monitor staff performance

- **Service Management**
  - Add/edit service categories
  - Set service prices
  - Manage service durations
  - Track service popularity

- **Inventory Control**
  - Add new inventory items
  - Set minimum stock levels
  - Track inventory usage
  - Manage stock alerts

- **Client Management**
  - View client history
  - Track client preferences
  - Manage client records
  - View service history

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/bizsynk.git
```

2. Install dependencies
```bash
cd bizsynk
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server
```bash
npm run dev
```

## Usage

### Staff Login
1. Navigate to `/staff/login`
2. Enter your credentials
3. Access your dashboard with service records and attendance tracking

### Admin Login
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access the admin dashboard with full system management capabilities

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/co9159x/bizsynk](https://github.com/co9159x/bizsynk) 