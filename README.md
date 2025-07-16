# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

<<<<<<< HEAD
## Expanding the ESLint configuration
=======
## Technologies

- Electron
- Node.js
- JavaScript
- Bybit API v5

---

## Features

- **Trading Interface**: Place buy/sell orders directly from the app.
- **Market Data**: View real-time cryptocurrency market data.
- **API Key Management**: Securely manage your Bybit API keys.
- **Local Backend**: A Node.js backend handles API requests and business logic.
- **Cross-Platform**: Works on Windows, macOS, and Linux.

---

## Screenshots

![screenshot1](https://github.com/Skaikru0518/bybit-electron-app/blob/main/screenshots/dashboard.png)
![screenshot2](https://github.com/Skaikru0518/bybit-electron-app/blob/main/screenshots/settings.png)
![screenshot3](https://github.com/Skaikru0518/bybit-electron-app/blob/main/screenshots/trades.png)

## Prerequisites

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Git](https://git-scm.com/)

---



## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Skaikru0518/bybittraderapp.git
   cd bybittraderapp
   
2. **Install dependecies**:
   ```bash
   npm install

3. **Create ApiKeys.json inside src/Backend**:
     ```json
     {
        "apiKey": "YOUR_API_KEY",
        "apiSecret": "YOUR_API_SECRET"
     }
   
## Running the app
### Development mode

1. **Start the React frontend and Node.js backend simultaneously:**
   ```bash
   npm run dev

2. **The app will open in a new Electron window, and the backend will start automatically.**

### Production build
1. **Build the React app:**
    ```bash
    npm run build
2. **Package the electron app:**
   ```bash
   npm run dist

## Contributing
### Contributions are welcome! If you'd like to contribute to this project, please follow these steps:
1. Fork the repo.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your fork.
4. Submit a pull request with a detailed descrpition.

---
## License

MIT
>>>>>>> 75e7e0b5d7147bb1f9d633adefdfe98c9c67a626

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
