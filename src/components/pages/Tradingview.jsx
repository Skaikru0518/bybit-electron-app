import React from 'react';

const Tradingview = () => {
  const isDev = !window.location.href.startsWith('file://');

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isDev ? (
        <p>
          WebWiev is disabled in development monde. Please build the app to use
          Tradingview
        </p>
      ) : (
        <webview
          src="https://tradingview.com/chart"
          style={{ width: '100%', height: '100%' }}
          allowpopups="true"
        />
      )}
    </div>
  );
};

export default Tradingview;
