import React from 'react';

import Button from '@/widgets/button';

const SelectionDetailsPopup = ({ isOpen, onClose, onClear, itemName, modifiers }) => {
  return (
    <>
      {isOpen && (
        <div
          className='fixed bottom-20 sm:bottom-24 w-full sm:left-[128px] sm:w-[40%] right-0 z-30 bg-primary-light rounded-t-3xl shadow-lg border transition-transform duration-300 ease-out'
          style={{
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className='p-3 flex w-full flex-col gap-3'>
            <div className='w-full flex justify-center'>
              <div className='w-12 h-1.5 bg-gray-300 rounded-full' />
            </div>

            <div className='flex justify-between items-center mt-3'>
              <h3 className='font-stone uppercase text-2xl mx-auto text-center'>
                SELECTION DETAILS
              </h3>
            </div>

            <div className='mt-4 text-sm px-8'>
              <div className='flex justify-between'>
                <p className='font-semibold text-sm'>{itemName}</p>
                <button
                  onClick={onClear}
                  className='text-primary hover:underline text-sm font-medium'
                >
                  Clear
                </button>
              </div>

              <div className='mt-2 space-y-2'>
                {modifiers.map((group) => (
                  <div key={group.id} className='flex'>
                    <h3 className='text-nowrap text-xs mr-1 text-stone-black'>{group.name}:</h3>
                    <div className='flex flex-wrap'>
                      {group.mods.map((mod, idx) => (
                        <span
                          key={mod.modId}
                          className='ml-1 text-xs text-stone-black font-semibold'
                        >
                          {mod.modName}
                          <span className='font-medium'>{' x' + mod.qunt}</span>
                          {idx !== group.mods.length - 1 && ','}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-6 mb-2'>
              <Button title='Close' onClick={onClose} primary={false} className='w-full' />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectionDetailsPopup;
