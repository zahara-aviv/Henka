import RECORD_TYPES from "../enums";

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default async function getRecords(key) {
  const results = [];
  const type = getKeyByValue(RECORD_TYPES, key);
  if (!type) return results;
  const url = "/api/record/" + type;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (const obj of data) {
        results.push(obj);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return results;
}

export async function searchRecords(type, searchString) {
  const results = [];
  await fetch("/api/search/" + searchString, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if ("err" in data) return; // error from server.
      for (const obj of data) {
        results.push(obj);
      }
    })
    .catch((err) => console.log(err));
  return results;
}
