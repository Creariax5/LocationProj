import * as h3 from "h3-js";
import {calculateDistance} from "./math";


export const updateVisitedHexagons = (locations, setVisitedHexagons, res, centerCoord) => {
    if (res <= 7) {
        // For resolution 8 and above, keep the original behavior
        const visitedHexIds = new Set(
            locations.map(loc => h3.latLngToCell(loc.latitude, loc.longitude, res))
        );
        setVisitedHexagons(visitedHexIds);
    } else {
        // Trier les emplacements par distance
        const sortedLocations = locations.sort((a, b) => {
            const distA = calculateDistance(centerCoord.latitude, centerCoord.longitude, a.latitude, a.longitude);
            const distB = calculateDistance(centerCoord.latitude, centerCoord.longitude, b.latitude, b.longitude);
            return distA - distB;
        });

        // Garder les 100 premiers emplacements
        const topLocations = sortedLocations.slice(0, 3000);

        // Créer un ensemble d'identifiants hexagonaux H3
        const visitedHexIds = new Set(
            topLocations.map(loc => h3.latLngToCell(loc.latitude, loc.longitude, res))
        );

        setVisitedHexagons(visitedHexIds);
    }
};



export const generateMaskPolygon = (coord, mapDelta) => {
    // Generate a large polygon that covers the entire visible map area
    const { latitude, longitude } = coord;
    let { latitudeDelta, longitudeDelta } = mapDelta;

    latitudeDelta = latitudeDelta * 16;
    longitudeDelta = longitudeDelta * 16;
    if (!isFinite(latitude) || !isFinite(longitude) || !isFinite(latitudeDelta) || !isFinite(longitudeDelta)) {
        return null;
    }

    return [
        { latitude: latitude - latitudeDelta, longitude: longitude - longitudeDelta },
        { latitude: latitude - latitudeDelta, longitude: longitude + longitudeDelta },
        { latitude: latitude + latitudeDelta, longitude: longitude + longitudeDelta },
        { latitude: latitude + latitudeDelta, longitude: longitude - longitudeDelta },
    ];
};


export const generateHoles = (visitedHexagons) => {
    return Array.from(visitedHexagons).map(hexId => {
        return h3.cellToBoundary(hexId).map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng
        }));
    });
};