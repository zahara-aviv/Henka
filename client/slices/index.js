import { createSlice } from "@reduxjs/toolkit";
//TODO: could remove since Immer allows mutation in the Slice

const initialState = {
  //convert to an immutable type
  totalRecords: 0,
  totalLinks: 0,
  recordList: [], //could refactor to an object
  lastRecordId: 0,
  searchString: "",
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
  },
});

export const { findRecord, addRecord, setSearchString, addLink, deleteLink } =
  linkRecordSlice.actions;

export default linkRecordSlice.reducer;
