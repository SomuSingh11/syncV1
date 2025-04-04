import * as turf from '@turf/turf';

export function checkSpatialConflict(geom1: { coordinates: number[]; radius?: number }, geom2: { coordinates: number[]; radius?: number }) {
    try {
        // Check if both geometries are valid
        if (!geom1 || !geom2 || !geom1.coordinates || !geom2.coordinates) {
            console.error('Invalid geometry objects provided');
            return null;
        }

        // Ensure coordinates are in the correct format for turf (longitude, latitude)
        const point1 = turf.point(geom1.coordinates);
        const point2 = turf.point(geom2.coordinates);

        // Get radius values with default fallback
        const radius1 = (geom1.radius || 1000) / 1000; // Convert to kilometers
        const radius2 = (geom2.radius || 1000) / 1000; // Convert to kilometers

        // Create circles from points with their radii
        const circle1 = turf.circle(
            geom1.coordinates,
            radius1,
            { units: 'kilometers' }
        );
        const circle2 = turf.circle(
            geom2.coordinates,
            radius2,
            { units: 'kilometers' }
        );

        // Calculate distance between points
        const distance = turf.distance(point1, point2, { units: 'meters' });

        // Check if circles intersect (distance between centers is less than sum of radii)
        const sumOfRadii = (radius1 + radius2) * 1000; // Convert back to meters
        const intersects = distance < sumOfRadii;

        if (!intersects) return null;

        // Calculate overlap percentage
        // Using the formula: overlap = (sumOfRadii - distance) / sumOfRadii * 100
        const overlapPercentage = Math.max(
            0,
            Math.round(((sumOfRadii - distance) / sumOfRadii) * 100)
        );

        return {
            distance,
            overlapPercentage,
            intersectionType: distance === 0 ? 'exact' : 'overlap'
        };
    } catch (error) {
        console.error('Spatial analysis error:', error);
        return null;
    }
}