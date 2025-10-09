import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import DeleteIcon from '@/icons/DeleteIcon';
import EditIcon from '@/icons/EditIcon';
import PlusMinusCart from '@/widgets/PlusMinusCart';
import routes from '@/utils/routes';
import { displayAmount } from '@/utils/helper';

const CartList = ({
  title = '',
  img = '',
  price = '',
  qunt = 1,
  data = [],
  prodData = {},
  setOpenCart = () => {},
  addSoftCart,
  removeItem = () => {},
  dtuseModel,
  itemLoad,
  modGroupName = [],
  buildOptionDataJSX,
}) => {
  const router = useRouter();

  return (
    <div className=' border-b-[3px] border-gray-100 flex gap-2 sm:gap-5 py-5 sm:p-5'>
      {img && (
        <div className='sm:min-w-[58px] mt-4'>
          <Image src={img} alt='' width={58} height={58} className='object-contain rounded-lg' />
        </div>
      )}
      <div className='flex flex-col w-full'>
        <div className='flex gap-5 justify-between mt-3 '>
          <div className='font-extrabold '>{title}</div>
          <div className=' font-stone text-xl'>{displayAmount(price)}</div>
        </div>
        <div className='flex gap-5 justify-between '>
          <div className='text-stone-black text-[14px] mb-2'>
            <div className=''>{buildOptionDataJSX(modGroupName)}</div>
          </div>
        </div>

        <div className='flex justify-between gap-5 items-center'>
          <div className='flex gap-5'>
            <button
              className='flex items-start gap-1 text-sm  font-semibold text-stone-black mt-1 hover:underline hover:text-primary duration-200'
              onClick={() => {
                setOpenCart(false);
                if (!router.pathname.includes('/menu/categories/items')) {
                  dtuseModel.handleItemClick(prodData.prodId, prodData);
                }
              }}
            >
              <EditIcon size={20} /> <span className=''>Edit</span>
            </button>
            <button
              className='flex items-center gap-1 text-sm  font-semibold text-stone-black hover:underline hover:text-primary duration-200'
              onClick={() => {
                const prodDel = true;
                let cartDel = false;
                if (data[0]?.products.length > 1) {
                  cartDel = false;
                } else {
                  cartDel = true;
                }
                if (router.pathname.includes('/menu/categories/items')) {
                  router.push(routes.menu);
                }
                removeItem(prodData, prodDel, cartDel);
              }}
            >
              <DeleteIcon size={20} />{' '}
              <span className='mt-1 hover:underline hover:text-primary'>Delete</span>
            </button>
          </div>
          <div>
            <PlusMinusCart
              itemLoad={itemLoad}
              removeItem={removeItem}
              addSoftCart={addSoftCart}
              data={data}
              prodData={prodData}
              qunt={qunt}
              className='gap-2'
              iconClassName='duration-300  border-2 !border-dark-primary text-dark-primary'
              iconClass='p-[4px] w-7 h-7  hover:text-white'
              tooltip={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartList;
