import React, { ChangeEvent, ChangeEventHandler, FormEvent } from "react";
import isUrl from "is-url";
import { useDispatch, useSelector } from "react-redux";
import {
  setCandidateRecordType,
  setFormDisplaySelector,
  setCandidateRecordName,
  setCandidateRecordURL,
  setCandidateRecordDescription,
  updateRecordList,
  setModal,
} from "../slices";
import { VALID_RECORD_TYPES, STATE_NAMES, COUNTRY_NAMES } from "../enums";
import { getKeyByValue } from "../utils";
import type { LinkStore, CurrentContext } from "../slices";

export const Form = (props: {}) => {
  const dispatch = useDispatch();
  const recordType = useSelector(
    (state: LinkStore) => state.links.candidateRecordType
  );
  const recordName = useSelector(
    (state: LinkStore) => state.links.candidateRecordName
  );
  const recordDescription = useSelector(
    (state: LinkStore) => state.links.candidateDescription
  );
  const recordURL = useSelector(
    (state: LinkStore) => state.links.candidateRecordURL
  );
  const formDisplaySelector = useSelector(
    (state: LinkStore) => state.links.formDisplaySelector
  );
  const currentContext = useSelector(
    (state: LinkStore) => state.links.currentContext
  );

  const candidateRecordName = useSelector(
    (state: LinkStore) => state.links.candidateRecordName
  );
  const recordTypeOptions = [
    <option id="default" value="" key="default"></option>,
  ].concat(
    Object.values(VALID_RECORD_TYPES).map((elem, idx) => (
      <option id={elem} value={elem} key={idx}>
        {elem}
      </option>
    ))
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

  const handleRecTypeSelect: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordType(e.target.value));
    dispatch(setCandidateRecordName(""));
    dispatch(setFormDisplaySelector(e.target.value));
  };
  const handleStateSelect: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const handleCountrySelect: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const updateRecordName: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordName(e.target.value));
  };
  const updateURL: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordURL(e.target.value));
  };
  const updateDescription: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setCandidateRecordDescription(e.target.value));
  };
  type RecordBody = {
    record_name: string;
    record_type?: string;
    url: string;
    description: string;
    record_type_id?: number;
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // post results to database
    const body: RecordBody = {
      record_name: recordName,
      record_type: getKeyByValue(VALID_RECORD_TYPES, recordType),
      url: recordURL,
      description: recordDescription,
    };
    if (currentContext !== undefined)
      body["record_type_id"] = currentContext.record_type_id;
    await fetch("/api/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch(updateRecordList(data));
      })
      .catch((err) => console.log(err));
    // update records
    dispatch(setModal(false));
  };
  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        onSubmit;
      }}
    >
      <div className="form-group">
        <label htmlFor="record-type">Record Type: </label>
        {currentContext !== undefined ? (
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
        {formDisplaySelector === VALID_RECORD_TYPES["state_name"] ? (
          <select id="stateNameSelect" onChange={handleStateSelect}>
            {stateNameOptions}
          </select>
        ) : formDisplaySelector === VALID_RECORD_TYPES["country_name"] ? (
          <select id="countryNameSelect" onChange={handleCountrySelect}>
            {countryNameOptions}
          </select>
        ) : null}
        {recordType === "" ? (
          <strong className="warning-text">(Select a Record Type)</strong>
        ) : recordName === "" &&
          formDisplaySelector !== VALID_RECORD_TYPES["company_name"] ? (
          <strong className="warning-text">(Select a Record Name)</strong>
        ) : null}
      </div>
      {formDisplaySelector === VALID_RECORD_TYPES["company_name"] ? (
        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <input
            className="form-control"
            id="name"
            onChange={updateRecordName}
          />
          {recordName !== "" ? null : (
            <strong className="warning-text">(Enter a Company Name)</strong>
          )}
        </div>
      ) : null}
      <div className="form-group">
        <label htmlFor="url-link">URL Link: </label>
        <input
          type="url-link"
          className="form-control"
          id="url-link"
          placeholder="https://"
          onChange={updateURL}
        />
        {isUrl(recordURL) ? null : (
          <strong className="warning-text">(Enter a valid URL)</strong>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="description">Description: </label>
        <input
          type="description"
          className="form-control"
          id="description"
          placeholder="Enter in a brief description..."
          onChange={updateDescription}
        />
      </div>
      <div className="BtnOptions">
        <button
          className="primaryButton"
          disabled={
            recordName === "" || recordType === "" || recordURL === ""
              ? true
              : false
          }
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
