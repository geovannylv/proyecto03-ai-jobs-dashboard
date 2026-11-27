import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { get, getDatabase, ref } from 'firebase/database';
import type { JobRecord } from '../types/job';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function assertFirebaseConfigured(config: FirebaseOptions): void {
  if (!config.apiKey || !config.databaseURL || !config.projectId) {
    throw new Error(
      'Faltan variables de entorno de Firebase. Configura .env.local basándote en .env.example.'
    );
  }
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const database = getDatabase(app);

/**
 * Consulta los registros de ofertas laborales almacenados en Firebase Realtime Database.
 */
export async function fetchJobsFromFirebase(nodePath = '/'): Promise<JobRecord[]> {
  assertFirebaseConfigured(firebaseConfig);

  const dbRef = ref(database, nodePath);
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) {
    return [];
  }

  const rawData: unknown = snapshot.val();

  if (Array.isArray(rawData)) {
    return rawData.filter((item): item is JobRecord => Boolean(item && typeof item === 'object'));
  }

  if (rawData && typeof rawData === 'object') {
    return Object.values(rawData as Record<string, unknown>).filter(
      (item): item is JobRecord => Boolean(item && typeof item === 'object')
    );
  }

  return [];
}
