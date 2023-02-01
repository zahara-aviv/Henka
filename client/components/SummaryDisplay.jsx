/**
 * ************************************
 *
 * @module  SummaryDisplay
 * @author
 * @date
 * @description presentation component that displays summary of database stats
 *
 * ************************************
 */

import React from "react";
import { useSelector } from "react-redux";

const SummaryDisplay = (props) => {
  const totalRecords = useSelector((state) => state.links.totalRecords);

  return (
    <div className="innerbox" id="totals">
      <label htmlFor="totalRecords">
        <strong>Total Records: </strong>
      </label>
      <span id="totalRecords">{totalRecords}</span>
    </div>
  );
};

export default SummaryDisplay;
