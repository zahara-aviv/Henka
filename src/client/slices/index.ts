import { createSlice } from "@reduxjs/toolkit";
import RECORD_TYPES from "../enums";
import { STATE_NAMES } from "../enums";

export type LinkState = {
  totalRecords: number;
  recordType: string;
  showModal: boolean;
  displaySelector: string;
  formDisplaySelector: string;
  totalLinks: number;
  recordList: RecordList;
  deleteLinkList: LinkList;
  updateLinkList: LinkList;
  candidateRecordName: string;
  candidateRecordType: string;
  candidateRecordURL: string;
  candidateDescription: string;
  // candidateRecordList: [];
  currentContext: CurrentContext | {};
  lastRecordId: number;
  searchString: string;
  buttonStates: ButtonState | {};
};

export type CurrentContext = {
  record_type: string;
  record_name: string;
  record_type_id: number;
};

export type LinkList = {
  [x: number]: boolean;
};

export type ButtonState = {
  [x: number]: { state: { up: boolean; down: boolean } };
};

export type RecordList = {
  [x: number]: LinkRecord;
};

export type LinkRecord = {
  _id: number;
  record_type_id: number;
  confidence_id: number;
  uri_id: number;
  url: string;
  description: string;
  company_name: string;
  country_name: string;
  state_name: string;
  upvote: number;
  downvote: number;
};

const initialState: LinkState = {
  //convert to an immutable type
  totalRecords: 0,
  recordType: "",
  showModal: false,
  displaySelector: "",
  formDisplaySelector: "",
  totalLinks: 0,
  recordList: {},
  deleteLinkList: {},
  updateLinkList: {},
  candidateRecordName: "",
  candidateRecordType: "",
  candidateRecordURL: "",
  candidateDescription: "",
  // candidateRecordList: [],
  currentContext: {},
  lastRecordId: 0,
  searchString: "",
  buttonStates: {},
};

export type LinkStore = {
  links: LinkState;
};

const linkRecordSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setSearchString(state, action) {
      state.searchString = action.payload;
    },
    setRecordType(state, action) {
      state.recordType = action.payload;
    },
    setRecordList(state, action) {
      state.recordList = {};
      for (const rec of action.payload) {
        state.recordList[rec.record_type_id] = rec;
      }
      state.totalRecords = Object.keys(state.recordList).length;
    },
    // setCandidateRecordList(state, action) {
    //   state.candidateRecordList = action.payload;
    // },
    setDeletedLink(state, action) {
      if (state.deleteLinkList[action.payload._id])
        state.deleteLinkList[action.payload._id] =
          !state.deleteLinkList[action.payload._id];
      else state.deleteLinkList[action.payload._id] = true;

      if (state.deleteLinkList[action.payload._id] !== undefined) {
        state.updateLinkList = Object.assign({}, state.updateLinkList, {
          [action.payload._id]: true,
        });
      } else {
        state.updateLinkList = Object.assign({}, state.updateLinkList, {
          [action.payload._id]: false,
        });
      }
    },
    clearDeletedLinks(state, action) {
      state.deleteLinkList = {};
      state.updateLinkList = {};
    },
    setModal(state, action) {
      state.showModal = action.payload;
    },
    setButtonState(state, action) {
      const { _id } = action.payload;
      if (
        _id !== undefined &&
        typeof _id === "number" &&
        "state" in action.payload
      ) {
        const { up, down } = action.payload.state;
        if (
          up !== undefined &&
          down !== undefined &&
          typeof up === "boolean" &&
          typeof down === "boolean"
        )
          state.buttonStates = Object.assign({}, state.buttonStates, {
            [_id]: { state: { up, down } },
          });
      }
    },
    setCandidateRecordType(state, action) {
      state.candidateRecordType = action.payload;
    },
    setDisplaySelector(state, action) {
      state.displaySelector = action.payload;
    },
    setFormDisplaySelector(state, action) {
      state.formDisplaySelector = action.payload;
    },
    setCandidateRecordName(state, action) {
      state.candidateRecordName = action.payload;
    },
    setCurrentContext(state, action) {
      state.currentContext = action.payload;
    },
    setCandidateRecordURL(state, action) {
      state.candidateRecordURL = action.payload;
    },
    setCandidateRecordDescription(state, action) {
      state.candidateDescription = action.payload;
    },
    updateRecordList(state, action) {
      for (const rec of action.payload) {
        state.recordList[rec.record_type_id] = rec;
      }
      state.totalRecords = Object.keys(state.recordList).length;
    },
  },
});

export const {
  setSearchString,
  clearDeletedLinks,
  setRecordType,
  setRecordList,
  setCandidateRecordName,
  // setCandidateRecordList,
  setCandidateRecordType,
  setDeletedLink,
  setModal,
  setButtonState,
  setDisplaySelector,
  setFormDisplaySelector,
  setCurrentContext,
  setCandidateRecordURL,
  setCandidateRecordDescription,
  updateRecordList,
} = linkRecordSlice.actions;

export default linkRecordSlice.reducer;
