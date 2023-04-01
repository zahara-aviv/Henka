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

import React, { ChangeEvent, ChangeEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  // findRecord,
  setRecordType,
  setSearchString,
  setRecordList,
  setDisplaySelector,
  setFormDisplaySelector,
} from '../slices';
import RECORD_TYPES from '../enums';
import getRecords from '../utils';
import { searchRecords } from '../utils';
import type { LinkStore } from '../slices';

const QueryResultCreator = function (props: {}) {
  const dispatch = useDispatch();
  const searchString = useSelector(
    (state: LinkStore) => state.links.searchString
  );

  const handleFilter: ChangeEventHandler = async (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setRecordType(e.target.value));
    const results = await getRecords(e.target.value);
    dispatch(setRecordList(results));
    dispatch(setDisplaySelector(e.target.value));
    dispatch(setFormDisplaySelector(e.target.value));
  };

  const handleFindRecordName = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // call database for string e.target.value
    const results = await searchRecords('record_type', searchString);
    dispatch(setRecordList(results));
    dispatch(setDisplaySelector('Search'));
  };

  const handleFindURL = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // call database for string e.target.value
    const results = await searchRecords('uri', searchString);
    dispatch(setRecordList(results));
    dispatch(setDisplaySelector('Search'));
  };

  const handleSetSearchString: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setSearchString(e.target.value));
  };

  const options = [
    <option id='default' value='' key='default'></option>,
  ].concat(
    Object.values(RECORD_TYPES).map((elem, idx) => (
      <option id={elem + idx} value={elem} key={idx}>
        {elem}
      </option>
    ))
  );
  return (
    <div>
      <p className='title-heading'>
        <strong>Search Database </strong>
      </p>
      <div className='title-heading'>
        <label>Type Filter: </label>
        <select id='recordTypeFilter' onChange={handleFilter}>
          {options}
        </select>
      </div>
      <form>
        <label className='SearchBtnOptions'>
          <input
            id='search-text'
            type='text'
            value={searchString}
            name='input-search-text'
            onChange={handleSetSearchString}
          ></input>
        </label>
        <div className='SearchBtnOptions'>
          <button
            className='primaryButton'
            name='button-searchString'
            onClick={(e) => {
              handleFindRecordName(e);
            }}
          >
            Search By Record Name
          </button>
          <button
            className='primaryButton'
            name='button-searchString'
            onClick={(e): void => {
              handleFindURL(e);
            }}
          >
            Search By URL / Description
          </button>
        </div>
      </form>
      <hr></hr>
    </div>
    // -------------------------------
  );
};

export default QueryResultCreator;
