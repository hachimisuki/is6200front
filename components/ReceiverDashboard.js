"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ReceiverDashboard = ({ onRoleReset }) => {
  const [rating, setRating] = useState("1"); // 默认好评
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // 示例数据 - 实际应用中应该从智能合约获取
  const [orders, setOrders] = useState([
    {
      id: 1,
      courierAddr: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      senderLoc: "深水埗区青山道100号",
      receiverLoc: "中环干诺道中50号",
      status: 3, // Delivered
      ethAmount: "0.05",
    },
    {
      id: 2,
      courierAddr: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      senderLoc: "荃湾区德士古道88号",
      receiverLoc: "旺角弥敦道200号",
      status: 4, // Finished
      ethAmount: "0.03",
    },
  ]);

  // 订单状态文本
  const statusText = [
    "待处理",
    "已接单",
    "运输中",
    "待收货",
    "已完成",
    "已取消",
  ];

  // 确认收货
  const confirmReceive = async (orderId) => {
    setLoading(true);
    setStatus(`订单#${orderId} 确认中...`);

    try {
      if (!window.ethereum) return alert("请安装MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 合约地址需要替换为你实际部署的地址
      const contractAddress = "0x你的合约地址";
      const contractABI = [
        {
          inputs: [
            { internalType: "uint256", name: "_orderID", type: "uint256" },
            {
              internalType: "enum LogisticsPlatform.OrderRating",
              name: "_rating",
              type: "uint8",
            },
          ],
          name: "receiverOrder",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // 调用合约的receiverOrder函数
      const tx = await contract.receiverOrder(orderId, parseInt(rating));
      await tx.wait();

      // 更新订单状态
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: 4 } // 更新为已完成状态
            : order
        )
      );

      setStatus(`订单#${orderId} 已确认收货！`);
    } catch (err) {
      console.error("确认收货失败:", err);
      setStatus(`确认失败: ${err.message}`);
    } finally {
      setLoading(false);
      // 2秒后清除状态消息
      setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>接收者面板</CardTitle>
        <Button variant="ghost" onClick={onRoleReset}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回
        </Button>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold mb-4">我的订单</h2>

        {status && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
            {status}
          </div>
        )}

        {orders.length === 0 ? (
          <p className="text-center py-4">暂无订单</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">订单 #{order.id}</h3>
                    <p className="text-sm">送货地址: {order.receiverLoc}</p>
                    <p className="text-sm">金额: {order.ethAmount} ETH</p>
                    <p className="text-sm">
                      状态:
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

                  {order.status === 3 && (
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          defaultValue="1"
                          value={rating}
                          onValueChange={setRating}
                          className="flex space-x-2"
                        >
                          <div className="flex items-center">
                            <RadioGroupItem value="1" id={`good-${order.id}`} />
                            <Label
                              htmlFor={`good-${order.id}`}
                              className="ml-1"
                            >
                              好评
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
                              中评
                            </Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="3" id={`bad-${order.id}`} />
                            <Label htmlFor={`bad-${order.id}`} className="ml-1">
                              差评
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={() => confirmReceive(order.id)}
                        disabled={loading}
                      >
                        确认收货
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
  );
};

export default ReceiverDashboard;
