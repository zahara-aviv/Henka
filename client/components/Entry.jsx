/**
 * ************************************
 *
 * @module Entry
 * @author
 * @date
 * @description presentation component that renders a single box for each query result
 *
 * ************************************
 */

import React from "react";

const Entry = (props) => (
  <div className="LinkRecordBox">
    <p>
      <strong>Record ID: </strong>
      {props.recordID}
    </p>
    <p>
      <strong>searchString: </strong>
      {props.searchString}
    </p>
    <p>
      <strong>Number Of Links: </strong>
      {props.numberOfLinks}
    </p>
    <button id={props.recordID} onClick={props.addLink}>
      Update
    </button>
    <button id={props.recordID} onClick={props.deleteLink}>
      Discard
    </button>
  </div>
);

export default Entry;
