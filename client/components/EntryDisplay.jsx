/**
 * ************************************
 *
 * @module  EntryDisplay
 * @author
 * @date
 * @description presentation component that renders entries for insertion into DB
 *
 * ************************************
 */

import React from "react";
import Entry from "./Entry.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addLink, deleteLink } from "../slices";

const EntryDisplay = (props) => {
  const recordList = useSelector((state) => state.links.recordList);
  const dispatch = useDispatch();
  const links = [];

  recordList.forEach((link) => {
    links.push(
      <Entry
        key={link.recordID}
        id={link.recordID}
        recordID={link.recordID}
        searchString={link.searchString}
        numberOfLinks={link.numberOfLinks}
        percentageOfTotal={link.percentageOfTotal}
        addLink={(e) => dispatch(addLink(e.target.id))}
        deleteLink={(e) => dispatch(deleteLink(e.target.id))}
      />
    );
  });

  return (
    <div className="displayBox">
      <h4>Links</h4>
      {links}
    </div>
  );
};

export default EntryDisplay;
