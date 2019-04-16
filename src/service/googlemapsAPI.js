import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import { decodePolyline } from '../utility/decodePolyline';

export const google_maps_directions_api_endpoint =
  'https://maps.googleapis.com/maps/api/directions/json';

export const google_maps_geocoding_api_endpoint =
  'https://maps.googleapis.com/maps/api/geocode/json';

const getAddressFromEvent = async event => {
  const {
    Account: { BillingAddress }
  } = event;
  const address = [
    BillingAddress.street,
    BillingAddress.state,
    BillingAddress.postalCode,
    BillingAddress.country
  ];
  const addressField = address.join(',');
  return addressField;
};

const simplifiedToSpelledOutPoint = point => ({
  latitude: point.lat,
  longitude: point.lng
});

export const getRouteForEvents = async events => {
  if (events && events.length > 0) {
    var originEvent = events[0];
    var destinationEvent = events[events.length - 1];
    var originAddress = await getAddressFromEvent(events[0]);
    var destinationAddress = await getAddressFromEvent(
      events[events.length - 1]
    );
    var wayPointsEvents = null;
    if (events.length > 2) {
      wayPointsEvents = events.slice(1, events.length - 1);
    }

    let wayPointAddressArray = [];
    for (let index in wayPointsEvents) {
      const address = await getAddressFromEvent(wayPointsEvents[index]);
      wayPointAddressArray.push(address);
    }
    const wayPointAddress = wayPointAddressArray.join('|');

    //console.log('originAddress', originAddress);
    //console.log('destinationAddress', destinationAddress);
    //console.log('wayPointAddress', wayPointAddress);

    const url =
      wayPointsEvents && wayPointsEvents.length > 0
        ? `${google_maps_directions_api_endpoint}?origin=${originAddress}&destination=${destinationAddress}&waypoints=${wayPointAddress}&key=${GOOGLE_MAPS_API_KEY}`
        : `${google_maps_directions_api_endpoint}?origin=${originAddress}&destination=${destinationAddress}&key=${GOOGLE_MAPS_API_KEY}`;
    //console.log('URL', url);
    const response = await fetch(url);
    const res = await response.json();
    //console.log('response', res);

    const { legs, waypoint_order, overview_polyline } = res.routes[0];
    const allCoordinates = [
      simplifiedToSpelledOutPoint(legs[0].start_location),
      ...legs.map(leg => simplifiedToSpelledOutPoint(leg.end_location))
    ];

    console.log('allCoordinates', allCoordinates);

    originEvent = {
      ...originEvent,
      coordinate: allCoordinates[0],
      address: originAddress
    };
    destinationEvent = {
      ...destinationEvent,
      coordinate: allCoordinates[allCoordinates.length - 1],
      address: destinationAddress
    };

    let newwayPointsArray = [];
    for (let index in waypoint_order) {
      newwayPointsArray.push({
        ...wayPointsEvents[index],
        coordinate: simplifiedToSpelledOutPoint(legs[index].end_location),
        address: wayPointAddressArray[index]
      });
    }

    return {
      origin: originEvent,
      destination: destinationEvent,
      waypoints: newwayPointsArray,
      polyline_points: decodePolyline(overview_polyline.points)
    };
  }
};
