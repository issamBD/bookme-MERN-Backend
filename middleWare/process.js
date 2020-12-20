import _ from "lodash";

const DAYS_OF_THE_WEEK_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wedensday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const processDurations = (duration) => {
  //transform the from of durations from hour/minut to the Number of minuts
  let processed = duration.map((item) => {
    let hour =
      typeof item.hour === "string" ? parseInt(item.hour.trim()) : item.hour;
    let minut =
      typeof item.minut === "string" ? parseInt(item.minut.trim()) : item.minut;
    hour = isNaN(hour) ? 0 : hour;
    minut = isNaN(minut) ? 0 : minut;
    return hour * 60 + minut;
  });
  return processed;
};

export const processPeriods = (periods) => {
  //extract all dates between the two dates submitted
  const processed = periods.map((period) => {
    let dates = [];
    let start = new Date(period.start);
    start.setHours(10, 10, 10, 10);
    let end = new Date(period.end);
    end.setHours(10, 10, 10, 10);
    while (start <= end) {
      dates = [...dates, new Date(start)];
      start.setDate(start.getDate() + 1);
    }
    return dates;
  });
  let allDates = [];
  for (let i of processed) {
    for (let j of i) allDates.push(new Date(j));
  }
  let uniqueArray = allDates
    .map(function (date) {
      return date.getTime();
    })
    .filter(function (date, i, array) {
      return array.indexOf(date) === i;
    })
    .map(function (time) {
      return new Date(time);
    });

  return uniqueArray;
};

export const processHours = (hours) => {
  //get all possible booking times between
  //two points of time with a 15 min interval
  const days = Object.keys(hours);
  const time = Object.values(hours);
  const extractedHours = time.map((item) => {
    const extracted = item.map((obj) => {
      let list = [];
      let startEnc =
        parseInt(obj.hour.from.substring(0, 2), 10) * 60 +
        parseInt(obj.hour.from.substring(3, 5), 10);
      let endEnc =
        parseInt(obj.hour.to.substring(0, 2), 10) * 60 +
        parseInt(obj.hour.to.substring(3, 5), 10);
      while (startEnc < endEnc - 45) {
        let hourDecoded = parseInt(startEnc / 60, 10).toString();
        let minutDecoded = (startEnc % 60).toString();
        if (hourDecoded.length === 1) hourDecoded = "0" + hourDecoded;
        if (minutDecoded.length === 1) minutDecoded = minutDecoded + "0";
        let decod = hourDecoded + ":" + minutDecoded;
        list.push(decod);
        startEnc += 15;
      }
      return list;
    });

    let T = [];
    for (let i in extracted) {
      for (let j in extracted[i]) T.push(extracted[i][j]);
    }

    return T;
  });
  let temp = [];
  for (let i in extractedHours) {
    let T = {
      day: days[i],
      hours: extractedHours[i],
    };
    temp.push(T);
  }

  return temp;
};

export const groupDates = (hoursList) => {
  //group the array of hours to an object with the days as keys
  var grouped = _.mapValues(_.groupBy(hoursList, "day"), (clist) =>
    clist.map((hour) => _.omit(hour, "day"))
  );
  return grouped;
};
