import RECORD_TYPES from '../enums';
import { LinkRecord, RecordList } from '../slices';

export function getKeyByValue(object: { [x: string]: string }, value: string) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default async function getRecords(key: string): Promise<LinkRecord[]> {
  const results: LinkRecord[] = [];
  const type = getKeyByValue(RECORD_TYPES, key);
  if (!type) return results;
  const url = '/api/record/' + type;
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

export async function searchRecords(
  type: string,
  searchString: string
): Promise<RecordList[]> {
  const results: RecordList[] = [];
  await fetch('/api/search/' + searchString, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if ('err' in data) return; // error from server.
      for (const obj of data) {
        results.push(obj);
      }
    })
    .catch((err) => console.log(err));
  return results;
}
