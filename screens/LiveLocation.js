import { StyleSheet, View, Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
} from "react-native-maps";
import Header from "../components/Header";
import ErrorDialog from "../components/ErrorDialog";
import * as Location from "expo-location";
import { doc, onSnapshot } from "firebase/firestore";
import { LogBox } from "react-native";
import { firestore } from "../config/firebase";
import { FontAwesome5, Foundation } from "@expo/vector-icons";
import usePrevious from "../custom-hooks/usePrevious";

LogBox.ignoreLogs(["Setting a timer"]);

const LATITUDE = 30.3753;
const LONGITUDE = 69.3451;
const LATITUDE_DELTA = 12;
const LONGITUDE_DELTA = 12;

const LiveLocation = ({ navigation, isPatron, id }) => {
  const sourceMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const [sourceState, setSourceState] = useState(null);
  const [destinationState, setDestinationState] = useState(null);
  const prevSourceState = usePrevious(sourceState);
  const prevDestinationState = usePrevious(destinationState);
  const updateSourceState = (data) =>
    setSourceState((state) => ({ ...state, ...data }));
  const updateDestinationState = (data) =>
    setDestinationState((state) => ({ ...state, ...data }));

  useEffect(() => {
    const docId = 37; //destination_id/source_id here
    const ref = doc(firestore, "live-coordinates", `${docId}`);
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        const { latitude, longitude } = doc?.data();
        animate(destinationMarkerRef, latitude, longitude);
        updateDestinationState({ 
          curLoc: { latitude, longitude },
          coordinate: new AnimatedRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        });
      },
      (error) => {
        setError(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const getMapRegion = () => ({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLiveLocation = async () => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response?.status === "granted") {
        Location.getCurrentPositionAsync({
          accuracy: Location?.Accuracy?.BestForNavigation,
        })
          .then((response) => {
            const { latitude, longitude } = response?.coords;
            animate(sourceMarkerRef, latitude, longitude);
            updateSourceState({
              curLoc: { latitude, longitude },
              coordinate: new AnimatedRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }),
            });
          })
          .catch((error) => {
            console?.log(error?.message);
          });
      } else {
        setError("Permission to access location was denied");
      }
    });
  };

  const animate = (markerRef, latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === "android") {
      if (markerRef?.current) {
        markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 1000);
      }
    }
  };

  const fitToMarkers = () => {
    let paramArray = [];
    if (sourceState) paramArray?.push("source");
    if (destinationState) paramArray?.push("destination");
    if (paramArray.length === 1) {
      const region = sourceState?.curLoc ?? destinationState?.curLoc;
      mapRef?.current?.animateToRegion(
        {
          latitude: region?.latitude,
          longitude: region?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        2000
      );
    } else {
      mapRef?.current?.fitToSuppliedMarkers(paramArray, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
      });
    }
  };

  useEffect(() => {
    if (sourceState && destinationState && !(prevSourceState && prevDestinationState)) {
      console.log(prevSourceState, sourceState, prevDestinationState, destinationState);
      setTimeout(() => {
        fitToMarkers();
      }, 1000);
    }
  }, [sourceState, destinationState]);

  return (
    <View style={[StyleSheet?.absoluteFillObject, styles?.container]}>
      <MapView
        style={[StyleSheet?.absoluteFillObject, styles?.mapView]}
        initialRegion={getMapRegion()}
        ref={mapRef}
      >
        {sourceState ? (
          <MarkerAnimated
            ref={sourceMarkerRef}
            coordinate={{
              latitude: sourceState?.curLoc?.latitude,
              longitude: sourceState?.curLoc?.longitude,
            }}
            title="Source"
            identifier="source"
          >
            <FontAwesome5 name="sourcetree" size={24} color="black" />
          </MarkerAnimated>
        ) : (
          <></>
        )}
        {destinationState ? (
          <MarkerAnimated
            ref={destinationMarkerRef}
            coordinate={{
              latitude: destinationState?.curLoc?.latitude,
              longitude: destinationState?.curLoc?.longitude,
            }}
            title="Destination"
            identifier="destination"
          >
            <Foundation name="target-two" size={24} color="black" />
          </MarkerAnimated>
        ) : (
          <></>
        )}
      </MapView>
      <View style={styles?.heading}>
        <Header text="Live Location" navigation={() => navigation?.goBack()} />
      </View>
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error!"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
      </View>
    </View>
  );
};

export default LiveLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  mapView: {
    flex: 1,
  },
  heading: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});

// useEffect(() => {
//   let unsubscribe;
//   Location.requestForegroundPermissionsAsync().then((response) => {
//     if (response?.status === "granted") {
//       Location?.watchPositionAsync(
//         {
//           accuracy: Location?.Accuracy?.BestForNavigation,
//           timeInterval: 2000,
//         },
//         (location_update) => {
//           const duration = 500;
//           const { latitude, longitude } = location_update?.coords;
//           const newCoordinates = {
//             latitude,
//             longitude,
//           };
//           if (Platform.OS === "android") {
//             if (markerRef) {
//               markerRef?.current?.animateMarkerToCoordinate(
//                 newCoordinates,
//                 duration
//               );
//             }
//           }
//           setLatlng({ lat: latitude, lng: longitude });
//         }
//       )
//         .then((unsub) => {
//           unsubscribe = unsub;
//         })
//         .catch((error) => {
//           console?.log(error?.message);
//         });
//     } else {
//       setError("Permission to access location was denied");
//     }
//   });

//   return () => {
//     unsubscribe?.remove();
//   };
// }, []);

// useEffect(() => {
//   setTimeout(() => {
//     const newCoordinates = {
//       latitude: latlng.lat,
//       longitude: latlng.lng,
//     };
//     if (Platform.OS === "android") {
//       if (markerRef) {
//         console?.log(newCoordinates);
//         markerRef?.current?.animateMarkerToCoordinate(newCoordinates, 500);
//       }
//     }
//   }, 1000);
// }, [latlng]);

// const [latlng, setLatlng] = useState({ lat: LATITUDE, lng: LONGITUDE });
// const [coordinates, setCoordinates] = useState(
//   new AnimatedRegion({
//     latitude: LATITUDE,
//     longitude: LONGITUDE,
//     latitudeDelta: 0,
//     longitudeDelta: 0,
//   })
// );
