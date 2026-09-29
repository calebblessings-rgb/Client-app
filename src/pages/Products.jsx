import { useState } from "react";

function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop",
      price: 800,
      user_id: 1,
    },
    {
      id: 2,
      name: "Keyboard",
      price: 50,
      user_id: 1,
    },
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setProducts(
        products.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name,
                price: Number(price),
              }
            : product
        )
      );

      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        price: Number(price),
        user_id: 1,
      };

      setProducts([...products, newProduct]);
    }

    setName("");
    setPrice("");
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
  }

  function handleDelete(id) {
    setProducts(products.filter((product) => product.id !== id));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setPrice("");
  }

  return (
    <div>
      <h1>Products</h1>

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

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>User ID: {product.user_id}</p>

          <button type="button" onClick={() => handleEdit(product)}>
            Edit
          </button>

          <button type="button" onClick={() => handleDelete(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;
