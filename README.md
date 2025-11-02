# Computer Use Tutor Assignment

This is a modern, interactive calendar application built with React, TypeScript, and Vite. It provides a user-friendly interface for managing events with multiple views (Month, Week, Day), support for recurring events, and drag-and-drop functionality.

## Features

-   **Multiple Views:** Seamlessly switch between Month, Week, and Day views to visualize your schedule.
-   **Event Management:** Create, edit, and delete events with a simple and intuitive modal.
-   **Recurring Events:** Schedule events that repeat daily, weekly, monthly, or annually.
-   **Drag & Drop:** Easily reschedule events by dragging and dropping them to a new date or time.
-   **Responsive Design:** The application is designed to work on various screen sizes.
-   **Mini Calendar:** A sidebar with a mini calendar for quick navigation to any date.
-   **Backend Integration:** Events are persisted in a backend server with a SQLite database.

## Setup and Run

### Frontend

1.  **Navigate to the project root directory.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Backend

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the server:**
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:3001`.

## Architecture and Technology Choices

### Frontend

-   **React:** The core of the application is built with React, a popular library for building user interfaces. We use functional components and hooks to manage state and side effects.
-   **TypeScript:** TypeScript is used for static typing, which helps in catching errors early and improving code quality and maintainability.
-   **Vite:** Vite is used as the build tool and development server. It offers a fast development experience with features like Hot Module Replacement (HMR).
-   **Component-Based Architecture:** The application is structured into reusable components, each with a specific responsibility. This makes the codebase modular and easy to understand. The main components are:
    -   `App.tsx`: The root component that manages the application's state.
    -   `CalendarHeader.tsx`: The header component with navigation and view selection.
    -   `Sidebar.tsx`: The sidebar with the mini calendar and create event button.
    -   `MonthView.tsx`, `WeekView.tsx`, `DayView.tsx`: Components for the different calendar views.
    -   `EventModal.tsx`: The modal for creating and editing events.
-   **Custom Hooks:** The `useCalendar` hook encapsulates the logic for generating the calendar data for different views.
-   **Date Utilities:** A custom `dateUtils.ts` file provides helper functions for date manipulation, avoiding the need for a large external library.

### Backend

-   **Node.js & Express:** The backend is a simple REST API built with Node.js and Express.
-   **SQLite:** A lightweight, file-based SQL database is used to store events. The database is initialized in memory for simplicity.
-   **CORS:** The `cors` middleware is used to enable Cross-Origin Resource Sharing, allowing the frontend to make requests to the backend.

## Business Logic and Edge Cases

-   **Recurring Events:**
    -   The application handles recurring events by storing the initial start date and the recurrence frequency.
    -   When rendering the calendar, it calculates and displays all instances of a recurring event within the current view.
    -   When a recurring event is dragged and dropped, the entire series is updated to the new start date and time.
-   **Overlap Conflicts:** The current implementation does not handle event overlap conflicts. Events with overlapping times will be rendered on top of each other.
-   **Time Zones:** The application currently uses the user's local time zone. It does not have explicit time zone support.

## Animations and Interactions

-   **Modals:** The event modal appears with a fade-in animation.
-   **Drag and Drop:** The drag-and-drop functionality is implemented using the native HTML Drag and Drop API. When an event is being dragged, its opacity is reduced to provide visual feedback.
-   **Hover Effects:** Buttons and other interactive elements have hover effects to indicate that they are clickable.

## Future Enhancements

-   **Event Overlap Handling:** Implement a layout algorithm to handle overlapping events gracefully in the Week and Day views.
-   **Time Zone Support:** Allow users to set a time zone for the calendar and for individual events.
-   **Database Persistence:** Change the backend to use a persistent database file instead of an in-memory database.
-   **Reminders and Notifications:** Add support for setting reminders for events and sending notifications.
-   **Accessibility Improvements:** Further improve the accessibility of the application by adding more ARIA attributes and ensuring keyboard navigation is seamless.
-   **More Themes:** Allow users to customize the look and feel of the calendar with different themes.