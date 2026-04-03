const generateSKU = (name, brand, count) => {
  const shortName = name.slice(0, 3).toUpperCase();
  const shortBrand = brand.slice(0, 3).toUpperCase();

  return `${shortBrand}-${shortName}-${count}`;
};

module.exports = generateSKU