import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import { saveLocationToSupabase } from "./database";
import { calculateDistance } from "./math";

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                resolve(position.coords);
            },
            (error) => {
                console.log("Error getting location:", error);
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};

export const startLocationTracking = (setCoord, setIsTracking, userId) => {
    let prevLatitude = null;
    let prevLongitude = null;

    const stopExistingTask = () => {
        return new Promise((resolve) => {
            ReactNativeForegroundService.stop();
            ReactNativeForegroundService.remove_task('location_tracking');
            console.log('Existing ForegroundService stopped');
            setTimeout(resolve, 1000); // Give it a second to fully stop
        });
    };

    const updateLocation = (latitude, longitude) => {
        setCoord({ latitude: latitude, longitude: longitude });
        console.log([latitude, longitude]);
        saveLocationToSupabase(userId, latitude, longitude);
        prevLatitude = latitude;
        prevLongitude = longitude;
    };

    const startNewTask = () => {
        if (Platform.OS === 'android') {
            try {
                ReactNativeForegroundService.add_task(
                    () => {
                        getCurrentPosition().then(({ latitude, longitude }) => {
                            if (prevLatitude === null || prevLongitude === null) {
                                // First run, always update
                                updateLocation(latitude, longitude);
                            } else {
                                const distance = calculateDistance(prevLatitude, prevLongitude, latitude, longitude);
                                console.log("distance", distance);
                                if (distance > 10) { // 10 meters threshold
                                    updateLocation(latitude, longitude);
                                } else {
                                    console.log(`Location hasn't changed significantly. Distance: ${distance.toFixed(2)} meters`);
                                }
                            }
                        });
                    },
                    {
                        delay: 3000, // Run every 3 seconds
                        onLoop: true,
                        taskId: 'location_tracking',
                        onError: (e) => console.log('Error in location tracking task:', e),
                    }
                );

                ReactNativeForegroundService.start({
                    id: 1244,
                    title: 'Location Tracking',
                    message: 'Tracking your location',
                    icon: 'ic_launcher',
                    button: true,
                    buttonText: 'Stop',
                    buttonOnPress: 'buttonOnPress',
                    setOnlyAlertOnce: true,
                    color: '#000000',
                    progress: {
                        max: 100,
                        current: 50,
                    },
                });
                console.log('New ForegroundService started successfully');
            } catch (error) {
                console.error('Failed to start new ForegroundService:', error);
                // Handle the error (e.g., show an alert to the user)
            }
        }
    };

    // Stop existing task (if any) and start a new one
    stopExistingTask().then(() => {
        startNewTask();
        setIsTracking(true);
    });
};

export const stopLocationTracking = (setIsTracking) => {
    if (Platform.OS === 'android') {
        ReactNativeForegroundService.remove_task('location_tracking');
        ReactNativeForegroundService.stop();
    }
    setIsTracking(false);
};
