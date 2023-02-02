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

import React from "react";
import QueryResult from "./QueryResult.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addLink, deleteLink } from "../slices";
import RECORD_TYPES from "../enums";

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
const QueryResultDisplay = (props) => {
  const recordList = useSelector((state) => state.links.recordList);
  const dispatch = useDispatch();
  const links = [];
  const calculateHealth = (up, down) => {
    const result = Math.round(100 * eval(`${up} / (${down} + ${up})`));
    if (isNaN(result))
      return 0;
    return result;    
  }
  recordList.forEach((link) => {
    links.push(
      <QueryResult
        key={link._id}
        id={link._id}
        urlID={link.uri_id}
        _ID={link._id}
        confID={link.confidence_id}
        linkList={Array.isArray(link.url) ? link.url : [link.url]}
        description={link.description}
        recordType={
          link.state_name
            ? RECORD_TYPES.state_name
            : link.country_name
            ? RECORD_TYPES.country_name
            : RECORD_TYPES.company_name
        }
        recordName={
          link.state_name
            ? link.state_name
            : link.country_name
            ? link.country_name
            : link.company_name
        }
        upVotes={link.upvote}
        downVotes={link.downvote}
        health={
          Array.isArray(link.upvote)
            ? link.upvote.map((up, i) => calculateHealth(up, link.downvote[i]))
            : [calculateHealth(link.upvote, link.downvote)]
        }
        addLink={(e) => dispatch(addLink(e.target.id))}
        deleteLink={(e) => dispatch(deleteLink(e.target.id))}
      />
    );
  });

  /*
  recordID: lastrecordID, // Record ID: unique number
  searchString: state.newsearchString,
  numberOfLinks: 0,    // assume 0 
  */
  return (
    <div className="displayBox">
      <h4>Links</h4>
      {links}
    </div>
  );
};

export default QueryResultDisplay;
