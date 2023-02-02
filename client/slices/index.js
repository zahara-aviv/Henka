import { createSlice } from "@reduxjs/toolkit";
import RECORD_TYPES from "../enums";

const initialState = {
  //convert to an immutable type
  totalRecords: 0,
  recordType: RECORD_TYPES["*"],
  showModal: false,
  totalLinks: 0,
  recordList: [], 
  deleteLinkList: {},
  candidaterecordList: [], 
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
    findRecord(state, action) {
      // query database
      // update page with matching records.
      state;
    },
    addRecord(state, action) {
      state.totalRecords++;
      state.lastRecordId++;
      state.recordList.push({
        recordID: state.lastRecordId,
        searchString: state.searchString,
        numberOfLinks: 0, // assume 0
      });
      state.searchString = "";
    },
    addLink(state, action) {
      const index = action.payload;
      state.totalLinks++;

      // state.recordList = state.recordList.map((el, i) => {
      //   if (index === i) el.numberOfLinks++;
      //   el.percentageOfTotal = (
      //     Math.round(10000 * (el.numberOfLinks / state.totalLinks)) / 100
      //   ).toFixed(2);

      //   return el;
      // });
    },
    deleteLink(state, action) {
      // update the recordList
      const index = action.payload;
      if (state.recordList[index].numberOfLinks > 0) --state.totalLinks;

      // state.recordList = state.recordList.map((elem, i) => {
      //   if (index === i && elem.numberOfLinks > 0) --elem.numberOfLinks;
      //   if (state.totalLinks > 0)
      //     elem.percentageOfTotal = (
      //       Math.round(10000 * (elem.numberOfLinks / state.totalLinks)) / 100
      //     ).toFixed(2);
      //   return elem;
      // });
    },
    setRecordType(state, action) {
      state.recordType = action.payload;
    },
    setRecordList(state, action) {
      state.recordList = action.payload;
      state.totalRecords = state.recordList.length;
    },
    setCandidateRecordList(state, action) {
      state.candidaterecordList =  action.payload;
    },
    setDeletedLink(state, action) {
      if (state.deleteLinkList[action.payload])
        state.deleteLinkList[action.payload] = !state.deleteLinkList[action.payload];
      else 
        state.deleteLinkList[action.payload] = true;
    },
    setModal(state, action) {
      state.showModal = action.payload;
    },
    setButtonState (state, action) {
      state.buttonStates[action.payload._id] = action.payload.state;
    }
  },
});

export const {
  findRecord,
  addRecord,
  setSearchString,
  addLink,
  deleteLink,
  setRecordType,
  setRecordList,
  setCandidateRecordList,
  setDeletedLink,
  setModal,
  setButtonState,
} = linkRecordSlice.actions;

export default linkRecordSlice.reducer;
