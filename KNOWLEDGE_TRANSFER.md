# Knowledge Transfer Document

## Project Overview

**Project Name:** ConvoX  
**Stack:** React (with Vite), Tailwind CSS, Radix UI, React Router, React Hook Form, custom backend APIs  
**Purpose:**  
A dashboard and widget system for managing and deploying AI-powered chat companions for business websites. Users can sign up, configure their companion, view analytics, and install a chat widget on their site.

---

## 1. Project Structure

```
convox/
  ├── public/                # Static assets (images, widget.js, etc.)
  ├── src/
  │   ├── assets/            # (Unused or for future static assets)
  │   ├── components/        # Reusable UI and feature components
  │   │   ├── installer/     # Widget installation modal
  │   │   ├── layouts/       # Layout components (Navbar)
  │   │   ├── protected/     # Route protection (auth)
  │   │   ├── signup/        # Signup form and steps
  │   │   └── ui/            # UI primitives (Button, Card, Loader, etc.)
  │   ├── hooks/             # Custom React hooks (e.g., useDashboardData)
  │   ├── lib/               # Utility functions (e.g., className merging)
  │   ├── pages/             # Main route pages (Dashboard, Login, Signup, etc.)
  │   ├── App.jsx            # Main app component, sets up routing
  │   ├── main.jsx           # React entry point
  │   └── index.css          # Tailwind and global styles
  ├── index.html             # HTML entry point
  ├── tailwind.config.js     # Tailwind CSS config
  ├── vite.config.js         # Vite config (with path aliases)
  ├── package.json           # Dependencies and scripts
  └── README.md              # (Default, not project-specific)
```

---

## 2. Key Features & Flows

### Authentication & Routing

- **Routing:**  
  Uses `react-router-dom` for client-side routing.  
  - `/login` and `/signup` are public.
  - All other routes are protected by `ProtectedRoute`, which checks for a valid JWT token in localStorage and verifies it with the backend.

- **Auth Flow:**  
  - On login/signup, JWT and user details are stored in localStorage.
  - `ProtectedRoute` fetches `/webhook/user_account` to validate the token.

### Main Pages

- **Dashboard (`/`)**  
  - Shows metrics (conversations, interactions, users), a table of recent conversations, and a bar chart (Recharts).
  - Data is fetched via the custom hook `useDashboardData`, which calls `/webhook/dashboardv1`.

- **Configure Companion (`/configureCompanion`)**  
  - Lets users set the companion's name, persona, colors, font, and upload knowledge files (if premium).
  - Generates a live preview and embed code for the chat widget.
  - Uses `InstallWidgetModal` for installation instructions.

- **Chat Widget (`/chat-widget`)**  
  - Standalone page for the embeddable chat widget.
  - Reads config from URL params, handles chat session, and interacts with `/webhook/convox_trial`.

- **Signup (`/signup`)**  
  - Multi-step form (business info, companion config, account creation, install/preview).
  - Each step is a separate component under `components/signup/steps/`.

- **Login (`/login`)**  
  - Simple login form, stores JWT and user details on success.

- **Reports (`/reports`)**  
  - Placeholder for future analytics.

---

## 3. UI & Styling

- **Tailwind CSS** is used for all styling.  
  - Custom colors, gradients, and fonts are defined in `tailwind.config.js`.
  - Dark mode is supported via a `ThemeContext` and toggled with a button in the Navbar.

- **UI Components**  
  - Located in `src/components/ui/` (Button, Card, Loader, Input, etc.).
  - Built on top of Radix UI primitives for accessibility and consistency.

- **Navbar**  
  - Sticky, includes user info, credits, dark mode toggle, and navigation.

---

## 4. Widget Installation

- **InstallWidgetModal**  
  - Generates a `<script>` tag for embedding the chat widget on any website.
  - Instructions for both JavaScript and (future) React integration.
  - User must confirm installation before proceeding.

---

## 5. State Management

- **React Context**  
  - `ThemeContext` for dark/light mode.
- **React Hook Form**  
  - Used for all forms, including multi-step signup and companion configuration.

---

## 6. API Endpoints

Below is a summary of the main backend API endpoints used in this project. All endpoints are hosted at `https://walrus.kalavishva.com/webhook/`.

| Sr. No | Endpoint                | Payload (example)                                                                 | Auth         | Purpose                                                      |
|--------|-------------------------|----------------------------------------------------------------------------------|--------------|--------------------------------------------------------------|
| 1      | `/loginv2`              | `{ email, password }`                                                            | JWT (custom) | Login user, returns JWT and user details                    |
| 2      | `/walrus_convox_signup` | `{ companyName, websiteURL, industry, ... , email, password, ... }`              | None         | Register a new user and business                            |
| 3      | `/dashboardv1`          | `{ user_id }`                                                                    | JWT          | Fetch dashboard metrics and recent conversations            |
| 4      | `/user_account`         | None (GET) or `{}`                                                               | JWT          | Get user account info, plan, and credits                    |
| 5      | `/update_companion`     | `{ user_id, companion_name, primary_colour, ... }`                               | JWT          | Update companion configuration                              |
| 6      | `/generate-widget`      | `{ user_id, primaryColor, secondaryColor, companionName, fontFamily, type? }`    | None         | Generate widget embed code (JS/React)                       |
| 7      | `/convox_trial`         | `{ user_id, session_id, customer_email?, user_message, timestamp? }`             | None         | Send/receive chat messages for the widget                   |

