import { useEffect, useState } from "react";
import getFoodProduct from "../services/openFoodFacts";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const [barcode, setBarcode] = useState("");
const [foodProduct, setFoodProduct] = useState(null);
const [foodLoading, setFoodLoading] = useState(false);
const [foodError, setFoodError] = useState("");


  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

async function handleFoodLookup(event) {
  event.preventDefault();

  setFoodLoading(true);
  setFoodError("");
  setFoodProduct(null);

  try {
    const product = await getFoodProduct(barcode);
    setFoodProduct(product);
  } catch (error) {
    setFoodError(error.message);
  } finally {
    setFoodLoading(false);
  }
}


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      if (editingId !== null) {
        const updatedProduct = await updateProduct(
          editingId,
          name,
          Number(price)
        );

        setProducts(
          products.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );

        setEditingId(null);
      } else {
        const newProduct = await createProduct(name, Number(price));

        setProducts([...products, newProduct]);
      }

      setName("");
      setPrice("");
    } catch (error) {
      setError(error.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteProduct(id);

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setPrice("");
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <h1>Products</h1>

      {error && <p>{error}</p>}

      <h2>{editingId !== null ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>

          <input
            id="price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <button type="submit">
          {editingId !== null ? "Update Product" : "Add Product"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Product List</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>

            <p>Price: ${product.price}</p>

            <p>User ID: {product.user_id}</p>

            <button type="button" onClick={() => handleEdit(product)}>
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

<h2>Open Food Facts Lookup</h2>

<form onSubmit={handleFoodLookup}>
  <div>
    <label htmlFor="barcode">Barcode</label>

    <input
      id="barcode"
      type="text"
      value={barcode}
      onChange={(event) => setBarcode(event.target.value)}
      placeholder="3017620422003"
      required
    />
  </div>

  <button type="submit" disabled={foodLoading}>
    {foodLoading ? "Searching..." : "Search Food Product"}
  </button>
</form>

{foodError && <p>{foodError}</p>}

{foodProduct && (
  <div>
    <h3>{foodProduct.product_name}</h3>

    <p>Brand: {foodProduct.brands || "Unknown"}</p>

    <p>
      Nutri-Score:{" "}
      {foodProduct.nutriscore_grade?.toUpperCase() || "Not available"}
    </p>

    {foodProduct.image_url && (
      <img
        src={foodProduct.image_url}
        alt={foodProduct.product_name}
        width="200"
      />
    )}
  </div>
)}

    </div>
  );
}

export default Products;
