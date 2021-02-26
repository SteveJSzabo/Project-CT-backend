import toastr from 'toastr';
import axios from 'axios';

export const login = async (loginData) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: '/api/auth/login',
      data: loginData
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('Login successful');

      window.setTimeout(() => {
        if (data.result.role === 'superadmin' || data.result.role === 'admin') {
          location.assign('/admin');
        } else {
          location.assign('/profile');
        }
      }, 100);
    }
  } catch (err) {
    toastr.error(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: '/api/auth/logout'
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('Logout successful');

      window.setTimeout(() => {
        location.assign('/');
      }, 100);
    }
  } catch (err) {
    toastr.error(err.response.data.message);
  }
};
