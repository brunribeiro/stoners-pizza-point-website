import React, { useContext } from 'react';

import AddCardForm from '../MyCards/AddCardForm';
import CustomModal from '../common/CustomModal';

import CustomSelect from '@/widgets/CustomSelect';
import IncentivioLoader from '@/widgets/incentivioLoader';
import AppContext from '@/utils/appContext';
import { KEYS } from '@/utils/constant';

const SelectCard = ({ dt }) => {
  const { loginData, modal, setModal } = useContext(AppContext);
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    control,
    errors,
    trigger,
    selectedDate,
    setSelectedDate,
    onSubmitCard,
    setCardData,
    cardListOption,
    loader,
    selectedCard,
    setSelectedCard,
  } = dt || {};
  return (
    <>
      {loader?.list && (
        <div className='flex h-4 justify-center items-center'>
          <IncentivioLoader size={KEYS.FIVE} />
        </div>
      )}
      {!loader?.list && (
        <div className=' grid gap-2'>
          {cardListOption?.length ? (
            <>
              <CustomSelect
                options={cardListOption}
                value={selectedCard}
                onChange={setSelectedCard}
                isLoading={loader.list}
                isClearable
                menuIsOpen={!selectedCard}
                placeholder='Select Credit Card'
              />
              {dt.error.selectedCard && !selectedCard && (
                <p className='text-red'>Please select a card</p>
              )}
            </>
          ) : (
            <></>
          )}
          <CustomModal
            title='Add card'
            open={modal.addCard}
            setOpen={(open) => setModal((prev) => ({ ...prev, addCard: open }))}
          >
            <AddCardForm
              handleSubmit={handleSubmit}
              onSubmitCard={onSubmitCard}
              register={register}
              setValue={setValue}
              control={control}
              errors={errors}
              trigger={trigger}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              loader={loader}
            />
          </CustomModal>

          {!modal.addCard && loginData.token && (
            <button
              onClick={() => {
                reset();
                setCardData(null);
                setModal((prev) => ({ ...prev, addCard: true }));
              }}
              className='flex items-center justify-center p-4 rounded-2xl bg-gray-100 text-black font-bold w-full text-opacity-50'
            >
              + Add New Card
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default SelectCard;
