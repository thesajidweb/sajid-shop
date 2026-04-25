//todo dummy page with dummy details ... for future use only

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
  Bell,
  MessageCircle,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

type TrackingEvent = {
  id: string;
  date: string;
  time: string;
  status: string;
  location: string;
  description: string;
  completed: boolean;
  estimated?: boolean;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
  colorCode: string;
  image: string;
};

type TrackingOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippedDate: string;
  deliveredDate?: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  timeline: TrackingEvent[];
};

// Status configuration
const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    icon: LucideIcon;
    progress: number;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    icon: Clock,
    progress: 10,
    description: "Your order has been received and is awaiting processing",
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500",
    icon: Package,
    progress: 30,
    description: "Your order is being prepared for shipment",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500",
    icon: Truck,
    progress: 60,
    description: "Your order has been shipped and is on its way",
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    color: "bg-indigo-500",
    icon: Truck,
    progress: 85,
    description: "Your package is out for delivery today",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500",
    icon: CheckCircle,
    progress: 100,
    description: "Your order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    icon: XCircle,
    progress: 0,
    description: "This order has been cancelled",
  },
};

// Dummy tracking data
const generateTrackingData = (orderId: string): TrackingOrder => {
  const isDelivered = orderId.includes("DEL");
  const isOutForDelivery = orderId.includes("OUT");
  const isShipped = orderId.includes("SHP");
  const isProcessing = orderId.includes("PRO");
  const isPending = orderId.includes("PEN");
  const isCancelled = orderId.includes("CAN");

  let status: OrderStatus = "pending";
  if (isDelivered) status = "delivered";
  else if (isOutForDelivery) status = "out-for-delivery";
  else if (isShipped) status = "shipped";
  else if (isProcessing) status = "processing";
  else if (isCancelled) status = "cancelled";
  else if (isPending) status = "pending";

  const baseEvents: TrackingEvent[] = [
    {
      id: "evt1",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "Order Placed",
      location: "Online",
      description: "Your order has been placed successfully",
      completed: true,
    },
    {
      id: "evt2",
      date: "2024-01-15",
      time: "10:32 AM",
      status: "Payment Confirmed",
      location: "Online",
      description: "Payment has been confirmed",
      completed: true,
    },
    {
      id: "evt3",
      date: "2024-01-16",
      time: "09:15 AM",
      status: "Order Verified",
      location: "Warehouse",
      description: "Order details have been verified",
      completed: status !== "pending",
    },
    {
      id: "evt4",
      date: "2024-01-16",
      time: "02:30 PM",
      status: "Processing",
      location: "Fulfillment Center",
      description: "Items are being picked and packed",
      completed: [
        "processing",
        "shipped",
        "out-for-delivery",
        "delivered",
      ].includes(status),
    },
    {
      id: "evt5",
      date: "2024-01-17",
      time: "11:45 AM",
      status: "Shipped",
      location: "Distribution Center, NJ",
      description: "Your order has been shipped via UPS",
      completed: ["shipped", "out-for-delivery", "delivered"].includes(status),
    },
    {
      id: "evt6",
      date: "2024-01-18",
      time: "08:20 AM",
      status: "Arrived at Hub",
      location: "Regional Hub, NY",
      description: "Package has arrived at regional distribution hub",
      completed: ["out-for-delivery", "delivered"].includes(status),
    },
    {
      id: "evt7",
      date: "2024-01-18",
      time: "09:30 AM",
      status: "Out for Delivery",
      location: "Local Facility, Brooklyn",
      description: "Package is out for delivery",
      completed: status === "delivered",
      estimated: status === "out-for-delivery",
    },
    {
      id: "evt8",
      date: "2024-01-18",
      time: "02:15 PM",
      status: "Delivered",
      location: "Shipping Address",
      description: "Package has been delivered",
      completed: status === "delivered",
      estimated: status !== "delivered",
    },
  ];

  // If cancelled, add cancellation event
  if (status === "cancelled") {
    baseEvents.push({
      id: "evt9",
      date: "2024-01-16",
      time: "03:45 PM",
      status: "Cancelled",
      location: "System",
      description: "Order has been cancelled",
      completed: true,
    });
  }

  return {
    id: orderId,
    orderNumber: orderId,
    status,
    carrier: "UPS",
    trackingNumber: `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    estimatedDelivery: "2024-01-20",
    shippedDate: "2024-01-17",
    deliveredDate: status === "delivered" ? "2024-01-18" : undefined,
    items: [
      {
        id: "1",
        name: "Classic White T-Shirt",
        price: 29.99,
        quantity: 2,
        size: "M",
        colorName: "White",
        colorCode: "#FFFFFF",
        image: "/placeholder.jpg",
      },
      {
        id: "2",
        name: "Slim Fit Jeans",
        price: 79.99,
        quantity: 1,
        size: "32",
        colorName: "Blue",
        colorCode: "#0000FF",
        image: "/placeholder.jpg",
      },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "(555) 123-4567",
    },
    timeline: baseEvents.filter((event) => {
      if (status === "cancelled") return true;
      if (status === "pending")
        return (
          event.status === "Order Placed" ||
          event.status === "Payment Confirmed"
        );
      return true;
    }),
  };
};

export default function TraceOrderPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TrackingEvent | null>(
    null,
  );

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate dummy data based on order ID
        const data = generateTrackingData(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error)
          setError("Failed to load tracking information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleNotifyMe = () => {
    setNotifyMe(!notifyMe);
    if (!notifyMe) {
      alert("You will be notified of tracking updates");
    }
  };

  const handleContactSubmit = () => {
    alert(`Support message sent: ${contactMessage}`);
    setShowContactDialog(false);
    setContactMessage("");
  };

  const handleShareTracking = () => {
    // Simulate sharing
    alert("Tracking link copied to clipboard");
  };

  const handleDownloadProof = () => {
    // Simulate download
    alert("Downloading delivery proof...");
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <TrackingSkeleton />
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Order not found"}</AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </section>
    );
  }

  const StatusIcon = STATUS_CONFIG[order.status].icon;
  const statusInfo = STATUS_CONFIG[order.status];

  return (
    <TooltipProvider>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Track Order
                </h1>
                <Badge
                  className={`
                    ${statusInfo.color} text-white px-3 py-1
                  `}
                >
                  <StatusIcon className="h-3 w-3 mr-1 inline" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-base text-muted-foreground mt-1">
                Order #{order.orderNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh tracking</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNotifyMe}
                  >
                    <Bell
                      className={`h-4 w-4 ${notifyMe ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get notifications</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShareTracking}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share tracking</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Main tracking content */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Left column - Tracking timeline */}
          <div className="space-y-6">
            {/* Current status card */}
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      h-12 w-12 rounded-full ${statusInfo.color} bg-opacity-20 flex items-center justify-center
                    `}
                    >
                      <StatusIcon
                        className={`h-6 w-6 ${statusInfo.color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {statusInfo.label}
                      </h2>
                      <p className="text-muted-foreground">
                        {statusInfo.description}
                      </p>

                      {order.status === "shipped" && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {order.carrier} • {order.trackingNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {order.status === "out-for-delivery" && (
                        <div className="mt-3">
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 bg-green-50"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Expected today by 8 PM
                          </Badge>
                        </div>
                      )}

                      {order.status === "delivered" && order.deliveredDate && (
                        <div className="mt-3 text-sm text-green-600">
                          Delivered on{" "}
                          {new Date(order.deliveredDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {order.status === "delivered" && (
                    <Button variant="outline" onClick={handleDownloadProof}>
                      <Download className="mr-2 h-4 w-4" />
                      Proof of Delivery
                    </Button>
                  )}
                </div>

                {/* Progress bar for non-delivered/cancelled orders */}
                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Estimated delivery</span>
                        <span className="font-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <Progress value={statusInfo.progress} className="h-2" />
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Tracking timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {order.timeline.map((event, index) => (
                    <div
                      key={event.id}
                      className={`
                        relative flex gap-4 pb-8 last:pb-0 cursor-pointer
                        ${!event.completed && !event.estimated ? "opacity-50" : ""}
                      `}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {/* Timeline line */}
                      {index < order.timeline.length - 1 && (
                        <div
                          className={`
                          absolute left-[15px] top-6 w-0.5 h-[calc(100%-24px)]
                          ${event.completed ? "bg-green-500" : "bg-muted"}
                        `}
                        />
                      )}

                      {/* Dot */}
                      <div
                        className={`
                        relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                        ${
                          event.completed
                            ? "bg-green-500"
                            : event.estimated
                              ? "bg-blue-100 border-2 border-blue-500"
                              : "bg-muted"
                        }
                      `}
                      >
                        {event.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : event.estimated ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.status}</p>
                          <div className="text-right">
                            <p className="text-sm font-medium">{event.date}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.time}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 inline" />
                              {event.location}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        {event.estimated && (
                          <Badge
                            variant="outline"
                            className="mt-2 text-blue-600 border-blue-200 bg-blue-50"
                          >
                            Estimated
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Package details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-medium">{order.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tracking Number
                    </p>
                    <p className="font-medium font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Shipped Date
                    </p>
                    <p className="font-medium">
                      {new Date(order.shippedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Items in this package
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.colorName} • {item.size} • Qty:{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Shipping info & actions */}
          <div className="space-y-6">
            {/* Delivery address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dialog
                  open={showContactDialog}
                  onOpenChange={setShowContactDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Support</DialogTitle>
                      <DialogDescription>
                        Have a question about your delivery? Send us a message.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderRef">Order Reference</Label>
                        <Input
                          id="orderRef"
                          value={order.orderNumber}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowContactDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleContactSubmit}
                        disabled={!contactMessage}
                      >
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/account/orders/${order.orderNumber}`}>
                    <Package className="mr-2 h-4 w-4" />
                    View Order Details
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/faq#delivery">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Delivery FAQ
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Delivery preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">SMS Updates</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleNotifyMe}>
                    {notifyMe ? "Disable" : "Enable"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email Updates</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <Separator />

                <p className="text-xs text-muted-foreground">
                  You can change your notification preferences at any time
                </p>
              </CardContent>
            </Card>

            {/* Need help? */}
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Need Immediate Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist with delivery
                  issues
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="tel:+18001234567">
                      <Phone className="mr-2 h-4 w-4" />
                      Call 1-800-123-4567
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event details dialog */}
        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.status}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent?.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedEvent?.time}</p>
                </div>
              </div>

              {selectedEvent?.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedEvent?.description}</p>
              </div>

              {selectedEvent?.estimated && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Estimated Update</AlertTitle>
                  <AlertDescription>
                    This is an estimated time and may change based on delivery
                    conditions
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </TooltipProvider>
  );
}

// Skeleton loader for tracking page
function TrackingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
