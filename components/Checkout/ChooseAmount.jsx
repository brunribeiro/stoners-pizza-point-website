import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PercentageButton from '@/widgets/PercentageButton';

const ChooseAmount = ({ options, value, setValue, getTip }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='w-full bg-white rounded-full'>
      <Slider {...settings}>
        {options.map((option) => (
          <div key={option} className='pr-2 '>
            <PercentageButton
              options={[option]}
              value={value}
              setValue={setValue}
              getTip={getTip}
              className='w-full'
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ChooseAmount;
