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

import React from 'react';
import QueryResult from './QueryResult';
import { useSelector } from 'react-redux';
import RECORD_TYPES from '../enums';

/*
link object:
[
    {
        "record_type_id": "1",
        "_id": [
            1,
            4
        ],
        "confidence_id": [
            "1",
            "3"
        ],
        "uri_id": [
            "1",
            "3"
        ],
        "url": [
            "https://www.njcourts.gov/self-help/name-change",
            "https://fake.url"
        ],
        "description": [
            "Name change process for the state of New Jersey",
            "Phonie Link For testing"
        ],
        "company_name": [
            null,
            null
        ],
        "country_name": [
            null,
            null
        ],
        "state_name": [
            "New Jersey",
            "New Jersey"
        ],
        "upvote": [
            "100",
            "0"
        ],
        "downvote": [
            "20",
            "0"
        ]
    },
]
*/
import type { LinkStore } from '../slices';

const QueryResultDisplay = (props: {}) => {
  const recordList = useSelector((state: LinkStore) => state.links.recordList);
  const displaySelector = useSelector(
    (state: LinkStore) => state.links.displaySelector
  );
  const links: JSX.Element[] = [];
  const calculateHealth = (up: number, down: number) => {
    const result = Math.round(100 * eval(`${up} / (${down} + ${up})`));
    if (isNaN(result)) return 0;
    return result;
  };
  for (const key in recordList) {
    const link = recordList[key];
    links.push(
      <QueryResult
        key={link._id}
        id={link._id}
        urlID={link.uri_id}
        _ID={link._id}
        confID={link.confidence_id}
        recordName={
          link.company_name[0] !== null
            ? link.company_name[0]
            : link.state_name[0] !== null
            ? link.state_name[0]
            : link.country_name[0]
        }
        recordType={
          link.state_name[0] !== null
            ? RECORD_TYPES.state_name
            : link.country_name[0] !== null
            ? RECORD_TYPES.country_name
            : RECORD_TYPES.company_name
        }
        linkList={link.url}
        description={link.description}
        recordTypeID={link.record_type_id}
        upVotes={link.upvote}
        downVotes={link.downvote}
        health={[calculateHealth(link.upvote, link.downvote)]}
      />
    );
  }

  /*
  recordID: lastrecordID, // Record ID: unique number
  searchString: state.newsearchString,
  numberOfLinks: 0,    // assume 0 
  */
  return (
    <div>
      <h4 className='title-heading'>Links</h4>

      <div className='displayBox'>{displaySelector === '' ? null : links}</div>
    </div>
  );
};

export default QueryResultDisplay;
