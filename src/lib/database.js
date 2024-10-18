import { supabase } from '../lib/supabase';

export const fetchLocationHistory = async (userId, setLocationHistory) => {
  console.log("fetching Location History");
  try {
    let allData = [];
    let count = 0;
    const pageSize = 1000;
    
    while (true) {
      const { data, error, count: totalCount } = await supabase
        .from('locations')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .gte('id', 422)
        .order('id', { ascending: true })
        .range(count, count + pageSize - 1);

      if (error) throw error;

      if (data.length === 0) break;

      allData = [...allData, ...data];
      count += data.length;

      if (count >= totalCount) break;
    }

    setLocationHistory(allData);
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