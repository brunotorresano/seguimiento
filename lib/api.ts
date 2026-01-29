import { supabase } from './supabaseClient';

export interface DailyScore {
    date: string; // YYYY-MM-DD
    sleep: number;
    food: number;
    sport: number;
    updated_at?: string;
}

export const fetchMonthScores = async (startDate: string, endDate: string): Promise<DailyScore[]> => {
    const { data, error } = await supabase
        .from('daily_scores')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) {
        console.error('Error fetching scores:', error);
        return [];
    }

    return data || [];
};

export const upsertDayScore = async (score: Omit<DailyScore, 'updated_at'>) => {
    const { data, error } = await supabase
        .from('daily_scores')
        .upsert({
            ...score,
            updated_at: new Date().toISOString()
        }, { onConflict: 'date' });

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
