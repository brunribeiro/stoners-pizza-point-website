import React from 'react';

import FilledcheckIcon from '@/icons/FilledcheckIcon';
import EmptycheckIcon from '@/icons/EmptycheckIcon';
import EditIcon from '@/icons/EditIcon';

const MyCard = ({
  name = '',
  lastFour = '',
  setSelectedCard,
  card,
  selectedCard,
  fromSettings = false,
  id,
  onEdit = () => {},
}) => {
  const isSelected = selectedCard?.paymentInstrumentId === card.paymentInstrumentId;

  return (
    <button
      className={`flex items-center justify-between py-3 px-4 rounded-2xl  cursor-pointer w-full ${fromSettings ? 'primary-border !border-light-gray rounded-xl p-4' : 'bg-primary-light'}`}
      onClick={() => setSelectedCard && setSelectedCard(card)}
    >
      <div className='text-left'>
        <p className='font-bold'>{name}</p>
        <p className='text-foreground text-sm'>{lastFour}</p>
      </div>
      <button>{selectedCard && (isSelected ? <FilledcheckIcon /> : <EmptycheckIcon />)}</button>
      <button
        className=' hover:text-gray-700 text-primary'
        onClick={() => {
          onEdit(id, false);
        }}
      >
        <EditIcon size={24} />
      </button>
    </button>
  );
};

export default MyCard;
