import React from 'react';

export default function About() {
  return (
    <div className="w-full min-h-[calc(100vh-60px)] text-primary-text flex items-center justify-center gap-10">
      <div className="bg-card-bg p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          About This App
        </h1>

        <div className="text-lg text-muted-text space-y-4">
          <p className="mb-4">
            This application provides real-time data from Bybit's API, allowing
            you to monitor open positions, set take profit (TP) and stop loss
            (SL), and easily close positions with a click.
          </p>

          <h2 className="text-xl font-medium text-white">Version</h2>
          <p className="text-lg text-muted-text">v1.0.3</p>

          <h2 className="text-xl font-medium text-white">Features:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Track your open positions</li>
            <li>Modify TP/SL values</li>
            <li>Instantly close positions</li>
            <li>Customizable refresh intervals</li>
          </ul>
        </div>

        <div className="flex flex-col my-8 gap-5">
          <h2>Changes</h2>
          <ul className="list-disc list-inside text-muted-text space-y-2">
            <li>Added animations for switching tabs</li>
            <li>Added animations for component buttons</li>
            <li>Adjusted font size at trading tab for better visibility</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-btn text-primary-text font-semibold py-2 px-6 rounded-lg hover:bg-btn-hover transition-all duration-300"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
