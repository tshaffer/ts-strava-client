import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';

import * as Converters from '../utilities/converters';

export interface ActivityMapProps {
  activitiesData: any;
  totalActivities: number;
  mapHeight: number;
  markerCount: number;
  reportClickLocation: any;
  onMapClick: any;
  activityLocations: any;
}

class ActivityMapComponent extends React.Component<ActivityMapProps> {

  mapBoxMap: any;
  activityMap: any;
  markerPoint: any;

  initializeMap() {

    const self = this;

    let minLongitude = 9999;
    let maxLongitude = -9999;
    let minLatitude = 9999;
    let maxLatitude = -9999;

    for (const activityData of self.props.activitiesData) {
      const pathToDecode = activityData.polyline;
      const ridePathDecoded = (window as any).google.maps.geometry.encoding.decodePath(pathToDecode);
      ridePathDecoded.forEach((location: any) => {
        const longitude = location.lng();
        const latitude = location.lat();

        if (longitude > maxLongitude) {
          maxLongitude = longitude;
        }
        if (longitude < minLongitude) {
          minLongitude = longitude;
        }

        if (latitude > maxLatitude) {
          maxLatitude = latitude;
        }
        if (latitude < minLatitude) {
          minLatitude = latitude;
        }
      });
    }

    (window as any).mapboxgl.accessToken =
      'pk.eyJ1IjoidGVkc2hhZmZlciIsImEiOiJjaXN2cjR4dXIwMjgwMm9wZ282cmk0aTgzIn0.9EtSUOr_ofLcwCDLM6FUHw';
    this.activityMap = new (window as any).mapboxgl.Map({
      container: 'mapBoxMap', // container id
      style: 'mapbox://styles/tedshaffer/citagbl4b000h2iqbkgub0t26',
    });

    this.activityMap.addControl(new (window as any).mapboxgl.Navigation());

    this.activityMap.on('load', () => {

      // experiment on adding padding around bounds - instead of a fixed value, perhaps it should be a percentage based on bounds
      const padding = 0.005;
      minLatitude -= padding;
      maxLatitude += padding;

      minLongitude -= padding;
      maxLongitude += padding;

      const minBounds = [
        minLongitude,
        minLatitude
      ];

      const maxBounds = [
        maxLongitude,
        maxLatitude
      ];

      self.activityMap.fitBounds([minBounds, maxBounds]);

      // code that may be required to track mouse movements over route
      //             self.activityMap.on('mousemove', (mouseEvent) => {
      //                 console.log('map onMouseMove:');
      //                 console.log(mouseEvent);
      //             });

      // polylines for activities
      for (let segmentIndex = 0; segmentIndex < self.props.activitiesData.length; segmentIndex++) {

        const sourceName = 'segment' + segmentIndex.toString();
        const lineLayerName = 'points' + segmentIndex.toString();

        const segmentData = self.props.activitiesData[segmentIndex];

        self.addLineToMap(sourceName, 'segment' + segmentIndex.toString(),
          lineLayerName, segmentData.polyline, segmentData.strokeColor);
      }

      if (self.props.markerCount > 0) {
        self.createMapMarker();
      }

      self.activityMap.on('mousedown', (mouseEvent: any) => {
        if (self.props.reportClickLocation) {
          const stravatronLocation = Converters.stravatronCoordinateFromLatLng(mouseEvent.lngLat.lat, mouseEvent.lngLat.lng);
          if (self.props.onMapClick) {
            self.props.onMapClick(stravatronLocation);
          }
        }
      });
    });
  }

  addLineToMap(
    sourceName: string,
    sourceTitle: string,
    layerName: string,
    pathToDecode: any,
    color: any) {

    const coordinates: any = [];

    const ridePathDecoded = (window as any).google.maps.geometry.encoding.decodePath(pathToDecode);
    ridePathDecoded.forEach((location: any) => {
      const longitude = location.lng();
      const latitude = location.lat();
      const lngLat = [longitude, latitude];
      coordinates.push(lngLat);
    });

    this.activityMap.addSource(sourceName, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {
            title: sourceTitle
          }
        }]
      }
    });

    this.activityMap.addLayer(
      {
        id: layerName,
        type: 'line',
        source: sourceName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color,
          'line - width': 2
        }
      });

    return coordinates;
  }

  addMapMarker(
    sourceName: string,
    coordinates: any,
    color: any,
  ) {

    this.markerPoint = {
      type: 'Point',
      coordinates,
    };

    this.activityMap.addSource(sourceName, { type: 'geojson', data: this.markerPoint });

    this.activityMap.addLayer({
      id: sourceName,
      type: 'circle',
      source: sourceName,
      paint: {
        'circle-radius': 8,
        'circle-color': color,
        'circle-opacity': 0.8
      }
    });
  }

  createMapMarker() {

    const locations = this.props.activityLocations;

    // one marker => elevation chart
    if (this.props.markerCount === 1) {
      this.addMapMarker('marker0', locations[0], 'red');
    }
    // two markers => create segment
    else if (this.props.markerCount === 2) {

      const location0Index = Math.floor(locations.length / 3);
      const location1Index = location0Index * 2;
      const mapMarker0Coordinates = locations[location0Index];
      const mapMarker1Coordinates = locations[location1Index];

      this.addMapMarker('marker0', mapMarker0Coordinates, 'green');
      this.addMapMarker('marker1', mapMarker1Coordinates, 'red');
    }
  }

  loadAndRenderMap() {

    if (!isNil(this.activityMap)) {
      return;
    }

    let allDataLoaded = true;
    if (this.props.activitiesData.length === this.props.totalActivities) {
      this.props.activitiesData.forEach((activityData: any) => {
        if (activityData.polyline === '') {
          allDataLoaded = false;
        }
      });
    }
    else {
      allDataLoaded = false;
    }

    if (this.mapBoxMap && allDataLoaded) {

      this.mapBoxMap.style.height = this.props.mapHeight;

      if (!this.activityMap) {
        this.initializeMap();
      }
    }

  }

  buildMapLegend(activitiesData: any): any {

    // for now, only show legend when more than one activity is mapped
    if (activitiesData.length < 2) {
      return (
        <noscript />
      );
    }

    return (
      <noscript />
    );

  }

  render(): any {

    const self = this;

    // if (this.activityMap && this.mapBoxMap) {
    //   this.updateMapMarkers();
    // }

    const mapLegendJSX = this.buildMapLegend(this.props.activitiesData);

    return (
      <div id='mapBoxMap'
        ref={(c) => {
          self.mapBoxMap = c;
          self.loadAndRenderMap();
        }}>
        {mapLegendJSX}
      </div>
    );

  }
}

function mapStateToProps(state: any, ownProps: any) {

  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMapComponent);
