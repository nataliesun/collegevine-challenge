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
  // addCollege
  // push college entry into college db
  // success
  // {id, ..data}

  // addComment
  // comments
  // { pk: commentId, fk: collegeId, message: string, parentId: null, ancestorId: 1 }
  //
  // parent: parentCommentId

  // allCommentsByCollege

  // top level 1

  // getChildrenCount([1])
  // get count from table comments where ancestorId = 1 = 123

  // let count = 0
  // commentId: 1
  // get from comments table where parentId = 1 => 26
  // increments count
  // 26 comments all with commentId
  // loop through 26 comments
  //

  // CRUD schools

  // user leaves comment against school

  // webhook
  // subscribed collegeId comments
  // getAllcomments
  // page subscribed /college/1/comments

  // whne another user inserts commment collegeId
  // posts comment
  // db
  // db ->
  // sqs handler -> publishes -> new comment /college/1/comments {}

  //

  // labels

  // get page in croatia

  // transalatin api

  // map croations labels

  // page
}

module.exports = {
  CollegesService,
};
