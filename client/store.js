/**
 * ************************************
 *
 * @module  store.js
 * @author
 * @date
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { configureStore } from "@reduxjs/toolkit";
import linkRecordReducer from "./slices";

const store = configureStore({
  reducer: {
    links: linkRecordReducer,
  },
});

export default store;
