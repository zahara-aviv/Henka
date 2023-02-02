import { createSlice } from "@reduxjs/toolkit";
import RECORD_TYPES from "../enums";
import { STATE_NAMES } from "../enums";

const initialState = {
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
  candidateRecordList: [],
  currentContext: {},
  lastRecordId: 0,
  searchString: "",
  buttonStates: {},
};

const linkRecordSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setSearchString(state, action) {
      state.searchString = action.payload;
    },
    addLink(state, action) {
      const index = action.payload;
      state.totalLinks++;
    },
    deleteLink(state, action) {
      // update the recordList
      const index = action.payload;
      if (state.recordList[index].numberOfLinks > 0) --state.totalLinks;
    },
    setRecordType(state, action) {
      state.recordType = action.payload;
    },
    setRecordList(state, action) {
      state.recordList = {};
      for (const rec of action.payload) {
        state.recordList[rec.record_type_id] = rec;
      }
      state.totalRecords = state.recordList.length;
    },
    setCandidateRecordList(state, action) {
      state.candidateRecordList = action.payload;
    },
    setDeletedLink(state, action) {
      if (state.deleteLinkList[action.payload._id])
        state.deleteLinkList[action.payload._id] =
          !state.deleteLinkList[action.payload._id];
      else state.deleteLinkList[action.payload._id] = true;

      if (state.deleteLinkList[action.payload._id]) {
        if (
          state.updateLinkList &&
          state.updateLinkList[action.payload.record_type_id]
        )
          state.updateLinkList[action.payload.record_type_id] = {
            ...state.updateLinkList[action.payload.record_type_id],
            [action.payload._id]: true,
          };
        else
          state.updateLinkList[action.payload.record_type_id] = {
            [action.payload._id]: true,
          };
      } else {
        state.updateLinkList[action.payload.record_type_id] = {
          ...state.updateLinkList[action.payload.record_type_id],
          [action.payload._id]: false,
        };
      }
    },
    clearDeletedLinks(state, action) {
      state.deleteLink = {};
      state.updateLinkList = {};
    },
    setModal(state, action) {
      state.showModal = action.payload;
    },
    setButtonState(state, action) {
      state.buttonStates[action.payload._id] = action.payload.state;
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
    },
  },
});

export const {
  setSearchString,
  addLink,
  deleteLink,
  clearDeletedLinks,
  setRecordType,
  setRecordList,
  setCandidateRecordName,
  setCandidateRecordList,
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
