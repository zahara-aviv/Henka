const db = require("../models/linkRecordModels");

/*

SELECT l._id, u.url, u.description, r.state_name, c.upvote, c.downvote FROM link_record l
JOIN uri u ON l.uri_id = u._id 
JOIN record_type r ON l.record_type_id = r._id
JOIN confidence c ON l.confidence_id = c._id;
 _id |                          url                           |                   description                   | state_name | upvote | downvote 
-----+--------------------------------------------------------+-------------------------------------------------+------------+--------+----------
   1 | https://www.njcourts.gov/self-help/name-change         | Name change process for the state of New Jersey | New Jersey |    100 |       20
   2 | https://nycourts.gov/courthelp/namechange/basics.shtml | Name change process for the state of New York   | New York   |     80 |       60


SELECT u.url, u.description FROM link_record l
join uri u ON l.uri_id = u._id;
                          url                           |                   description                   
--------------------------------------------------------+-------------------------------------------------
 https://www.njcourts.gov/self-help/name-change         | Name change process for the state of New Jersey
 https://nycourts.gov/courthelp/namechange/basics.shtml | Name change process for the state of New York




*/

const linkRecordController = {};

linkRecordController.getLinks = (req, res, next) => {
  const text = ""; // TODO
  db.query(text)
    .then((results) => {
      // console.log(results.rows);
      res.locals.links = results.rows;
      next();
    })
    .catch((err) => {
      console.log(err);
      next({ log: "Error caught in getLinks", message: { err } });
    });
};

//  req.params.record_type
linkRecordController.getRecordType = (req, res, next) => {
  if ("record_type" in req.params) {
    const recordType = req.params.record_type;
    const text = ""; // TODO
    db.query(text)
      .then((result) => {
        // console.log(result);
        // if result is empty throw an error...
        if (!("rows" in result) || result.rows.length === 0) {
          return next({
            log: "Error caught in getRecordType, query empty",
            message: {
              err: "An error occurred in linkRecordController.getRecordType",
            },
          });
        }
        res.locals.record = result.rows[0];
        next();
      })
      .catch((err) => {
        console.log(err);
        next({ log: "Error caught in getRecordType", message: { err } });
      });
  } else {
    // id error!
    return next({
      log: "Error caught in getRecordType while getting id",
      message: {
        err: "An error occurred in linkRecordController.getRecordType",
      },
    });
  }
};
/*
{
  record_type,
  confidence > x %,
  search_text ~ for search in either url or description
}
*/
linkRecordController.getSearchResults = (req, res, next) => {
  // write code here
  const { record_type, confidence, search_text } = req.body;
  const values = [id];
  const text = ""; //TODO
  db.query(text, values)
    .then((result) => {
      // console.log(result);
      // if result is empty throw an error...
      if (!("rows" in result) || result.rows.length === 0) {
        return next({
          log: "Error caught in getSearchResults, query empty",
          message: {
            err: "An error occurred in linkRecordController.getSearchResults",
          },
        });
      }
      res.locals.searchResults = result.rows[0];
      next();
    })
    .catch((err) => {
      next({
        log: "Error caught in getSearchResults",
        message: { err },
      });
    });
};
/*
 */
linkRecordController.getByID = (req, res, next) => {
  if ("id" in req.query) {
    const id = req.query.id;
    const values = [id];
    const text = "SELECT * FROM link_record WHERE _id = $1";
    db.query(text, values)
      .then((result) => {
        // console.log(result);
        // if result is empty throw an error...
        if (!("rows" in result) || result.rows.length === 0) {
          return next({
            log: "Error caught in getByID, query empty",
            message: {
              err: "An error occurred in linkRecordController.getByID",
            },
          });
        }
        res.locals.record = result.rows[0];
        next();
      })
      .catch((err) => {
        next({
          log: "Error caught in getByID",
          message: { err },
        });
      });
  } else {
    //input error
    return next({
      log: "Error caught in getByID while getting id",
      message: { err: "An error occurred in linkRecordController.getByID" },
    });
  }
};

/*
input req.body contains:
const body = {
        record_type,
        url: []
        description,
      };

output: Create entry in database:
*/
linkRecordController.addLinkRecord = async (req, res, next) => {
  const keys = ["record_type", "url", "description"];
  const values = [];
  for (const key of keys) {
    if (!([key] in req.body)) {
      return next({
        log: `Error caught in addLinkRecord, ${key} doesn't exist in request body!`,
        message: {
          err: "An error occurred in linkRecordController.addLinkRecord",
        },
      });
    }
    values.push(req.body[key]);
  }
  // const text = INSERT INTO public.record_type VALUES (1, 'New Jersey', NULL);`
  // update tables
  await db
    .query(text, values)
    .then((result) => {
      if (result.length === 0) {
        next({
          log: "Error in addLinkRecord - query response empty ()!",
          message: {
            err: "An error occurred in linkRecordController.addLinkRecord",
          },
        });
      }
    })
    .catch((error) =>
      next({
        log: "Error caught in addLinkRecord",
        message: { err: error },
      })
    );
  // get the  _id (x) from the people TABLE
  let id;
  await db
    .query("SELECT MAX(_id) FROM record_types")
    .then((result) => {
      if (result.rows.length === 0) {
        next({
          log: "Error in addChacter - no id found!",
          message: {
            err: "An error occurred in linkRecordController.addLinkRecord",
          },
        });
      }
      // console.log(result);
      id = result.rows[0].max;
      // console.log("_id", id);
    })
    .catch((error) => {
      next({
        log: "Error caught in addLinkRecord - get id",
        message: { err: error },
      });
    });
  // LOOP:
  // update url table
  for (const url of req.body.url) {
    const fText = ` `;
    // const fValues =
    await db
      .query(fText, fValues)
      .then((result) => {
        if (result.length === 0) {
          next({
            log: "Error in addLinkRecord - query response empty !",
            message: {
              err: "An error occurred in linkRecordController.addLinkRecord",
            },
          });
        }
      })
      .catch((error) => {
        next({
          log: "Error caught in addLinkRecord - insert into table",
          message: { err: error },
        });
      });
  }
  next();
};

module.exports = linkRecordController;
