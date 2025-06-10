
# Herafi\_BOT – Optimism Sepolia Automation Bot

Herafi\_BOT is a Node.js-based Command-Line Interface (CLI) bot designed to streamline interactions with the **Optimism Sepolia** network. This bot can automatically perform:

* 💧 Claiming from faucets
* 🔄 Token swaps
* 💼 Adding liquidity
* 🗑️ Removing liquidity

Built using [Ethers.js v6](https://docs.ethers.org/v6/), this bot is especially useful for developers and DApp testers in a testnet environment.

---

## 📦 Key Features

* 💧 Automatically claim testnet faucet tokens
* 💱 Swap tokens between specific addresses or types
* 💼 Add liquidity to supported protocols
* 🗑️ Remove liquidity from protocols
* 🔐 `.env` support to securely manage private keys and sensitive config
* 🧪 Tailored for the **Optimism Sepolia** test network

---

## 🏗️ Project Structure

```
Herafi_BOT/
├── LICENSE            # License information
├── .env.example       # Environment config template
├── index.js         # Main script
├── package.json       # Metadata and npm dependencies
└── README.md          # This documentation
```

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bronkdrop/Herafi-Testnet-Bot.git
   cd Herafi-Testnet-Bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the environment config**

   Copy `.env.example` to `.env` and fill in the following variables:

   ```
   cp .env.example .env
   ```

   ```
   PRIVATE_KEY=YourPrivateKeyHere
   RPC_URL=https://sepolia.optimism.io
   CYCLE_MINUTES=60
   ```

---

## 🚀 Running the Bot

Run the bot using:

```bash
npm start
```

> Follow the interactive prompts in the terminal. Make sure your wallet has enough test ETH to cover gas fees.

Ensure your `package.json` includes the following section:

```json
"scripts": {
  "start": "node index.js"
}
```

---

## 🌐 Requirements

* Node.js v18+
* Stable internet connection
* A wallet with test ETH on the **Optimism Sepolia** network

---

## 📃 License

Distributed under the MIT License. See `LICENSE` for more information.


Last updated: Tue Jun 10 12:25:51 UTC 2025
