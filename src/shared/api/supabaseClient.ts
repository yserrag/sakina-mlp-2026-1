import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars
const getEnv = (key: string, fallback: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', getEnv('VITE_SUPABASE_URL', 'https://xyzcompany.supabase.co'));
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', getEnv('VITE_SUPABASE_ANON_KEY', 'public-anon-key'));

const isPlaceholder = supabaseUrl === 'https://xyzcompany.supabase.co' || !supabaseUrl;

// Robust Mock Client
const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (email) {
         return { 
            data: { 
              user: { id: 'mock-user-123', email: email, created_at: new Date().toISOString() }, 
              session: { access_token: 'mock-jwt-token', user: { id: 'mock-user-123', email: email } } 
            }, 
            error: null 
         };
      }
      return { data: { user: null, session: null }, error: { message: "Invalid credentials" } };
    },
    signUp: async ({ email, password, options }: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
          data: { 
            user: { id: 'mock-user-new', email: email, created_at: new Date().toISOString(), user_metadata: options?.data }, 
            session: { access_token: 'mock-jwt-token', user: { id: 'mock-user-new', email: email } } 
          }, 
          error: null 
      };
    },
    signOut: async () => {
      return { error: null };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    updateUser: async (attrs: any) => {
       await new Promise(resolve => setTimeout(resolve, 500));
       return { data: { user: { id: 'mock-user-123', ...attrs } }, error: null };
    },
    onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  // Mock Database Methods
  from: (table: string) => {
    return {
      select: (columns: string) => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: async () => {
                if (table === 'profiles') {
                    return { data: { preferences: { saved_items: [] } }, error: null };
                }
                return { data: null, error: null };
              },
              maybeSingle: async () => ({ data: null, error: null })
            }
          },
          order: () => ({ data: [], error: null })
        }
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
             return Promise.resolve({ data: null, error: null });
          }
        }
      },
      insert: (data: any) => {
          return {
              select: () => ({
                  single: async () => ({ data: { ...data, id: 'mock-id' }, error: null })
              })
          }
      }
    }
  }
};

export const supabase = isPlaceholder ? (mockSupabase as any) : createClient(supabaseUrl, supabaseKey);
export const isDemoMode = isPlaceholder;
