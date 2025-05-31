import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Removed unused Antd imports - using native HTML inputs with Tailwind styling
import { Prices } from "../components/Price.js";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Products - Best offers"}>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src="/images/fotor-ai-20240619193052.jpg"
          className="w-full h-full object-cover"
          alt="BookBuddy Banner"
        />
        <div className="absolute inset-0  bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center mt-16 text-white">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
              Welcome to BookBuddy
            </h1>
            <p className="text-xl md:text-2xl">
              Discover your next favorite book
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span>Filter By Category</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({categories?.length || 0})
                  </span>
                </h3>
                <div className="space-y-3">
                  {categories?.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 hover:text-indigo-600 transition-colors">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Filter By Price
                </h3>
                <div className="space-y-3">
                  {Prices?.map((p) => (
                    <label
                      key={p._id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        value={p.array}
                        onChange={(e) => setRadio(e.target.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 hover:text-indigo-600 transition-colors">
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
                All Products
              </h2>
              <p className="text-gray-600">
                {products?.length || 0} products available
              </p>
            </div>

            {products?.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products?.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          alt={p.name}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {p.name}
                          </h3>
                          <span className="text-xl font-bold text-indigo-600">
                            {p.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {p.description.substring(0, 100)}...
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => navigate(`/product/${p.slug}`)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setCart([...cart, p]);
                              localStorage.setItem(
                                "cart",
                                JSON.stringify([...cart, p])
                              );
                              toast.success("Item Added to cart");
                            }}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {products && products.length < total && (
                  <div className="text-center mt-12">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                      disabled={loading}
                      className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More</span>
                          <AiOutlineReload />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
