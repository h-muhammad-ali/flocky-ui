import React, { useState, useEffect } from "react";
import Timeline from "react-native-timeline-flatlist";
import { Ionicons } from "@expo/vector-icons";

const TimeLine = ({ source, destination, stops }) => {
  const [timeLineData, setTimeLineData] = useState([]);
  useEffect(() => {
    let timeline = [];
    timeline?.push({
      title: source,
      icon: <Ionicons name="location-outline" size={20} />,
    });
    stops?.forEach((element) => {
      timeline?.push({
        title: element,
        icon: <Ionicons name="stop-circle-outline" size={15} />,
      });
    });
    timeline?.push({
      title: destination,
      icon: <Ionicons name="locate-outline" size={20} />,
    });
    setTimeLineData(timeline);
  }, [source, destination, stops]);
  return (
    <>
      {timeLineData?.length !== 0 ? (
        <Timeline
          data={timeLineData}
          innerCircle="icon"
          circleSize={21}
          circleColor="#f2f3f3"
          showTime={false}
          titleStyle={{
            fontSize: 12,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TimeLine;
