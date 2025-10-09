import { useRouter } from 'next/router';
import React from 'react';

import EnterCodeIcon from '@/icons/EnterCodeIcon';
// import InboxIcon from '@/icons/InboxIcon';
import LoyaltyCardIcon from '@/icons/LoyaltyCardIcon';
// import MyOrdersIcon from '@/icons/MyOrdersIcon';
// import PaymentsIcon from '@/icons/PaymentsIcon';
// import RewardsIcon from '@/icons/RewardsIcon';
// import RightIcon from '@/icons/RightIcon';
// import SettingsIcon from '@/icons/SettingsIcon';
import routes from '@/utils/routes';
import IncentivioLink from '@/widgets/incentivioLink';

const NavDropdown = ({ logout = () => {}, setOpenPopup }) => {
  const router = useRouter();

  const menuItems = [
    { href: routes.deals, icon: <LoyaltyCardIcon />, label: 'Loyalty' },
    { href: routes.settings, label: 'My Accounts' },
    { href: '#', icon: <EnterCodeIcon />, label: 'Enter Code', isButton: true },
    { href: '#', label: 'Sign Out', isButton: true, action: logout }, // Attach logout function
  ];

  return (
    <div className='absolute sm:right-0 -left-14 pt-3 top-full w-[220px] hidden group-hover:block max-w-[220px ] bg-white rounded-2xl py-3 px-6 shadow-[0px_4px_20px_rgba(0,0,0,0.15)]'>
      <ul className=''>
        {menuItems.map((item) => (
          <li key={item.label} className=' menu-item'>
            {item.isButton ? (
              <button
                onClick={() => (item.action ? item.action() : setOpenPopup(item?.label))}
                className='text-lg py-2 flex justify-between gap-3 items-center w-full text-left'
                aria-label={item.label} // Accessibility improvement
              >
                <span className='flex items-center gap-3 menu-item-text'>{item.label}</span>
              </button>
            ) : (
              <IncentivioLink
                href={item.href}
                className={`text-lg py-2 flex justify-between gap-3 items-center ${
                  router.asPath === item.href ? 'text-dark-primary' : ''
                }`}
                aria-label={item.label} // Accessibility improvement
              >
                <span className='flex items-center gap-3 menu-item-text'>{item.label}</span>
              </IncentivioLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavDropdown;
