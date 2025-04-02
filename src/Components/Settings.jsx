import React, { useState, useEffect } from 'react';

function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(5000); // Default to 5000ms
  const [successMessage, setSuccessMessage] = useState(''); // State for success message visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error message visibility
  const [selectedInstance, setSelectedInstance] = useState('demo');

  // Load API keys and interval from Electron store when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.bybitAPI.getSettings();
      console.log('Loaded settings:', settings); // Add this line to check loaded settings
      setApiKey(settings.apiKey || '');
      setApiSecret(settings.apiSecret || '');
      setRefreshInterval(settings.interval || 5000); // Load refresh interval from Electron store
      setSelectedInstance(settings.instance || 'demo');
    };

    loadSettings();
  }, []);

  // Save API keys to Electron store
  const handleSaveKeys = () => {
    if (apiKey && apiSecret) {
      window.bybitAPI.setApiKeys(apiKey, apiSecret);
      setSuccessMessage('API Keys saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
    } else {
      setErrorMessage('API Key and Secret are required!');
      setTimeout(() => setErrorMessage(''), 3000); // Hide after 3 seconds
    }
  };

  // Delete API keys from Electron store
  const handleDeleteKeys = () => {
    window.bybitAPI.setApiKeys('', ''); // Clear the keys
    setApiKey('');
    setApiSecret('');
    setSuccessMessage('API Keys deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
  };

  // Save the refresh interval to Electron store
  const handleSaveInterval = () => {
    console.log('Saving interval:', refreshInterval); // Debugging log
    if ([5000, 10000, 30000].includes(refreshInterval)) {
      window.bybitAPI.setInterval(refreshInterval);
      setSuccessMessage('Refresh interval saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
    } else {
      setErrorMessage(
        'Invalid interval value. Please choose from 5000ms, 10000ms, or 30000ms.',
      );
      setTimeout(() => setErrorMessage(''), 3000); // Hide after 3 seconds
    }
  };

  const handleInstanceChange = (event) => {
    setSelectedInstance(event.target.value);
  };

  const handleInstanceSave = async () => {
    try {
      const response = await window.bybitAPI.changeInstance(selectedInstance);
      console.log(`Bybit instance changed to: ${response.instance}`);
      setSuccessMessage('Chaged Instance! RESTART NEEDED!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Failed to change instance!', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] p-6  text-primary-text flex flex-col items-center">
      <h2 className="text-center text-3xl font-semibold mb-4 mt-4">Settings</h2>

      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg z-10">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message Popup */}
      {errorMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg z-10">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="flex flex-col w-[400px] justify-center">
        <div className="space-y-4">
          {/* API Key Input */}
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm text-gray-400 mb-2"
            >
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl"
              placeholder="Enter your API key"
            />
          </div>

          {/* API Secret Input */}
          <div>
            <label
              htmlFor="apiSecret"
              className="block text-sm text-gray-400 mb-2"
            >
              API Secret
            </label>
            <input
              type="password"
              id="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl"
              placeholder="Enter your API secret"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="flex-1 p-3 bg-btn text-white rounded-xl hover:bg-btn-hover transition-all duration-300"
              onClick={handleSaveKeys}
            >
              Save Keys
            </button>
            <button
              className="flex-1 p-3 bg-red-600 text-white rounded-xl hover:bg-red-800 transition-all duration-300"
              onClick={handleDeleteKeys}
            >
              Delete Keys
            </button>
          </div>
        </div>

        {/* Refresh Interval */}
        <div className="mt-6">
          <label
            htmlFor="refreshInterval"
            className="block text-sm text-gray-400 mb-2"
          >
            Refresh Interval (ms)
          </label>
          <select
            id="refreshInterval"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl"
          >
            <option value={5000}>5000 ms</option>
            <option value={10000}>10000 ms</option>
            <option value={30000}>30000 ms</option>
          </select>
          {/* Display the current interval */}
          <p className="mt-2 text-sm text-gray-400">
            Current Interval: {refreshInterval} ms
          </p>
        </div>

        <div className="mt-6">
          <button
            className="w-full p-3 bg-btn text-white rounded-xl hover:bg-btn-hover transition-all duration-300"
            onClick={handleSaveInterval}
          >
            Save Refresh Interval
          </button>
        </div>
        <div className="mt-6">
          <label
            htmlFor="bybitChange"
            className="block text-sm text-gray-400 mb-2"
          >
            Change Bybit Instance
          </label>
          <select
            name="bybitChange"
            id="bybitChange"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3"
            value={selectedInstance}
            onChange={handleInstanceChange}
          >
            <option hidden>Change instance</option>
            <option value="demo">Bybit Demo</option>
            <option value="mainnet">Bybit Mainnet</option>
          </select>
          <p className="mt-2 text-sm text-gray-400">
            Current instance:{' '}
            {selectedInstance == 'https://api.bybit.com' ? 'MAINNET' : 'DEMO'}
          </p>
          <p className="mt-2 text-sm text-red-500">
            Remember to change your API key!
          </p>
          <div className="mt-3">
            <button
              onClick={handleInstanceSave}
              className="w-full p-3 bg-btn text-white rounded-xl hover:bg-btn-hover transition-all duration-300"
            >
              Save Instance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
