import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import Image from 'next/image';

import CustomModal from '../common/CustomModal';

import PurchaseGiftCard from './PurchaseGiftCard';

import EditIcon from '@/icons/EditIcon';
import commonApi from '@/services/api/common';
import { KEYS } from '@/utils/constant';
import IncentivioLoader from '@/widgets/incentivioLoader';
import Button from '@/widgets/button';

const MyGiftCard = ({ id, src = '', name = '', lastFour = '', handleEdit }) => {
  const [open, setOpen] = useState(false);
  const [addValueOpen, setAddValueOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const getCardDetails = async (id) => {
    const payload = {
      sourceType: KEYS.WEB,
      cardIdentifier: id,
    };

    try {
      const res = await commonApi({
        action: 'getGiftCard',
        data: payload,
      });

      // Check if res.data exists
      if (res?.data) {
        setCardDetails(res.data);
        setOpen(true);
      } else {
        console.error('No card data found');
      }
    } catch (error) {
      console.error('Error fetching card details:', error);
    }
  };
  const handleAddValue = () => {
    setAddValueOpen(true);
  };

  return (
    <>
      <button
        onClick={() => getCardDetails(id)}
        className='flex text-left items-center justify-between p-4 rounded-2xl bg-gray-100'
      >
        <div className='flex items-center space-x-4'>
          {src ? <Image src={src} alt='credit-card' width={12} height={8} /> : null}
          <div>
            <p className='text-gray-500'>{name}</p>
            <p className='text-foreground font-bold'>{lastFour}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(id);
          }}
        >
          <EditIcon className='w-6 h-6' />
        </button>
      </button>
      <CustomModal open={open} title='Gift Cards' titleClass='justify-center ' setOpen={setOpen}>
        <>
          <div className='grid gap-2  text-center'>
            <p>
              Pay in store by scanning the code below or by sharing your card number with the
              cashier
            </p>
            <div style={{ height: 'auto', margin: '0 auto', maxWidth: 250, width: '100%' }}>
              {cardDetails?.cardIdentifier ? (
                <QRCode
                  size={100}
                  style={{ height: 'auto', width: '100%' }}
                  value={cardDetails.cardIdentifier}
                  viewBox='0 0 50 50'
                />
              ) : (
                <div className='flex h-4 p-4 justify-center items-center'>
                  <IncentivioLoader size='12' />
                </div>
              )}
            </div>
            <p className='font-bold'>
              {cardDetails?.cardIdentifier || 'Card identifier unavailable'}
            </p>
            <p>Your Balance is</p>
            <p className='font-bold'>${cardDetails?.cardAccountBalance ?? 'Balance unavailable'}</p>
          </div>
          <div className='flex gap-2 '>
            <Button
              className='w-full'
              onClick={() => getCardDetails(id)}
              title='Re-check Balance'
            />
            <Button className='w-full' onClick={handleAddValue} title='Add Value' />
          </div>
        </>
      </CustomModal>

      {/* Add Value Modal */}
      <CustomModal open={addValueOpen} title='Add Value to Gift Card' setOpen={setAddValueOpen}>
        <PurchaseGiftCard id={id} setOpen={setAddValueOpen} />
      </CustomModal>
    </>
  );
};

export default MyGiftCard;
