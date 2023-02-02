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
  deleteByID: (req, res, next) => {
    if (req.params.id) {
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
          Promise.all([
            db.query(rmRecType),
            db.query(rmURI),
            db.query(rmConfidence),
          ])
            .then((results) => {
              console.log(results);
              return next();
            })
            .catch((err) =>
              next({ log: "Error caught in deleteByID", message: { err } })
            );
        })
        .catch((err) =>
          next({ log: "Error caught in deleteByID", message: { err } })
        );
    } else {
      return next({
        log: "Error caught in deleteByID",
        message: { err: "ID does not exist in DB" },
      });
    }
  },
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
            .query(
              `SELECT _id FROM record_type WHERE ${recordType} IS NOT NULL`
            )
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
      text += ` GROUP BY l.record_type_id;`;
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
    console.log("in updateVote");
    const keys = ["_id", "upvote", "downvote"];
    for (const key of keys) {
      if (!(key in req.body)) {
        return next({
          log: "Error caught in updateVote",
          message: { err: "request body malformed..." },
        });
      }
    }
    // only delete unique records from other tables
    const text = `UPDATE confidence   
      SET upvote = $2, downvote = $3 
      WHERE _id = $1`;
    console.log(
      `id = ${req.body._id}, upvote = ${req.body.upvote}, downvote = ${req.body.downvote}`
    );
    db.query(text, [req.body._id, req.body.upvote, req.body.downvote])
      .then((result) => {
        return next();
      })
      .catch((err) =>
        next({ log: "Error caught in updateVote", message: { err } })
      );
  },
  /*
  {
    record_type,
    confidence > x %,
    search_text ~ for search in either url or description
  }
  */
  getSearchResults: async (req, res, next) => {
    console.log("get Search...", req.params);
    if (
      !req.body ||
      !("type" in req.body) ||
      !(req.body.type === "record_type" || req.body.type === "uri")
    ) {
      return next({
        log: "Error caught in getSearchResults",
        message: { err: "request body malformed..." },
      });
    }
    let search;
    if (req.body.type === "uri") {
      search = `SELECT _id FROM ${req.body.type} where url ~* $1 OR description ~* $1`;
    } else {
      search = `SELECT _id FROM ${req.body.type} where state_name ~* $1 
                OR company_name ~* $1 OR country_name ~* $1`;
    }
    const ids = [];
    await db
      .query(search, [req.params.text])
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
        for (const obj of result.rows) {
          ids.push(obj._id);
        }
        console.log(ids);
        // res.locals.searchResults = result.rows[0];
        // return next();
      })
      .catch((err) => {
        return next({
          log: "Error caught in getSearchResults",
          message: { err },
        });
      });
    let filter;
    if (req.body.type === "uri") {
      filter = `WHERE l.uri_id IN (${ids}) GROUP BY l.record_type_id;`;
    } else {
      filter = `WHERE l.record_type_id IN (${ids}) GROUP BY l.record_type_id;`;
    }
    //select all records with ids found above...
    const text =
      `SELECT l.record_type_id,
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
                JOIN confidence c ON l.confidence_id = c._id ` + filter;
    // get the results from the DB
    db.query(text)
      .then((result) => {
        if (!("rows" in result) || result.rows.length === 0) {
          return next({
            log: "Error caught in getRecordType, query empty",
            message: {
              err: "An error occurred in linkRecordController.getRecordType",
            },
          });
        }
        console.log(result.rows);
        res.locals.searchResults = result.rows;
        return next();
      })
      .catch((err) => {
        return next({ log: "Error caught in getRecordType", message: { err } });
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
          record_name,
          url,
          description,
        };
        option body params: when provided forgo creating a record_type
        "record_type_id", 
  output: Create entry in database:
  */
  addLinkRecord: async (req, res, next) => {
    console.log("get addLink...", req.body);
    const keys = ["record_type", "record_name", "url", "description"];
    for (const key of keys) {
      if (!([key] in req.body)) {
        return next({
          log: `Error caught in addLinkRecord, ${key} doesn't exist in request body!`,
          message: {
            err: "An error occurred in linkRecordController.addLinkRecord",
          },
        });
      }
    }
    const insertConfRecord = `INSERT INTO confidence (upvote, downvote)
                  VALUES (0, 0) RETURNING *`;
    // put into confidence_id = rows[0].id
    let confidence_id;
    const insertURI = `INSERT INTO uri (url, description)
    VALUES ($1, $2) RETURNING *`;
    // put into uri_id = rows[0].id
    let uri_id;
    const promiseArray = [
      db.query(insertConfRecord),
      db.query(insertURI, [req.body.url, req.body.description]),
    ];
    // if record type id is given do not insert into table...
    let { record_type_id } = req.body;
    if (!record_type_id) {
      switch (req.body.record_type) {
        case "state_name":
        case "country_name":
        case "company_name":
          break;
        default:
          return next({
            log: `Error caught in addLinkRecord, record_type = ${req.body.record_type} is invalid!`,
            message: {
              err: "An error occurred in linkRecordController.addLinkRecord",
            },
          });
      }
      const insertRecordType = `INSERT INTO record_type (${req.body.record_type})
                  VALUES ($1) RETURNING *`;
      promiseArray.push(db.query(insertRecordType, [req.body.record_name]));
    }

    await Promise.all(promiseArray)
      .then((results) => {
        if (!results || results.length === 0) {
          return next({
            log: "Error in addLinkRecord - query response empty ()!",
            message: {
              err: "An error occurred in linkRecordController.addLinkRecord",
            },
          });
        }
        confidence_id = results[0].rows[0]._id;
        uri_id = results[1].rows[0]._id;
        if (!record_type_id) record_type_id = results[2].rows[0]._id;
      })
      .catch((error) =>
        next({
          log: "Error caught in addLinkRecord",
          message: { err: error },
        })
      );

    const insertLinkRecord = `INSERT INTO link_record (record_type_id, confidence_id, uri_id)
                  VALUES ($1, $2, $3);`;
    console.log([record_type_id, confidence_id, uri_id]);
    db.query(insertLinkRecord, [record_type_id, confidence_id, uri_id])
      .then((result) => {
        return next();
      })
      .catch((error) => {
        next({
          log: "Error caught in addLinkRecord",
          message: { err: error },
        });
      });
  },
};

module.exports = linkRecordController;
