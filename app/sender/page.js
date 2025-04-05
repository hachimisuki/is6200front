"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateOrder from "../../components/CreateOrder";
import OrderList from "../../components/OrderList";

export default function SenderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create-order");
  const [walletAddress, setWalletAddress] = useState("");

  // 检查用户是否已登录
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // 检查是否连接了钱包
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length === 0) {
          // 如果没有连接钱包，重定向到主页
          router.push("/");
        } else {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("验证身份时出错:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  const handleRoleReset = () => {
    router.push("/"); // 返回角色选择页面
  };

  const renderContent = () => {
    switch (activeTab) {
      case "create-order":
        return <CreateOrder />;
      case "orders":
        return <OrderList showAll={false} />;
      default:
        return <CreateOrder />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>发送者面板</CardTitle>
            <Button variant="ghost" onClick={handleRoleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回选择身份
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="create-order">
                  <Package className="mr-2 h-4 w-4" />
                  创建订单
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  我的订单
                </TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>{renderContent()}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
