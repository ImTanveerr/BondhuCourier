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



## 🔐 entication & orization

- **JWT-based** entication system
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
| POST   | `/auth/login`      | Login and receive JWT  |
| POST   | `/auth/logout`      | Logout and remove JWT  |
| POST   | `/auth/reset-password`  | change own password |


### Sender Routes
| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/sender/create-parcel`  | Create a new parcel             |
| POST   | `/sender/cancel/:id`     | Cancel parcel before dispatch   |


### Receiver Routes
| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/parcels/incoming`     | List incoming parcels           |
| PATCH  | `/parcels/receive/:id`  | Confirm parcel delivery         |
| GET    | `/parcels/history`      | Get delivery history            |


### 📦 Parcel Routes (Accessible by Sender and Receiver)

The following endpoints allow senders and receivers to view and filter their parcels.

| Method | Endpoint                              | Description                                         |
|--------|---------------------------------------|-----------------------------------------------------|
| GET    | `/parcel/get-parcels`                 | Retrieve all parcels related to the user            |
| GET    | `/parcel/get-parcels/:id`             | Get details of a specific parcel by its ID          |
| GET    | `/parcel/get-parcels?searchTerm=`     | Search parcels by Searchable Fields                 |
| GET    | `/parcel/get-parcels?sort=`           | Sort parcels by fields (e.g., date, weight, status) |
| GET    | `/parcel/get-parcels?fields=`         | Select specific fields to display in the response   |
| GET    | `/parcel/get-parcels?page=`           | Paginate results by specifying the page number      |
| GET    | `/parcel/get-parcels?limit=`          | Limit the number of results per page                |


### 🔍 Searchable Fields

The following fields can be used with the `searchTerm` query parameter in `/parcel/get-parcels`:

- `description`
- `parcelType`
- `pickupAddress`
- `deliveryAddress`

**Example:**
```http
GET http://localhost:5000/api/v1/parcel/get-parcels?page=1&limit=2
GET http://localhost:5000/api/v1/parcel/get-parcels?fields=description
GET http://localhost:5000/api/v1/parcel/get-parcels?sort=pickupAddress
GET http://localhost:5000/api/v1/parcel/get-parcels?searchTerm=box



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
