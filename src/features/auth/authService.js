import API from "../../services/api";

export const loginApi = async (data) => {
  const response = await API.post("/users/login", data);
  return response.data;
};

export const registerApi = async (data) => {
  const response = await API.post("/users/register", data);
  return response.data;
};

//get all users
export const getUsersApi = async () => {
  try {
    const response = await API.get("/users/all");
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to fetch users");
  }
};

//update user
export const updateUserApi = async (id, data) => {
  try {
    const response = await API.put(`/users/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to update user");
  }
};

//delete user
export const deleteUserApi = async (id) => {
  try {
    const response = await API.delete(`/users/delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to delete user");
  }
};

// Forgot Password
export const forgotPasswordApi = async (data) => {
  const response = await API.post("/users/forgot-password", data);
  return response.data;
};

// Verify OTP
export const verifyOTPApi = async (data) => {
  const response = await API.post("/users/verify-otp", data);
  return response.data;
};

// Change Password
export const changePasswordApi = async (data) => {
  const response = await API.post("/users/change-password", data);
  return response.data;
};
