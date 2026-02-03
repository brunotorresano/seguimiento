import { supabase } from './supabaseClient';

export interface DailyScore {
    date: string; // YYYY-MM-DD
    user_id?: string;
    teeth: number;
    food: number;
    sport: number;
    notes?: string;
    updated_at?: string;
}

export const fetchMonthScores = async (startDate: string, endDate: string): Promise<DailyScore[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
        .from('daily_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) {
        console.error('Error fetching scores:', error);
        return [];
    }

    return data || [];
};

export const upsertDayScore = async (score: Omit<DailyScore, 'updated_at' | 'user_id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No authenticated session found");

    const { data, error } = await supabase
        .from('daily_scores')
        .upsert({
            ...score,
            user_id: session.user.id,
            updated_at: new Date().toISOString()
        }, { onConflict: 'date,user_id' }); // Conflict now includes user_id

    if (error) {
        console.error('Error upserting score:', error);
        throw error;
    }

    return data;
};

export const deleteDayScore = async (date: string) => {
    const { error } = await supabase
        .from('daily_scores')
        .delete()
        .eq('date', date);

    if (error) {
        console.error('Error deleting score:', error);
        throw error;
    }
};
