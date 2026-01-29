// Offline-first storage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export const STORAGE_KEYS = {
  USER_ROLE: 'disaster_app_user_role',
  USER_ID: 'disaster_app_user_id',
  USER_NAME: 'disaster_app_user_name',
  REQUESTS: 'disaster_app_requests',
  CHAT_MESSAGES: 'disaster_app_chat_messages',
  NOTIFICATIONS: 'disaster_app_notifications',
  LAST_LOCATION: 'disaster_app_last_location',
} as const;
