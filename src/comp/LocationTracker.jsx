import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { requestLocationPermission } from "../lib/perms";
import { fetchLocationHistory } from "../lib/database";
import MapView, { Marker, Polygon } from 'react-native-maps';
import { updateVisitedHexagons, generateMaskPolygon, generateHoles } from "../lib/grid";


const LocationTracker = ({ userId }) => {
  const defaultCoord = { latitude: 37.78825, longitude: -122.4324 };
  const [coord, setCoord] = useState(defaultCoord);
  const [newPos, setNewPos] = useState(defaultCoord);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [visitedHexagons, setVisitedHexagons] = useState(new Set());
  const [res, setRes] = useState(8);
  const [mapDelta, setMapDelta] = useState({
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    requestLocationPermission(setCoord, setIsTracking, userId);
    fetchLocationHistory(userId, setLocationHistory)
  }, []);

  useEffect(() => {
    console.log("coord changed");
    if (newPos.latitude === defaultCoord.latitude && newPos.longitude === defaultCoord.longitude) {
      console.log("newPos == defaultCoord true");
      setNewPos(coord);
    }
  }, [coord, newPos]);

  useEffect(() => {
    console.log("newPos changed");
    console.log(newPos.latitude);
    console.log(newPos.longitude);
  }, [newPos]);

  useEffect(() => {
    updateVisitedHexagons(locationHistory, setVisitedHexagons, res, coord); // replace coord by centerCoord
  }, [locationHistory, res]);

  const handleRegionChange = (region) => {
    const zoomLevel = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
    setZoomLevel(zoomLevel);

    const tmpValues = [1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 8, 9, 9, 10, 11];
    const newRes = zoomLevel >= 16 ? 11 : tmpValues[zoomLevel-2];
    setRes(newRes);
  };

  const maskPolygon = generateMaskPolygon();

  return (
    <View style={{ width: "100%" }} >
        <MapView
          region={{
            latitude: newPos.latitude,
            longitude: newPos.longitude,
            latitudeDelta: mapDelta.latitudeDelta,
            longitudeDelta: mapDelta.longitudeDelta,
          }}
          style={{ height: 800 }}
          onRegionChangeComplete={handleRegionChange}
        >
          <Marker
            coordinate={{
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}
            title="Your Location"
            description={`Latitude: ${coord.latitude}, Longitude: ${coord.longitude}`}
          />
          {maskPolygon && (
            <Polygon
              coordinates={maskPolygon}
              holes={generateHoles(visitedHexagons)}
              strokeWidth={0}
              strokeColor="rgba(0, 0, 0, 0.03)"
              fillColor="rgba(0, 60, 20, 0.6)"
            />
          )}
        </MapView>
        <View style={{ margin: 10, position: "absolute", top: 0, left: 0 }}>
          <Text>User ID: {userId}</Text>
          <Text style={{ fontSize: 20 }}>{coord.latitude}, {coord.longitude}</Text>
        </View>
        <View style={{ margin: 10, position: "absolute", top: 60 }}>
          <Text>Zoom Level: {zoomLevel}</Text>
          <Text>Resolution: {res}</Text>
        </View>
        {/*<ScrollView>
        {locationHistory.length > 0 && (
          <View style={{ margin: 30 }}>
            <Text style={{ fontWeight: '600', fontSize: 18 }}>Location History:</Text>
            {locationHistory.map((location, index) => (
              <Text key={location.id}>
                {index + 1}. Lat: {location.latitude}, Lon: {location.longitude}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>*/}
    </View>
  );
};

export default LocationTracker;