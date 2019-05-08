import * as types from "../../constants/actionTypes";
import { fetchAllProfilesRequest, batchDownloadRequest } from "../../services/api";

export const fetchAllProfiles = () => {
  return {
    type: types.FETCH_ALL_PROFILES,
    payload: fetchAllProfilesRequest()
  };
};

export const storeSearchInput = (searchInput) => {
  return {
    type: types.STORE_SEARCH_INPUT,
    searchInput
  };
};

export const batchDownload = (resumes) => {
  const resumesForJSON = { urls: resumes }
  return {
    type: types.BATCH_DOWNLOAD,
    payload: batchDownloadRequest(resumesForJSON)
  }
}
