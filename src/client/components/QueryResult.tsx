/**
 * ************************************
 *
 * @module QueryResult
 * @author
 * @date
 * @description presentation component that renders a single box for each query result
 *
 * ************************************
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faUpVote } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown as faDownVote } from "@fortawesome/free-regular-svg-icons";
import {
  setDeletedLink,
  setModal,
  setButtonState,
  setCurrentContext,
  setCandidateRecordType,
  setCandidateRecordName,
  setCandidateRecordURL,
  setFormDisplaySelector,
  updateRecordList,
  clearDeletedLinks,
} from "../slices";
import type { LinkStore } from "../slices";

type QueryResultProps = {
  id: number;
  urlID: number;
  _ID: number;
  confID: number;
  recordName: string;
  recordType: string;
  linkList: string;
  description: string;
  recordTypeID: number;
  upVotes: number;
  downVotes: number;
  health: number[];
};

const QueryResult = (props: QueryResultProps) => {
  const getColor = (health: number) => {
    if (health > 90) return "green";
    if (health > 75) return "yellow";
    if (health > 50) return "orange";
    return "red";
  };
  const dispatch = useDispatch();
  const deleteLinkList = useSelector(
    (state: LinkStore) => state.links.deleteLinkList
  );
  const updateLinkList = useSelector(
    (state: LinkStore) => state.links.updateLinkList
  );
  const buttonStates = useSelector(
    (state: LinkStore) => state.links.buttonStates
  );
  // keep track of button clicks

  const handleDeleteLink = async () => {
    // console.log(deleteLinkList);
    for (const id in deleteLinkList) {
      if (deleteLinkList[id] === true) {
        await fetch("/api/id/" + id, { method: "DELETE" }).catch((err) => {
          console.log(err);
        });
      }
    }
    for (const id in updateLinkList) {
      let update = false;
      // only update if set to true
      if (!updateLinkList[id]) continue;

      await fetch("/api/id/" + id, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          dispatch(updateRecordList(data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    dispatch(clearDeletedLinks({}));
  };

  const handleAddLink = () => {
    dispatch(
      setCurrentContext({
        record_type: props.recordType,
        record_name: props.recordName,
        record_type_id: props.recordTypeID,
      })
    );
    dispatch(setCandidateRecordType(props.recordType));
    dispatch(setCandidateRecordName(props.recordName));
    dispatch(setCandidateRecordURL(""));
    dispatch(setFormDisplaySelector("None"));
    dispatch(setModal(true));
  };

  const updateUpVote = async (increase, idx) => {
    const path = "/api/vote/";
    let upvote = Number(props.upVotes[idx]);
    let downvote = Number(props.downVotes[idx]);
    if (increase) upvote++;
    else upvote--;

    await fetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: Number(props.confID[idx]),
        upvote,
        downvote,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch(updateRecordList(data));
      })
      .catch((err) => console.log(err));
  };

  const updateDownVote = async (increase, idx) => {
    const path = "/api/vote/";
    let upvote = Number(props.upVotes[idx]);
    let downvote = Number(props.downVotes[idx]);
    if (increase) downvote++;
    else downvote--;

    await fetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: Number(props.confID[idx]),
        upvote,
        downvote,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch(updateRecordList(data));
      })
      .catch((err) => console.log(err));
  };

  const setUpVote = async (e, idx) => {
    const _id = props._ID;
    let update = false;
    let up = false;
    let down = false;
    if (buttonStates[_id] === undefined) {
      //first time...
      up = true;
      down = false;
      dispatch(setButtonState({ _id, state: { up, down } }));
      update = true;
    } else if (!buttonStates[_id].down) {
      up = !buttonStates[_id].up;
      down = buttonStates[_id].down;
      dispatch(
        setButtonState({
          _id,
          state: {
            up,
            down,
          },
        })
      );
      update = true;
    }
    if (update) {
      // e.currentTarget.classList.toggle("on");
      //update the database...
      await updateUpVote(up, idx);
    }
  };

  const setDownVote = async (e, idx) => {
    const _id = props._ID[idx];
    let update = false;
    let up = false;
    let down = false;
    if (buttonStates[_id] === undefined) {
      //first time...
      up = false;
      down = true;
      dispatch(setButtonState({ _id, state: { up, down } }));
      update = true;
    } else if (!buttonStates[_id].up) {
      down = !buttonStates[_id].down;
      up = buttonStates[_id].up;
      dispatch(
        setButtonState({
          _id,
          state: {
            up,
            down,
          },
        })
      );
      update = true;
    }
    if (update) {
      // e.currentTarget.classList.toggle("on");
      //update the database...
      await updateDownVote(down, idx);
    }
  };

  const elem = props.linkList;
  const idx = 0;
  const _id = props._ID[idx];
  // const links = props.linkList.map((elem, idx) => {
  //   const _id = props._ID[idx];
  //   return (
  const links = (
    <div className="link-box" key={elem + idx}>
      <input
        type="checkbox"
        id="delete"
        onClick={() =>
          dispatch(setDeletedLink({ _id, record_type_id: props.recordTypeID }))
        }
        name={"delete" + idx}
        value=""
        key={"radio" + idx}
      />

      <a
        href={elem}
        className="link-text"
        title={props.description}
        key={"Link" + idx}
      >
        {`Link ${idx + 1}`}
      </a>
      <svg className="icon">
        <circle
          cx={5}
          cy={5}
          r={5}
          fill={getColor(props.health[idx])}
          key={"icon" + idx}
        />
      </svg>
      <>{props.health[idx] + "%"}</>
      <span
        className={
          buttonStates[_id] && buttonStates[_id].up ? "up-vote on" : "up-vote"
        }
        onClick={(e) => setUpVote(e, idx)}
      >
        <FAIcon icon={faUpVote} fill="currentColor" />
      </span>
      <span
        className={
          buttonStates[_id] && buttonStates[_id].down
            ? "down-vote on"
            : "down-vote"
        }
        onClick={(e) => setDownVote(e, idx)}
      >
        <FAIcon icon={faDownVote} fill="currentColor" />
      </span>
    </div>
  );

  return (
    <div className="LinkRecordBox">
      <p>
        <strong>{props.recordType}: </strong>
        {props.recordName}
      </p>
      <p>
        <strong>Links: </strong>
        {links}
      </p>
      <div className="BtnOptions">
        <button
          className="primaryButton"
          key={1}
          id={String(props.id)}
          onClick={handleAddLink}
        >
          Add Link
        </button>
      </div>
      <div className="BtnOptions">
        <button
          className="secondaryButton"
          key={2}
          id={String(props.id)}
          onClick={handleDeleteLink}
        >
          Delete Link
        </button>
      </div>
    </div>
  );
};

export default QueryResult;
