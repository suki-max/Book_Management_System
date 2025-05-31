import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories - BookBuddy"}>
      <div className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover books across different genres and categories. Find your
            next great read!
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <FiBookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500">
              Categories will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <FiBookOpen className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-center text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    <span className="text-sm font-medium mr-1">Explore</span>
                    <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Browse all our products or use the search feature to find specific
              books.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <span>View All Products</span>
              <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
