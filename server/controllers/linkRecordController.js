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

const linkRecordController = {

  getLinks: (req, res, next) => {
    console.log("get Links...", req.params);
    const text = ""; // TODO
    db.query(text)
      .then((results) => {
        // console.log(results.rows);
        res.locals.links = results.rows;
        return next();
      })
      .catch((err) => {
        console.log(err);
        return next({ log: "Error caught in getLinks", message: { err } });
      });
  },
  deleteByID: (req, res, next) => {
    if(req.params.id) {
      // only delete unique records from other tables
      const rmRecType = `DELETE FROM record_type  
      WHERE _id NOT IN (SELECT l.record_type_id FROM link_record l)`;
      const rmURI = `DELETE FROM uri
      WHERE _id NOT IN (SELECT l.uri_id FROM link_record l)`;
      const rmConfidence = `DELETE FROM confidence
      WHERE _id NOT IN (SELECT l.confidence_id FROM link_record l)`;
      const rmLinkRecord = `DELETE FROM link_record WHERE _id = $1`;
      db.query(rmLinkRecord, [req.params.id])
      .then((result) => {
        // if (!result.rows || result.rows.length === 0) {
        //   return next({ log: "Error caught in deleteByID", message: { err: 'Nothing found to delete...' } });
        // }
        Promise.all([db.query(rmRecType),
                   db.query(rmURI),
                   db.query(rmConfidence)])
        .then((results) => {
          console.log(results);
          return next();
        })
        .catch(err => next({ log: "Error caught in deleteByID", message: { err } }));
      })
      .catch(err => next({ log: "Error caught in deleteByID", message: { err } }));

      
    } else {
      return next({log: "Error caught in deleteByID", message: {err: 'ID does not exist in DB'}})
    }
  },

  //  req.params.record_type
  getRecordType: async (req, res, next) => {
    if ("record_type" in req.params) {
      const recordType = req.params.record_type;
      let value = "";
      let text = `SELECT l.record_type_id,
                  array_agg(l._id) as _id, 
                  array_agg(l.confidence_id) as confidence_id, 
                  array_agg(l.uri_id) as uri_id, 
                  array_agg(u.url) AS url, 
                  array_agg(u.description) As description, 
                  array_agg(r.company_name) as company_name, 
                  array_agg(r.country_name) as country_name, 
                  array_agg(r.state_name) as state_name, 
                  array_agg(c.upvote) as upvote, 
                  array_agg(c.downvote) as downvote  
                  FROM link_record l
          JOIN uri u ON l.uri_id = u._id 
          JOIN record_type r ON l.record_type_id = r._id
          JOIN confidence c ON l.confidence_id = c._id`;
      switch (recordType) {
        case "*":
          break;
        case "state_name":
        case "company_name":
        case "country_name":
          // Get IDs for this case - note can't use parametrized query for column name...
          await db
            .query(`SELECT _id FROM record_type WHERE ${recordType} IS NOT NULL`)
            .then((result) => {
              console.log(result);
              if (!("rows" in result) || result.rows.length === 0) {
                res.locals.records = [];
                return next({
                  log: "Error caught in getRecordType, query empty",
                  message: {
                    err: "An error occurred in linkRecordController.getRecordType",
                  },
                });
              }
              value = [];
              let i = 0;
              for (const obj of result.rows) {
                value.push(obj._id);
              }
            })
            .catch((err) => {
              console.log(err);
              return next({
                log: "Error caught in getRecordType",
                message: { err },
              });
            });
          text += ` WHERE l.record_type_id IN (${value})`;
          value = [];
          break;
        default:
          return next({
            log: "Error caught in getRecordType",
            message: { err: "Invalid RecordType" },
          });
      }
      // get the results from the DB
      text += ` GROUP BY l.record_type_id;`
      db.query(text, value)
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
          res.locals.records = result.rows;
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
  },
  updateVote: (req, res, next) => {
    console.log('in updateVote');
    const keys = ["_id", "upvote", "downvote"];
    for (const key of keys) {
      if (!(key in req.body)) {
        return next({
          log: "Error caught in updateVote", message: {err: 'request body malformed...'}
        });
     }
    }
      // only delete unique records from other tables
      const text = `UPDATE confidence   
      SET upvote = $2, downvote = $3 
      WHERE _id = $1`;
      console.log(`id = ${req.body._id}, upvote = ${req.body.upvote}, downvote = ${req.body.downvote}`);
      db.query(text, [req.body._id, req.body.upvote, req.body.downvote])
      .then((result) => {
        return next();
      })
      .catch(err => next({ log: "Error caught in updateVote", message: { err } }));
  },
  /*
  {
    record_type,
    confidence > x %,
    search_text ~ for search in either url or description
  }
  */
  getSearchResults: (req, res, next) => {
    console.log("get Search...", req.params);
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
  },
  /*
  */
  getByID: (req, res, next) => {
    console.log("get ByID...", req.params);
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
  },

  /*
  input req.body contains:
  const body = {
          record_type,
          url: []
          description,
        };

  output: Create entry in database:
  */
  addLinkRecord: async (req, res, next) => {
    console.log("get addLink...", req.params);
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
  },
};

module.exports = linkRecordController;
