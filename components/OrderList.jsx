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

const OrderList = ({ showAll = false }) => {
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      receiverAddr: "0xf00c8Ecb203e5C3ABbe7305F355dd273e0056FA0",
      senderLoc: "深水埗区青山道100号",
      receiverLoc: "中环干诺道中50号",
      status: 0,
      ethAmount: "0.05",
    },
    {
      id: 2,
      receiverAddr: "0xf00c8Ecb203e5C3ABbe7305F355dd273e0056FA0",
      senderLoc: "荃湾区德士古道88号",
      receiverLoc: "旺角弥敦道200号",
      status: 1,
      ethAmount: "0.03",
    },
  ]);
  useEffect(() => {
    // 检查用户是否已登录
    loadOrders();
    console.log("渲染了");
  }, []);
  // 加载订单数据
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
      }

      setOrders(ordersList);
    } catch (err) {
      console.error("加载订单失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 删除订单
  const handleDelete = (id) => {
    alert(`删除订单 #${id}`);
    // 实际删除逻辑需要实现
  };

  // 修改订单
  const handleEdit = (order) => {
    setSelectedOrder(order);
  };

  // 返回订单列表
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // 如果选择了订单，显示修改页面
  if (selectedOrder) {
    return <ModifyOrder order={selectedOrder} onBack={handleBackToList} />;
  }

  // 否则显示订单列表
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">我的订单</h2>

      {loading ? (
        <p>加载中...</p>
      ) : orders.length === 0 ? (
        <p>暂无订单</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">接收地址</th>
              <th className="p-2 text-left">发送位置</th>
              <th className="p-2 text-left">接收位置</th>
              <th className="p-2 text-left">金额</th>
              <th className="p-2 text-left">状态</th>
              <th className="p-2 text-left">操作</th>
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
                      "待处理",
                      "已接单",
                      "运输中",
                      "已送达",
                      "已完成",
                      "已取消",
                    ][order.status]
                  }
                </td>
                <td className="p-2">
                  {/* 如果是用户 */}
                  {!showAll && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(order)}
                        className="mr-2"
                        disabled={order.status !== 0}
                      >
                        修改
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(order.id)}
                        disabled={order.status !== 0}
                      >
                        删除
                      </Button>
                    </>
                  )}
                  {/* 如果是外卖员 */}{" "}
                  {showAll && (
                    <Button
                      size="sm"
                      onClick={() => handleEdit(order)}
                      className="mr-2"
                      disabled={order.status !== 0}
                    >
                      接单
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button className="mt-4" onClick={loadOrders}>
        刷新订单
      </Button>
    </div>
  );
};

export default OrderList;
