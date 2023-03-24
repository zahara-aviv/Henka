import React, { Component } from "react";
import { Modal } from "../components/Modal.jsx";

export class ModalContainer extends Component {
  constructor(props) {
    super(props);
  }
  showModal = () => {
    this.props.setModal(true);
    // this.closeButton.focus();
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.props.setModal(false);
    // this.triggerRef.focus();
    this.toggleScrollLock();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };
  render = () => {
    return (
      <React.Fragment>
        {this.props.isShown ? (
          <Modal
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          />
        ) : null}
      </React.Fragment>
    );
  };
}

export default ModalContainer;
