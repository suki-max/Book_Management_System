import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import {
  FiTrash2,
  FiShoppingCart,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import axios from "../config/axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout title="Shopping Cart - BookBuddy">
      <div className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-lg text-gray-700">
              {!auth?.user
                ? "Hello Guest! 👋"
                : `Hello ${auth?.user?.name}! 👋`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {cart?.length
                ? `You have ${cart.length} item${
                    cart.length > 1 ? "s" : ""
                  } in your cart ${
                    auth?.token ? "" : "- please login to checkout"
                  }`
                : "Your cart is empty"}
            </p>
          </div>
        </div>
        {cart?.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cart?.map((p) => (
                    <div
                      key={p._id}
                      className="p-6 flex items-center space-x-4"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="h-24 w-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {p.description.substring(0, 80)}...
                        </p>
                        <p className="text-lg font-semibold text-indigo-600">
                          {p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => removeCartItem(p._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">
                      Subtotal ({cart?.length} items)
                    </span>
                    <span className="font-semibold text-gray-900">
                      {totalPrice()}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600">{totalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-6">
                  {auth?.user?.address ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FiMapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          Delivery Address
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {auth?.user?.address}
                      </p>
                      <button
                        onClick={() => navigate("/dashboard/user/profile")}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                      >
                        Update Address
                      </button>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm mb-3">
                        Please add your delivery address to proceed
                      </p>
                      {auth?.token ? (
                        <button
                          onClick={() => navigate("/dashboard/user/profile")}
                          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Add Address
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/login", { state: "/cart" })}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Login to Checkout
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Section */}
                <div className="mt-6">
                  {!clientToken || !auth?.token || !cart?.length ? (
                    <div className="text-center text-gray-500 text-sm">
                      {!auth?.token
                        ? "Please login to proceed"
                        : "Loading payment options..."}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <FiCreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="font-medium text-gray-900">
                            Payment Method
                          </h4>
                        </div>
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: {
                              flow: "vault",
                            },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          "Complete Payment"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
