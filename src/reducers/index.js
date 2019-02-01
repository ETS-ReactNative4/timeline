import { combineReducers } from 'redux';
import empresaReducer from './empresaReducer';

export default combineReducers({
  empresa: empresaReducer
});
