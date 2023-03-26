import React, { Component } from "react";
import { Modal } from "../components/Modal.js";
interface ModalContainerProps {
  isShown: boolean;
  triggerText: string;
  setModal: (x: boolean) => void;
}

export class ModalContainer extends Component<ModalContainerProps> {
  modal: React.RefObject<Element>;
  closeButton: React.RefObject<Element>;
  constructor(props: ModalContainerProps) {
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
  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.closeModal();
    }
  };
  onClickOutside = (event: MouseEvent) => {
    // if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    const html = document.querySelector("html");
    if (html !== null) html.classList.toggle("scroll-lock");
  };
  render = () => {
    return (
      <React.Fragment>
        {this.props.isShown ? (
          <Modal
            modalRef={(n: React.RefObject<Element>) => (this.modal = n)}
            buttonRef={(n: React.RefObject<Element>) => (this.closeButton = n)}
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
