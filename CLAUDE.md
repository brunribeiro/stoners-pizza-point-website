# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js e-commerce website for Stoner's Pizza Joint, built with React and integrated with various third-party services including Sentry for error tracking, PostHog for analytics, and Atlas for customer support chat.

## Development Commands

### Basic Development

- `npm run dev` - Start development server on port 1124
- `npm run build` - Build the production application
- `npm start` - Start production server on port 8124
- `npm run start-prod` - Start production server on port 8010

### Code Quality

- `npm run lint` - Run Next.js linter
- `npm run check-lint` - Run ESLint with strict checks
- `npm run check-format` - Check code formatting with Prettier
- `npm run format` - Auto-format code with Prettier

### PM2 Deployment

- `npm run init-dev` - Install dependencies, build, and start dev server with PM2
- `npm run init-prod` - Install dependencies, build, and start prod server with PM2
- `npm run serve` - Deploy and reload dev PM2 process (8124-stoner-website)
- `npm run serve-prod` - Deploy and reload prod PM2 process (8010-stoner-website)

The `next-deploy.js` script handles the deployment process by installing dependencies, building, and managing the .next directory.

## Architecture

### Routing System

This application uses a **dynamic routing pattern** based on dining options:

- Primary route structure: `[diningOption]/[rest]/menu/categories/[id]`
- The `[diningOption]` parameter determines ordering mode (delivery, pickup, curbsidepickup)
- The `[rest]` parameter identifies the restaurant location
- Routes are centralized in `utils/routes.js`

Example routes:

- Menu: `/delivery/main-street/menu/categories`
- Item detail: `/pickup/downtown/menu/categories/items/123`

### State Management

The application uses **React Context** for global state management with three main contexts:

1. **AppContext** (`utils/appContext.js` + `hook/context/useAppContext.js`)
   - Manages authentication state, user login data
   - Stores menu/restaurant session IDs
   - Handles button loading states

2. **RestaurantContext** (`contexts/restaurantContext.js`)
   - Manages restaurant lists (default, pickup search, delivery search)
   - Handles location coordinates for pickup and delivery
   - Implements debounced search with stale guard mechanism
   - Key methods: `loadDefaultList()`, `loadSearchByPickup()`, `loadSearchByDelivery()`

3. **MenuContext** (`contexts/menuContext.js`)
   - Manages category and item lists
   - Handles menu search with debounced queries
   - Key methods: `loadCategories()`, `loadItems()`, `searchItems()`

### Session Management

- Uses `iron-session` for secure server-side sessions
- Session wrapper functions in `lib/withSession.js`:
  - `withSessionRoute()` - Wraps API routes
  - `withSessionSsr()` - Wraps `getServerSideProps`
- Session config stored in `lib/config.js`
- Auth routing handled by `utils/handleAuth.js` with `privateRoute()` HOC

### Component Structure

- `components/` - Organized by feature area:
  - `Home/` - Landing page components with sign-in/sign-up overlay
  - `Menu/` - Category lists, item cards, cart overlays, customization modals
  - `Order/` - Order history, order details, receipts
  - `Checkout/` - Checkout flow components
  - `Settings/` - Account settings, preferences, dietary restrictions
  - `MyCards/` - Payment cards and gift card management
  - `Rewards/` - Loyalty card and rewards system
  - `Inbox/` - User notifications and messages
  - `common/` - Reusable components (modals, loaders, skeletons, maps)

### Services Layer

- `services/api/` - **Client-side API utilities** (NOT Vercel serverless functions)
  - `common.js` - Common API wrapper function
  - `index.js` - Axios configuration and request handlers
  - `list.js` - API endpoint definitions
- `services/restaurantService.js` - Restaurant search and location APIs
- `services/menuService.js` - Menu categories, items, and search APIs
- **Actual API routes** are in `pages/api/` (Next.js convention for serverless functions)
- All API calls go through a centralized service pattern

### Utilities

- `utils/constant.js` - Application constants (API responses, formats, enums)
- `utils/helper.js` - Common helper functions (date formatting, token refresh)
- `utils/localStorage.js` - LocalStorage wrapper utilities
- `utils/routes.js` - Route path generators
- `utils/toast.js` - Toast notification utilities
- `utils/handleAuth.js` - Authentication helpers and route guards

## Internationalization

- Uses `next-translate` for i18n
- Configured in `i18n.json` with two locales: `en` (default) and `id`
- Translation files in `locales/[locale]/[namespace].json`
- Namespaces: common, home, menu, order, checkout

## Code Style

### ESLint Rules (`.eslintrc.json`)

- Strict equality required (`eqeqeq: error`)
- Enforced import ordering with newlines between groups
- SonarJS rules for code quality
- Prefer const and arrow callbacks
- Single quotes for strings (except to avoid escaping)

### Prettier Config (`.prettierrc`)

- Single quotes with JSX single quotes
- 2-space tabs, 100 character print width
- Trailing commas, semicolons required
- Arrow parens always

## Environment Variables

Required runtime config (see `next.config.mjs`):

- `NEXT_PUBLIC_FETCH_URL` - API base URL
- `NEXT_PUBLIC_DOMAIN_URL` - Domain URL
- `NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY` - Google reCAPTCHA key
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

## Integration Services

### Sentry

- Configured in `sentry.server.config.js`, `sentry.edge.config.js`, and `next.config.mjs`
- Organization: `gf-5n`, Project: `stoners-pizza-joint-nextjs`
- Tunnel route: `/monitoring`
- Example error page: `/sentry-example-page`

### PostHog

- Initialized in `pages/_app.js` with autocapture disabled
- Manual event tracking required

### Atlas Chat Widget

- Customer support chatbot loaded in `_app.js`
- App ID: `ld2n10pcuu`
- Positioned bottom-right, identifies logged-in users

### Google Maps

- Used for location selection in delivery/pickup flows
- Components: `PlacesAutocomplete.jsx`, `PlacesDelivery.jsx`, `PlacesPickup.jsx`, `Map.jsx`
- Uses `@react-google-maps/api` and `use-places-autocomplete`

## Deployment

### GitLab CI/CD (`.gitlab-ci.yml`)

Three environments:

- **dev**: Auto-deploys on tags matching `dev-[v]-*`
- **uat**: Manual deploy on tags matching `uat-v-*`
- **prod**: Manual deploy on tags matching `v-*`

All deployments:

1. SSH into target server
2. Fetch and checkout the tag
3. Run `npm run serve` or `npm run serve-prod`
4. PM2 reloads the application

## Important Notes

- **Pages Router**: This is a Next.js Pages Router application, not App Router
- **Session Storage**: Login triggers a page refresh via `sessionStorage.getItem('hasReloadedOnLogin')`
- **Dynamic Imports**: Menu customization uses modal components that should be lazy-loaded for performance
- **Mobile-Specific Pages**: Separate mobile checkout page at `pages/mobile/checkoutIndex.js`
- **Error Pages**: Custom 404 (`pages/404.js`) and 500 (`pages/500.js`) pages
- **Maintenance Mode**: Handled by `useCheckMaintence` hook and `MaintenaceScreen` component
