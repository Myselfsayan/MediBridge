import React from "react";

function Dashboard() {
  return (
    <div className="m-5">
      <h1 className="text-lg font-medium text-slate-900 mb-6">
          Dashboard
      </h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-16 h-16 bg-cyan-50 text-primary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome to MediBridge Admin</h2>
          <p className="text-slate-500 max-w-md">
              Manage your doctors, view all appointments, and keep track of your healthcare platform's activity from this professional dashboard.
          </p>
      </div>
    </div>
  )
}

export default Dashboard;
