import { GET_EMPRESA } from '../actions/types';
const initialState = { empresa: {} };

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EMPRESA:
      return { ...state, empresa: action.payload };

    default:
      return state;
  }
}
