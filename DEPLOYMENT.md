# Deployment to Vercel

To deploy this marketplace to Vercel, follow these steps:

## 1. Prerequisites
- A Vercel account.
- The Vercel CLI installed (`npm i -g vercel`) or connect your GitHub repository.

## 2. Environment Variables
You must set the following environment variables in the Vercel Dashboard (Settings > Environment Variables):

- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key (from Stripe Dashboard).
- `VITE_FIREBASE_API_KEY`: (And other Firebase config if not using the embedded config).
  - *Note: This app uses a local `firebase-applet-config.json`. For production, you may want to move these to environment variables.*

## 3. Deployment Steps
### Using CLI:
1. Run `vercel` in the root directory.
2. Follow the prompts.
3. Once finished, run `vercel --prod` to deploy to production.

### Using GitHub:
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Vercel will automatically detect the settings from `vercel.json` and `package.json`.

## 4. Port Configuration
Vercel handles the entry point via the `vercel.json` configuration. The Express server in `server.ts` is configured to work as a serverless function for API routes.
