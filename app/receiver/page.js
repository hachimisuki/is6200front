"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LOGISTIC_ADDRESS, logistic_ABI2 } from "@/utils/constants";

export default function ReceiverPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null); // Track the currently processing order ID
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderRatings, setOrderRatings] = useState({}); // Ratings for each order

  // Order status text
  const statusText = [
    "Pending",
    "Taken",
    "In Transit",
    "Awaiting Receipt",
    "Completed",
    "Cancelled",
  ];

  // Check if the user is logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length === 0) {
          router.push("/");
        } else {
          // Load receiver's orders
          loadReceiverOrders(accounts[0]);
        }
      } catch (error) {
        console.error("Error verifying identity:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  // Load receiver's orders
  const loadReceiverOrders = async (userAddress) => {
    setLoadingOrders(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
        signer
      );

      // Get total order count
      const totalOrderCount = await contract.totalOrderCount();

      // Store orders belonging to the current user
      const myOrders = [];
      const newOrderRatings = {};

      // Iterate through all orders
      for (let i = 1; i <= totalOrderCount; i++) {
        const order = await contract.orderMap(i);

        // Check if the order belongs to the current user
        if (order.receiverAddr.toLowerCase() === userAddress.toLowerCase()) {
          const orderId = order.orderID.toNumber();
          myOrders.push({
            id: orderId,
            senderLoc: order.senderLoc,
            receiverLoc: order.receiverLoc,
            status: parseInt(order.status.toString()),
            ethAmount: ethers.utils.formatEther(order.ethAmount),
          });

          // Set default rating for each order to "Good"
          newOrderRatings[orderId] = orderRatings[orderId] || "1";
        }
      }

      setOrders(myOrders);
      setOrderRatings(newOrderRatings);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setStatus("Failed to retrieve orders. Please try again later.");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Update the rating for a specific order
  const handleRatingChange = (orderId, newRating) => {
    setOrderRatings((prev) => ({
      ...prev,
      [orderId]: newRating,
    }));
  };

  // Confirm receipt of an order
  const confirmReceive = async (orderId) => {
    setLoading(true);
    setProcessingOrderId(orderId);
    setStatus(`Order #${orderId} is being confirmed...`);

    try {
      if (!window.ethereum) return alert("Please install MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log("Current user address:", userAddress);

      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
        signer
      );

      // Retrieve order details for verification
      const order = await contract.orderMap(orderId);
      console.log("Order details:", order);
      console.log("Order status:", order.status.toString());
      console.log("Order receiver address:", order.receiverAddr);
      console.log(
        "Does the current user address match the receiver:",
        order.receiverAddr.toLowerCase() === userAddress.toLowerCase()
      );

      // Check if the order status is "Delivered" (3)
      if (parseInt(order.status.toString()) !== 3) {
        throw new Error("Only delivered orders can be confirmed.");
      }

      // Ensure the receiver address matches
      if (order.receiverAddr.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error("You are not the receiver of this order.");
      }

      // Map the rating based on the contract's OrderRating enum
      const ratingMap = {
        "1": 1, // Good
        "2": 2, // Neutral
        "3": 3, // Bad
      };

      const ratingStr = orderRatings[orderId] || "1";
      const orderRating = ratingMap[ratingStr];

      console.log(
        "Order ID:",
        orderId,
        "Rating option:",
        ratingStr,
        "Mapped to enum value:",
        orderRating
      );

      // Submit the transaction
      const tx = await contract.receiverOrder(orderId, orderRating);
      console.log("Transaction submitted:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Update the order status
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: 4 } // Update to "Completed"
            : order
        )
      );

      setStatus(`Order #${orderId} has been successfully confirmed!`);
    } catch (err) {
      console.error("Failed to confirm receipt:", err);

      let errorMsg = err.message;
      if (err.data) {
        try {
          errorMsg = `Contract error: ${err.data}`;
        } catch (e) {}
      }

      setStatus(`Confirmation failed: ${errorMsg}`);
    } finally {
      setLoading(false);
      setProcessingOrderId(null);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const handleRoleReset = () => {
    router.push("/");
  };

  // Manually refresh orders
  const handleRefresh = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        loadReceiverOrders(accounts[0]);
      }
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Receiver Panel</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loadingOrders}
              >
                {loadingOrders ? "Loading..." : "Refresh Orders"}
              </Button>
              <Button variant="ghost" onClick={handleRoleReset}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>

            {status && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
                {status}
              </div>
            )}

            {loadingOrders ? (
              <div className="text-center py-8">
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center py-4">No orders available</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">Order #{order.id}</h3>
                        <p className="text-sm">
                          Sender Address: {order.senderLoc}
                        </p>
                        <p className="text-sm">
                          Delivery Address: {order.receiverLoc}
                        </p>
                        <p className="text-sm">Amount: {order.ethAmount} LTK</p>
                        <p className="text-sm">
                          Status:
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              order.status === 3
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === 4
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {statusText[order.status]}
                          </span>
                        </p>
                      </div>

                      {true && (
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroup
                              defaultValue="1"
                              value={orderRatings[order.id] || "1"}
                              onValueChange={(value) =>
                                handleRatingChange(order.id, value)
                              }
                              className="flex space-x-2"
                            >
                              <div className="flex items-center">
                                <RadioGroupItem
                                  value="1"
                                  id={`good-${order.id}`}
                                />
                                <Label
                                  htmlFor={`good-${order.id}`}
                                  className="ml-1"
                                >
                                  Good
                                </Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem
                                  value="2"
                                  id={`neutral-${order.id}`}
                                />
                                <Label
                                  htmlFor={`neutral-${order.id}`}
                                  className="ml-1"
                                >
                                  Neutral
                                </Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem
                                  value="3"
                                  id={`bad-${order.id}`}
                                />
                                <Label
                                  htmlFor={`bad-${order.id}`}
                                  className="ml-1"
                                >
                                  Bad
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <Button
                            onClick={() => confirmReceive(order.id)}
                            disabled={
                              order.status !== 3 ||
                              loading ||
                              processingOrderId === order.id
                            }
                            variant="delivered"
                            className="w-full mt-5"
                          >
                            {processingOrderId === order.id
                              ? "Processing..."
                              : "Confirm Receipt"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
