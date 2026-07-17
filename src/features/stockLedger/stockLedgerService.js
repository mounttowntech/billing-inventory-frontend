import API from "../../services/api";

const getStockLedgers = async () => {
  const response = await API.get("/stock-ledgers/all");
  return response.data.data;
};

const getStockLedgerById = async (id) => {
  const response = await API.get(`/stock-ledgers/${id}`);
  return response.data.data;
};

const createStockLedger = async (stockLedgerData) => {
  const response = await API.post("/stock-ledgers/create", stockLedgerData);
  return response.data.data;
};

const updateStockLedger = async ({ id, stockLedgerData }) => {
  const response = await API.put(
    `/stock-ledgers/update/${id}`,
    stockLedgerData,
  );
  return response.data.data;
};

const deleteStockLedger = async (id) => {
  await API.delete(`/stock-ledgers/delete/${id}`);
  return id;
};

const stockLedgerService = {
  getStockLedgers,
  getStockLedgerById,
  createStockLedger,
  updateStockLedger,
  deleteStockLedger,
};

export default stockLedgerService;
