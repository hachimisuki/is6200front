import { ethers } from "ethers";
import { LOGISTIC_ADDRESS, logistic_ABI2 } from "@/utils/constants";

// Get contract instance
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask wallet.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return new ethers.Contract(LOGISTIC_ADDRESS, logistic_ABI2, signer);
};

/**
 * Take an order - Courier accepts a pending order
 * @param {number} orderId - Order ID
 * @returns {Promise} Promise containing the transaction result
 */
export const takeOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // Call the takeOrder function in the contract
    const tx = await contract.takeOrder(orderId);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log("Order successfully taken:", receipt);
    return {
      success: true,
      message: "Order successfully taken",
      data: receipt,
    };
  } catch (error) {
    console.error("Failed to take order:", error);
    return {
      success: false,
      message: error.message || "Failed to take order",
      error,
    };
  }
};

/**
 * Start delivery - Change the order status to "In Transit"
 * @param {number} orderId - Order ID
 * @returns {Promise} Promise containing the transaction result
 */
export const startDelivery = async (orderId) => {
  try {
    const contract = await getContract();

    // Call the modifyOrder function in the contract to set the status to "In Transit" (2)
    const tx = await contract.modifyOrder(orderId, 2);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log("Order status updated to 'In Transit':", receipt);
    return {
      success: true,
      message: "Delivery started",
      data: receipt,
    };
  } catch (error) {
    console.error("Failed to start delivery:", error);
    return {
      success: false,
      message: error.message || "Failed to start delivery",
      error,
    };
  }
};

/**
 * Deliver order - Change the order status to "Delivered"
 * @param {number} orderId - Order ID
 * @returns {Promise} Promise containing the transaction result
 */
export const deliverOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // Call the modifyOrder function in the contract to set the status to "Delivered" (3)
    const tx = await contract.modifyOrder(orderId, 3);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log("Order status updated to 'Delivered':", receipt);
    return {
      success: true,
      message: "Order delivered",
      data: receipt,
    };
  } catch (error) {
    console.error("Failed to deliver order:", error);
    return {
      success: false,
      message: error.message || "Failed to deliver order",
      error,
    };
  }
};

/**
 * Cancel order - Change the order status to "Cancelled"
 * @param {number} orderId - Order ID
 * @returns {Promise} Promise containing the transaction result
 */
export const cancelOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // Call the modifyOrder function in the contract to set the status to "Cancelled" (5)
    const tx = await contract.modifyOrder(orderId, 5);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log("Order cancelled:", receipt);
    return {
      success: true,
      message: "Order cancelled",
      data: receipt,
    };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return {
      success: false,
      message: error.message || "Failed to cancel order",
      error,
    };
  }
};

/**
 * Get all orders for the courier
 * @returns {Promise<Array>} List of orders for the courier
 */
export const getCourierOrders = async () => {
  try {
    const contract = await getContract();
    const signer = contract.signer;
    const courierAddress = await signer.getAddress();

    // Get the total number of orders
    const totalOrderCount = await contract.totalOrderCount();

    // Find orders belonging to the current courier
    const orders = [];

    for (let i = 1; i <= totalOrderCount; i++) {
      try {
        const order = await contract.orderMap(i);

        if (order.courierAddr.toLowerCase() === courierAddress.toLowerCase()) {
          orders.push({
            id: order.orderID.toNumber(),
            senderAddr: order.senderAddr,
            receiverAddr: order.receiverAddr,
            senderLoc: order.senderLoc,
            receiverLoc: order.receiverLoc,
            status: parseInt(order.status.toString()),
            ethAmount: ethers.utils.formatEther(order.ethAmount),
            ltkReward: order.ltkReward.toString(),
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch order #${i}`, err);
      }
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      error,
    };
  }
};

/**
 * Get all available orders
 * @returns {Promise<Array>} List of all pending orders
 */
export const getAvailableOrders = async () => {
  try {
    const contract = await getContract();

    // Get the total number of orders
    const totalOrderCount = await contract.totalOrderCount();

    // Find all pending orders
    const orders = [];

    for (let i = 1; i <= totalOrderCount; i++) {
      try {
        const order = await contract.orderMap(i);

        // Only fetch orders with status "Pending" (0)
        if (parseInt(order.status.toString()) === 0) {
          orders.push({
            id: order.orderID.toNumber(),
            senderAddr: order.senderAddr,
            receiverAddr: order.receiverAddr,
            senderLoc: order.senderLoc,
            receiverLoc: order.receiverLoc,
            status: 0,
            ethAmount: ethers.utils.formatEther(order.ethAmount),
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch order #${i}`, err);
      }
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("Failed to fetch available orders:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch available orders",
      error,
    };
  }
};
