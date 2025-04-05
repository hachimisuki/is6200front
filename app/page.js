"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, User } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 检查是否已连接钱包
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsLoggedIn(true);
        }
      } else {
        setError("请安装 MetaMask 钱包!");
      }
    } catch (error) {
      console.error("连接钱包时出错:", error);
    }
  };

  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        setWalletAddress(account);
        setIsLoggedIn(true);
        setError("");
      } else {
        setError("请安装 MetaMask 钱包!");
      }
    } catch (error) {
      console.error("连接钱包时出错:", error);
      if (error.code === 4001) {
        setError("您拒绝了钱包连接请求。");
      } else {
        setError(`连接钱包时出错: ${error.message}`);
      }
    }
  };

  const handleRoleSelect = (role) => {
    // 根据角色导航到相应的路由

    router.push(`/${role}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>登录</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full bg-black">
              使用钱包登录
            </Button>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>选择角色</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => handleRoleSelect("sender")} className="w-full">
            <Package className="mr-2 h-4 w-4" /> 发送者
          </Button>

          <Button
            onClick={() => handleRoleSelect("courier")}
            className="w-full"
          >
            <Truck className="mr-2 h-4 w-4" /> 快递员
          </Button>

          <Button
            onClick={() => handleRoleSelect("receiver")}
            className="w-full"
          >
            <User className="mr-2 h-4 w-4" /> 接收者
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
