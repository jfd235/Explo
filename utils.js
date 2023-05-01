export function getTimeDiff(lastActTime) {
    const currTime = new Date();
    const hourDiff = (currTime.getTime() - lastActTime) / (1000 * 60 * 60);
    if (hourDiff <= 24) {
        return Math.round(hourDiff) + " hours ago";
    } else {
        return Math.round(hourDiff / 24) + " days ago";
    }
}

    
export function calGeoDistance(from, to) {
    const R = 6371; // radius of the earth in km
    const lat1 = from.latitude;
    const lon1 = from.longitude;
    const lat2 = to.latitude;
    const lon2 = to.longitude;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

     return d.toFixed(2);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}