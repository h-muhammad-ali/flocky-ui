import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Header from "../components/Header";
import PatronDetailsHeader from "../components/PatronDetailsHeader";
import TimeLine from "../components/TimeLine";
import DepartingDetails from "../components/DepartingDetails";
import VehicleDetails from "../components/VehicleDetails";
import Button from "../components/Button";
import Map from "../components/Map";
import { Ionicons } from "@expo/vector-icons";

const PatronDetails = ({ navigation, route }) => {
  const dummyPatronDetails = [
    {
      ride_id: 1,
      name: "John Doe",
      ride_count: 3,
      ride: {
        available_seats: 4,
        total_seats: 5,
        start_location: {
          coords: {
            lat: 31.5788719,
            lng: 74.30438509999999,
          },
          formatted_address:
            "Main Bazaar، Data Darbar Rd, near NBP، Data Gunj Buksh Town, Lahore, Punjab 54000, Pakistan",
          place_id: "ChIJD1_4IKIcGTkRHWJ0TD2nuiA",
        },
        end_location: {
          coords: {
            lat: 31.5641139,
            lng: 74.318805,
          },
          formatted_address:
            "Hall Rd, Garhi Shahu, Lahore, Punjab 54000, Pakistan",
          place_id:
            "EjRIYWxsIFJkLCBHYXJoaSBTaGFodSwgTGFob3JlLCBQdW5qYWIgNTQwMDAsIFBha2lzdGFuIi4qLAoUChIJ8eyI4VMbGTkRFeFSIB8gamsSFAoSCcW5o5cyGxk5EakCpbI5ojjK",
        },
        way_points: [],
        overview_polyline:
          "itv_EkrodMd@xC?j@E|@Mz@`CKf@MpASp@O|@Bx@e@bCgBlAs@z@]Pb@fDdFNNFw@Fa@`BgFPs@LgAb@gDbAL`@Jx@Vj@T`A^pAXz@L^Jf@PbA\\TI\\ENGn@]hAaHF_@HMAEAMBMJIv@kGf@uBpAwDNg@J_@|@wAPa@|@wCjAyDFMl@u@bEiEZ_@Gg@c@sDq@wF{@gJd@KLBf@Br@ErCg@`Dm@",
        departure_time: "8:00 PM",
      },
      vehicle: {
        make: "Honda",
        model: "CD-70",
        registration_no: "XYZ 1234",
        type: "bike",
      },
    },
    {
      ride_id: 2,
      name: "John Doe",
      ride_count: 3,
      ride: {
        available_seats: 4,
        total_seats: 5,
        start_location: {
          coords: {
            lat: 31.5788719,
            lng: 74.30438509999999,
          },
          formatted_address:
            "Main Bazaar، Data Darbar Rd, near NBP، Data Gunj Buksh Town, Lahore, Punjab 54000, Pakistan",
          place_id: "ChIJD1_4IKIcGTkRHWJ0TD2nuiA",
          short_address: "Main Bazaar، Data Darbar Rd",
        },
        end_location: {
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
        way_points: [
          {
            coords: {
              lat: 31.5788833,
              lng: 74.3088372,
            },
            formatted_address:
              "Hakiman Bazaar, Mohalla Patrangan Kucha Faqirkhana اندرون لاہور،، Lahore, Punjab 54000, Pakistan",
            place_id: "ChIJ2_bSuy4dGTkR7xT_GPVRBdQ",
            short_address: "Hakiman Bazaar, Mohalla Patrangan Kucha Faqirkhana",
          },
        ],
        overview_polyline:
          "itv_EkrodMd@xC?j@E|@Mz@eCF}ELw@Ag@EeCOS?AqABaADUbA_A\\s@~@sAT}@lCqDoCMiDYDy@dBNrAJr@@b@Cn@Gn@UZWVYV{@FkADi@HYZ]r@q@DCiAcChAbCR@T@VEHEv@cAVk@Z}@~BmIRkAFaBNsB`@kEXmGGEGO@QFOFE@A`@oDf@oBTm@f@w@ZSZc@`AAxBF~BRdCJdCVfAg@h@U?A@E@CFCt@eBzAsCZU^ClBHv@DvA\\ZPTLnCYLHVBpCNzAI|@Ij@A|@Ad@KLBf@Br@ErCg@`Dm@",
        departure_time: "8:00 PM",
      },
      vehicle: {
        make: "Honda",
        model: "City XLR",
        registration_no: "XYZ 1234",
        type: "car",
      },
    },
  ];
  const [patron, setPatron] = useState(null);
  useEffect(() => {
    const obj = dummyPatronDetails?.find(
      (element) => element?.ride_id === route.params?.id
    );
    setPatron(obj);
  }, []);

  return (
    <View style={styles?.container}>
      <Header
        text="Ride Details"
        navigation={() => navigation?.goBack()}
        isCancel={route.params?.isBooked}
        onCancel={() => {}}
      />
      {patron ? (
        <>
          <PatronDetailsHeader
            name={patron?.name}
            rides={patron?.ride_count}
            filledSeats={
              patron?.ride?.total_seats - patron?.ride?.available_seats
            }
            availableSeats={patron?.ride?.available_seats}
            showSeats={!route.params?.isBooked}
          />

          <TimeLine
            source={patron?.ride?.start_location?.formatted_address}
            destination={patron?.ride?.end_location?.formatted_address}
            stops={patron?.ride?.way_points?.map(
              (waypoint) => waypoint?.formatted_address
            )}
          />
          {route.params?.isBooked ? (
            <View style={styles?.departingContainer}>
              <DepartingDetails
                style={{ flex: 1 }}
                showDate={false}
                time={patron?.ride?.departure_time}
              />
              <TouchableOpacity style={styles?.liveLocationButton}>
                <Text style={styles?.liveLocationText}>See Live Location</Text>
                <Ionicons name="location" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <DepartingDetails
              showDate={true}
              time={patron?.ride?.departure_time}
            />
          )}
          <VehicleDetails
            make={patron?.vehicle?.make}
            model={patron?.vehicle?.model}
            registration_no={patron?.vehicle?.registration_no}
            type={patron?.vehicle?.type}
          />
          <View style={{ flex: 2, marginHorizontal: 12 }}>
            <Map
              start={patron?.ride?.start_location}
              end={patron?.ride?.end_location}
              way_points={patron?.ride?.way_points}
              overview_polyline={patron?.ride?.overview_polyline}
              navigation={() => {
                navigation?.navigate("Full Screen Map", {
                  start: patron?.ride?.start_location,
                  end: patron?.ride?.end_location,
                  way_points: patron?.ride?.way_points,
                  overview_polyline: patron?.ride?.overview_polyline,
                });
              }}
            />
          </View>
          {route.params?.isBooked ? (
            <Button
              text="Message"
              onPress={() => {
                navigation?.navigate("Chat", { name: patron?.name });
              }}
            />
          ) : (
            <Button
              text="Request Ride"
              onPress={() => {
                navigation?.navigate("RideRequested");
              }}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default PatronDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  departingContainer: { flexDirection: "row", justifyContent: "space-between" },
  liveLocationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    marginVertical: 12,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  liveLocationText: { color: "white", marginEnd: 5 },
});
