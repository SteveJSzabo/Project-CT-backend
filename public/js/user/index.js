import toastr from 'toastr';
import axios from 'axios';

export const createUser = async (userData) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: '/api/users',
      data: userData
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('User create successful');

      window.setTimeout(() => {
        location.assign('/admin');
      }, 100);
    }
  } catch (err) {
    toastr.error(err.response.data.message);
  }
};

export const editUser = async (id, userData) => {
  try {
    const { data } = await axios({
      method: 'PATCH',
      url: `/api/users/${id}`,
      data: userData
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('User update successful');

      window.setTimeout(() => {
        location.assign('/admin');
      }, 100);
    }
  } catch (err) {
    toastr.error(err.response.data.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const { data } = await axios({
      method: 'DELETE',
      url: `/api/users/${id}`
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('User delete successful');

      window.setTimeout(() => {
        location.assign('/admin');
      }, 100);
    }
  } catch (err) {
    toastr.error(err.response.data.message);
  }
};

export const editProfile = async (userData) => {
  try {
    const { data } = await axios({
      method: 'PATCH',
      url: '/api/users/update-me',
      data: userData
    });

    if (data.status === 'success') {
      // Show success alert
      toastr.success('Profile update successful');

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
