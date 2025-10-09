import Image from 'next/image';
import React from 'react';

const InboxCard = ({ src = '', title = '', className = '', setOpen = () => {}, dt, msg }) => {
  return (
    <div className={`px-9 ${className}`}>
      <button
        type='button'
        aria-label={title || 'Open Inbox Card'}
        className='flex flex-col overflow-hidden rounded-2xl cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full'
        onClick={() => {
          dt?.setMessageDetail?.(msg);
          setOpen(true);
        }}
      >
        <div className='relative w-full h-[150px]'>
          {src && (
            <Image src={src} alt={title || 'Inbox image'} fill className='object-cover' priority />
          )}
        </div>
      </button>
    </div>
  );
};

export default InboxCard;
