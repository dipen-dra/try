"use client"

import React from 'react';
import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "./buttons"
import { ChevronDown, X, Menu } from "lucide-react"
import logo from "../assets/images/logo.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with animation */}
          <div className="flex items-center animate-fadeInLeft">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-6 h-6" // optional: to size the image nicely inside
                />
              </div>

              <span className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors duration-300">
                HopeCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 animate-fadeInDown">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">
                Services
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>
            </div>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Contact us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 animate-fadeInRight">
            <Link to="/login">
              <Button variant="ghost" size="small">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="small">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:bg-green-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:bg-green-50 rounded-lg"
            >
              Services
            </Link>
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Link to="/login">
                <Button variant="ghost" size="small" className="justify-start">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="small">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header