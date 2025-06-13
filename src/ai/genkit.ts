
import { genkit, type Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';

config(); // Ensure .env is loaded if present locally, though server env vars are key

console.log('[Genkit Init] Starting Genkit initialization...');

const geminiApiKey = process.env.GEMINI_API_KEY;
if (geminiApiKey) {
  console.log(`[Genkit Init] GEMINI_API_KEY is present. Length: ${geminiApiKey.length}. First 3 chars: ${geminiApiKey.substring(0, 3)}...`);
} else {
  console.log('[Genkit Init] GEMINI_API_KEY is NOT present in process.env.');
}

let finalPlugins: any[] = [];
let genkitOptions: any = { plugins: [] }; // Default to no plugins, no default model

try {
  if (!geminiApiKey) {
    console.error(
      'CRITICAL: GEMINI_API_KEY environment variable is not set. Genkit GoogleAI plugin will not be initialized. AI features will be disabled.'
    );
    // ai will be genkit with no plugins and no default model
  } else {
    // Attempt to initialize the plugin. This might throw if the key is invalid.
    console.log('[Genkit Init] Attempting to initialize GoogleAI plugin...');
    const googleAiPlugin = googleAI(); // This is where it might fail if key is invalid or service is unreachable
    console.log('[Genkit Init] GoogleAI plugin initialized successfully.');
    finalPlugins.push(googleAiPlugin);
    genkitOptions.plugins = finalPlugins;
    // Only set the default model if the GoogleAI plugin was successfully added
    genkitOptions.model = 'googleai/gemini-2.0-flash';
    console.log('[Genkit Init] Genkit: GoogleAI plugin configured with default model gemini-2.0-flash.');
  }
} catch (error: any) {
  console.error(
    'FATAL: Error initializing GoogleAI plugin for Genkit. AI features will be disabled. This could be due to an invalid API key or other configuration issues. Error:',
    error.message || error,
    error.stack // Log the stack trace for more details
  );
  // Fallback: genkitOptions remains with plugins: [] and no default model
  // Ensure 'model' is not set if plugins failed
  genkitOptions.plugins = []; // Explicitly clear plugins on error
  delete genkitOptions.model;
}

export const ai: Genkit = genkit(genkitOptions);

if (finalPlugins.length === 0) {
    console.warn("[Genkit Init] Genkit initialized WITHOUT any AI plugins. AI features will be non-functional unless models are explicitly configured with a working plugin later or API key is provided and server is restarted.");
} else {
    console.log("[Genkit Init] Genkit initialized successfully with plugins:", finalPlugins.map(p => p?.name || 'unknown_plugin').join(', '));
}

console.log('[Genkit Init] Genkit initialization complete.');
