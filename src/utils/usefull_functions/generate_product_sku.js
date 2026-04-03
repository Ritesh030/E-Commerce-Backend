const { nanoid } = require("nanoid");

const generateSKU = (name, brand) => {
  const shortName = name.trim().split(" ")[0].slice(0, 3).toUpperCase();
  const shortBrand = brand.trim().split(" ")[0].slice(0, 3).toUpperCase();

  const uniqueId = nanoid(6).toUpperCase();

  return `${shortBrand}-${shortName}-${uniqueId}`;
};

module.exports = generateSKU;