# Master Scheduler 2

A comprehensive hospital room scheduling application built with React, TypeScript, and Tailwind CSS. This application allows hospital administrators to manage room bookings with detailed staff assignments.

## Features

- 🏥 **Hospital Room Scheduling** - Manage room bookings for hospital operations
- 📅 **Month/Year Selection** - Select any month and year for scheduling
- 📊 **Weekly View** - View the correct number of weeks per month with room availability
- ⏰ **Time Slot Management** - Book AM or PM slots
- 👥 **Staff Assignment** - Assign surgeons, nurses (max 4), and anaesthetists
- ✏️ **Edit Bookings** - Modify existing bookings with full details
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with concurrent features
- 📝 **TypeScript** - Type-safe JavaScript
- 🔧 **ESLint** - Code linting and formatting
- 🚀 **Hot Module Replacement** - Instant development feedback

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd master-scheduler-2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## Project Structure

```
master-scheduler-2/
├── src/
│   ├── components/
│   │   ├── BookingModal.tsx    # Modal for booking details
│   │   ├── MonthSelector.tsx   # Month/year selector
│   │   ├── TimeSlot.tsx        # Individual time slot component
│   │   └── Week.tsx            # Week display component
│   ├── types/
│   │   └── schedule.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── scheduleUtils.ts    # Schedule management utilities
│   │   └── demoData.ts         # Demo data for testing
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                  # This file
```

## Technologies Used

- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization

## How to Use

### 1. Select Month and Year
- Use the dropdown selectors to choose the desired month and year
- The schedule will automatically update to show the selected period

### 2. View Weekly Schedule
- Each month displays the correct number of weeks based on the calendar
- Each week contains 2 rooms (Room 1, Room 2)
- Each room has 2 time slots: AM and PM

### 3. Book Time Slots
- Click on any empty time slot (dashed border with + icon)
- Fill in the booking details:
  - **Surgeon**: Required field for the operating surgeon
  - **Nurses**: Add up to 4 nurses (required)
  - **Anaesthetist**: Optional field for the anaesthetist
- Click "Save" to confirm the booking

### 4. Edit Existing Bookings
- Click on any booked time slot to edit the details
- Modify the staff assignments as needed
- Save changes to update the schedule

### 5. View Booking Details
- Booked slots display the surgeon name prominently
- Nurse names are listed below
- Anaesthetist information is shown if provided

## Development

The project uses Vite for fast development with hot module replacement. Any changes you make to the source code will be reflected immediately in the browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details 