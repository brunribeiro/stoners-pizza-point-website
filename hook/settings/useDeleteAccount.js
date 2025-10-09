import commonApi from '@/api/common';
import { API_SUCCESS_RESPONSE } from '@/utils/constant';
import Toast from '@/utils/toast';
import { logout } from '@/utils/util';

const useDeleteAccount = () => {
  const deleteHandler = async () => {
    try {
      const response = await commonApi({
        action: 'deleteAccount',
      });

      if (response.code === API_SUCCESS_RESPONSE) {
        Toast.success('Account deleted successfully');
        logout();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  return { deleteHandler };
};

export default useDeleteAccount;
