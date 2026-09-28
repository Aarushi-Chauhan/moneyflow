# MoneyFlow - Step-by-Step User Guide

Welcome to **MoneyFlow**, your personal finance and analytics dashboard. This guide will walk you through what MoneyFlow is and how to use it step-by-step.

## 1. Prerequisites (Important for Setup)

MoneyFlow is built with modern tools like Next.js, which require a recent version of Node.js.
- **Required Node.js Version**: `>= 20.9.0`
- You recently encountered an error: `You are using Node.js 16.20.2. For Next.js, Node.js version ">=20.9.0" is required.`
- **How to update**: You can use `nvm` (Node Version Manager) in your terminal to switch to the correct version:
  ```bash
  nvm install 20
  nvm use 20
  ```

## 2. Getting Started

Once you have the correct Node.js version active, you can start the application:

1. **Install Dependencies** (if you haven't already):
   ```bash
   npm install
   ```
2. **Run the Development Server**: Start the local server by running:
   ```bash
   npm run dev
   ```
3. **Open the App**: Open your browser and go to [http://localhost:3000](http://localhost:3000).

## 3. How to Use MoneyFlow (Step-by-Step Flow)

Once you are in the application, here is how you can use the different features:

### Step 1: The Dashboard (Your Overview)
- When you open the app, you will land on the **Dashboard**.
- Here you can see your high-level Key Performance Indicators (KPIs): Total Balance, Income, and Expenses.
- **Action**: Check the charts to understand your spending trends over the last few months.

### Step 2: Managing Transactions
- Navigate to the **Transactions** page from the sidebar.
- You will see a list of all your mock transactions.
- **Action 1 (Search)**: Use the search bar to find specific transactions (e.g., type "Coffee" or "Rent").
- **Action 2 (Filter)**: Use the filters to view transactions by specific categories or dates.
- **Action 3 (Add New)**: Click the "Add Transaction" button. Fill out the form with the amount, category, and date. The form will validate your inputs before saving.

### Step 3: Budgets & Categories
- Go to the **Budgets** section to see how much you are spending in different categories.
- You will see visual progress bars indicating how close you are to your budget limits.
- **Action**: Review which categories are in the "red" (over budget) and adjust your spending habits accordingly.

### Step 4: Analytics (Deep Dive)
- Head over to the **Analytics** page.
- This section provides detailed insights into your savings and spending patterns over time.
- **Action**: Use these insights to plan your future finances.

### Step 5: Settings & Customization
- Go to **Settings**.
- **Dark Mode**: MoneyFlow supports a fully integrated dark mode. You can toggle between light and dark themes based on your preference.
- **Action**: Update your profile preferences (mock data) to see how the app reacts to user changes.

## 4. Understanding the Architecture

If you are a developer looking into the code, here is a quick summary:
- The UI is built with **React** and styled beautifully using **Tailwind CSS**.
- The routing uses **Next.js App Router** for modern web performance.
- The data you see is currently mock data (simulating a real backend with fake network latency). In the future, this can be connected to a real database like PostgreSQL.

Enjoy managing your finances with MoneyFlow!
