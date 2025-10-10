import * as React from 'react';
import Image from 'next/image';

const LoginRightContent = ({ style, className, ...rest }) => (
  <div
    className={`${className} relative overflow-hidden`}
    style={{
      width: '100%',
      height: '100%',
      ...style,
    }}
    role='img'
    aria-label='Map view background'
    {...rest}
  >
    <Image
      src='/images/ViewMap.webp'
      alt='Map view background'
      fill
      priority
      quality={85}
      sizes='(max-width: 768px) 100vw, 50vw'
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  </div>
);

export default LoginRightContent;
