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
import {
  findRecord,
  setRecordType,
  setSearchString,
  setRecordList,
} from "../slices";
import RECORD_TYPES from "../enums";
import getRecords from "../utils";

const QueryResultCreator = function (props) {
  const dispatch = useDispatch();
  const searchString = useSelector((state) => state.links.searchString);

  const handleFilter = async (e) => {
    dispatch(setRecordType(e.target.value));
    const results = await getRecords(e.target.value);
    dispatch(setRecordList(results));
  };

  const handleFindRecord = (e) => {
    e.preventDefault();
    dispatch(findRecord());
  };

  const handleSetSearchString = (e) => {
    dispatch(setSearchString(e.target.value));
  };

  const options = Object.values(RECORD_TYPES).map((elem, idx) => (
    <option id={elem + idx} value={elem} key={idx}>
      {elem}
    </option>
  ));
  return (
    <div>
      <p>
        <strong>Search Database: </strong>
      </p>
      <label>Record Type Filter: </label>
      <select id="recordTypeFilter" onChange={handleFilter}>
        {options}
      </select>
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