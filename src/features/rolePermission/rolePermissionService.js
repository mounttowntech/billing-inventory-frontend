import API from "../../services/api";

// ================= Get All Roles =================

const getRoles = async () => {
  const response = await API.get("/roles/all");
  return response.data;
};

// ================= Get Role By Id =================

const getRoleById = async (id) => {
  const response = await API.get(`/roles/${id}`);
  return response.data;
};

// ================= Create Role =================

const createRole = async (roleData) => {
  const response = await API.post("/roles/create", roleData);

  return response.data;
};

// ================= Update Role =================

const updateRole = async (data) => {
  const { id, ...body } = data;

  const response = await API.put(`/roles/update/${id}`, body);

  return response.data;
};

// ================= Delete Role =================

const deleteRole = async (id) => {
  const response = await API.delete(`/roles/delete/${id}`);

  return response.data;
};

const rolePermissionService = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};

export default rolePermissionService;
