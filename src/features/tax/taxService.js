import API from "../../services/api";


//get all taxes
export const getTaxesApi = async () => {
  try {
  const response = await API.get("/tax/all");
  return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to fetch taxes");
  }
};

//create tax
export const createTaxApi = async (data) => {
  try {
    const response = await API.post("/tax/create", data);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to create tax");
  }
};

//update tax
export const updateTaxApi = async (id, data) => {
  try {
    const response = await API.put(`/tax/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to update tax");
  }
};

//delete tax
export const deleteTaxApi = async (id) => {
  try {
    const response = await API.delete(`/tax/delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("error_response", error.response);
    throw new Error("Failed to delete tax");
  }
};
