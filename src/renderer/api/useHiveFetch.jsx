import { useQuery } from 'react-query';

export function useSettingsData() {
  return useQuery(['settings'], async () => {
    // const settings = await window.electron.getSettings();
    // return settings;
    // return { serverHost: 'localhost', serverPort: '3025' };
    if (!localStorage.getItem('settings')) {
      const settings = { serverHost: 'localhost', serverPort: '3025' };
      localStorage.setItem('settings', JSON.stringify(settings));
    }
    return JSON.parse(localStorage.getItem('settings'));
  });
}

function useHiveFetch() {
  const settings = useSettingsData();
  /* eslint-disable no-restricted-syntax */
  const apiUrl = `http://${settings.data.serverHost}:${settings.data.serverPort}/api/`;
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
  // eslint-disable-next-line consistent-return
  return async function hiveFetch(body) {
    const localOptions = { ...options };
    localOptions.body = convertToFormType(body);
    const res = await fetch(apiUrl, localOptions);
    const jsonRes = await res.json();
    if (jsonRes.msg !== 'ok') console.log(jsonRes.msg);
    else return jsonRes.data;
  };
}

export default useHiveFetch;
