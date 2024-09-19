import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from './src/lib/supabase';
import Auth from './src/comp/Auth';
import LocationTracker from './src/comp/LocationTracker';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log("start")

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!session ? (
        <Auth />
      ) : (
        <LocationTracker userId={session.user.id} />
      )}
    </View>
  );
};

export default App;