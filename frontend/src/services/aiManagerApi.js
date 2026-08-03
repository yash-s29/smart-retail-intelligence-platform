import api from "./api";

/**
 * AI Store Manager API client
 * - Daily brief
 * - Action cards
 * - Grounded Q&A + chat history
 */

const aiManagerApi = {
  /**
   * Main page payload
   * GET /ai-manager/brief
   */
  getBrief: async () => {
    const { data } = await api.get("/ai-manager/brief");
    return data;
  },

  /**
   * Refresh action cards only
   * GET /ai-manager/actions
   */
  getActions: async () => {
    const { data } = await api.get("/ai-manager/actions");
    return data;
  },

  /**
   * Ask a grounded question
   * POST /ai-manager/ask
   * @param {Object} body
   * @param {string} body.question
   * @param {boolean} [body.include_forecast=true]
   * @param {boolean} [body.include_inventory=true]
   * @param {boolean} [body.include_sales=true]
   */
  ask: async ({
    question,
    include_forecast = true,
    include_inventory = true,
    include_sales = true,
  } = {}) => {
    const { data } = await api.post("/ai-manager/ask", {
      question: String(question || "").trim(),
      include_forecast,
      include_inventory,
      include_sales,
    });
    return data;
  },

  /**
   * Past chat turns
   * GET /ai-manager/chat/history
   */
  getChatHistory: async (limit = 20) => {
    const { data } = await api.get("/ai-manager/chat/history", {
      params: { limit },
    });
    return data;
  },
};

export default aiManagerApi;

// Named helpers (optional)
export const getAIManagerBrief = () => aiManagerApi.getBrief();
export const getAIManagerActions = () => aiManagerApi.getActions();
export const askAIManager = (body) => aiManagerApi.ask(body);
export const getAIManagerChatHistory = (limit) =>
  aiManagerApi.getChatHistory(limit);