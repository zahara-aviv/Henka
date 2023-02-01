/**
 * ************************************
 *
 * @module QueryResultDisplay
 * @author
 * @date
 * @description presentation component that renders n QueryResults
 *
 * ************************************
 */

import React from "react";
import QueryResult from "./QueryResult.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addLink, deleteLink } from "../slices";

const QueryResultDisplay = (props) => {
  const recordList = useSelector((state) => state.links.recordList);
  const dispatch = useDispatch();
  const links = [];

  recordList.forEach((link) => {
    links.push(
      <QueryResult
        key={link.recordID}
        id={link.recordID}
        recordID={link.recordID}
        searchString={link.searchString}
        numberOfLinks={link.numberOfLinks}
        addLink={(e) => dispatch(addLink(e.target.id))}
        deleteLink={(e) => dispatch(deleteLink(e.target.id))}
      />
    );
  });

  /*
  recordID: lastrecordID, // Market ID: unique number
  searchString: state.newsearchString,
  numberOfLinks: 0,    // assume 0 
  */
  return (
    <div className="displayBox">
      <h4>Links</h4>
      {links}
    </div>
  );
};

export default QueryResultDisplay;
