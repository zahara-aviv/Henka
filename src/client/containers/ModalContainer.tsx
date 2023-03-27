import React, {
  Component,
  KeyboardEventHandler,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { Modal } from "../components/Modal";
interface ModalContainerProps {
  isShown: boolean;
  triggerText: string;
  setModal: (x: boolean) => void;
}

export class ModalContainer extends Component<ModalContainerProps> {
  modal: React.RefObject<HTMLDivElement> | null;
  closeButton: React.RefObject<HTMLButtonElement> | null;
  constructor(props: ModalContainerProps) {
    super(props);
    this.modal = null;
    this.closeButton = null;
  }
  showModal = () => {
    this.props.setModal(true);
    // this.closeButton.focus();
    this.toggleScrollLock();
  };
  closeModal = (event?: MouseEvent) => {
    this.props.setModal(false);
    // this.triggerRef.focus();
    this.toggleScrollLock();
  };
  onKeyDown: KeyboardEventHandler = (event: KeyboardEvent<Element>) => {
    if (event.key === "Escape") {
      this.closeModal();
    }
  };
  onClickOutside = (event: MouseEvent<HTMLAreaElement>) => {
    if (
      this.modal !== null &&
      this.modal.current !== null &&
      this.modal.current.contains(event.target as Node)
    )
      return;
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
            modalRef={(n: React.RefObject<HTMLDivElement>) => (this.modal = n)}
            buttonRef={(n: React.RefObject<HTMLButtonElement>) =>
              (this.closeButton = n)
            }
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
