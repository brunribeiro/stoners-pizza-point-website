import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useRef } from 'react';

import CloseIcon from '@/icons/CloseIcon';

const CustomModal = ({
  open = false,
  setOpen = () => {},
  titleClass = '',
  children,
  title = '',
  className,
  className2,
}) => {
  const cancelButtonReference = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[1300]  overflow-y-auto'
        initialFocus={cancelButtonReference}
        onClose={setOpen}
      >
        <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 '>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-300'
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
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-300'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div
              className={`relative inline-block text-left align-bottom transition-all transform  rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-[510px] w-full sm:w-full ${className2}`}
            >
              <div
                className={`sm:px-10 px-6 py-6 sm:py-12 bg-white rounded-2xl w-full  ${className}`}
              >
                <div className='w-full sm:flex sm:items-start'>
                  <div className='w-full'>
                    <div className='relative grid gap-3'>
                      <button
                        type='button'
                        className='absolute -right-2 -top-6 flex items-center justify-center transition focus:outline-none hover:rotate-90'
                        onClick={() => setOpen(false)}
                      >
                        <span className='sr-only'>Close panel</span>
                        <CloseIcon />
                      </button>
                      <div className={`flex  gap-5 items-center ${titleClass}`}>
                        <p className='text-[21px] font-extrabold  '>{title}</p>
                      </div>
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CustomModal;
