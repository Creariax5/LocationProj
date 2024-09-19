import { supabase } from '../lib/supabase';


export const fetchLocationHistory = async (userId, setLocationHistory) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .gte('id', 422)
      .order('id', { ascending: true });

    if (error) throw error;

    setLocationHistory(data);
  } catch (error) {
    console.error('Error fetching location history:', error);
  }
};

export const saveLocationToSupabase = async (userId, latitude, longitude) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          user_id: userId,
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date().toISOString()
        });
  
      if (error) throw error;
      console.log('Location saved successfully', data);
    } catch (error) {
      console.error('Error saving location:', error.message);
    }
  };