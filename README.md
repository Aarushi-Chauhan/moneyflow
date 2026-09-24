# MoneyFlow

**Personal Finance & Analytics Dashboard**

MoneyFlow is a production-quality personal finance and financial analytics web application designed for a modern frontend developer portfolio. It showcases advanced React patterns, clean architecture, responsive design, and performance optimizations.

## Features

- **Dashboard**: High-level KPI cards, balance trends, and expense breakdowns.
- **Transactions**: Paginated/infinite scroll transaction list with search and filtering.
- **Analytics**: Detailed insights into spending, savings, and budget tracking.
- **Budgets & Categories**: Visual progress bars and category management.
- **Settings & Auth**: Sleek mock authentication and user preferences UI.
- **Dark Mode**: Fully supported dark and light themes using Tailwind CSS.

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI Library**: React & Tailwind CSS
- **Language**: TypeScript
- **State/Forms**: React Hook Form, Zod
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Key Frontend Engineering Highlights

- **Next.js App Router**: Utilizes the modern Next.js routing paradigms.
- **TypeScript**: Strictly typed components, props, and mock data for scalability.
- **Tailwind CSS**: A beautiful custom design system built with utility classes.
- **API-Driven Architecture**: Business logic is separated using `services/` and `hooks/`, simulating realistic backend interactions with fake latency.
- **Infinite Scrolling**: Implemented a custom Intersection Observer hook to lazy-load transactions.
- **Debounced Search**: Optimized API calls by debouncing user search inputs.
- **Form Validation**: Complex transaction form utilizing React Hook Form + Zod.
- **Reusable Component Architecture**: UI components are isolated and highly reusable (inspired by shadcn/ui).
- **Responsive Design**: Designed Mobile-first to ensure usability across all device sizes.
- **Accessibility**: ARIA labels, semantic HTML, and proper focus states applied.

## Architecture & Folder Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           
│   ├── dashboard/        # Dashboard specific components
│   ├── layout/           # Global layouts (Sidebar, Header)
│   ├── transactions/     # Transaction table, forms
│   └── ui/               # Generic, reusable UI elements
├── data/                 # Mock data generators and seed data
├── features/             # Feature-specific business logic
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and config
├── services/             # API communication layer
└── types/                # TypeScript domain models
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moneyflow.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Improvements

- Connect to a real database (e.g., PostgreSQL + Prisma).
- Implement NextAuth.js for real authentication.
- Add more advanced data visualizations and date range filtering.
- Implement server-side rendering for initial data loads.
