import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { requestLocationPermission } from "../lib/perms";
import { fetchLocationHistory } from "../lib/database";
import MapView, { Marker, Polygon } from 'react-native-maps';
import { generateHexagonGrid, updateVisitedHexagons } from "../lib/grid";


const delta = 1;

const LocationTracker = ({ userId }) => {
  const [coord, setCoord] = useState([0, 0]);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [hexagons, setHexagons] = useState([]);
  const [res, setRes] = useState(8);
  const [mapDelta, setMapDelta] = useState({
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [zoomLevel, setZoomLevel] = useState(0);


  useEffect(() => {
    requestLocationPermission(setCoord, setIsTracking, userId);

    return () => {
      // stopLocationTracking(setIsTracking);
    }
  }, []);

  useEffect(() => {
    if (hexagons.length == 0) {
      if (coord[0] !== 0 && coord[1] !== 0) {
        generateHexagonGrid(coord, setHexagons, res);
      }
    } else {
      //let tmp = locationHistory;
      //setLocationHistory(tmp.push({"id": tmp.length + 500, "latitude": coord[0], "longitude": coord[1]}));
    }
  }, [coord]);

  useEffect(() => {
    updateVisitedHexagons(locationHistory, setHexagons, res);
  }, [locationHistory]);

  useEffect(() => {
    if (coord[0] !== 0 && coord[1] !== 0) {
      generateHexagonGrid(coord, setHexagons, res);
    }
    updateVisitedHexagons(locationHistory, setHexagons, res);
  }, [res]);

  const handleRegionChange = (region) => {
    setMapDelta({
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });

    // Calculate zoom level
    const zoomLevel = Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2);
    setZoomLevel(zoomLevel);

    setRes(zoomLevel-2);
  };


  return (
    <View style={{ width: "100%" }} >
      <ScrollView>
        <View style={{ margin: 30 }}>
          <Text>User ID: {userId}</Text>
          <Text style={{ color: 'red', fontWeight: '600', fontSize: 20 }}>Location Tracking</Text>
          <Text style={{ fontSize: 20 }}>{coord[0]}, {coord[1]}</Text>
        </View>
        <MapView
          region={{
            latitude: coord[0] || 37.78825,
            longitude: coord[1] || -122.4324,
            latitudeDelta: 0.0922 / delta,
            longitudeDelta: 0.0421 / delta,
          }}
          style={{ height: 400 }}
          onRegionChangeComplete={handleRegionChange}
        >
          <Marker
            coordinate={{
              latitude: coord[0],
              longitude: coord[1],
            }}
            title="Your Location"
            description={`Latitude: ${coord[0]}, Longitude: ${coord[1]}`}
          />
          {hexagons.map((hexagon, index) => (
            <Polygon
              key={index}
              coordinates={hexagon.boundary}
              strokeWidth={1}
              strokeColor="rgba(0, 0, 0, 0.3)"
              fillColor={hexagon.visited ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.3)"}
            />
          ))}
          {/*locationHistory.map((location, index) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location ${index + 1}`}
            description={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
            pinColor="blue"
          />
        ))*/}
        </MapView>
        <View style={{ margin: 10 }}>
          <Text>Zoom Level: {zoomLevel}</Text>
          <Text>Latitude Delta: {mapDelta.latitudeDelta.toFixed(6)}</Text>
          <Text>Longitude Delta: {mapDelta.longitudeDelta.toFixed(6)}</Text>
        </View>
        {isTracking ? (
          <Text>Your location is tracked</Text>
        ) : (
          <Text>Your location is not tracked</Text>
        )}
        <Button title="Fetch Location History" onPress={() => fetchLocationHistory(userId, setLocationHistory)} />

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
      </ScrollView>
    </View >
  );
};

export default LocationTracker;