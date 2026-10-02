from flask import Flask, request, session

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)
