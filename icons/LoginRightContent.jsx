import * as React from 'react';

const LoginRightContent = ({ style, className, ...rest }) => (
  <div
    className={className}
    style={{
      backgroundImage: "url('/images/ViewMap.webp')",
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      ...style,
    }}
    role='img'
    aria-label='Map view background'
    {...rest}
  />
);

export default LoginRightContent;
