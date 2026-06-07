# ⚡ TaskFlow — Premium SaaS Productivity Dashboard

TaskFlow is a highly polished, recruiter-impressive, production-ready Task Manager web application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **Framer Motion**. It adopts a sleek, minimal, and premium visual layout inspired by leading developer productivity suites like Linear, Notion, and Vercel.

---

## ✨ Features and Architecture

### 📊 Real-Time Analytics Dashboard
* **Dynamic Stats Cards**: At-a-glance trackers for **Total Tasks**, **Active Tasks**, **Completed Tasks**, and **Overdue Warnings**.
* **Interactive Progress Ring**: An animated SVG radial progress meter representing your overall completion percentage. The ring stroke offset animates in real-time on task mutation (creation, completion, deletion).

### 🖋️ Interactive Creation Form
* **Task Form Inputs**: Highly stylized inputs with custom outlines and active glow borders.
* **Inline Length Trackers**: Character limit indicator (`title.length/60`) for titles.
* **Overdue Date Flags**: Form displays an alert notification if the user selects a due date in the past.
* **Segmented Priority Controller**: Custom segmented control for setting task priority (Low, Medium, High) with smooth color-coded highlight indicators.

### 📝 Task List Board
* **Left-Border Priority Striping**: Tasks are color-coded on the left border matching their priority level (Indigo for Low, Amber for Medium, Rose for High).
* **Completed Strikethrough Animation**: Circular completion checkboxes animate an emerald checkbox fill with a checkmark spring. The task title strikes through from left to right.
* **Overdue Date Highlighting**: Flashing warning icons and red timestamps mark items whose deadlines are in the past.

### ⚙️ Premium UI/UX Polish
* **Fluid Theme Engine**: Fast, seamless dark/light mode toggle with persistent browser memory (`localStorage`) and system preference checks.
* **Interactive Widgets**:
  * **Quote Engine**: Displays rotating motivational productivity quotes, featuring a manual refresh button with spin animations.
  * **System Logger**: Chronological timeline displaying recent user operations (adding, editing, deleting, completing).
* **Timed Toast Notifications**: Non-blocking alerts (Success, Info, Warning) at the bottom-right of the viewport.
* **Skeleton Loader States**: Simulates network/database fetch latency with shimmering card loading skeletons.
* **Confirmation Dialog Modal**: Accessible delete modal overlay featuring a backdrop blur, Escape key dismissal listener, and spring animations.

---

## 🛠️ Tech Stack

* **Core Framework**: React 19 (Hooks, Context, Refs, LocalStorage hooks)
* **Build Tool**: Vite 8 (Ultra-fast Hot Module Replacement)
* **Styling**: Tailwind CSS v4 (CSS-first setup, custom animations, custom utility classes)
* **Transitions**: Framer Motion (Layout-preserving physics springs, fade/slide animations)
* **Iconography**: React Icons (`react-icons/fi`)

---

## 🚀 Setup & Run Instructions

Follow these commands in your terminal to install dependencies and boot up the development server:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser to interact with the dashboard.

### 3. Build for Production
To generate a fully minified and optimized production build (output placed in the `/dist` directory):
```bash
npm run build
```
*(The project compiles with 0 errors and 0 warnings.)*

---

## 📂 Project Structure
```text
jobProject/
├── dist/                # Production-ready minified build assets
├── src/
│   ├── assets/          # Static media assets
│   ├── components/      # Modular UI components
│   │   ├── DashboardStats.jsx  # Metric cards & circular progress
│   │   ├── EmptyState.jsx      # Vector illustrations for empty workspaces
│   │   ├── Header.jsx          # Branding & Light/Dark Theme Switch
│   │   ├── Modal.jsx           # Accessible confirmation modal overlay
│   │   ├── QuoteWidget.jsx     # Rotating productivity quote box
│   │   ├── RecentActivity.jsx  # Activity log timeline
│   │   ├── TaskCard.jsx        # Colored priority border card layout
│   │   ├── TaskForm.jsx        # Smart task create/edit form
│   │   └── Toast.jsx           # Stackable toast manager
│   ├── context/
│   │   └── ThemeContext.jsx    # Global dark mode toggle provider
│   ├── hooks/
│   │   └── useLocalStorage.js  # React state-sync local storage hook
│   ├── App.jsx          # Main application coordinator
│   ├── index.css        # Tailwind config, scrollbars & global fonts
│   └── main.jsx         # Render entry point
├── index.html           # HTML5 wrapper & SEO metadata definitions
├── package.json         # Project manifests and dependency trees
└── vite.config.js       # Vite build configurations and plugin definitions
```

