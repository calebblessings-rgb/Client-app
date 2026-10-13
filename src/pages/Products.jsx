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
    <main className="products-page">
      <header className="products-header">
        <div>
          <p className="eyebrow">Product Manager</p>
          <h1>Products</h1>
          <p className="page-intro">Add, update, and review your product inventory.</p>
        </div>
      </header>

      {error && <p className="form-message form-message--error" role="alert">{error}</p>}

      <div className="products-layout">
        <section className="panel product-editor" aria-labelledby="editor-title">
          <h2 id="editor-title">{editingId !== null ? "Edit product" : "Add product"}</h2>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Product name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button className="button button--primary" type="submit">
                {editingId !== null ? "Update product" : "Add product"}
              </button>
              {editingId !== null && (
                <button className="button button--secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel product-list" aria-labelledby="list-title">
          <div className="section-heading">
            <h2 id="list-title">Product list</h2>
            <span className="item-count">{products.length} items</span>
          </div>
          {products.length === 0 ? (
            <p className="empty-state">No products available.</p>
          ) : (
            <ul className="product-items">
              {products.map((product) => (
                <li className="product-item" key={product.id}>
                  <div>
                    <h3>{product.name}</h3>
                    <p className="product-meta">${Number(product.price).toFixed(2)} · User ID: {product.user_id}</p>
                  </div>
                  <div className="item-actions">
                    <button className="button button--secondary" type="button" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="button button--danger" type="button" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel food-lookup" aria-labelledby="lookup-title">
          <h2 id="lookup-title">Open Food Facts lookup</h2>
          <p className="section-description">Find product details by scanning or entering a barcode.</p>
          <form className="lookup-form" onSubmit={handleFoodLookup}>
            <div className="form-field">
              <label htmlFor="barcode">Barcode</label>
              <input
                id="barcode"
                name="barcode"
                type="text"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                placeholder="3017620422003"
                required
              />
            </div>
            <button className="button button--primary" type="submit" disabled={foodLoading}>
              {foodLoading ? "Searching..." : "Search product"}
            </button>
          </form>
          {foodError && <p className="form-message form-message--error" role="alert">{foodError}</p>}
          {foodProduct && (
            <article className="food-result">
              <div>
                <p className="eyebrow">Search result</p>
                <h3>{foodProduct.product_name}</h3>
                <p>Brand: {foodProduct.brands || "Unknown"}</p>
                <p>Nutri-Score: {foodProduct.nutriscore_grade?.toUpperCase() || "Not available"}</p>
              </div>
              {foodProduct.image_url && (
                <img src={foodProduct.image_url} alt={foodProduct.product_name} />
              )}
            </article>
          )}
        </section>
      </div>
    </main>
  );
}

export default Products;
