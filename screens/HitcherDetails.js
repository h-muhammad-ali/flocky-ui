import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import Map from "../components/Map";
import TimeLine from "../components/TimeLine";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

const HitcherDetails = ({ route, navigation }) => {
  const dummyHitcherDetails = [
    {
      id: 1,
      name: "John Doe",
      pickup_location: {
        coords: {
          lat: 31.5788719,
          lng: 74.30438509999999,
        },
        formatted_address:
          "Main Bazaar، Data Darbar Rd, near NBP، Data Gunj Buksh Town, Lahore, Punjab 54000, Pakistan",
        place_id: "ChIJD1_4IKIcGTkRHWJ0TD2nuiA",
        short_address: "Main Bazaar، Data Darbar Rd",
      },
      dropoff_location: {
        coords: {
          lat: 31.5641139,
          lng: 74.318805,
        },
        formatted_address:
          "Hall Rd, Garhi Shahu, Lahore, Punjab 54000, Pakistan",
        place_id:
          "EjRIYWxsIFJkLCBHYXJoaSBTaGFodSwgTGFob3JlLCBQdW5qYWIgNTQwMDAsIFBha2lzdGFuIi4qLAoUChIJ8eyI4VMbGTkRFeFSIB8gamsSFAoSCcW5o5cyGxk5EakCpbI5ojjK",
        short_address: "Hall Rd, Garhi Shahu",
      },
      overview_polyline:
        "itv_EkrodMd@xC?j@E|@Mz@`CKf@MpASp@O|@Bx@e@bCgBlAs@z@]Pb@fDdFNNFw@Fa@`BgFPs@LgAb@gDbAL`@Jx@Vj@T`A^pAXz@L^Jf@PbA\\TI\\ENGn@]hAaHF_@HMAEAMBMJIv@kGf@uBpAwDNg@J_@|@wAPa@|@wCjAyDFMl@u@bEiEZ_@Gg@c@sDq@wF{@gJd@KLBf@Br@ErCg@`Dm@",
    },
    {
      id: 2,
      name: "Jane Dane",
      pickup_location: {
        coords: {
          lat: 31.5788719,
          lng: 74.30438509999999,
        },
        formatted_address:
          "Main Bazaar، Data Darbar Rd, near NBP، Data Gunj Buksh Town, Lahore, Punjab 54000, Pakistan",
        place_id: "ChIJD1_4IKIcGTkRHWJ0TD2nuiA",
        short_address: "Main Bazaar، Data Darbar Rd",
      },
      dropoff_location: {
        coords: {
          lat: 31.5641139,
          lng: 74.318805,
        },
        formatted_address:
          "Hall Rd, Garhi Shahu, Lahore, Punjab 54000, Pakistan",
        place_id:
          "EjRIYWxsIFJkLCBHYXJoaSBTaGFodSwgTGFob3JlLCBQdW5qYWIgNTQwMDAsIFBha2lzdGFuIi4qLAoUChIJ8eyI4VMbGTkRFeFSIB8gamsSFAoSCcW5o5cyGxk5EakCpbI5ojjK",
        short_address: "Hall Rd, Garhi Shahu",
      },
      overview_polyline:
        "itv_EkrodMd@xC?j@E|@Mz@`CKf@MpASp@O|@Bx@e@bCgBlAs@z@]Pb@fDdFNNFw@Fa@`BgFPs@LgAb@gDbAL`@Jx@Vj@T`A^pAXz@L^Jf@PbA\\TI\\ENGn@]hAaHF_@HMAEAMBMJIv@kGf@uBpAwDNg@J_@|@wAPa@|@wCjAyDFMl@u@bEiEZ_@Gg@c@sDq@wF{@gJd@KLBf@Br@ErCg@`Dm@",
    },
  ];
  const [hitcher, setHitcher] = useState(null);
  useEffect(() => {
    const obj = dummyHitcherDetails?.find(
      (element) => element?.id === route.params?.id
    );
    setHitcher(obj);
  }, []);

  return (
    <>
      {hitcher ? (
        <View style={styles?.container}>
          <Header text="Ride Details" navigation={() => navigation?.goBack()} />
          <View style={styles?.headerContainer}>
            <Ionicons name="person-circle" size={100} color={"#5188E3"} />
            <View style={styles?.semiContainer}>
              <Text style={styles?.name}>{hitcher?.name}</Text>
            </View>
          </View>
          <View style={{ flex: 1.5 }}>
            <TimeLine
              source={hitcher?.pickup_location?.formatted_address}
              destination={hitcher?.dropoff_location?.formatted_address}
            />
          </View>

          <TouchableOpacity
            style={styles?.liveLocationButton}
            onPress={() => {
              navigation?.navigate("Live Location", {
                id: hitcher?.id,
              });
            }}
          >
            <Text style={styles?.liveLocationText}>See Live Location</Text>
            <Ionicons name="location" size={20} />
          </TouchableOpacity>

          <View style={{ flex: 6, marginHorizontal: 10 }}>
            <Map
              start={hitcher?.pickup_location}
              end={hitcher?.dropoff_location}
              way_points={[]}
              overview_polyline={hitcher?.overview_polyline}
              navigation={() => {
                navigation?.navigate("Full Screen Map", {
                  start: hitcher?.pickup_location,
                  end: hitcher?.dropoff_location,
                  way_points: [],
                  overview_polyline: hitcher?.overview_polyline,
                });
              }}
            />
          </View>
          <Button
            text="Message"
            onPress={() => {
              navigation?.navigate("Chat", { name: hitcher?.name });
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default HitcherDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  semiContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 24,
  },
  time: {
    color: "white",
    fontFamily: "NunitoSans-SemiBold",
  },
  statement: {
    fontFamily: "NunitoSans-SemiBold",
  },
  statementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    flex: 1,
    justifyContent: "center",
  },
  liveLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    marginVertical: 5,
    marginHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
  },
  liveLocationText: { color: "white", marginEnd: 5 },
});
