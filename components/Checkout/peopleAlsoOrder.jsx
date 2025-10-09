import React from 'react';
import Slider from 'react-slick';

import OrderCard from './OrderCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import IncentivioLoader from '@/widgets/incentivioLoader';
import routes from '@/utils/routes';

const PeopleAlsoOrder = ({ dtuseModel, upsellData, loading, router }) => {
  const openModel = (id) => {
    dtuseModel.handleItemClick(id);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {upsellData?.data?.items?.length > 0 ? (
        <div className='w-full  flex flex-col gap-4'>
          <div className=' font-stone uppercase  text-3xl '>Add-ons</div>
          <div className='container  '>
            {loading && (
              <div className='flex h-10 justify-center items-center '>
                <IncentivioLoader size='5' />
              </div>
            )}
            {!loading && (
              <Slider {...settings}>
                {upsellData?.data?.items?.map((data) => (
                  <div key={data.prodId} className='px-2 pb-4'>
                    <OrderCard
                      title={data.name}
                      price={data.cost}
                      img={data.smallImg}
                      onClick={() => {
                        openModel(data.prodId);
                        router.push(routes.selectedItem(data.prodId));
                      }}
                      onCardClick={() => {
                        router.push(routes.items(data.cateId));
                      }}
                    />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default PeopleAlsoOrder;
