/**
 * ************************************
 *
 * @module  App.tsx
 * @author Zahara Aviv
 * @date
 * @description
 *
 * ************************************
 */
import { hot } from "react-hot-loader/root";
import React, { Component } from "react";
import MainContainer from "./containers/MainContainer.jsx";

/*
Heirarchy
|-- App
  |-- MainContainer
      |-- SummaryDisplay
      |-- QueryContainer
          |-- RecordQueryCreator 
          |—- QueryResultDisplay
              |—- QueryResult 
*/
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MainContainer />
      </div>
    );
  }
}

export default hot(App);
