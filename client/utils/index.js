import RECORD_TYPES from "../enums";

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default async function getRecords(key) {
  const results = [];
  const url = "/api/record/" + getKeyByValue(RECORD_TYPES, key);
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
