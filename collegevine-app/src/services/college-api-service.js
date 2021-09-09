import config from '../config';

const CollegeApiService = {
  getCollegesByDistance({ lat, lon }) {
    return fetch(`${config.API_ENDPOINT}/colleges/distance`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ lat, lon }),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json(),
    );
  },
};

export default CollegeApiService;
