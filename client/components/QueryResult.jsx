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
  setRecordList,
  setModal,
  setButtonState,
  setCurrentContext,
  setCandidateRecordType,
  setCandidateRecordName,
  setDisplaySelector,
} from "../slices";
import getRecords from "../utils";

const QueryResult = (props) => {
  const getColor = (health) => {
    if (health > 90) return "green";
    if (health > 75) return "yellow";
    if (health > 50) return "orange";
    return "red";
  };
  const dispatch = useDispatch();
  const deleteLinkList = useSelector((state) => state.links.deleteLinkList);
  const recordType = useSelector((state) => state.links.recordType);
  const buttonStates = useSelector((state) => state.links.buttonStates);
  // keep track of button clicks

  const handleDeleteLink = async () => {
    console.log(deleteLinkList);
    for (const id in deleteLinkList) {
      if (deleteLinkList[id] === true) {
        try {
          await fetch("/api/id/" + id, { method: "DELETE" });
        } catch (err) {
          console.log(err);
        }
      }
    }
    const results = await getRecords(recordType);
    dispatch(setRecordList(results));
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
    dispatch(setDisplaySelector("None"));
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
    }).catch((err) => console.log(err));
    const results = await getRecords(recordType);
    dispatch(setRecordList(results));
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
    }).catch((err) => console.log(err));
    const results = await getRecords(recordType);
    dispatch(setRecordList(results));
  };

  const setUpVote = async (e, idx) => {
    const _id = props._ID[idx];
    let update = false;
    let up, down;
    if (!([_id] in buttonStates)) {
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
      e.currentTarget.classList.toggle("on");
      //update the database...
      await updateUpVote(up, idx);
    }
  };

  const setDownVote = async (e, idx) => {
    const _id = props._ID[idx];
    let update = false;
    let up, down;
    if (!([_id] in buttonStates)) {
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
      e.currentTarget.classList.toggle("on");
      //update the database...
      await updateDownVote(down, idx);
    }
  };

  // props._ID.forEach((_id) => {
  //   dispatch(setButtonState({_id, state: {up: false, down: false}}));
  // })

  const links = props.linkList.map((elem, idx) => {
    const _id = props._ID[idx];
    return (
      <link-box>
        <input
          type="checkbox"
          id="delete"
          onClick={() => dispatch(setDeletedLink(_id))}
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
        <span className="up-vote" onClick={(e) => setUpVote(e, idx)}>
          <FAIcon icon={faUpVote} fill="currentColor" />
        </span>
        <span className="down-vote" onClick={(e) => setDownVote(e, idx)}>
          <FAIcon icon={faDownVote} fill="currentColor" />
        </span>
      </link-box>
    );
  });

  return (
    <div className="LinkRecordBox">
      {/* <p>
        <strong>ID(s): </strong>
        {props.id.join(", ")}
      </p> */}
      <p>
        <strong>{props.recordType}: </strong>
        {props.recordName}
      </p>
      <p>
        <strong>Links: </strong>
        {links}
      </p>
      <button key={1} id={props.id} onClick={handleAddLink}>
        Add Link
      </button>
      <button key={2} id={props.id} onClick={handleDeleteLink}>
        Delete Link
      </button>
    </div>
  );
};

export default QueryResult;
