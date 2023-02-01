/**
 * ************************************
 *
 * @module QueryResultCreator
 * @author zahara aviv
 * @date 2023-01-29
 * @description presentation component that takes user search text and creates query result objects
 *
 * ************************************
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { findRecord, setSearchString } from "../slices";

const QueryResultCreator = function (props) {
  const dispatch = useDispatch();
  const searchString = useSelector((state) => state.links.searchString);

  const handleFindRecord = (e) => {
    e.preventDefault();
    dispatch(findRecord());
  };

  const handleSetSearchString = (e) => {
    dispatch(setSearchString(e.target.value));
  };

  return (
    <div>
      <p>
        <strong>Search Database: </strong>
      </p>
      <form>
        <label>
          <input
            id="search-text"
            type="text"
            value={searchString}
            name="input-search-text"
            onChange={handleSetSearchString}
          ></input>
        </label>
        <button name="button-searchString" onClick={handleFindRecord}>
          Find Record
        </button>
      </form>
      <hr></hr>
    </div>
    // -------------------------------
  );
};

export default QueryResultCreator;
