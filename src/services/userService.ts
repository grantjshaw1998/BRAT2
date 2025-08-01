import { supabase } from '../lib/supabase';
import { User, UserSettings } from '../types';

export class UserService {
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User not found
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error fetching user profile:', error);
      return null;
    }
  }

  static async createUserProfile(user: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error creating user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error updating user profile:', error);
      return null;
    }
  }

  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Settings not found, create default
          return await this.createDefaultUserSettings(userId);
        }
        console.error('Error fetching user settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error fetching user settings:', error);
      return null;
    }
  }

  static async createDefaultUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const defaultSettings: Partial<UserSettings> = {
        user_id: userId,
        theme: 'dark',
        font_size: 'medium',
        tts_voice: 'default',
        tts_speed: 1.0,
        tts_pitch: 1.0,
        auto_sync: true,
        offline_mode: false
      };

      const { data, error } = await supabase
        .from('user_settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (error) {
        console.error('Error creating default user settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error creating default user settings:', error);
      return null;
    }
  }

  static async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Network error updating user settings:', error);
      return null;
    }
  }
}