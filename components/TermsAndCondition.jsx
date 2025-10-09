import Link from 'next/link';
import React from 'react';

import LayoutWrapper from '@/shared/layoutWrapper';

const TermsAndCondition = () => {
  return (
    <LayoutWrapper>
      <div className='max-w-[640px] mx-auto px-5 py-10'>
        <h2 className='font-bold text-xl mb-4'>Terms and condition</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos sed vitae iusto sint
          officia mollitia enim nulla illum similique omnis placeat laboriosam itaque dolores
          debitis deserunt, esse corporis et aperiam ipsa velit repudiandae doloribus
          necessitatibus! Id molestiae eos nostrum animi, neque optio non incidunt distinctio
          dolorem voluptatibus fuga voluptates facere.
        </p>
        <Link className='text-primary border-b border-primary mb-2' href='/'>
          Go to home
        </Link>
      </div>
    </LayoutWrapper>
  );
};

export default TermsAndCondition;
