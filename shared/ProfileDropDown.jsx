import React from 'react';

import NavDropdown from './NavDropdown';

import DownIcon from '@/icons/DownIcon';
// import UserIcon from '@/icons/UserIcon';
import { logout } from '@/utils/util';
import { LocalStorage } from '@/utils/localStorage';
import useRewards from '@/hook/rewards/useRewards';

const ProfileDropDown = ({ loginData, setOpenPopup = () => {} }) => {
  const Name = LocalStorage.get('UserName');
  const { loyaltyData } = useRewards(true);
  return (
    <div className='relative group py-[6px] hover:cursor-pointer'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1 my-auto'>
          {/* <UserIcon /> */}
          <div className='flex items-center group-hover:text-dark-primary sm:gap-3 gap-1  font-semibold'>
            <div>
              Hi, {Name || loginData?.firstName}{' '}
              <div className='font-normal text-end -mt-[6px] text-stone-black'>
                {loyaltyData?.confirmedPoints?.toLocaleString()} pts
              </div>
            </div>
            <DownIcon size='18' className='' />
          </div>
        </div>
      </div>
      <NavDropdown logout={logout} setOpenPopup={setOpenPopup} />
    </div>
  );
};

export default ProfileDropDown;
