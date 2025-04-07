"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  LOGISTIC_ADDRESS,
  logistic_ABI,
  logistic_ABI2,
} from "../utils/constants";
import ModifyOrder from "./ModifyOrder";
import {
  takeOrder,
  startDelivery,
  deliverOrder,
  cancelOrder,
  getCourierOrders,
  getAvailableOrders,
} from "@/components/utils/courier-functions";

const OrderList = ({ showAll = false, getTakedOrder = false }) => {
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Check if the user is logged in
    loadOrders();
    console.log("Rendered");
  }, []);

  // Load order data
  const loadOrders = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractAddress = LOGISTIC_ADDRESS;

      const contract = new ethers.Contract(
        contractAddress,
        logistic_ABI2,
        signer
      );
      const totalOrders = await contract.totalOrderCount();
      console.log("Total Orders:", totalOrders);
      const ordersList = [];
      for (let i = 1; i <= totalOrders.toNumber(); i++) {
        const order = await contract.orderMap(i);

        if (
          // showAll queries all orders || queries orders for the current sender
          !getTakedOrder ||
          showAll ||
          order.senderAddr.toLowerCase() === userAddress.toLowerCase()
        ) {
          ordersList.push({
            id: order.orderID.toNumber(),
            receiverAddr: order.receiverAddr,
            senderLoc: order.senderLoc,
            receiverLoc: order.receiverLoc,
            status: order.status,
            ethAmount: ethers.utils.formatEther(order.ethAmount),
          });
        }
        if (getTakedOrder) {
          // TODO: Query accepted orders
        }
      }

      setOrders(ordersList);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start delivery
  const startSend = async (orderId) => {
    await startDelivery(orderId);
    // Refresh order list
    loadOrders();
  };

  // Mark order as delivered
  const deliverOk = async (orderId) => {
    await deliverOrder(orderId);
    loadOrders();
  };

  // Delete order
  const handleDelete = (id) => {
    alert(`Delete order #${id}`);
    // Actual delete logic needs to be implemented
  };

  // Edit order
  const handleEdit = (order) => {
    setSelectedOrder(order);
  };

  // Accept order
  const handleAcceptOrder = async (orderId) => {
    try {
      // Show loading state
      setLoading(true);

      // Connect to Ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
        signer
      );

      // Call the takeOrder function in the contract
      const tx = await contract.takeOrder(orderId);

      // Wait for transaction confirmation
      await tx.wait();

      // Refresh order list
      loadOrders();
    } catch (error) {
      console.error("Failed to accept order:", error);
      alert(`Failed to accept order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Return to order list
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // If an order is selected, show the edit page
  if (selectedOrder) {
    return <ModifyOrder order={selectedOrder} onBack={handleBackToList} />;
  }

  // Otherwise, show the order list
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Receiver Address</th>
              <th className="p-2 text-left">Sender Location</th>
              <th className="p-2 text-left">Receiver Location</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.receiverAddr.slice(0, 6)}...</td>
                <td className="p-2">{order.senderLoc}</td>
                <td className="p-2">{order.receiverLoc}</td>
                <td className="p-2">{order.ethAmount} ETH</td>
                <td className="p-2">
                  {
                    [
                      "Pending",
                      "Taken",
                      "In Transit",
                      "Delivered",
                      "Completed",
                      "Cancelled",
                    ][order.status]
                  }
                </td>
                <td className="p-2">
                  {/* If user */}
                  {!showAll && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(order)}
                        className="mr-2"
                        disabled={order.status !== 0}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(order.id)}
                        disabled={order.status !== 0}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {/* If courier queries all available orders */}
                  {showAll && !getTakedOrder && (
                    <Button
                      size="sm"
                      onClick={() => handleAcceptOrder(order.id)}
                      className="mr-2"
                      disabled={order.status !== 0}
                    >
                      Accept Order
                    </Button>
                  )}
                  {/* If courier queries accepted orders */}
                  {true && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => startSend(order.id)}
                        className="mr-2"
                        disabled={order.status !== 1}
                      >
                        Start Delivery
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deliverOk(order.id)}
                        className="mr-2"
                        disabled={order.status !== 2}
                      >
                        Mark as Delivered
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button className="mt-4" onClick={loadOrders}>
        Refresh Orders
      </Button>
    </div>
  );
};

export default OrderList;
