import React, { forwardRef, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import CloseIcon from '@/icons/CloseIcon';

const InboxModel = forwardRef(
  (
    {
      open = false,
      setOpen = () => {},
      modalFooter,
      onModelClose = () => {},
      children,
      title = true,
      backButton = false,
      backButtonContent = null,
    },
    ref,
  ) => {
    const cancelButtonReference = useRef(null);

    const handleClose = () => {
      // Prevent closing the modal when clicking outside
      // by not calling the onVisible function
      setOpen(false);
      onModelClose();
    };

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-50 overflow-y-auto'
          initialFocus={cancelButtonReference}
          onClose={handleClose}
        >
          <div
            className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'
            ref={ref}
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 transition-opacity bg-black bg-opacity-50' />
            </Transition.Child>
            <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <div className='relative inline-block text-left align-bottom transition-all transform bg-white rounded-[40px] shadow-xl sm:my-8 sm:align-middle lg:max-w-[480px] sm:max-w-[90%] w-full'>
                <div className=' bg-white overflow-hidden rounded-3xl w-full'>
                  <div className='w-full sm:flex sm:items-start'>
                    <div className='w-full '>
                      <div className='grid overflow-hidden rounded-2xl'>
                        <div className='relative'>
                          <div className='absolute top-6 left-8'>
                            {backButton && backButtonContent}
                          </div>
                          <>
                            {title && (
                              <div className=' bg-primary-light flex items-center p-6 pl-9  pb-14'>
                                <Dialog.Title className='text-3xl text-dark-Green font-stone uppercase w-full '>
                                  {String(title || '').replace(/\*+$/, '')}
                                </Dialog.Title>
                              </div>
                            )}

                            <div className='absolute flex items-center  transform -sm:translate-x-10 -translate-x-5 h-7 right-0 top-7 z-10 '>
                              <button
                                type='button'
                                className='p-[6px] rounded-full focus:outline-none hover:rotate-90 hover:border-primary hover:text-primary duration-300 text-sm border-[3px] border-gray-300 bg-white'
                                onClick={handleClose}
                              >
                                <CloseIcon size='17' />
                              </button>
                            </div>
                          </>
                        </div>
                        {children}
                      </div>
                      {modalFooter ? (
                        <div className='bg-white'>
                          <div
                            className={
                              'flex items-center justify-end gap-3 p-5 modal-footer bg-primary-light w-full  shadow-inner rounded-t-2xl '
                            }
                          >
                            {modalFooter}
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  },
);

InboxModel.displayName = 'InboxModel';

export default InboxModel;
