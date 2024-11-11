import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Challenge } from "../models/challenge";
import { Fonts } from "../constants/fonts";

export default function ChallengeCountdown({
  challenge,
}: {
  challenge: Challenge;
}) {
  const [duration, setDuration] = useState(null);

  const endDate = useMemo(() => {
    if (challenge && challenge.voteDate) {
      return moment(new Date(challenge.voteDate.seconds * 1000));
    } else {
      return moment();
    }
  }, [challenge]);

  useEffect(() => {
    const interval = setInterval(() => {
      var duration = moment.duration(endDate.diff(moment()));
      setDuration(duration);
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const daysRemaining = useMemo(() => {
    if (duration) {
      let days = duration.days();
      if (days < 0) {
        return 0;
      }
      return days;
    }
    return 0;
  }, [duration]);

  const hoursRemaining = useMemo(() => {
    if (duration) {
      let hours = duration.hours();
      if (hours < 0) {
        return 0;
      }
      return hours;
    }
    return 0;
  }, [duration]);

  const minsRemaining = useMemo(() => {
    if (duration) {
      let minutes = duration.minutes();
      if (minutes < 0) {
        return 0;
      }
      return minutes;
    }
    return 0;
  }, [duration]);

  const secondsRemaining = useMemo(() => {
    if (duration) {
      let seconds = duration.seconds();
      if (seconds < 0) {
        return 0;
      }
      return seconds;
    }
    return 0;
  }, [duration]);

  return (
    <View style={{ flexDirection: "row", marginVertical: 4 }}>
      {daysRemaining > 0 ? (
        <CountdownItem val={daysRemaining} title="days" isLast={false} />
      ) : (
        <View />
      )}
      <CountdownItem val={hoursRemaining} title="hours" isLast={false} />
      <CountdownItem val={minsRemaining} title="minutes" isLast={false} />

      <CountdownItem val={secondsRemaining} title="seconds" isLast={true} />
    </View>
  );
}

const CountdownItem = ({ val, title, isLast }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              backgroundColor: "white",
              width: 24,
              height: 36,
              marginRight: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 24,
                fontFamily: Fonts.MonoBold,
              }}
            >
              {val > 9 ? `${val}`[0] : "0"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              width: 24,
              height: 36,
              marginRight: 5,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 24,
                fontFamily: Fonts.MonoBold,
              }}
            >
              {val > 9 ? `${val}`[1] : `${val}`}
            </Text>
          </View>
          {val > 99 && title == "hours" && (
            <View
              style={{
                backgroundColor: "white",
                width: 24,
                height: 36,
                marginRight: 5,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 24,
                  fontFamily: Fonts.MonoBold,
                }}
              >
                {val > 99 ? `${val}`[2] : `${val}`}
              </Text>
            </View>
          )}
          {!isLast && (
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontFamily: Fonts.MonoBold,
                marginRight: 5,
              }}
            >
              {":"}
            </Text>
          )}
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 12,
            fontFamily: Fonts.MonoBold,
          }}
          allowFontScaling={false}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};
