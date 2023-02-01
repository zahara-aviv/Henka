/**
 * ************************************
 *
 * @module EntryCreator
 * @author zahara aviv
 * @date 2023-01-29
 * @description presentation component that allows the user to create a DB entry
 *
 * ************************************
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { findRecord, setSearchString } from "../slices";

const EntryCreator = function (props) {
  const dispatch = useDispatch();
  const searchString = useSelector((state) => state.links.searchString);

  const handleFindRecord = (e) => {
    e.preventDefault();
    dispatch(findRecord());
  };

  const handleSetSearchString = (e) => {
    dispatch(setSearchString(e.target.value));
  };

  const record_types = [
    <option value="State" key="state1">
      State
    </option>,
    <option value="Company" key="company1">
      Company
    </option>,
  ];
  return (
    <div>
      <p>
        <strong>Create Database Entry: </strong>
      </p>
      <form>
        <label htmlFor="record_type">
          {record_types}
          <input
            id="search-text"
            type="text"
            value={searchString}
            name="input-search-text"
            onChange={handleSetSearchString}
          ></input>
        </label>
        <button name="button-searchString" onClick={handleFindRecord}>
          Submit
        </button>
      </form>
      <hr></hr>
    </div>
    // -------------------------------
  );
};

export default EntryCreator;
