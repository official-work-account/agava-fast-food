function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems) {
  // Calculate the items price
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // // Note: FOR PRODUCTION MODE - Calculate the shipping price
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 0);
  // // Note: FOR PRODUCTION MODE - Calculate the tax price
  const taxPrice = addDecimals(Number((0 * itemsPrice).toFixed(2)));

  // Note: FOR DEVELOPMENT & TEST MODE - Calculate the shipping price
  // const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 0.1);
  // Note: FOR DEVELOPMENT & TEST MODE - Calculate the tax price
  // const taxPrice = addDecimals(Number((0.01 * itemsPrice).toFixed(2)));

  // Calculate the total price
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
