import React, { Fragment, useContext, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import useTranslation from 'next-translate/useTranslation';

import CloseIcon from '@/icons/CloseIcon';
import ScheduleCard from '@/components/common/ScheduleCard';
import AppContext from '@/utils/appContext';
import { formatAddress } from '@/utils/common';
import AddressCard from '@/components/Home/addressCard';
import AddressList from '@/components/Home/addressList';
import DownIcon from '@/icons/DownIcon';
import BackButton from '@/components/common/BackButton';

const WhereAreWe = ({ dtAdd }) => {
  if (!dtAdd.open) {
    return <></>;
  }

  return (
    <div>
      <button
        className='text-left flex justify-between items-center rounded-3xl border w-full p-4 hover:shadow cursor-pointer mb-6'
        onClick={() => dtAdd.setOpen(true)}
        aria-expanded={dtAdd.open ? 'true' : 'false'}
        aria-controls='address-section'
      >
        <span>
          <h2 className='text-lg font-bold capitalize'>{dtAdd?.address?.label}</h2>
          <p className='text-[15px] font-medium opacity-50'>{formatAddress(dtAdd.address)}</p>
        </span>
        <DownIcon />
      </button>
    </div>
  );
};

const RestaurantScheduler = ({ open = false, setOpen = () => {}, dt, dtAdd }) => {
  const { currentTab, setCurrentTab } = useContext(AppContext);
  const { t } = useTranslation('common');
  const cancelButtonReference = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[1300] overflow-y-auto'
        initialFocus={cancelButtonReference}
        onClose={setOpen}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
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
              className='relative inline-block text-left align-bottom transition-all transform rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-[510px] sm:w-full'
              role='dialog'
            >
              <button
                type='button'
                className='absolute top-2 right-3 flex items-center justify-center transition focus:outline-none hover:rotate-90'
                onClick={() => setOpen(false)}
                ref={cancelButtonReference}
                aria-label='Close the modal'
              >
                <span className='sr-only'>Close panel</span>
                <CloseIcon />
              </button>
              <div className='sm:px-10 px-6 py-6 sm:py-12 bg-white rounded-2xl w-full'>
                <div className='lg:h-full scrollbar-hide'>
                  <Tabs
                    selectedIndex={currentTab}
                    onSelect={(value) => setCurrentTab(value)}
                    className={'flex flex-col gap-6 '}
                    role='tablist'
                  >
                    <TabList>
                      <div className='bg-gray-200 rounded-[50px] flex justify-between items-center font-bold py-2 px-2 h-[60px]'>
                        <Tab
                          className={`p-2 px-4 flex justify-center cursor-pointer items-center w-[50%] ${
                            currentTab === 0
                              ? 'bg-primary rounded-3xl text-white font-extrabold text-lg'
                              : 'text-gray-600 text-lg font-extrabold'
                          }`}
                          role='tab'
                          tabindex='0'
                          aria-selected={currentTab === 0 ? 'true' : 'false'}
                          id='pickup-tab'
                          aria-controls='pickup-panel'
                        >
                          <div className={'text-xl'}>{t`pickup`}</div>
                        </Tab>
                        <Tab
                          className={`h-[48px] px-9 flex justify-center cursor-pointer items-center w-[50%] ${
                            currentTab === 1
                              ? 'bg-primary rounded-3xl text-white font-extrabold text-lg'
                              : 'text-gray-600 font-extrabold text-lg'
                          }`}
                          role='tab'
                          tabindex='0'
                          aria-selected={currentTab === 1 ? 'true' : 'false'}
                          id='delivery-tab'
                          aria-controls='delivery-panel'
                        >
                          <div>{t`delivery`}</div>
                        </Tab>
                      </div>
                    </TabList>

                    <TabPanel id='pickup-panel'>
                      <ScheduleCard dt={dt} t={t} />
                    </TabPanel>

                    <TabPanel id='delivery-panel'>
                      {dtAdd.addressList.length ? (
                        <div className='relative mb-2'>
                          {!dtAdd.isAddNewAddress ? (
                            <WhereAreWe dtAdd={dtAdd} />
                          ) : (
                            <BackButton
                              className='pl-2'
                              handleBack={() => dtAdd.setIsAddNewAddress(false)}
                              aria-label='Go back to address selection'
                            />
                          )}
                          {dtAdd.open && <AddressList dtAdd={dtAdd} t={t} />}
                          {dtAdd.isAddNewAddress && (
                            <AddressCard
                              dtAdd={dtAdd}
                              setValue={dtAdd.setValue}
                              register={dtAdd.register}
                              errors={dtAdd.errors}
                              isLoadedMap
                              t={t}
                            />
                          )}
                        </div>
                      ) : (
                        <AddressCard
                          dtAdd={dtAdd}
                          setValue={dtAdd.setValue}
                          register={dtAdd.register}
                          errors={dtAdd.errors}
                          isLoadedMap
                          t={t}
                        />
                      )}
                      <ScheduleCard dt={dt} t={t} />
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RestaurantScheduler;
