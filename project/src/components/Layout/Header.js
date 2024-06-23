import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import styled from "styled-components";

import { GiSpellBook } from "react-icons/gi";

const Navbar = styled.nav`
  background-color: #f8f9fa; /* Body tertiary color */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it's above other content */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
`;

const NavbarBrand = styled(Link)`
  font-weight: bold;
  color: #000;
  text-decoration: none;
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-right: 15px;
  position: relative;

  &:hover > ul {
    display: block;
  }
`;

const NavLinkItem = styled.div`
  color: #000;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: none;

  ${NavItem}:hover & {
    display: block;
  }
`;

const DropdownMenuItem = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const DropdownLink = styled.div`
  color: #000;
  text-decoration: none;
  cursor: pointer;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const handleCategoriesToggle = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleDropdownItemClick = (path) => {
    setIsCategoriesOpen(false);
    setIsUserDropdownOpen(false);
    // Navigate to the specified path
    // You might need to adjust this based on your router setup
    window.location.href = path;
  };

  return (
    <Navbar>
      <NavbarBrand to="/">
        <GiSpellBook style={{ fontSize: "30px" }} /> BookBuddy
      </NavbarBrand>
      <NavList>
        <NavItem>
          <SearchInput />
        </NavItem>
        <NavItem>
          <NavLinkItem>
            <NavLink style={{ textDecoration: "none", color: "black" }} to="/">
              Home
            </NavLink>
          </NavLinkItem>
        </NavItem>
        <NavItem>
          <NavLinkItem onClick={handleCategoriesToggle}>Categories</NavLinkItem>
          <DropdownMenu
            style={{ display: isCategoriesOpen ? "block" : "none" }}
          >
            <DropdownMenuItem>
              <DropdownLink
                onClick={() => handleDropdownItemClick("/categories")}
              >
                All Categories
              </DropdownLink>
            </DropdownMenuItem>
            {categories?.map((c) => (
              <DropdownMenuItem key={c.id}>
                <DropdownLink
                  onClick={() => handleDropdownItemClick(`/category/${c.slug}`)}
                >
                  {c.name}
                </DropdownLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </NavItem>
        {!auth?.user ? (
          <>
            <NavItem>
              <NavLinkItem>
                <NavLink to="/register">Register</NavLink>
              </NavLinkItem>
            </NavItem>
            <NavItem>
              <NavLinkItem>
                <NavLink to="/login">Login</NavLink>
              </NavLinkItem>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <NavLinkItem onClick={handleUserDropdownToggle}>
              {auth?.user?.name} <span className="caret"></span>
            </NavLinkItem>
            <DropdownMenu
              style={{ display: isUserDropdownOpen ? "block" : "none" }}
            >
              <DropdownMenuItem>
                <DropdownLink
                  onClick={() =>
                    handleDropdownItemClick(
                      `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`
                    )
                  }
                >
                  Dashboard
                </DropdownLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownLink
                  onClick={() =>
                    handleDropdownItemClick("/login", handleLogout)
                  }
                >
                  Logout
                </DropdownLink>
              </DropdownMenuItem>
            </DropdownMenu>
          </NavItem>
        )}
        <NavItem>
          <NavLinkItem>
            <NavLink to="/cart">
              <Badge count={cart?.length} showZero offset={[10, -5]}>
                Cart
              </Badge>
            </NavLink>
          </NavLinkItem>
        </NavItem>
      </NavList>
    </Navbar>
  );
};

export default Header;
