# PhonePe MERN Clone (Backend Only)

A simple, easy-to-understand Backend for a PhonePe clone project. This system is heavily commented and uses beginner-friendly architectures while simulating a real-world FinTech application environment.

## 🌟 Full Feature Set
1. **User Authentication:** Strict JWT-based Register and Login system.
2. **Dynamic UPI IDs:** Newly registered users automatically receive a unique UPI tag (e.g., `saurabh354@phonepe`).
3. **Strict MPIN System:** All outbound transactions mathematically enforce a robust 4-digit MPIN verification layer. 
4. **Flexible Peer-to-Peer Transfers:** Send money directly to users by entering either their **10-digit Phone Number** OR their assigned **UPI ID**.
5. **Wallet Top-Up:** Simulate direct bank transfers by adding test deposits into a user's wallet via the Top-up route.
6. **Utility Bill Payments:** Mock endpoints for recharging Mobile Data or paying Electricity Bills. Recharges natively deduct wallet bounds while logging specialized `BILL_PAY` histories.
7. **Detailed Transaction Records:** See all history of deposits, withdrawals, utility bills, and friend transfers mapped recursively to the user logged in.
8. **Swagger User Interface:** A complete webpage auto-generating readable tables for all your available endpoints.
9. **Interactive Postman Library:** Complete endpoint repository fully equipped with auto-saving Environment token scripting out-of-the-box!

---

## 🛠 Tech Stack Used
- NodeJS & ExpressJS Framework
- MongoDB Memory System with Mongoose ORM
- BcryptJS (Password & MPIN ciphering)
- JSONWebToken (Session Validation)
- Swagger-UI (Auto Documentations)


### Install & Setup
```bash
npm install
```

Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/phonepay
JWT_SECRET=your_secret_key
```

### Run
```bash
npm run dev          # Development
npm start            # Production
npm run swagger      # Update API docs
```

View API docs at: `http://localhost:3000/api-docs`



## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/transaction` | Get transactions |
| POST | `/api/transaction` | Create transaction |
| GET | `/api/wallet/balance` | Get wallet balance |
| POST | `/api/wallet/transfer` | Transfer funds |

*Authentication endpoints require Bearer token*

## Project Structure
```
src/
├── config/db.js
├── controllers/
├── middleware/authMIddleware.js
├── models/
└── routes/
```

## Author
prince-rathod


