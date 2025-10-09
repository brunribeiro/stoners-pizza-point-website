import { useEffect, useState } from 'react';

import commonApi from '@/api/common';

const useCheckMaintence = () => {
  const [IsMaintenance, setIsMaintenance] = useState('');
  const [loading, setLoading] = useState(false);

  const checkMaintence = async () => {
    try {
      setLoading(true);
      const response = await commonApi({
        action: 'inMaintenance',
      });
      setIsMaintenance(response.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in checking maintenance results:', error);
    }
  };

  useEffect(() => {
    checkMaintence();
  }, []);

  return {
    IsMaintenance,
    checkMaintence,
    loading,
  };
};

export default useCheckMaintence;
