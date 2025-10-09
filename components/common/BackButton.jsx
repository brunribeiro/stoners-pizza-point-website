import { useRouter } from 'next/router';
import React from 'react';

const BackButton = ({ handleBack, className }) => {
  const back = () => {
    router.back();
  };
  const router = useRouter();
  return (
    <button
      onClick={handleBack || back}
      className={`text-primary cursor-pointer underline mb-5 block underline-offset-4 ${className}`}
    >
      &lt; Back
    </button>
  );
};

export default BackButton;
