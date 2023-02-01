/**
 * ************************************
 *
 * @module EntryContainer
 * @author
 * @date
 * @description stateful component that renders EntryCreator and EntryDisplay
 *
 * ************************************
 */

import React from "react";
// import actions from action creators file
import EntryCreator from "../components/EntryCreator.jsx";
import EntryDisplay from "../components/EntryDisplay.jsx";

const EntryContainer = (props) => (
  <div className="innerbox">
    <EntryCreator />
    <EntryDisplay />
  </div>
);

export default EntryContainer;
