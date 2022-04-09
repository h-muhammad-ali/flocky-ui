import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Polyline from "@mapbox/polyline";

const FullScreenMap = ({ route }) => {
  const { source, destination, wayPoints, overview_polyline } = useSelector(
    (state) => state?.locations
  );
  const [region, setRegion] = useState({
    latitude: 30.3753,
    longitude: 69.3451,
    longitudeDelta: 12,
    latitudeDelta: 12,
  });
  const mapRef = useRef(null);

  const [coords, setCoords] = useState([]);
  const getDirections = () => {
    let points = Polyline?.decode(overview_polyline);
    let coords = points?.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    setCoords(coords);
    setTimeout(() => {
      fitToMarkers(wayPoints);
    }, 1000);
  };

  const getDirectionsForRouteProps = () => {
    let points = Polyline?.decode(route?.params?.overview_polyline);
    let coords = points?.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    setCoords(coords);
    setTimeout(() => {
      fitToMarkers(route?.params?.way_points);
    }, 1000);
  };

  const fitToMarkers = (wayPoints) => {
    let paramArray = [];
    if (source || route?.params?.start) paramArray?.push("source");
    if (destination || route?.params?.end) paramArray?.push("destination");
    paramArray.push(
      ...wayPoints?.map((waypoint, index) => `waypoint#${index + 1}`)
    );
    mapRef?.current?.fitToSuppliedMarkers(paramArray, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  };

  useEffect(() => {
    if (route?.params?.start && route?.params?.end) {
      getDirectionsForRouteProps();
    }
  }, []);

  useEffect(() => {
    console?.log(route);
    if (!source || !destination || (route?.params?.start && route?.params?.end))
      return;
    getDirections();
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles?.mapView}
        initialRegion={region}
        onMapReady={() => {}}
      >
        {(source || route?.params?.start) && (
          <Marker
            coordinate={{
              latitude: route?.params?.start
                ? route?.params?.start?.coords?.lat
                : source?.coords?.lat,
              longitude: route?.params?.start
                ? route?.params?.start?.coords?.lng
                : source?.coords?.lng,
            }}
            title="Source"
            description={
              route?.params?.start
                ? route?.params?.start?.formatted_address
                : source?.formatted_address
            }
            identifier="source"
          >
            <MaterialIcons name="trip-origin" size={30} color="black" />
          </Marker>
        )}

        {route?.params?.start
          ? route?.params?.way_points?.map((waypoint, index) => (
              <Marker
                key={waypoint?.place_id + index}
                coordinate={{
                  latitude: waypoint?.coords?.lat,
                  longitude: waypoint?.coords?.lng,
                }}
                title={`WayPoint ${index + 1}`}
                description={waypoint?.formatted_address}
                identifier={`waypoint#${index + 1}`}
              >
                <MaterialCommunityIcons
                  name={`numeric-${index + 1}-circle`}
                  size={24}
                  color={"#5188E3"}
                />
              </Marker>
            ))
          : wayPoints?.map((waypoint, index) => (
              <Marker
                key={waypoint?.place_id + index}
                coordinate={{
                  latitude: waypoint?.coords?.lat,
                  longitude: waypoint?.coords?.lng,
                }}
                title={`WayPoint ${index + 1}`}
                description={waypoint?.formatted_address}
                identifier={`waypoint#${index + 1}`}
              >
                <MaterialCommunityIcons
                  name={`numeric-${index + 1}-circle`}
                  size={24}
                  color={"#5188E3"}
                />
              </Marker>
            ))}

        {(source && (destination || wayPoints?.length)) ||
        (route?.params?.start &&
          (route?.params?.end || route?.params?.way_points?.length)) ? (
          <MapView.Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={"#5188E3"}
          />
        ) : (
          <></>
        )}

        {(route?.params?.end || destination) && (
          <Marker
            coordinate={{
              latitude: route?.params?.end
                ? route?.params?.end?.coords?.lat
                : destination?.coords?.lat,
              longitude: route?.params?.end
                ? route?.params?.end?.coords?.lng
                : destination?.coords?.lng,
            }}
            title="Destination"
            description={
              route?.params?.end
                ? route?.params?.end?.formatted_address
                : destination?.formatted_address
            }
            identifier="destination"
          >
            <MaterialCommunityIcons name="target" size={35} color="black" />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default FullScreenMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
});
