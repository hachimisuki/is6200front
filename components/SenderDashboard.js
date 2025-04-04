"use client";
import { ethers } from "ethers";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateOrder from "./CreateOrder";
import OrderList from "./OrderList";
const SenderDashboard = ({ onRoleReset }) => {
  const [activeTab, setActiveTab] = useState("create-order");
  const [count, setCount] = useState(0);
  // 连接钱包 + 调用合约
  const addCount = async () => {
    if (!window.ethereum) return alert("需要 MetaMask!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    console.log("当前连接的网络:", network.name, "链ID:", network.chainId);
    // 你的合约地址
    const contractAddress = "0xf00c8Ecb203e5C3ABbe7305F355dd273e0056FA0";

    // 检查合约代码是否存在
    const code = await provider.getCode(contractAddress);
    console.log("合约地址上的代码:", code);

    if (code === "0x") {
      alert(
        `在当前网络(${network.name})上未找到合约代码。请检查合约地址和网络设置。`
      );
      return;
    }
    const contractABI = [
      {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      },
      {
        "inputs": [],
        "name": "count",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      },
    ];

    console.log("当前合约地址:", contractAddress);
    // 确认和部署的地址完全一致（包括大小写）

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log("合约连接成功！");
    // const tx = await contract.increment();
    // await tx.wait(); // 等待交易确认
    const latestCount = await contract.count();
    console.log("最新 count:", latestCount.toString());
    setCount(latestCount);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "create-order":
        return <CreateOrder />;
      case "orders":
        return <OrderList />;
      case "pay":
        return <PayOrder />;
      default:
        return <CreateOrder />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>发送者面板</CardTitle>
        <Button variant="ghost" onClick={onRoleReset}>
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
            <TabsTrigger value="pay">
              <DollarSign className="mr-2 h-4 w-4" /> 支付
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>{renderContent()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

function PayOrder() {
  return <div>支付订单的内容</div>;
}
export default SenderDashboard;
