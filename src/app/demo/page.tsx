"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  Repeat2,
  Wallet,
} from "lucide-react";

const logos = {
  citreaAMM: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FFD700" }} />
          <stop offset="100%" style={{ stopColor: "#FFA500" }} />
        </linearGradient>
        <pattern
          id="citrusPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 20 Q20 0, 40 20 Q20 40, 0 20"
            fill="none"
            stroke="#FFE5B4"
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#bgGradient)" />
      <circle cx="100" cy="100" r="90" fill="url(#citrusPattern)" />
      <path
        d="M100 20 a80 80 0 0 1 0 160 a80 80 0 0 1 0 -160"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        opacity="0.6"
        strokeDasharray="25 8"
      />
      <circle cx="100" cy="100" r="60" fill="#FFFFFF" opacity="0.15" />
      <path
        d="M130 70 A40 40 0 1 0 130 130 A30 30 0 1 1 130 90 M120 85 A20 20 0 1 1 120 115"
        fill="none"
        stroke="#1a5f7a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <g transform="translate(85, 75) scale(0.8)">
        <path
          d="M15 20 h25 a15 15 0 0 1 0 30 h-25 M15 50 h30 a15 15 0 0 1 0 30 h-30 M25 10 v90 M40 10 v90"
          fill="none"
          stroke="#1a5f7a"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M150 40 Q160 35, 165 45 Q170 55, 160 60 Q150 65, 145 55 Q140 45, 150 40"
        fill="#4CAF50"
      />
    </svg>
  ),
};

const Presentation = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    // Page 1: Introduction
    <div
      key="intro"
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <div className="w-40 h-40 mb-8">{logos.citreaAMM}</div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
        CitriFi
      </h1>
      <p className="text-2xl text-gray-600 mb-8">
        The First Native Bitcoin AMM on Citrea
      </p>
      <div className="flex space-x-4">
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
          <Wallet className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">Native cBTC Support</span>
        </div>
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
          <Repeat2 className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">DCA</span>
        </div>
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
          <Repeat2 className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">Stablecoin Swap</span>
        </div>
      </div>
    </div>,

    // Page 2: Key Features
    <div key="features" className="flex flex-col h-full px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Key Features</h2>
      <div className="grid grid-cols-2 gap-8 flex-grow">
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-orange-600 mb-3">
              Native Integration
            </h3>
            <p className="text-gray-600">
              Seamlessly interact with Citrea's native cBTC token, enabling
              efficient and secure transactions.
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-yellow-600 mb-3">
              Optimal Pricing
            </h3>
            <p className="text-gray-600">
              Advanced constant product formula ensuring fair and efficient
              price discovery.
            </p>
          </div>
        </div>
        <div className="space-y-6 mt-12">
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Liquidity Rewards
            </h3>
            <p className="text-gray-600">
              Earn fees by providing liquidity to the protocol while maintaining
              full custody.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Security First
            </h3>
            <p className="text-gray-600">
              Thoroughly audited smart contracts with built-in safety
              mechanisms.
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Page 3: How It Works
    <div key="how-it-works" className="flex flex-col h-full px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-yellow-100 rounded-xl transform -rotate-1"></div>
          <div className="relative bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start">
                <ArrowDownCircle className="w-8 h-8 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Liquidity</h3>
                  <p className="text-gray-600">
                    Deposit cBTC and USDC to earn trading fees and rewards.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Repeat2 className="w-8 h-8 text-yellow-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Swap Tokens</h3>
                  <p className="text-gray-600">
                    Exchange cBTC for USDC or vice versa with minimal slippage.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Wallet className="w-8 h-8 text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                  <p className="text-gray-600">
                    Collect fees from trades proportional to your pool share.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Page 4: Call to Action
    <div
      key="cta"
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <h2 className="text-4xl font-bold mb-6">Start Trading Now</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Join the future of decentralized trading on Citrea with our secure and
        efficient AMM protocol.
      </p>
      <div className="flex space-x-4">
        <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-colors">
          Launch App
        </button>
        <button className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
          Documentation
        </button>
      </div>
    </div>,
  ];

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-grow relative">
        {pages[currentPage]}

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4">
          <button
            onClick={prevPage}
            className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex space-x-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentPage ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
            disabled={currentPage === pages.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
