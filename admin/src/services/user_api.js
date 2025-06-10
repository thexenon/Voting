import ApiManager from './ApiManager';
const token = localStorage.getItem('token');

export const user_login = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error;
  }
};

export const userPassword = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/updateMyPassword', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error;
  }
};

export const forgotPass = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const user_signup = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitComment = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitPost = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error;
  }
};

export const submitUpdate = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: reqData,
      withCredentials: true,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitUserUpdate = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/updateMe', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};
