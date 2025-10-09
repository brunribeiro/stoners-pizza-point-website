import React from 'react';
import Link from 'next/link';

const IncentivioLink = ({ href, children, ...other }) => {
  if (!href) {
    return <span {...other}>{children}</span>;
  }

  return (
    <Link href={href} {...other}>
      {children}
    </Link>
  );
};

export default IncentivioLink;
