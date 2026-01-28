import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed

// A simple progress bar component to be used within the card
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden border border-gray-50">
    <div
      className="bg-gradient-to-r from-blood-500 to-blood-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(220,38,38,0.3)]"
      style={{ width: `${Math.min(progress, 100)}%` }}
    ></div>
  </div>
);

const FundraiserCard = ({ id, title, image, raised, goal, donors, formatCurrency, className = "", style }) => {
  const progress = goal > 0 ? (raised / goal) * 100 : 0;

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 overflow-hidden ${className}`}
      style={style}
    >
      {/* Image Section - Full Bleed with Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={image || "/placeholder.svg?height=300&width=400"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-blood-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            URGENT
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-blood-600 transition-colors" title={title}>
          {title}
        </h3>

        <div className="mt-auto">
          <ProgressBar progress={progress} />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Raised</span>
              <span className="text-lg font-bold text-blood-600">{formatCurrency(raised)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Goal</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(goal)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-50 mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {donors} Donors
              </span>
            </div>
            <span className="text-sm font-bold text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>

          <Link
            to={`/donate/${id}`}
            className="block w-full bg-gray-900 hover:bg-blood-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-md hover:shadow-blood-200"
          >
            <span className="flex items-center justify-center">
              Donate Now
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FundraiserCard;

