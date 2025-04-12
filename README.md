# Stochastic Oscillator Trading Bot - Frontend

A modern, responsive web application for visualizing and backtesting cryptocurrency trading strategies using the Stochastic Oscillator indicator.

## Live Demo

[View the live demo](https://your-username.github.io/trading-bot-frontend) (Replace with your actual deployed URL)

![Screenshot](screenshots/dashboard.png)

## Features

- Interactive backtesting with configurable parameters
- Real-time price charts with trade entry/exit markers
- Performance metrics dashboard
- Detailed trade history with sorting and filtering
- Dark mode support
- Responsive design for all devices

## Built With

- **React** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Lightweight Charts** - Trading charts
- **Flask** - Backend API (separate repository)

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- A running instance of the [Stochastic Oscillator Trading Bot Backend](https://github.com/yourusername/trading-bot-backend)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/trading-bot-frontend.git
   cd trading-bot-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
   Update the URL to point to your backend API instance.

4. Start the development server:
   ```
   npm start
   ```
   The application will open in your browser at http://localhost:3000

### Connecting to the Backend

This frontend application requires the backend API to be running. By default, it will look for the API at `http://localhost:5000`. To connect to a different backend instance:

1. Update the `.env.local` file with your backend URL
2. Or deploy with environment variables set in your hosting platform

### Deployment

To build the application for production:

```
npm run build
```

The build is minified and optimized for best performance. See the [deployment section](https://facebook.github.io/create-react-app/docs/deployment) in the Create React App documentation for more information on deploying to various platforms.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework 