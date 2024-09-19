import { PermissionsAndroid, Platform } from 'react-native';
import { startLocationTracking } from "./location";


export const requestLocationPermission = async (setCoord, setIsTracking, userId) => {
    try {
        if (Platform.OS === 'android') {
            const fineLocationGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Fine location permission granted');

                const backgroundLocationGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
                );
                if (backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Background location permission granted');
                    startLocationTracking(setCoord, setIsTracking, userId);
                } else {
                    console.log('Background location permission denied');
                    // Handle denied background permission
                }
            } else {
                console.log('Fine location permission denied');
                // Handle denied fine location permission
            }
        } else {
            // iOS handling
            startLocationTracking(setCoord, setIsTracking, userId);
        }
    } catch (err) {
        console.warn('Error requesting permissions:', err);
    }
};