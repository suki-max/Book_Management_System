import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { GiSpellBook } from "react-icons/gi";
import {
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <GiSpellBook className="text-2xl sm:text-3xl" />
            <span className="font-playfair hidden sm:block">BookBuddy</span>
            <span className="font-playfair sm:hidden">BB</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <SearchInput />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Home Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-indigo-600 font-medium transition-colors ${
                  isActive ? "text-indigo-600 border-b-2 border-indigo-600" : ""
                }`
              }
            >
              Home
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <span>Categories</span>
                <FiChevronDown className="text-sm" />
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${
                  isCategoriesOpen ? "block" : "hidden"
                } group-hover:block`}
              >
                <Link
                  to="/categories"
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  All Categories
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Links */}
            {!auth?.user ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/register"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Login
                </NavLink>
              </div>
            ) : (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <FiUser className="text-lg" />
                  <span>{auth?.user?.name}</span>
                  <FiChevronDown className="text-sm" />
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${
                    isUserDropdownOpen ? "block" : "hidden"
                  } group-hover:block`}
                >
                  <Link
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <FiShoppingCart className="text-xl" />
              <span className="font-medium hidden lg:block">Cart</span>
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart */}
            <NavLink
              to="/cart"
              className="relative text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <FiShoppingCart className="text-xl" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchInput />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Home Link */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block text-gray-700 hover:text-indigo-600 font-medium transition-colors ${
                    isActive ? "text-indigo-600" : ""
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>

              {/* Categories */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span>Categories</span>
                  <FiChevronDown
                    className={`text-sm transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isCategoriesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <Link
                      to="/categories"
                      className="block text-gray-600 hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      All Categories
                    </Link>
                    {categories?.map((c) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        className="block text-gray-600 hover:text-indigo-600 transition-colors"
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth Links */}
              {!auth?.user ? (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <NavLink
                    to="/register"
                    className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FiUser className="text-lg" />
                    <span className="font-medium">{auth?.user?.name}</span>
                  </div>
                  <Link
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="block text-gray-700 hover:text-indigo-600 transition-colors ml-6"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 transition-colors ml-6"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
