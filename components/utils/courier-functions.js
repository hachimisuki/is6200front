import { ethers } from "ethers";
import { LOGISTIC_ADDRESS, logistic_ABI2 } from "@/utils/constants";

// 获取合约实例
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("请安装MetaMask钱包");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return new ethers.Contract(LOGISTIC_ADDRESS, logistic_ABI2, signer);
};

/**
 * 接单函数 - 快递员接受一个待处理的订单
 * @param {number} orderId - 要接单的订单ID
 * @returns {Promise} 包含交易结果的Promise
 */
export const takeOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // 调用合约的takeOrder函数
    const tx = await contract.takeOrder(orderId);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("接单成功:", receipt);
    return {
      success: true,
      message: "接单成功",
      data: receipt,
    };
  } catch (error) {
    console.error("接单失败:", error);
    return {
      success: false,
      message: error.message || "接单失败",
      error,
    };
  }
};

/**
 * 开始配送 - 将订单状态更改为"运输中"
 * @param {number} orderId - 订单ID
 * @returns {Promise} 包含交易结果的Promise
 */
export const startDelivery = async (orderId) => {
  try {
    const contract = await getContract();

    // 调用合约的modifyOrder函数，将状态设为"运输中"(2)
    const tx = await contract.modifyOrder(orderId, 2);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("订单已更新为运输中:", receipt);
    return {
      success: true,
      message: "已开始配送",
      data: receipt,
    };
  } catch (error) {
    console.error("开始配送失败:", error);
    return {
      success: false,
      message: error.message || "开始配送失败",
      error,
    };
  }
};

/**
 * 送达订单 - 将订单状态更改为"已送达"
 * @param {number} orderId - 订单ID
 * @returns {Promise} 包含交易结果的Promise
 */
export const deliverOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // 调用合约的modifyOrder函数，将状态设为"已送达"(3)
    const tx = await contract.modifyOrder(orderId, 3);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("订单已更新为已送达:", receipt);
    return {
      success: true,
      message: "订单已送达",
      data: receipt,
    };
  } catch (error) {
    console.error("送达失败:", error);
    return {
      success: false,
      message: error.message || "送达失败",
      error,
    };
  }
};

/**
 * 取消订单 - 将订单状态更改为"已取消"
 * @param {number} orderId - 订单ID
 * @returns {Promise} 包含交易结果的Promise
 */
export const cancelOrder = async (orderId) => {
  try {
    const contract = await getContract();

    // 调用合约的modifyOrder函数，将状态设为"已取消"(5)
    const tx = await contract.modifyOrder(orderId, 5);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("订单已取消:", receipt);
    return {
      success: true,
      message: "订单已取消",
      data: receipt,
    };
  } catch (error) {
    console.error("取消订单失败:", error);
    return {
      success: false,
      message: error.message || "取消订单失败",
      error,
    };
  }
};

/**
 * 获取快递员的所有订单
 * @returns {Promise<Array>} 快递员的订单列表
 */
export const getCourierOrders = async () => {
  try {
    const contract = await getContract();
    const signer = contract.signer;
    const courierAddress = await signer.getAddress();

    // 获取总订单数
    const totalOrderCount = await contract.totalOrderCount();

    // 查找属于当前快递员的订单
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
        console.warn(`获取订单 #${i} 失败`, err);
      }
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("获取订单失败:", error);
    return {
      success: false,
      message: error.message || "获取订单失败",
      error,
    };
  }
};

/**
 * 获取所有可接单的订单
 * @returns {Promise<Array>} 所有待处理订单列表
 */
export const getAvailableOrders = async () => {
  try {
    const contract = await getContract();

    // 获取总订单数
    const totalOrderCount = await contract.totalOrderCount();

    // 查找所有待处理的订单
    const orders = [];

    for (let i = 1; i <= totalOrderCount; i++) {
      try {
        const order = await contract.orderMap(i);

        // 只获取状态为"待处理"(0)的订单
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
        console.warn(`获取订单 #${i} 失败`, err);
      }
    }

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("获取可接单列表失败:", error);
    return {
      success: false,
      message: error.message || "获取可接单列表失败",
      error,
    };
  }
};
