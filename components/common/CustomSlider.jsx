import * as React from 'react';
import Slider from '@mui/material/Slider';

const CustomSlider = ({ pointsUsed, handleSliderChange, max }) => {
  return (
    <Slider
      value={pointsUsed}
      onChange={handleSliderChange}
      min={0}
      max={max}
      sx={{
        color: 'red',
        height: '10px',
        '& .MuiSlider-thumb': {
          width: '40px',
          height: '40px',
          backgroundImage: 'url(/images/tomatoIcon.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'transparent',
        },
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-rail': {
          opacity: 0.5,
          backgroundColor: '#ddd',
        },
      }}
    />
  );
};

export default CustomSlider;
