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
import SummaryDisplay from "../components/SummaryDisplay";
import QueryContainer from "./QueryContainer";
import EntryContainer from "./EntryContainer";
import ModalContainer from "./ModalContainer";
import type { LinkStore } from "../slices";
const LOGO = require("../../../public/Henka-Logo.svg").default;

function MainContainer(props: {}) {
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
        {/* <h1 id="header">Name Change Resource Database</h1> */}
        <div className="centered">
          <img className="logo" src={LOGO} />
        </div>
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
