import * as types from "../../constants/actionTypes";

const SearchReducer = (
  state = {
    storedSearchInput: ""
  },
  action
) => {
  switch (action.type) {
    case types.STORE_SEARCH_INPUT:
      return {
        ...state,
        storedSearchInput: action.searchInput
      };
    case types.BATCH_DOWNLOAD_FULFILLED:
      return {
        ...state,
        isLoading: false,
        hasError: false
      };
    case types.BATCH_DOWNLOAD_PENDING:
      return {
        ...state,
        isLoading: true,
        hasError: false
      };
    case types.BATCH_DOWNLOAD_REJECTED:
      return {
        ...state,
        isLoading: false,
        hasError: true
      };
    default:
      return state;
  }
};

export default SearchReducer;
