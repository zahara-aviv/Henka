/**
 * ************************************
 *
 * @module EntryContainer
 * @author
 * @date
 * @description stateful component that renders EntryCreator
 *
 * ************************************
 */

import React from "react";
// import actions from action creators file
import EntryCreator from "../components/EntryCreator.jsx";

const EntryContainer = (props) => (
  <div className="innerbox">
    <EntryCreator />
  </div>
);

export default EntryContainer;
