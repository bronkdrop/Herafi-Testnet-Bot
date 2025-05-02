# Herafi\_BOT – Optimism Sepolia 自動化ボット

**Herafi\_BOT** は、**Optimism Sepolia** ネットワークとのやりとりを簡素化するために設計された Node.js ベースのコマンドラインインターフェース（CLI）ボットです。
このボットは以下の操作を自動的に実行できます：

* 💧 ファウセットの請求
* 🔄 トークンのスワップ
* 💼 流動性の追加
* 🗑️ 流動性の削除

[**Ethers.js v6**](https://docs.ethers.org/v6/) を使用して構築されており、テストネット環境での DApp 開発・テストに非常に役立ちます。

---

## 📦 主な機能

* 💧 テストネットファウセットからの自動請求
* 💱 特定のアドレスやトークン間のスワップ
* 💼 対応するプロトコルへの流動性追加
* 🗑️ プロトコルからの流動性削除
* 🔐 `.env` ファイルによる秘密鍵と機密情報の安全な管理
* 🧪 **Optimism Sepolia** ネットワーク専用に設計

---

## 🏗️ プロジェクト構成

```
Herafi_BOT/
├── LICENSE            # ライセンス情報
├── .env.example       # 環境変数設定のテンプレート
├── index.js         # メインスクリプト
├── package.json       # メタ情報と npm 依存関係
└── README.md          # このドキュメント
```

---

## ⚙️ インストール方法

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/bronkdrop/Herafi-Testnet-Bot.git
   cd Herafi-Testnet-Bot
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   ```

3. **環境変数を設定**

   `.env.example` を `.env` にコピーし、以下の変数を設定してください：

   ```
   cp .env.example .env
   ```


   ```
   PRIVATE_KEY=あなたの秘密鍵
   RPC_URL=https://sepolia.optimism.io
   CYCLE_MINUTES=60
   ```

---

## 🚀 ボットの実行

以下のコマンドでボットを起動します：

```bash
npm start
```

> ターミナルに表示されるインタラクティブな指示に従ってください。ガス代のためにテストネット ETH を十分に用意しておいてください。

`package.json` に以下のスクリプトが含まれていることを確認してください：

```json
"scripts": {
  "start": "node index.js"
}
```

---

## 🌐 必要環境

* Node.js v18 以上
* 安定したインターネット接続
* **Optimism Sepolia** ネットワーク上の ETH を持つウォレット

---

## 📃 ライセンス

このプロジェクトは MIT ライセンスの下で配布されています。詳細は `LICENSE` ファイルをご覧ください。

---

## 🙌 貢献

プルリクエストやイシューは大歓迎です！大きな変更を提案する場合は、まず issue を立てて内容を相談してください。

