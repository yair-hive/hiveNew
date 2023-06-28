/* eslint-disable no-restricted-syntax */
const apiUrl = 'http://localhost:3025/api/';
const options = {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
};

function convertToFormType(object) {
  const asArray = Object.entries(object);
  const stringsArray = [];
  for (const [key, value] of asArray) {
    stringsArray.push(`${key}=${value}`);
  }
  return stringsArray.join('&');
}
async function hiveFetch(body) {
  const localOptions = { ...options };
  localOptions.body = convertToFormType(body);
  const res = await fetch(apiUrl, localOptions);
  const jsonRes = await res.json();
  if (jsonRes.msg !== 'ok') throw new Error(jsonRes.msg);
  else return jsonRes.data;
}

export default hiveFetch;
