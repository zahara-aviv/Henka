/**
 * ************************************
 *
 * @module QueryResult
 * @author
 * @date
 * @description presentation component that renders a single box for each query result
 *
 * ************************************
 */

import React from "react";

const QueryResult = (props) => (
  <div className="LinkRecordBox">
    <p>
      <strong>Link Record ID: </strong>
      {props.recordID}
    </p>
    <p>
      <strong>Search: </strong>
      {props.searchString}
    </p>
    <p>
      <strong>Links: </strong>
      {props.numberOfLinks}
    </p>
    <button id={props.recordID} onClick={props.addLink}>
      Add Link
    </button>
    <button id={props.recordID} onClick={props.deleteLink}>
      Delete Link
    </button>
  </div>
);

export default QueryResult;
