/**
 * ************************************
 *
 * @module  QueryContainer
 * @author
 * @date
 * @description stateful component that renders QueryResult Creator and Display
 *
 * ************************************
 */

import React from 'react';
// import actions from action creators file
import QueryResultCreator from '../components/QueryResultCreator';
import QueryResultDisplay from '../components/QueryResultDisplay';

const QueryContainer = (props: {}) => (
  <div className='innerbox'>
    <QueryResultCreator />
    <QueryResultDisplay />
  </div>
);

export default QueryContainer;
