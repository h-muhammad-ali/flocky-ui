import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Polyline from "@mapbox/polyline";
import ErrorDialog from "../components/ErrorDialog";

const MapForPatron = ({ navigation, start, end }) => {
  const { source, destination, wayPoints, overview_polyline } = useSelector(
    (state) => state?.locations
  );
  const [coords, setCoords] = useState([]);
  const [region, setRegion] = useState({
    latitude: 30.3753,
    longitude: 69.3451,
    longitudeDelta: 12,
    latitudeDelta: 12,
  });
  const mapRef = useRef(null);
  const [error, setError] = useState("");

  const getDirectionsForPatron = () => {
    let points = Polyline?.decode(overview_polyline);
    let coords = points?.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    setCoords(coords);
    setTimeout(() => {
      fitToMarkers();
    }, 1000);
  };

  const fitToMarkers = () => {
    let paramArray = [];
    paramArray?.push("patronSource");
    paramArray?.push("patronDestination");
    paramArray?.push("hitcherSource");
    paramArray?.push("hitcherDestination");
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
    getDirectionsForPatron();
  }, []);

  const areCoordinatesAlmostEqual = (coords1, coords2) => {
    const R = 6371000;
    let latDiff = (coords2.lat - coords1.lat) * (Math.PI / 180);
    let longDiff = (coords2.lng - coords1.lng) * (Math.PI / 180);

    let a =
      Math.pow(Math.sin(latDiff / 2), 2) +
      Math.cos(coords1.lat * (Math.PI / 180)) *
        Math.cos(coords2.lat * (Math.PI / 180)) *
        Math.pow(Math.sin(longDiff / 2), 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mapRef} style={styles?.mapView} initialRegion={region}>
        {start &&
        source &&
        areCoordinatesAlmostEqual(start?.coords, source?.coords) >= 20 ? (
          <>
            {start ? (
              <Marker
                coordinate={{
                  latitude: start?.coords?.lat,
                  longitude: start?.coords?.lng,
                }}
                title="Hitcher Source"
                description={start?.formatted_address}
                identifier="hitcherSource"
              >
                <MaterialCommunityIcons
                  name="alpha-h-circle"
                  size={35}
                  color="black"
                />
              </Marker>
            ) : (
              <></>
            )}
            {source ? (
              <Marker
                coordinate={{
                  latitude: source?.coords?.lat,
                  longitude: source?.coords?.lng,
                }}
                title="Patron Source"
                description={source?.formatted_address}
                identifier="patronSource"
              >
                <MaterialIcons name="my-location" size={35} color="black" />
              </Marker>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {start ? (
              <Marker
                coordinate={{
                  latitude: start?.coords?.lat,
                  longitude: start?.coords?.lng,
                }}
                title="Hitcher Source"
                description={start?.formatted_address}
                identifier="hitcherSource"
              >
                <MaterialCommunityIcons
                  name="alpha-h-circle"
                  size={35}
                  color="black"
                />
              </Marker>
            ) : (
              <></>
            )}
          </>
        )}
        {wayPoints.length ? (
          wayPoints?.map((waypoint, index) =>
            areCoordinatesAlmostEqual(start?.coords, waypoint?.coords) < 20 ||
            areCoordinatesAlmostEqual(end?.coords, waypoint?.coords) < 20 ? (
              <></>
            ) : (
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
                  color={"black"}
                />
              </Marker>
            )
          )
        ) : (
          <></>
        )}

        {source && destination ? (
          <MapView.Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={"#5188E3"}
          />
        ) : (
          <></>
        )}
        {end &&
        destination &&
        areCoordinatesAlmostEqual(end?.coords, destination?.coords) >= 20 ? (
          <>
            {end ? (
              <Marker
                coordinate={{
                  latitude: end?.coords?.lat,
                  longitude: end?.coords?.lng,
                }}
                title="Hitcher Destination"
                description={end?.formatted_address}
                identifier="hitcherDestination"
              >
                <MaterialCommunityIcons
                  name="hospital-marker"
                  size={35}
                  color="black"
                />
              </Marker>
            ) : (
              <></>
            )}
            {destination ? (
              <Marker
                coordinate={{
                  latitude: destination?.coords?.lat,
                  longitude: destination?.coords?.lng,
                }}
                title="Patron Destination"
                description={destination?.formatted_address}
                identifier="patronDestination"
              >
                <Entypo name="flag" size={35} color="black" />
              </Marker>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {end ? (
              <Marker
                coordinate={{
                  latitude: end?.coords?.lat,
                  longitude: end?.coords?.lng,
                }}
                title="Hitcher Destination"
                description={end?.formatted_address}
                identifier="hitcherDestination"
              >
                <MaterialCommunityIcons
                  name="hospital-marker"
                  size={35}
                  color="black"
                />
              </Marker>
            ) : (
              <></>
            )}
          </>
        )}
      </MapView>
      <TouchableOpacity style={styles?.fullScreen} onPress={navigation}>
        <Ionicons name="expand" size={25} />
      </TouchableOpacity>
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
      </View>
    </View>
  );
};

export default MapForPatron;

const styles = StyleSheet?.create({
  mapView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  fullScreen: { position: "absolute", top: 15, right: 10 },
});
