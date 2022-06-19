import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { GOOGLE_MAPS_API_KEY } from "@env";
import Polyline from "@mapbox/polyline";
import {
  setOverViewPolyline,
  clearOverViewPolyline,
} from "../redux/locations/locationsActions";
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";

let apiCancelToken;
const Map = ({
  navigation,
  start,
  end,
  way_points,
  overview_polyline,
  loading,
}) => {
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );
  const dispatch = useDispatch();
  const [coords, setCoords] = useState([]);
  const [region, setRegion] = useState({
    latitude: 30.3753,
    longitude: 69.3451,
    longitudeDelta: 12,
    latitudeDelta: 12,
  });
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const getDirections = async () => {
    let waypoints = wayPoints
      ?.map((wayPoint) => `place_id:${wayPoint?.place_id}`)
      ?.join("|");
    wayPoints.length ? (waypoints = "&waypoints=" + waypoints) : "";
    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${source?.place_id}&destination=place_id:${destination?.place_id}${waypoints}&key=${GOOGLE_MAPS_API_KEY}`,
        {
          cancelToken: apiCancelToken?.token,
        }
      )
      .then((response) => {
        dispatch(
          setOverViewPolyline(
            response.data?.routes[0]?.overview_polyline?.points
          )
        );
        let points = Polyline?.decode(
          response.data?.routes[0]?.overview_polyline?.points
        );
        let coords = points?.map((point, index) => {
          return {
            latitude: point[0],
            longitude: point[1],
          };
        });
        setCoords(coords);
        return coords;
      })
      .then(() => {
        setTimeout(() => {
          fitToMarkers(wayPoints);
        }, 500);
      })
      .catch((error) => {
        console?.log(error);
        if (connectionStatus) {
          if (axios.isCancel(error)) {
            console.log(error?.message);
          } else {
            setError(
              "There is some issue with Google Maps API. Please try again later."
            );
          }
        } else {
          setError("No Internet Connection!");
        }
      });
  };
  const getDirectionsForProps = () => {
    let points = Polyline?.decode(overview_polyline);
    let coords = points?.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    setCoords(coords);
    setTimeout(() => {
      fitToMarkers(way_points);
    }, 1000);
  };

  const fitToMarkers = (wayPoints) => {
    let paramArray = [];
    if (source || start) paramArray?.push("source");
    if (destination || end) paramArray?.push("destination");
    paramArray.push(
      ...wayPoints?.map((waypoint, index) => `waypoint#${index + 1}`)
    );
    if (paramArray.length === 1) {
      const region = source ?? destination ?? wayPoints[0];
      mapRef?.current?.animateToRegion(
        {
          latitude: region?.coords?.lat,
          longitude: region?.coords?.lng,
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
    if (start && end) {
      getDirectionsForProps();
    }
  }, []);

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    if (!source || !destination || (start && end)) {
      setTimeout(() => {
        fitToMarkers(wayPoints);
      }, 1000);
      return;
    }
    getDirections();
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [source, destination, wayPoints]);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", opacity: 0.5 }}>
        <ActivityIndicator size="small" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mapRef} style={styles?.mapView} initialRegion={region}>
        {(source || start) && (
          <Marker
            coordinate={{
              latitude: start ? start?.coords?.lat : source?.coords?.lat,
              longitude: start ? start?.coords?.lng : source?.coords?.lng,
            }}
            title="Source"
            description={
              start ? start?.formatted_address : source?.formatted_address
            }
            identifier="source"
          >
            <MaterialIcons name="my-location" size={30} color="black" />
          </Marker>
        )}

        {start
          ? way_points?.map((waypoint, index) => (
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
                  size={28}
                  color={"black"}
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
                  size={28}
                  color={"black"}
                />
              </Marker>
            ))}

        {(source && destination) || (start && (end || way_points?.length)) ? (
          <MapView.Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={"#5188E3"}
          />
        ) : (
          <></>
        )}

        {(end || destination) && (
          <Marker
            coordinate={{
              latitude: end ? end?.coords?.lat : destination?.coords?.lat,
              longitude: end ? end?.coords?.lng : destination?.coords?.lng,
            }}
            title="Destination"
            description={
              end ? end?.formatted_address : destination?.formatted_address
            }
            identifier="destination"
          >
            <Entypo name="flag" size={35} color="black" />
          </Marker>
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

export default Map;

const styles = StyleSheet?.create({
  mapView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  fullScreen: { position: "absolute", top: 15, right: 10 },
});
