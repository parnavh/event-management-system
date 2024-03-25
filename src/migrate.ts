import fs from "fs";
import csv from "fast-csv";

type Data = {
  event_name: string;
  city_name: string;
  date: Date;
  latitude: number;
  longitude: number;
};

const file = fs.readFileSync("dataset.csv", "utf8");

const result = await csv.parseString(file).toArray();
result.shift();

const data: Data[] = result.map((row) => {
  const dateParts = row[2].split("-");
  const timeParts = row[3].split(":");

  const parsedDate = new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
    timeParts[0],
    timeParts[1],
    timeParts[2],
  );

  return {
    event_name: row[0],
    city_name: row[1],
    date: parsedDate,
    latitude: row[4],
    longitude: row[5],
  };
});

data.forEach(async (row) => {
  fetch("http://localhost:3000/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(row),
  });
});
