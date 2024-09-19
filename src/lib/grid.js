import * as h3 from "h3-js";


export const generateHexagonGrid = (coord, setHexagons, res) => {
    const resolution = res; // Adjust this for different hexagon sizes
    const centerHex = h3.latLngToCell(coord[0], coord[1], resolution);
    const hexRing = h3.gridDisk(centerHex, 16); // Adjust the number for more or fewer hexagons

    const hexCoords = hexRing.map(hexId => {
        const boundary = h3.cellToBoundary(hexId);
        return {
            id: hexId, // Store the hexagon ID
            boundary: boundary.map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng
            })),
            visited: false
        };
    });

    setHexagons(hexCoords);
};


export const updateVisitedHexagons = (locations, setHexagons, res) => {
    const resolution = res; // Same as in generateHexagonGrid
    const visitedHexIds = new Set(
        locations.map(loc => h3.latLngToCell(loc.latitude, loc.longitude, resolution))
    );

    setHexagons(prevHexagons =>
        prevHexagons.map(hexagon => ({
            ...hexagon,
            visited: visitedHexIds.has(hexagon.id) // Compare using stored ID
        }))
    );
};