**Notes:**
- All endpoints except signup and widget/chat use JWT authentication. The JWT is stored in localStorage after login/signup.
- The payloads above are representative; see the relevant code for full details and optional fields.
- The widget embed code can be generated for both JavaScript and (future) React types.
- The `/convox_trial` endpoint is used by the chat widget for all user-bot interactions.

---

## 7. Environment & Setup

- **Install dependencies:**  
  `npm install`
- **Run dev server:**  
  `npm run dev`
- **Build for production:**  
  `npm run build`
- **Preview production build:**  
  `npm run preview`
- **Lint:**  
  `npm run lint`

- **Vite** is used for fast development and builds.
- **Path aliases:**  
  `@` points to `src/` (see `vite.config.js`).

---

## 8. Custom Hooks & Utilities

- **`useDashboardData`**  
  Fetches and formats dashboard metrics and messages.

- **`cn` utility**  
  Merges class names using `clsx` and `tailwind-merge`.

---

## 9. Theming

- **Dark mode** is toggled via the Navbar and stored in localStorage.
- **ThemeContext** provides `theme` and `toggleTheme` to the app.

---

## 10. Deployment

- **Vercel** is used for deployment (see `vercel.json`).
- **Static assets** are in `public/`.

---

## 11. Notable Packages

- `@radix-ui/react-*` — Accessible UI primitives
- `react-hook-form` — Form state management
- `recharts` — Charting
- `sonner` — Toast notifications
- `lucide-react` — Icons
- `axios` — HTTP requests (used in some hooks)
- `jwt-encode` — JWT creation for login

---

## 12. Extending & Maintaining

This section provides detailed guidance for future developers on how to extend, maintain, and evolve the project.

### Adding New Pages

1. **Create a New Page Component:**
   - Add a new file in `src/pages/`, e.g., `NewFeaturePage.jsx`.
   - Use functional components and Tailwind CSS for styling.
   - Example skeleton:
     ```jsx
     import Navbar from "@/components/layouts/Navbar";
     
     function NewFeaturePage() {
       return (
         <div>
           <Navbar title="New Feature" />
           <div className="p-6">Your content here</div>
         </div>
       );
     }
     export default NewFeaturePage;
     ```

2. **Register the Route:**
   - Open `src/App.jsx`.
   - Import your new page at the top.
   - Add a `<Route path="/new-feature" element={<NewFeaturePage />} />` inside the `<Routes>` block.
   - If the page should be protected (requires login), wrap it in `<ProtectedRoute>`.

3. **Navigation:**
   - Update the Navbar or any relevant navigation component to include a link to your new page if needed.

### Adding New UI Components

1. **Create the Component:**
   - Place new UI primitives in `src/components/ui/` (e.g., `MyButton.jsx`).
   - For feature-specific or composite components, use a relevant subfolder in `src/components/`.
   - Use Tailwind CSS for styling and follow the conventions in existing UI components.

2. **Export and Use:**
   - Export your component and import it where needed in pages or other components.
   - Reuse existing UI primitives for consistency.

3. **Testing:**
   - Test your component in isolation and as part of the page.
   - Ensure accessibility (labels, keyboard navigation, etc.).

### Updating the Widget

1. **Widget Logic:**
   - The main widget logic is in `src/pages/ChatWidget.jsx`.
   - To change the widget's appearance, behavior, or API integration, edit this file.
   - The widget reads configuration from URL parameters and interacts with the backend via `/webhook/convox_trial`.

2. **Widget Installation:**
   - The installation modal is in `src/components/installer/InstallWidgetModal.jsx`.
   - To change installation instructions or add new embed types, update this component.

3. **Testing the Widget:**
   - Run the app locally and visit `/chat-widget` with appropriate URL parameters to test changes.
   - Example: `http://localhost:5173/chat-widget?user_id=demo&primaryColor=%230675E6`

### General Maintenance

- **Dependencies:**
  - Keep dependencies up to date. Use `npm outdated` and `npm update` as needed.
  - Check for breaking changes in major libraries (React, Tailwind, Radix UI, etc.).

- **Code Quality:**
  - Run `npm run lint` before committing changes.
  - Follow the code style and patterns used in the project.
  - Use descriptive commit messages.

- **Environment Variables:**
  - If new environment variables are needed, use Vite's `.env` system (e.g., `VITE_API_URL`).
  - Document any required variables in the README or this file.

- **Testing & Preview:**
  - Use `npm run dev` for local development.
  - Use `npm run preview` to test the production build locally.

- **Deployment:**
  - The project is set up for Vercel deployment. Push to the main branch to trigger deployment (if connected).
  - For static assets, place them in the `public/` directory.

- **Documentation:**
  - Update this knowledge transfer file and the README as the project evolves.
  - Add code comments for complex logic or non-obvious decisions.

---

**By following these guidelines, you can ensure the project remains maintainable, scalable, and easy for future contributors to understand.** 