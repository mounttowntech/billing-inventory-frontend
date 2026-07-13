import API from "../../services/api";

const getAuditLogs = async () => {
  const response = await API.get("/auditlogs/all");
  return response.data;
};

const getAuditLogById = async (id) => {
  const response = await API.get(`/auditlogs/${id}`);
  return response.data;
};

const createAuditLog = async (auditData) => {
  const response = await API.post("/auditlogs/create", auditData);
  return response.data;
};

const updateAuditLog = async (data) => {
  const { id, ...body } = data;

  const response = await API.put(`/auditlogs/update/${id}`, body);

  return response.data;
};

const deleteAuditLog = async (id) => {
  const response = await API.delete(`/auditlogs/delete/${id}`);
  return response.data;
};

const auditLogService = {
  getAuditLogs,
  getAuditLogById,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog,
};

export default auditLogService;
