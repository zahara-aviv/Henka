import React, { useRef, KeyboardEventHandler, MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { Form } from './Form';
import FocusTrap from 'focus-trap-react';
type propType = {
  onClickOutside: MouseEventHandler;
  onKeyDown: KeyboardEventHandler;
  modalRef: (
    n: React.RefObject<HTMLDivElement>
  ) => React.RefObject<HTMLDivElement>;
  buttonRef: (
    n: React.RefObject<HTMLButtonElement>
  ) => React.RefObject<HTMLButtonElement>;
  closeModal: MouseEventHandler;
};
export const Modal = (props: propType) => {
  const { onClickOutside, onKeyDown, modalRef, buttonRef, closeModal } = props;
  const divRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  modalRef(divRef);
  buttonRef(btnRef);
  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        // tag="aside"
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
        className='modal-cover'
        onClick={onClickOutside}
        onKeyDown={onKeyDown}
      >
        <div className='modal-area-container'>
          <div className='modal-area' ref={divRef}>
            <button
              ref={btnRef}
              aria-label='Close Modal'
              aria-labelledby='close-modal'
              className='_modal-close'
              onClick={closeModal}
            >
              <span id='close-modal' className='_hide-visual'>
                Close
              </span>
              <svg className='_modal-close-icon' viewBox='0 0 40 40'>
                <path d='M 10,10 L 30,30 M 30,10 L 10,30' />
              </svg>
            </button>
            <div className='modal-body'>
              <Form />
            </div>
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
