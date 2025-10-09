import React, { useState } from 'react';

import AccountSkeleton from '../common/AccountSkeleton';

import SettingsTab from './SettingsTab';
import AccountHead from './AccountHead';

import LayoutWrapper from '@/shared/layoutWrapper';
import TomatoIcon from '@/icons/TomatoIcon';
import useSettingForm from '@/hook/settings/useSettingForm';

const Setting = () => {
  const { ...dtSetting } = useSettingForm();
  const [selectedOption, setSelectedOption] = useState('general');

  const sidebarOptions = ['general', 'change password', 'addresses', 'payment method'];
  const scrollToSection = (id) => {
    setSelectedOption(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const activeClass =
    'lg:before:absolute lg:before:bottom-0 lg:before:bg-primary lg:before:w-[3px] lg:before:h-full lg:before:left-0 sm:bg-gray-200';
  return (
    <LayoutWrapper>
      <div className='flex flex-col lg:flex-row sm:w-[85%]  mx-auto '>
        <aside className='sticky top-0 lg:top-[80px] lg:h-[calc(100dvh-120px)] w-full max-w-full lg:max-w-[345px] bg-white z-10 '>
          <div className='pt-5 lg:p-5 lg:my-6 lg:mx-5 bg-primary-light rounded-2xl  before:absolute before:bottom-0 before:left-0 before:w-full before:border-b-[4px] before:border-[#dadada] lg:before:border-b-0 before:z-[5]'>
            <div className='flex items-center gap-2 sm:mb-6  my-4 sm:mt-0 px-8 lg:px-0'>
              <div className='hidden sm:block'>
                <TomatoIcon />
              </div>
              <h1 className='uppercase font-stone sm:text-3xl text-2xl'>Account</h1>
            </div>

            <nav className='flex flex-row lg:flex-col gap-2 overflow-x-scroll mx-4 lg:mx-0 no-scrollbar'>
              {sidebarOptions.map((option, index) => {
                const sectionId = option.toLowerCase().replace(/\s/g, '-');
                return (
                  <button
                    key={index}
                    className={`${
                      selectedOption === sectionId && activeClass
                    } px-5 py-2 lg:pl-8 cursor-pointer whitespace-nowrap text-sm sm:text-base text-foreground sm:text-black lg:whitespace-normal relative flex justify-start w-full uppercase font-medium sm:hover:bg-light-gray transition text-left ${selectedOption === sectionId && 'selected-setting '}`}
                    onClick={() => scrollToSection(sectionId)}
                  >
                    {option}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className='flex flex-col w-full lg:flex-row container mx-auto'>
          <div className='flex flex-col lg:flex-row w-full min-h-screen mx-auto gap-4'>
            <main className='w-full lg:w-[95%]   py-6 px-4 lg:px-0 flex flex-col gap-10'>
              {dtSetting?.loader.userForm ? (
                <AccountSkeleton />
              ) : (
                <>
                  <AccountHead dtSetting={dtSetting} />
                  <SettingsTab dtSetting={dtSetting} />
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Setting;
