import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCandidateRecordType,
  setDisplaySelector,
  setCandidateRecordName,
  setCandidateRecordURL,
  setCandidateRecordDescription,
} from "../slices";
import { VALID_RECORD_TYPES, STATE_NAMES, COUNTRY_NAMES } from "../enums";

export const Form = (props) => {
  const dispatch = useDispatch();
  const recordType = useSelector((state) => state.links.candidateRecordType);
  const recordName = useSelector((state) => state.links.candidateRecordName);
  const recordDescription = useSelector(
    (state) => state.links.candidateDescription
  );
  const recordURL = useSelector((state) => state.links.candidateRecordURL);
  const displaySelector = useSelector((state) => state.links.displaySelector);
  const currentContext = useSelector((state) => state.links.currentContext);

  const candidateRecordName = useSelector(
    (state) => state.links.candidateRecordName
  );
  const recordTypeOptions = Object.values(VALID_RECORD_TYPES).map(
    (elem, idx) => (
      <option id={elem} value={elem} key={idx}>
        {elem}
      </option>
    )
  );
  const stateNameOptions = [
    <option id="default" value="" key="default"></option>,
  ].concat(
    STATE_NAMES.map((elem, idx) => {
      return (
        <option id={elem} value={elem} key={elem}>
          {elem}
        </option>
      );
    })
  );
  const countryNameOptions = [
    <option id="default" value="" key="default"></option>,
  ].concat(
    COUNTRY_NAMES.map((elem, idx) => (
      <option id={elem} value={elem} key={idx}>
        {elem}
      </option>
    ))
  );

  const handleRecTypeSelect = (e) => {
    dispatch(setCandidateRecordType(e.target.value));
    dispatch(setCandidateRecordName(""));
    dispatch(setDisplaySelector(e.target.value));
  };
  const handleStateSelect = (e) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const handleCountrySelect = (e) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const updateRecordName = (e) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const updateURL = (e) => {
    dispatch(setCandidateRecordURL(e.target.value));
  };
  const updateDescription = (e) => {
    dispatch(setCandidateRecordDescription(e.target.value));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if ("record_type" in currentContext && "record_name" in currentContext) {
      const { record_type_id, record_type, record_name } = currentContext;
      const body = JSON.stringify({
        record_type_id,
        record_name,
        record_type,
        url: recordURL,
        description: recordDescription,
      });
      fetch("/");

      // add record for link
      // add confidence record
      // add link record
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="record-type">Record Type</label>
        {"record_type" in currentContext && "record_name" in currentContext ? (
          <>
            <select id="recordType">
              <option id={recordType} value={recordType} key={recordType}>
                {recordType}
              </option>
            </select>
            <select id="recordName">
              <option id={recordName} value={recordName} key={recordName}>
                {recordName}
              </option>
            </select>
          </>
        ) : (
          <select id="recordTypeSelect" onChange={handleRecTypeSelect}>
            {recordTypeOptions}
          </select>
        )}
        {displaySelector === VALID_RECORD_TYPES["state_name"] ? (
          <select id="stateNameSelect" onChange={handleStateSelect}>
            {stateNameOptions}
          </select>
        ) : displaySelector === VALID_RECORD_TYPES["country_name"] ? (
          <select id="countryNameSelect" onChange={handleCountrySelect}>
            {countryNameOptions}
          </select>
        ) : null}
      </div>
      {displaySelector === VALID_RECORD_TYPES["company_name"] ? (
        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <input
            className="form-control"
            id="name"
            onChange={updateRecordName}
          />
        </div>
      ) : null}
      <div className="form-group">
        <label htmlFor="url-link">url-link</label>
        <input
          type="url-link"
          className="form-control"
          id="url-link"
          placeholder="https://"
          onChange={updateURL}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">description</label>
        <input
          type="description"
          className="form-control"
          id="description"
          placeholder="Enter in a brief description..."
          onChange={updateDescription}
        />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
