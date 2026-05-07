# FinVista — AI Wealth Intelligence & Expense Tracker

FinVista is a premium, high-performance financial management application designed to help users track, analyze, and optimize their wealth effortlessly. Built with a focus on aesthetics and performance, it combines advanced data visualization with a sleek, modern interface.

![FinVista Landing Mockup](https://raw.githubusercontent.com/SujalPatelDeveloper/Expense-Tracker/main/src/assets/FinVista_Dashboard_Dark.png)

## ✨ Features

- **📊 Smart Analytics**: Deep-dive into your spending habits with interactive charts powered by Recharts.
- **🇮🇳 Multi-Locale Support**: Intelligent number formatting (Commas based on Indian or International systems) based on your currency.
- **📄 Professional Reports**: Export your transactions to beautiful, color-coded PDFs with automatic Profit/Loss totals.
- **🔐 Premium Auth Suite**: Secure, glassmorphic Login and Sign Up flows powered by Supabase.
- **🎯 Savings Goals**: Define, track, and visualize your progress towards major financial milestones.
- **📅 Subscription Manager**: Keep track of recurring payments with automated monthly/annual projections.
- **📱 PWA Ready**: Install FinVista on your phone or desktop for a native app experience.
- **🌓 Theme Support**: Elegant dark mode by default with light mode compatibility.

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **Database/Auth**: Supabase
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF + autoTable

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Supabase account (for database and authentication)

### Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SujalPatelDeveloper/Expense-Tracker.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

FinVista follows a **Premium Modern Aesthetics** approach:

- **Typography**: Uses 'Outfit' for a modern, tech-forward feel.
- **Colors**: A curated palette of Amber (`#f59e0b`) and Emerald (`#10b981`) against deep space backgrounds.
- **Glassmorphism**: Extensive use of backdrop-filters, subtle borders, and layered transparency for a sophisticated UI.
- **Precision**: Locale-aware numeric grouping and professional alignment across all tables and exports.

---

Developed with ❤️ by [Sujal Patel](https://github.com/SujalPatelDeveloper)
