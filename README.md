
# Binance Orderbook Challenge

Real-time orderbook viewer for cryptocurrency pairs using the Binance WebSocket API. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Environment Variables

Before running the project, you must create a `.env` file based on `.env.example` and set the required values:

```
cp .env.example .env
```

Required variables:

- `NEXT_PUBLIC_WS_BASE_URL`: WebSocket URL for the orderbook (default: wss://stream.binance.com:9443/ws/)
- `NEXT_PUBLIC_API_EXCHANGE_INFO_URL`: API URL for exchange info (default: https://api.binance.com/api/v3/exchangeInfo)

You can change these values in your `.env` file if you need to use different endpoints.

### Development Mode

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the development server:
    ```bash
    npm run dev
    ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Mode with Docker

1. Build the image:
    ```bash
    docker build -t orderbook-challenge .
    ```
2. Run the container:
    ```bash
    docker run -p 3000:3000 orderbook-challenge
    ```
3. Access [http://localhost:3000](http://localhost:3000)

## 🏗️ Main Technologies
- **Next.js 14** (App Router)
- **TypeScript** (strict typing)
- **Tailwind CSS**
- **Docker**

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Global layout
│   └── components/           # UI components
│       ├── Dropdown.tsx
│       ├── currencies/
│       │   └── CurrencySelector.tsx
│       ├── orderbook/
│       │   ├── OrderBookItem.tsx
│       │   ├── OrderBookLayout.tsx
│       │   └── OrderBookTable.tsx
│       └── skeletons/
│           └── SkeletonTable.tsx
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
```

## ✨ Main Features
- Real-time orderbook visualization using WebSocket
- Switch between currency pairs (BTC/USDT, ETH/USDT, etc.)
- Skeletons and loading states for smooth UX
- Error handling and automatic reconnection
- Responsive and modern design

## ⚙️ Design Decisions & Trade-offs
- **WebSocket vs Polling:** WebSocket was chosen for real-time data and to avoid overloading the Binance API. This results in a much smoother and more efficient experience.
- **Skeletons & Transitions:** Skeletons and smooth transitions were implemented to avoid layout shifts and improve perceived speed.
- **Strict Typing:** The entire codebase uses TypeScript for better maintainability and fewer bugs.

## 🛠️ What I Would Improve with More Time
- Add unit and integration tests.
- Dark mode support.

## 📝 Final Notes
This project was developed as a technical challenge. Clarity, performance, and user experience were prioritized. The code is easily extensible and ready to scale with new features.

---

Developed by Agustin
