import { Metadata } from "next";

type ProjectSection = {
  title: string;
  description: string;
  techDetails?: string[];
  metrics?: string;
};

export const metadata: Metadata = {
  title: "Project Overview",
  description:
    "Project overview for Sajid Shop, a portfolio e-commerce application built with Next.js. This demo project showcases product management, authentication, and scalable architecture for learning purposes.",
};

const sections: ProjectSection[] = [
  {
    title: "🎯 Project Overview",
    description:
      "This is a full-stack e-commerce platform built for small to medium businesses. It supports product management, orders, users, and analytics. The system is designed to handle growing data and users without major changes.",
    metrics: "Scalable system | Supports thousands of users",
    techDetails: [
      "Built with modern full-stack technologies",
      "Clean and scalable structure",
      "Ready for real-world use",
    ],
  },

  {
    title: "🏗️ System Architecture",
    description:
      "The project is built with a clean and organized structure. Backend logic, database queries, and API routes are separated to make the code easy to manage and update.",
    techDetails: [
      "API → Service → Database structure",
      "Reusable functions for business logic",
      "Custom hooks for frontend data fetching",
    ],
  },

  {
    title: "🔐 Role & Permission System",
    description:
      "The app uses a role-based access system. Each user has a role and only allowed actions can be performed. All permissions are checked on the backend for better security.",
    techDetails: [
      "Roles: Admin, Manager, Order Manager, Customer, Demo",
      "15+ permissions (create, update, delete, etc.)",
      "Session reset when role changes",
      "Secure API-level permission checks",
    ],
  },

  {
    title: "📦 Product Management",
    description:
      "Products support multiple variants like colors and sizes. Each variant has its own stock. This makes it easy to manage complex products like clothing.",
    techDetails: [
      "Product → Colors → Sizes → Stock",
      "Separate stock for each variant",
      "Supports bulk updates",
      "Tracks product stats (sales, views)",
    ],
  },

  {
    title: "⚡ Performance Optimization",
    description:
      "The system is optimized for fast performance. Only required data is fetched, and caching is used to reduce load on the server.",
    metrics: "Fast API responses (~200ms)",
    techDetails: [
      "Optimized database queries",
      "Next.js caching",
      "Debounced search",
      "Image optimization with CDN",
    ],
  },

  {
    title: "🛒 Order Management",
    description:
      "Orders are handled safely using database transactions. If any step fails, the system rolls back changes to avoid errors in stock or data.",
    techDetails: [
      "Safe order processing with transactions",
      "Order status flow (pending → delivered)",
      "Stock updates during order",
      "Limit on active orders per user",
    ],
  },

  {
    title: "🔍 Search & Filters",
    description:
      "Users can search products and apply filters like category, price, and date. Sorting and pagination are also supported.",
    techDetails: [
      "Search by name and brand",
      "Filter by category and price",
      "Sorting options",
      "Pagination support",
    ],
  },

  {
    title: "🖼️ Image Handling",
    description:
      "Images are managed using ImageKit CDN. Images are optimized automatically for better performance and faster loading.",
    techDetails: [
      "CDN-based image storage",
      "Automatic optimization",
      "Lazy loading",
      "Supports multiple images per product",
    ],
  },

  {
    title: "📊 Analytics",
    description:
      "The admin dashboard shows important business data like sales, orders, and popular products.",
    techDetails: [
      "Sales tracking",
      "Top products",
      "Order trends",
      "Basic reporting system",
    ],
  },

  {
    title: "🎨 UI & Design",
    description:
      "The UI is modern and responsive. It works on mobile, tablet, and desktop devices.",
    techDetails: [
      "Built with Tailwind CSS",
      "Responsive design",
      "Dark mode support",
      "Form validation with Zod",
    ],
  },

  {
    title: "🔄 State Management",
    description:
      "Global state is managed using Redux Toolkit. Data fetching and caching are handled efficiently.",
    techDetails: [
      "Redux Toolkit",
      "RTK Query for API calls",
      "Optimistic UI updates",
      "Cart saved in localStorage",
    ],
  },

  {
    title: "🔐 Security",
    description:
      "Basic security practices are implemented to protect user data and API routes.",
    techDetails: [
      "Password hashing with bcrypt",
      "Protected API routes",
      "Input validation using Zod",
      "Environment variables for secrets",
    ],
  },

  {
    title: "💳 Payments (In Progress)",
    description:
      "Currently supports Cash on Delivery. Other payment methods will be added soon.",
    techDetails: [
      "Cash on Delivery",
      "Stripe integration planned",
      "JazzCash & Easypaisa planned",
    ],
  },

  {
    title: "📧 Notifications (Planned)",
    description:
      "Email system is planned for sending order updates and account messages.",
    techDetails: [
      "Order confirmation emails",
      "Password reset emails",
      "Using Resend (planned)",
    ],
  },

  {
    title: "🚧 Limitations",
    description:
      "Some features are still in progress and will be improved in future updates.",
    techDetails: [
      "Review system not complete",
      "Forgot password pending",
      "Logging can be improved",
    ],
  },

  {
    title: "🚀 Future Plans",
    description:
      "The project will be improved with more features and better performance.",
    techDetails: [
      "Add payment integrations",
      "Complete review system",
      "Deploy to production",
      "Add caching (Redis)",
      "Build mobile app",
    ],
  },
];
export default function ProjectOverview() {
  return (
    <div className="max-w-5xl mx-auto p-2 md:4 space-y-2 ">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Full-Stack E-Commerce Platform
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A modern and scalable e-commerce system with role-based access,
          product management, and secure order handling. Built with real-world
          architecture in mind.
        </p>

        {/* Highlight Line */}
        <p className="md:text-sm text-xs text-muted-foreground">
          Production-ready • Secure • Multi-role • Scalable
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full md:text-sm text-xs">
            Next.js 16
          </span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full md:text-sm text-xs">
            TypeScript
          </span>
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full md:text-sm text-xs">
            MongoDB
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full md:text-sm text-xs">
            Redux Toolkit
          </span>
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full md:text-sm text-xs">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full md:text-sm text-xs">
            ImageKit CDN
          </span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full md:text-sm text-xs">
            Zod Validation
          </span>
        </div>

        {/* Key Features */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            🔐 Role-Based Access
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            ⚡ Fast Performance
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            📦 Product Variants
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            🛒 Order System
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            📊 Analytics Dashboard
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-center">
          <div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              15+
            </p>
            <p className="text-xs text-gray-500">Permissions</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              5
            </p>
            <p className="text-xs text-gray-500">User Roles</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ~200ms
            </p>
            <p className="text-xs text-gray-500">API Response</p>
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Scalable
            </p>
            <p className="text-xs text-gray-500">Architecture</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <div
          key={index}
          className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900"
        >
          <h2 className="h2-text font-semibold mb-3 flex items-center gap-2">
            {section.title}
          </h2>
          <p className="text-muted-foreground p-text leading-relaxed mb-3">
            {section.description}
          </p>

          {section.metrics && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="p-text text-blue-700 dark:text-blue-300 font-mono">
                📊 {section.metrics}
              </p>
            </div>
          )}

          {section.techDetails && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-muted-foreground  mb-2">
                Technical Details:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {section.techDetails.map((detail, i) => (
                  <li className="p-text" key={i}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
