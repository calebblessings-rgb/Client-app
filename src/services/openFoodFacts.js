const OPEN_FOOD_FACTS_URL =
  "https://world.openfoodfacts.org/api/v3/product";

async function getFoodProduct(barcode) {
  const response = await fetch(
    `${OPEN_FOOD_FACTS_URL}/${barcode}?fields=code,product_name,brands,image_url,nutriscore_grade`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product from Open Food Facts");
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error("Product was not found");
  }

  return data.product;
}

export default getFoodProduct;
