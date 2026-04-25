
```markdown
# 🛍️ Sajid Shop - Modern eCommerce Platform

A scalable and production-ready eCommerce application built with Next.js, MongoDB, and modern web technologies. It includes a powerful admin dashboard, role-based access control, and optimized performance with advanced caching.

---

## ✨ Core Features

### 🛒 Storefront
- Product listing with search & filtering
- Product detail pages (Partial Prerendering)
- Shopping cart with real-time updates
- Checkout flow
- Wishlist system
- User profile & order history
- Fully responsive design

### 👑 Admin Dashboard
- Analytics dashboard (daily / monthly / yearly)
- Product CRUD management
- Collection-based product organization
- Order management system
- User & role management
- Image upload via ImageKit

### 🔐 Authentication & Roles
- Better Auth integration
- Google OAuth login
- Role-based access control:
  - Admin
  - Manager
  - Order Manager
  - Customer
  - Demo (read-only)

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit

### Backend
- Next.js API Routes
- MongoDB + Mongoose
- Better Auth
- ImageKit

---

## ⚡ Performance

- Static + Partial Prerendering
- Server Components with caching
- MongoDB indexing
- Image optimization
- Code splitting

---

## 📦 Project Structure

```

app/
(dashboard)/
api/
components/
lib/
actions/
db/
auth/
utils/
public/
proxy.ts

````

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
````

### 2. Setup environment variables

Create `.env` file:

```env
MONGODB_URL=


IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# App
NEXT_PUBLIC_APP_NAME=SajidShop
NEXT_PUBLIC_URL=http://localhost:3000


BETTER_AUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


# Security
JWT_SECRET=
ENCRYPTION_KEY=


```

### 3. Run project

```bash
npm run dev
```

---

## 🔑 Role Example

```ts
const session = await getServerAuth("UPDATE_PRODUCT");

if (!session) {
  // Access denied
}
```

---

## 📊 Analytics (Stored & Calculated)

* Revenue (daily / monthly / yearly)
* Orders count
* Top selling products
* User spending
* Average order value

---

## 🔧 Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

---

## 🛡️ Security

* Role-based route protection
* Zod validation
* Secure auth sessions
* MongoDB query protection

---

## 📌 Notes

* Uses cookies/localStorage for selected collection
* Optimized for performance and scalability
* Built for real-world eCommerce usage

---

## 📄 License

Private Project – Not for public distribution.

---

## 👨‍💻 Author

**Muhammad Sajid Shah**
