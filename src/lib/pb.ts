import PocketBase from 'pocketbase';

// Determine the URL for PocketBase. Replace with your actual VPS URL or IP if not using an environment variable.
// E.g., http://123.45.67.89:8090 or https://api.yourdomain.com
export const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);
