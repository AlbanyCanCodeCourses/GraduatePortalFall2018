import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";

import NavBarContainer from "./NavBar/NavBarContainer";
import Footer from "./Footer/Footer";
import LoginContainer from "./Login/LoginContainer";
import SearchContainer from "./Search/SearchContainer";
import ViewProfileContainer from "./ViewProfile/ViewProfileContainer";
import NewProfileContainer from "./NewProfile/NewProfileContainer";
import EditProfileContainer from "./EditProfile/EditProfileContainer";
import RegistrationContainer from "./Registration/RegistrationContainer";
import NewUsersContainer from "./CreateNewUsers/NewUsersContainer";
import ForgotPasswordContainer from "./ForgotPassword/ForgotPasswordContainer";
import ResetPasswordContainer from "./ResetPassword/ResetPasswordContainer";

function App() {
  return (
    <div>
      <Route path="/" component={NavBarContainer} />
      <Switch>
        <Route exact path="/" component={SearchContainer} />
        <Route path="/user/reg-form" component={RegistrationContainer} />
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/forgotPassword" component={ForgotPasswordContainer} />
        <Route exact path="/resetPassword/:token" component={ResetPasswordContainer} />
        <Route exact path="/profile/add" component={NewProfileContainer} />
        <Route
          exact
          path="/profile/:graduateId/edit"
          component={EditProfileContainer}
        />
        <Route
          exact
          path="/profile/:graduateId"
          component={ViewProfileContainer}
        />
        <Route exact path="/newusers" component={NewUsersContainer} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
