import { connect } from "react-redux";
import Search from "./Search";

import { fetchAllProfiles, storeSearchInput } from "./searchActions";
import { profileEdit } from "../EditProfile/EditProfileActions";
import { batchDownload } from "../Search/searchActions";

function mapStateToProps(state) {
  return {
    ...state.Shared,
    ...state.Search
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllProfiles: () => dispatch(fetchAllProfiles()),
    storeSearchInput: (searchInput) => dispatch(storeSearchInput(searchInput)),
    profileEdit: (profileData) => dispatch(profileEdit(profileData)),
    batchDownload: (resumes) => dispatch(batchDownload(resumes))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
