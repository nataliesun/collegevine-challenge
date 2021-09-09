const { getHaversineDistance } = require('./lib/helpers');

class CollegesService {
  repository;

  constructor(repository) {
    this.repository = repository;
  }

  getAllWithDistances(lat, lon) {
    console.log(lat, lon);
    const locations = this.repository;

    const locationsWithDistances = locations
      .map((location) => {
        const { address__latitude: lat2, address__longitude: lon2 } = location;
        const distance = getHaversineDistance([lat, lon], [lat2, lon2]);
        return {
          ...location,
          distance,
        };
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      });

    return locationsWithDistances;
  }
}

module.exports = {
  CollegesService,
};
