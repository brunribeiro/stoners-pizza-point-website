import React from 'react';
import Image from 'next/image';

import AddIcon from '@/icons/AddIcon';
import Button from '@/widgets/button';
import { DEFAULT_IMAGE } from '@/utils/constant';
import { displayAmount } from '@/utils/helper';

const OrderCard = ({
  img = '',
  title = '',
  price = '',
  onClick = () => {},
  onCardClick = () => {},
}) => {
  const finalImage = img || DEFAULT_IMAGE;
  return (
    <div className=' flex flex-col rounded-[30px] bg-primary-light relative primary-border  border-gray-200'>
      <button onClick={onCardClick}>
        <Image
          width={300}
          height={105}
          src={finalImage}
          className='w-full h-[105px] object-contain rounded-tl-[28px] rounded-tr-[28px]'
          alt=''
        />
        <div className='p-3 text-left'>
          <div className=' line-clamp-1 font-bold'>{title}</div>
          <div className='text-sm text-foreground'>{displayAmount(price)}</div>
        </div>
      </button>

      <Button
        className='absolute right-2 bottom-16 !p-0 !py-[0px]'
        onClick={onClick}
        title={<AddIcon size={30} />}
      />
    </div>
  );
};

export default OrderCard;
