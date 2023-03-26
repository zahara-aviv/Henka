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
import {
  setCurrentContext,
  setModal,
  setCandidateRecordType,
  setCandidateRecordName,
  setFormDisplaySelector,
} from "../slices";
import type { LinkStore } from "../slices";

const EntryCreator = function (props) {
  const dispatch = useDispatch();
  const searchString = useSelector(
    (state: LinkStore) => state.links.searchString
  );

  const handleCreateRecord = (e) => {
    dispatch(setCurrentContext({}));
    dispatch(setCandidateRecordType(""));
    dispatch(setCandidateRecordName(""));
    dispatch(setFormDisplaySelector("None"));
    dispatch(setModal(true));
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
    <div className="BtnOptions">
      <button
        className="primaryButton"
        name="create-record"
        onClick={handleCreateRecord}
      >
        Create Link Entry
      </button>
    </div>
    // -------------------------------
  );
};

export default EntryCreator;
