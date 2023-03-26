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
import { useSelector, useDispatch } from "react-redux";
import { setModal } from "../slices";

// import from child components...
import SummaryDisplay from "../components/SummaryDisplay.js";
import QueryContainer from "./QueryContainer.jsx";
import EntryContainer from "./EntryContainer.js";
import ModalContainer from "./ModalContainer.jsx";
import type { LinkStore } from "../slices";

function MainContainer(props) {
  const triggerText: string = "Open form";
  // const onSubmit = (event) => {
  //   event.preventDefault(event);
  //   // console.log(event.target.name.value);
  //   // console.log(event.target.url - link.value);
  // };
  const isShown = useSelector((state: LinkStore) => state.links.showModal);
  const dispatch = useDispatch();
  const setModalState = (e: boolean) => dispatch(setModal(e));
  return (
    <div className="container">
      <div className="outerBox">
        <h1 id="header">Name Change Resource Database</h1>
        <SummaryDisplay />
        <QueryContainer />
        <EntryContainer />
        <ModalContainer
          isShown={isShown}
          triggerText={triggerText}
          setModal={setModalState}
        />
      </div>
    </div>
  );
}

export default MainContainer;
