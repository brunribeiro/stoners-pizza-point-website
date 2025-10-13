/**
 * Environment Variable Validation
 * Validates that all required environment variables are present
 * Throws an error during build time if any are missing
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FETCH_URL',
  'NEXT_PUBLIC_DOMAIN_URL',
  'NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
];

const optionalEnvVars = ['NEXT_PUBLIC_POSTHOG_KEY', 'NEXT_PUBLIC_POSTHOG_HOST', 'SESSION_SECRET'];

export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  // Check optional but recommended variables
  optionalEnvVars.forEach((key) => {
    if (!process.env[key]) {
      warnings.push(key);
    }
  });

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const missingList = missing.map((key) => `  - ${key}`).join('\n');
    throw new Error(
      `❌ Missing required environment variables:\n${missingList}\n\nPlease add them to your .env.local file or Vercel environment settings.`,
    );
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    const warningList = warnings.map((key) => `  - ${key}`).join('\n');
    console.warn(`⚠️  Optional environment variables not set:\n${warningList}`);
  }

  // Success message (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ All required environment variables are set');
  }
}

// Auto-validate on import in non-production builds
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}
