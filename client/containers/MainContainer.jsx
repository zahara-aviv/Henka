/**
 * ************************************
 *
 * @module  MainContainer
 * @author
 * @date
 * @description stateful component that renders Summary & Query Container
 *
 * ************************************
 */

import React, { Component } from "react";
import { connect } from "react-redux";
// import from child components...
import SummaryDisplay from "../components/SummaryDisplay.jsx";
import QueryContainer from "./QueryContainer.jsx";
import EntryContainer from "./EntryContainer.jsx";

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="outerBox">
          <h1 id="header">Name Change Resource Database</h1>
          <SummaryDisplay />
          <QueryContainer />
          <EntryContainer />
        </div>
      </div>
    );
  }
}

export default MainContainer;
