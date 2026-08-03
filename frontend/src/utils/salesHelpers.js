// ==========================================================
// Currency Formatter
// ==========================================================

export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

// ==========================================================
// Date Formatter
// ==========================================================

export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================================
// Date & Time Formatter
// ==========================================================

export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ==========================================================
// Calculate Sale Total
// ==========================================================

export const calculateSaleTotal = (
  quantity = 0,
  price = 0
) => {
  return Number(quantity) * Number(price);
};

// ==========================================================
// Calculate Profit
// ==========================================================

export const calculateProfit = (
  sellingPrice = 0,
  costPrice = 0,
  quantity = 0
) => {
  return (
    (Number(sellingPrice) - Number(costPrice)) *
    Number(quantity)
  );
};

// ==========================================================
// Inventory Status
// ==========================================================

export const getStockStatus = (
  stock = 0,
  minimum = 10
) => {
  if (stock <= 0)
    return "Out of Stock";

  if (stock <= minimum)
    return "Low Stock";

  return "In Stock";
};

// ==========================================================
// Sale Status Color
// ==========================================================

export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";

    case "Pending":
      return "warning";

    case "Cancelled":
      return "error";

    case "Refunded":
      return "secondary";

    default:
      return "default";
  }
};

// ==========================================================
// Payment Method Color
// ==========================================================

export const getPaymentColor = (method) => {
  switch (method) {
    case "Cash":
      return "success";

    case "Card":
      return "primary";

    case "UPI":
      return "secondary";

    default:
      return "default";
  }
};

// ==========================================================
// Generate Invoice Number (Frontend Preview)
// ==========================================================

export const generateInvoiceNumber = () => {
  return `INV-${Date.now()}`;
};

// ==========================================================
// Search Sales
// ==========================================================

export const filterSales = (
  sales = [],
  search = ""
) => {
  if (!search) return sales;

  const keyword = search.toLowerCase();

  return sales.filter((sale) => {
    return (
      sale.product_name
        ?.toLowerCase()
        .includes(keyword) ||
      sale.customer_name
        ?.toLowerCase()
        .includes(keyword) ||
      sale.invoice_number
        ?.toLowerCase()
        .includes(keyword)
    );
  });
};

// ==========================================================
// Dashboard Statistics
// ==========================================================

export const calculateDashboardStats = (
  sales = []
) => {
  const revenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const orders = sales.length;

  const productsSold = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity_sold || 0),
    0
  );

  const averageOrder =
    orders > 0 ? revenue / orders : 0;

  return {
    revenue,
    orders,
    productsSold,
    averageOrder,
  };
};

// ==========================================================
// Chart Colors
// ==========================================================

export const getChartColors = () => [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#EC4899",
  "#6366F1",
];