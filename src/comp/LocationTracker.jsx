import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { requestLocationPermission } from "../lib/perms";
import { fetchLocationHistory } from "../lib/database";
import MapView, { Marker, Polygon } from 'react-native-maps';
import { updateVisitedHexagons, generateMaskPolygon, generateHoles } from "../lib/grid";


const LocationTracker = ({ userId }) => {
  const [coord, setCoord] = useState({ latitude: 37.78825, longitude: -122.4324 });
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
  }, []);

  useEffect(() => {
    updateVisitedHexagons(locationHistory, setVisitedHexagons, res, coord); // replace coord by centerCoord
  }, [locationHistory, res]);

  const handleRegionChange = (region) => {
    setMapDelta({
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });

    const zoomLevel = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
    setZoomLevel(zoomLevel);

    const tmpValues = [1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 8, 9, 9, 10, 11];
    const newRes = zoomLevel >= 16 ? 11 : tmpValues[zoomLevel-2];
    setRes(newRes);
  };

  const maskPolygon = generateMaskPolygon(coord, mapDelta);

  return (
    <View style={{ width: "100%" }} >
      <ScrollView>
        <View style={{ margin: 30 }}>
          <Text>User ID: {userId}</Text>
          <Text style={{ color: 'red', fontWeight: '600', fontSize: 20 }}>Location Tracking</Text>
          <Text style={{ fontSize: 20 }}>{coord.latitude}, {coord.longitude}</Text>
        </View>
        <MapView
          region={{
            latitude: coord.latitude || 37.78825,
            longitude: coord.longitude || -122.4324,
            latitudeDelta: mapDelta.latitudeDelta,
            longitudeDelta: mapDelta.longitudeDelta,
          }}
          style={{ height: 400 }}
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
              strokeColor="rgba(0, 0, 0, 0.3)"
              fillColor="rgba(0, 0, 0, 0.3)"
            />
          )}
        </MapView>
        <View style={{ margin: 10 }}>
          <Text>Zoom Level: {zoomLevel}</Text>
          <Text>Resolution: {res}</Text>
        </View>
        <Text>{isTracking ? "Your location is tracked" : "Your location is not tracked"}</Text>
        <Button title="Fetch Location History" onPress={() => fetchLocationHistory(userId, setLocationHistory)} />
        {/*locationHistory.length > 0 && (
          <View style={{ margin: 30 }}>
            <Text style={{ fontWeight: '600', fontSize: 18 }}>Location History:</Text>
            {locationHistory.map((location, index) => (
              <Text key={location.id}>
                {index + 1}. Lat: {location.latitude}, Lon: {location.longitude}
              </Text>
            ))}
          </View>
        )*/}
      </ScrollView>
    </View>
  );
};

export default LocationTracker;