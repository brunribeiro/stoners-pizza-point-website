import React from 'react';

import Button from '@/widgets/button';

const ModalContent = ({
  handleConfirm = () => {},
  handleClose = () => {},
  loading,
  title = '',
  btn1Text = '',
  btn2Text = '',
  desc = '',
  className = '',
  btn1ClassName = '',
  btn2ClassName = '',
}) => {
  return (
    <div className={`p-4 border border-black  ${className}`}>
      <div className='flex mt-3 flex-col gap-6 items-center'>
        <div className='flex flex-col gap-2 justify-center items-center'>
          <h2 className='font-appleberry text-3xl'>{title}</h2>
        </div>

        <p className='text-center'>{desc}</p>
        <Button
          loading={loading}
          disabled={loading}
          title={btn1Text}
          className={` w-full  hover:text-white  text-white !text-[16px] ${btn1ClassName}`}
          onClick={handleConfirm}
        />
        <button className='w-full !text-lg ' onClick={handleClose}>
          <p
            className={`inline-block hover:border-b leading-none hover:text-primary hover:border-primary duration-200 ${btn2ClassName}`}
          >
            {btn2Text}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModalContent;
