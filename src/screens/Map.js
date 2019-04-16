import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import { getRouteForEvents } from '../service/googlemapsAPI';
import { formatDateTimeOnly, isBefore } from '../utility/utility';
import sampleData from './sampleData';

class Map extends Component {
  state = {
    areAllPointsReady: false,
    allPoints: [],
    polyline_points: []
  };
  map = null;
  markers = [];

  componentWillMount = async () => {
    var events = sampleData;
    //console.log('EVETS', events);
    if (events && events.length > 0) {
      const response = await getRouteForEvents(events);
      const { origin, destination, waypoints, polyline_points } = response;

      if (origin.coordinate) {
        if (this.map) {
          this.map.animateToRegion(origin.coordinate, 250);
        }
      }
      //console.log('NEW EVENT', response);

      //const { origin, destination, waypoints, polyline_points, error } = response
      const allPoints = [origin, ...waypoints, destination];

      this.onDirectionReady([
        origin.coordinate,
        ...waypoints.map(point => point.coordinate),
        destination.coordinate
      ]);

      const areAllPointsReady =
        allPoints.filter(point => !point.coordinate).length === 0 &&
        polyline_points.length > 0;

      this.setState({ areAllPointsReady, allPoints, polyline_points });
    }
  };

  componentWillUnmount() {
    // Unmounting map object
    this.map = null;
    this.markers = [];
  }

  onDirectionReady = result => {
    if (this.map) {
      this.map.fitToCoordinates(result, {
        animated: true,
        edgePadding: {
          right: 50,
          bottom: 50,
          left: 50,
          top: 50
        }
      });
    }
  };

  onCalloutClicked(e, index) {
    e.stopPropagation();

    const marker = this.markers[index];

    if (marker) {
      marker.hideCallout();
    }
  }

  renderMarker = (areAllPointsReady, allPoints) => {
    if (areAllPointsReady) {
      return allPoints.map((point, index) => {
        const {
          Account: { Name },
          address,
          coordinate,
          StartDateTime
        } = point;
        const color = isBefore(new Date().getTime(), StartDateTime)
          ? '#4D8175'
          : '#63ADEC';
        return (
          <MapView.Marker
            key={index}
            ref={marker => (this.markers[index] = marker)}
            title={Name}
            pinColor={color}
            description={address}
            coordinate={coordinate}
            onPress={() => {
              if (coordinate) {
                if (this.map) {
                  this.map.animateToRegion(coordinate, 250);
                }
              }
            }}
          >
            {this.renderCallout(point, index)}
          </MapView.Marker>
        );
      });
    }
  };

  renderCallout = (point, index) => {
    const {
      Account: { Name },
      address,
      StartDateTime,
      EndDateTime
    } = point;
    return (
      <MapView.Callout
        tooltip={false}
        onPress={e => this.onCalloutClicked(e, index)}
      >
        <Text style={styles.calloutAccountName}>{Name}</Text>
        <Text style={styles.calloutAccountNumber}>
          {formatDateTimeOnly(StartDateTime)} -{' '}
          {formatDateTimeOnly(EndDateTime)}
        </Text>
        <Text style={styles.calloutAddress}>{address}</Text>
      </MapView.Callout>
    );
  };

  renderPolyline = (areAllPointsReady, polyline_points) => {
    if (areAllPointsReady) {
      return (
        <MapView.Polyline
          coordinates={polyline_points}
          strokeWidth={3}
          strokeColor="#0E68FF"
        />
      );
    }
  };

  render() {
    const { areAllPointsReady, allPoints, polyline_points } = this.state;
    return (
      <View style={{ height: '100%', width: '100%' }}>
        <MapView ref={ref => (this.map = ref)} style={{ flex: 1 }}>
          {this.renderMarker(areAllPointsReady, allPoints)}
          {this.renderPolyline(areAllPointsReady, polyline_points)}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calloutAccountName: {
    color: '#6C6C6C',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16
  },
  calloutAccountNumber: {
    color: '#05A079',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15
  },
  calloutAddress: {
    color: '#6C6C6C',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 15
  }
});

export default Map;
