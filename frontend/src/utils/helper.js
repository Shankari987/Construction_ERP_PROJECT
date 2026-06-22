// Format Currency
export const formatCurrency = (amount) => {
  return `₹ ${amount}`;
};

// Format Date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Capitalize Text
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};