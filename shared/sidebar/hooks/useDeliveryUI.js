import { useMemo, useState, useCallback } from 'react';

import { hasDeliveryList } from '@/utils/helper';

const useDeliveryUI = ({ dt, localDeliveryAddress }) => {
  const initialEditing = useMemo(() => !localDeliveryAddress, [localDeliveryAddress]);
  const [isEditing, setIsEditing] = useState(initialEditing);

  const startEdit = useCallback(() => setIsEditing(true), []);
  const finishEdit = useCallback(() => setIsEditing(false), []);

  const hasList = hasDeliveryList(dt, localDeliveryAddress);
  const shouldShowList = hasList && !isEditing;

  return {
    isEditing,
    startEdit,
    finishEdit,
    shouldShowList,
  };
};

export default useDeliveryUI;
