# Herafi\_BOT – Bot Tự Động cho Optimism Sepolia

Herafi\_BOT là một bot giao diện dòng lệnh (CLI) dựa trên Node.js, được thiết kế để đơn giản hóa việc tương tác với mạng **Optimism Sepolia**. Bot này có thể tự động thực hiện:

* 💧 Nhận token từ faucet
* 🔄 Hoán đổi token
* 💼 Thêm thanh khoản
* 🗑️ Rút thanh khoản

Được xây dựng với [Ethers.js v6](https://docs.ethers.org/v6/), bot này rất hữu ích cho các nhà phát triển và người kiểm thử DApp trong môi trường testnet.

---

## 📦 Tính Năng Chính

* 💧 Tự động nhận token từ faucet testnet
* 💱 Hoán đổi token giữa các địa chỉ/token cụ thể
* 💼 Thêm thanh khoản vào các giao thức được hỗ trợ
* 🗑️ Rút thanh khoản khỏi giao thức
* 🔐 Hỗ trợ tệp `.env` để bảo mật khóa riêng và cấu hình nhạy cảm
* 🧪 Được thiết kế riêng cho mạng **Optimism Sepolia**

---

## 🏗️ Cấu Trúc Dự Án

```
Herafi_BOT/
├── LICENSE            # Thông tin giấy phép
├── .env.example       # Mẫu cấu hình môi trường
├── autoBot.js         # Script chính
├── package.json       # Metadata và các gói npm
└── README.md          # Tài liệu này
```

---

## ⚙️ Cài Đặt

1. **Clone repository**

   ```bash
   git clone https://github.com/bronkdrop/Herafi-Testnet-Bot.git
   cd Herafi-Testnet-Bot
   ```

2. **Cài đặt các phụ thuộc**

   ```bash
   npm install
   ```

3. **Thiết lập tệp cấu hình môi trường**

   Sao chép `.env.example` thành `.env` và điền các biến sau:

   ```
   cp .env.example .env
   ```

   ```
   PRIVATE_KEY=KhóaRiêngCủaBạn
   RPC_URL=https://sepolia.optimism.io
   CYCLE_MINUTES=60
   ```

---

## 🚀 Chạy Bot

Chạy bot bằng lệnh:

```bash
npm start
```

> Làm theo hướng dẫn tương tác hiển thị trong terminal. Đảm bảo ví của bạn có đủ ETH testnet để trả phí gas.

Đảm bảo `package.json` của bạn có phần sau:

```json
"scripts": {
  "start": "node index.js"
}
```

---

## 🌐 Yêu Cầu

* Node.js v18 trở lên
* Kết nối internet ổn định
* Ví có ETH testnet trên mạng **Optimism Sepolia**

## 📃 Giấy Phép

Phân phối theo giấy phép MIT. Xem tệp `LICENSE` để biết thêm chi tiết.

---

## 🙌 Đóng Góp

Rất hoan nghênh các pull request và issue! Với các đóng góp lớn, vui lòng tạo *issue* trước để thảo luận về thay đổi bạn muốn thực hiện.
