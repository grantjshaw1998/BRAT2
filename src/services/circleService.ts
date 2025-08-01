import { supabase } from '../lib/supabase';
import type { Circle, CircleMember } from '../types';

export class CircleService {
  static async createCircle(circle: Omit<Circle, 'id' | 'invite_code' | 'created_at' | 'updated_at'>): Promise<Circle> {
    const { data, error } = await supabase
      .from('circles')
      .insert(circle)
      .select('*')
      .single();

    if (error) throw error;

    // Add creator as owner
    await supabase
      .from('circle_members')
      .insert({
        circle_id: data.id,
        user_id: circle.owner_id,
        role: 'owner'
      });

    return data;
  }

  static async getUserCircles(userId: string): Promise<Circle[]> {
    // First get circles where user is owner
    const { data: ownedCircles, error: ownedError } = await supabase
      .from('circles')
      .select(`
        *,
        members:circle_members(*)
      `)
      .eq('owner_id', userId);

    if (ownedError) throw ownedError;

    // Then get circles where user is a member
    const { data: memberCircleIds, error: memberError } = await supabase
      .from('circle_members')
      .select('circle_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;

    let memberCircles: Circle[] = [];
    if (memberCircleIds && memberCircleIds.length > 0) {
      const circleIds = memberCircleIds.map(m => m.circle_id);
      const { data: memberCirclesData, error: memberCirclesError } = await supabase
        .from('circles')
        .select(`
          *,
          members:circle_members(*)
        `)
        .in('id', circleIds);

      if (memberCirclesError) throw memberCirclesError;
      memberCircles = memberCirclesData || [];
    }

    // Combine and deduplicate circles
    const allCircles = [...(ownedCircles || []), ...memberCircles];
    const uniqueCircles = allCircles.filter((circle, index, self) => 
      index === self.findIndex(c => c.id === circle.id)
    );

    return uniqueCircles;
  }

  static async getCircle(id: string): Promise<Circle | null> {
    const { data, error } = await supabase
      .from('circles')
      .select(`
        *,
        members:circle_members(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async joinCircleByCode(inviteCode: string, userId: string): Promise<Circle> {
    // First find the circle
    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (circleError) throw circleError;

    // Add user as member
    const { error: memberError } = await supabase
      .from('circle_members')
      .insert({
        circle_id: circle.id,
        user_id: userId,
        role: 'member'
      });

    if (memberError) throw memberError;

    return circle;
  }

  static async leaveCircle(circleId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('circle_members')
      .delete()
      .eq('circle_id', circleId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async updateCircle(id: string, updates: Partial<Circle>): Promise<Circle> {
    const { data, error } = await supabase
      .from('circles')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCircle(id: string): Promise<void> {
    const { error } = await supabase
      .from('circles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

}