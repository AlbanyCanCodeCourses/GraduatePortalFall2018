import React, { Component } from "react";
//import history from "../../history";
import { Button, Modal } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newuserCreation } from "../../services/api";

class NewUsers extends Component {
  state = {
    showModal: true,
    emailInput: "",
    dataToSend: {
      emails: [],
      isGrad: true
    },
    serverResponse: ""
  };

  createNewUsers = async newUserInfo => {
    console.log("new User", newUserInfo);
    const response = await newuserCreation(newUserInfo);
    console.log(response);

    if (response.success === 1) {
      this.notify();
    } else {
      this.errorNotify();
    }
  };

  handleClick = e => {
    this.setState({ dataToSend: { isGrad: !this.state.dataToSend.isGrad } });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleAddEmails = () => {
    this.setState({ showModal: true });
  };

  notify = () => toast("Success! Thank you!", { type: toast.TYPE.SUCCESS });

  errorNotify = () =>
    toast("Something went wrong.", { type: toast.TYPE.ERROR });

  inputErrorNotify = () =>
    toast(
      "Please check your input. Make sure each email address is separated by a comma.",
      { type: toast.TYPE.WARNING }
    );

  serverNotify = () =>
    toast("Sending new user information to server.", { autoClose: 2000 });

  handleInput = e => {
    this.setState({ emailInput: e.target.value });
  };

  emailValidation = () => {
    let emailArray = [];
    emailArray = this.state.emailInput.split(",");

    let trimmedArray = [];
    trimmedArray = emailArray.map(item => item.trim());

    let numberOfAts = 0;
    let numberOfCommas = 0;

    if (this.state.emailInput.indexOf("@") !== -1) {
      numberOfAts = this.state.emailInput.match(/@/g).length;
    }

    if (this.state.emailInput.indexOf(",") !== -1) {
      numberOfCommas = this.state.emailInput.match(/,/g).length;
    }

    if (trimmedArray.length === 1 && numberOfAts === 1) {
      this.serverNotify();
      this.setState({ showModal: false });

      const { dataToSend } = this.state;
      dataToSend.emails = [...trimmedArray];

      this.setState(
        {
          dataToSend
        },
        () => console.log("this is saved Emails", this.state.dataToSend)
      );

      this.setState({
        serverResponse: this.createNewUsers(this.state.dataToSend)
      });
      console.log(this.state.serverResponse);
    } else if (numberOfAts - numberOfCommas !== 1) {
      this.inputErrorNotify();
    } else {
      this.serverNotify();
      this.setState({ showModal: false });

      const { dataToSend } = this.state;
      dataToSend.emails = [...trimmedArray];

      this.setState(
        {
          dataToSend
        },
        () => console.log("this is saved Emails", this.state.dataToSend)
      );

      this.setState({
        serverResponse: this.createNewUsers(this.state.dataToSend)
      });
      //submitEmails(trimmedArray);
    }
  };

  // submitEmails = emailArray => {};

  // successToast = () => toast("Everything went great!", { autoClose: 7000 });
  // badInputToast = () =>
  //   toast(
  //     "Please check your input to ensure each email address is separated by a comma",
  //     { autoClose: 7000 }
  //   );
  // serverErrorToast = () =>
  //   toast("We encountered an error communicating with the server.", {
  //     autoClose: 7000
  //   });

  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <Modal
          show={this.state.showModal}
          onHide={e => this.handleClose(e)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              Add email addresses, separated by a comma.
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  onClick={e => this.handleClick(e.target.checked)}
                />
                <label className="form-check-label">
                  These new accounts will be admin accounts
                </label>
              </div>

              <div class="form-group">
                <textarea
                  class="form-control"
                  id="message-text"
                  onChange={e => this.handleInput(e)}
                  value={this.state.emailInput}
                />
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.handleClose(e)}>
              Close
            </Button>
            <Button variant="primary" onClick={this.emailValidation}>
              Add new users
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NewUsers;
