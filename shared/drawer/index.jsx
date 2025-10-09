import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import CloseIcon from '@/icons/CloseIcon';
import RightIcon from '@/icons/RightIcon';

export default function SideOverlay({
  modalFooter,
  visible = false,
  widthClass,
  children,
  childClassname,
  title = '',
  footerClassname,
  BlackTheme = false,
  arrow = false,
  onclose = () => {},
}) {
  const handleClose = () => {
    // Prevent closing the modal when clicking outside
    // by not calling the onVisible function
    onclose();
  };
  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 dialog overflow-hidden z-[100]'
        open={visible}
        onClose={handleClose}
      >
        <div className='absolute inset-0 overflow-hidden  bg-black bg-opacity-50'>
          <Dialog.Overlay className='absolute inset-0' />
          <div className='fixed inset-y-0 right-0 flex max-w-full sm:pl-16 pl-0 '>
            <Transition.Child
              as={Fragment}
              enter='transform transition ease-in-out duration-500 sm:duration-700'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-500 sm:duration-700'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
            >
              <div
                className={`${
                  widthClass ? widthClass : ' max-w-3xl w-screen'
                } flex flex-col h-[100dvh] shadow-xl bg-white`}
              >
                {title ? (
                  <div
                    className={`flex items-center justify-between  bg-primary-light ${BlackTheme && '!bg-charcoal-gray'}`}
                  >
                    {arrow ? (
                      <button onClick={onclose}>
                        <RightIcon className={'rotate-180 text-[#85888a] mr-2 mb-1'} size='16' />
                      </button>
                    ) : (
                      ''
                    )}
                    {title && (
                      <div
                        className={` w-full flex items-center sm:p-8 p-5 pb-7  ${BlackTheme && 'text-white'}`}
                      >
                        <Dialog.Title className='text-2xl sm:text-3xl text-dark-Green font-stone uppercase w-full '>
                          {title}
                        </Dialog.Title>
                      </div>
                    )}
                    <div className='absolute flex items-center  transform -sm:translate-x-10 md:-translate-x-5 -translate-x-2 right-2 top-5 sm:top-7 z-10 hover:rotate-90  duration-300 '>
                      <button
                        type='button'
                        className=' p-1 sm:p-2 rounded-full focus:outline-none text-sm border-[3px] bg-white hover:border-primary hover:text-primary'
                        onClick={onclose}
                      >
                        <CloseIcon size='17' />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {title && (
                      <div className='flex items-center p-9 bg-primary-light pt-14'>
                        <Dialog.Title className='text-3xl text-dark-Green font-stone uppercase w-full '>
                          {title}
                        </Dialog.Title>
                      </div>
                    )}

                    <div className='absolute flex items-center  transform -sm:translate-x-10 -translate-x-5 h-7 right-0 top-5 z-10 '>
                      <button
                        type='button'
                        className='p-2 rounded-full focus:outline-none hover:rotate-90 hover:bg-slate-50 duration-300 text-sm border-[3px] bg-white'
                        onClick={onclose}
                      >
                        <CloseIcon size='17' />
                      </button>
                    </div>
                  </>
                )}

                {/* Divider container */}
                <div
                  className={`h-full bg-white overlay-height relative overflow-auto scrollbar-hide ${childClassname}`}
                >
                  {/* {loader && <KlarifyLoader />} */}
                  {children}
                </div>

                {/* Action buttons */}
                {modalFooter ? (
                  <div className={`z-50 bg-white  ${BlackTheme && '!bg-black'}`}>
                    <div
                      className={`flex items-center rounded-t-2xl shadow-[0px_2px_10px_0px_rgba(28,28,28,0.4)]  justify-end gap-3 sm:px-10 px-3 pb-[25px] pt-5 modal-footer bg-primary-light w-full ${footerClassname} ${BlackTheme && '!bg-charcoal-gray'}`}
                    >
                      {modalFooter}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
