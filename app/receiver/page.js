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
  const [rating, setRating] = useState("1"); // 默认好评
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 订单状态文本
  const statusText = [
    "待处理",
    "已接单",
    "运输中",
    "待收货",
    "已完成",
    "已取消",
  ];

  // 检查用户是否已登录
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
          // 加载收货人订单
          loadReceiverOrders(accounts[0]);
        }
      } catch (error) {
        console.error("验证身份时出错:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  // 加载收货人的订单
  const loadReceiverOrders = async (userAddress) => {
    setLoadingOrders(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 创建合约实例
      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
        signer
      );

      // 获取订单总数
      const totalOrderCount = await contract.totalOrderCount();

      // 存储属于当前用户的订单
      const myOrders = [];

      // 遍历获取所有订单
      for (let i = 1; i <= totalOrderCount; i++) {
        const order = await contract.orderMap(i);

        // 检查是否是当前用户的订单
        if (order.receiverAddr.toLowerCase() === userAddress.toLowerCase()) {
          myOrders.push({
            id: order.orderID.toNumber(),
            senderLoc: order.senderLoc,
            receiverLoc: order.receiverLoc,
            status: parseInt(order.status.toString()),
            ethAmount: ethers.utils.formatEther(order.ethAmount),
          });
        }
      }

      setOrders(myOrders);
    } catch (error) {
      console.error("加载订单失败:", error);
      setStatus("获取订单失败，请稍后再试");
    } finally {
      setLoadingOrders(false);
    }
  };

  // 确认收货
  const confirmReceive = async (orderId) => {
    setLoading(true);
    setStatus(`订单#${orderId} 确认中...`);

    try {
      if (!window.ethereum) return alert("请安装MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
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
      // 5秒后清除状态消息
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const handleRoleReset = () => {
    router.push("/");
  };

  // 手动刷新订单
  const handleRefresh = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        loadReceiverOrders(accounts[0]);
      }
    } catch (error) {
      console.error("刷新订单失败:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>接收者面板</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loadingOrders}
              >
                {loadingOrders ? "加载中..." : "刷新订单"}
              </Button>
              <Button variant="ghost" onClick={handleRoleReset}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold mb-4">我的订单</h2>

            {status && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
                {status}
              </div>
            )}

            {loadingOrders ? (
              <div className="text-center py-8">
                <p>正在加载订单...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center py-4">暂无订单</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">订单 #{order.id}</h3>
                        <p className="text-sm">发送地址: {order.senderLoc}</p>
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
                                <RadioGroupItem
                                  value="1"
                                  id={`good-${order.id}`}
                                />
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
                                <RadioGroupItem
                                  value="3"
                                  id={`bad-${order.id}`}
                                />
                                <Label
                                  htmlFor={`bad-${order.id}`}
                                  className="ml-1"
                                >
                                  差评
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <Button
                            onClick={() => confirmReceive(order.id)}
                            disabled={loading}
                          >
                            {loading ? "处理中..." : "确认收货"}
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
