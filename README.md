# 📦 Parcel Delivery API

A **secure, modular, and role-based backend API** for managing a parcel delivery system inspired by Pathao Courier and Sundarban. Built using **Express.js**, **Mongoose**, and **TypeScript**, this project supports different user roles with controlled access to parcel operations, including tracking, creation, and status updates.

---

## 🎯 Project Overview

This API allows:
- ✅ **Senders** to create, cancel, and track their parcels
- ✅ **Receivers** to view incoming parcels and confirm delivery
- ✅ **Admins** to manage users and parcel statuses
- ✅ **Embedded status tracking** with full parcel history
- ✅ **JWT-based authentication** and **role-based authorization**

---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Auth**: JWT, Bcrypt
- **Testing**: Postman
- **Tooling**: ts-node-dev, ESLint

---



## 🔐 Authentication & Authorization

- **JWT-based** authentication system
- **Password hashing** using bcrypt
- Three user roles:
  - `admin`
  - `sender`
  - `receiver`
- **Role-based access control middleware**

---

## 🧱 Parcel & Status Schema

### Parcel Fields:
- `trackingId` (`TRK-YYYYMMDD-xxxxxx`)
- `senderId`, `receiverId`
- `type`, `weight`, `deliveryAddress`
- `fee`, `status`, `isBlocked`
- `statusLogs[]`: Array of subdocuments

### StatusLog Subdocument:
- `status` (e.g., Requested, Dispatched, Delivered)
- `location`
- `note`
- `updatedBy`
- `timestamp`

---

## 📦 Parcel Flow & Validations

- 📌 Only **senders** can create parcels
- 🚫 Parcels can be **canceled** only before dispatch
- ✅ **Receivers** can confirm delivery
- 🔐 **Admins** can update status or block users/parcels
- ❌ Blocked users can't access the system
- 🔁 **Status log** auto-updates with every status change

---

## 📊 API Endpoints

### Auth Routes
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/auth/register`   | Register as a user     |
| POST   | `/auth/login`      | Login and receive JWT  |

### Sender Routes
| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/parcels`               | Create a new parcel             |
| PATCH  | `/parcels/cancel/:id`    | Cancel parcel before dispatch   |
| GET    | `/parcels/me`            | Get sender's parcels            |
| GET    | `/parcels/:id/status-log`| Get full status history         |

### Receiver Routes
| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/parcels/incoming`     | List incoming parcels           |
| PATCH  | `/parcels/receive/:id`  | Confirm parcel delivery         |
| GET    | `/parcels/history`      | Get delivery history            |

### Admin Routes
| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/admin/users`           | View all users                 |
| PATCH  | `/admin/users/block/:id` | Block a user                   |
| GET    | `/admin/parcels`         | View all parcels               |
| PATCH  | `/admin/parcels/status/:id`| Update parcel status         |
| PATCH  | `/admin/parcels/block/:id` | Block a parcel                |

---

## 🧪 Testing & Documentation

- ✅ **Postman** collection included
- ✅ All endpoints tested with authentication and role-based access
- ✅ Status codes follow HTTP conventions (e.g., 200, 401, 403, 404)

---

## 📦 Tracking & Status History

- **Unique Tracking ID**: `TRK-YYYYMMDD-xxxxxx`
- **Status history** viewable by:
  - Sender (all parcels)
  - Receiver (incoming)
  - Admin (all parcels)
- **Location-based tracking** optional (status logs include location field)

---

## 💼 Business Logic Rules

- 🚫 Dispatched parcels can't be canceled
- ✅ Receivers can confirm delivery
- 🔐 Blocked users lose all access
- ✅ All status changes logged with user and timestamp
- ⚠️ Status transitions are validated (no skipping)

---

## 💡 Bonus Features (Optional)

- 📍 Tracking system with public tracking ID (future scope)
- 📊 Fee calculation based on weight (flat rate in current build)
- 🎁 Coupons or discounts (optional for future release)
- 🧑‍💼 Admin dashboard (API-ready)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run the development server
npm run dev
