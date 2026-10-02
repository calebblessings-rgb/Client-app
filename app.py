from flask import Flask, request, session
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    supports_credentials=True
)

app.secret_key = "dev-secret-key"

users = [{
    "id": 1,
    "email": "caleb@example.com",
    "password": "password123"
}]


@app.route("/")
def home():
    return {"message": "Product Manager API is running!"}


@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    for user in users:
        if user["email"] == email and user["password"] == password:
            session["user_id"] = user["id"]

            return {
                "message": "Sign-in successful",
                "user_id": user["id"]
            }

    return {
        "message": "Invalid email or password"
    }, 401

@app.get("/me")
def current_user():
    user_id = session.get("user_id")

    if not user_id:
        return {
            "message": "User not signed in"
        }, 401

    return {
        "message": "User is signed in",
        "user_id": user_id
    }

products = []


@app.get("/products")
def get_products():
    return products

@app.post("/products")
def create_product():
    user_id = session.get("user_id")

    if not user_id:
        return {
            "message": "You must be signed in"
        }, 401

    data = request.get_json()

    product = {
        "id": len(products) + 1,
        "name": data.get("name"),
        "price": data.get("price"),
        "user_id": user_id
    }

    products.append(product)

    return product, 201

@app.patch("/products/<int:product_id>")
def update_product(product_id):
    user_id = session.get("user_id")

    if not user_id:
        return {
            "message": "You must be signed in"
        }, 401

    data = request.get_json()

    for product in products:
        if product["id"] == product_id:

            if product["user_id"] != user_id:
                return {
                    "message": "You cannot edit this product"
                }, 403

            if "name" in data:
                product["name"] = data["name"]

            if "price" in data:
                product["price"] = data["price"]

            return product, 200

    return {
        "message": "Product not found"
    }, 404

@app.delete("/products/<int:product_id>")
def delete_product(product_id):
    user_id = session.get("user_id")

    if not user_id:
        return {
            "message": "You must be signed in"
        }, 401

    for product in products:
        if product["id"] == product_id:

            if product["user_id"] != user_id:
                return {
                    "message": "You cannot delete this product"
                }, 403

            products.remove(product)

            return {
                "message": "Product deleted successfully"
            }, 200

    return {
        "message": "Product not found"
    }, 404

if __name__ == "__main__":
    app.run(debug=True)
