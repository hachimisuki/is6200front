"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, User } from "lucide-react";
import SenderDashboard from "@/components/SenderDashboard";
import CourierDashboard from "@/components/CourierDashboard";
import ReceiverDashboard from "@/components/ReceiverDashboard";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  // 检查是否已连接钱包
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      // 检查浏览器是否有 Ethereum 对象 (MetaMask)
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
        // 请求用户授权访问其 MetaMask 账户
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // 获取用户的钱包地址
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
        // 用户拒绝了请求
        setError("您拒绝了钱包连接请求。");
      } else {
        setError(`连接钱包时出错: ${error.message}`);
      }
    }
  };
  const handleRoleSelect = (role) => {
    setUserRole(role);
  };
  const resetUserRole = () => {
    setUserRole(null);
  };
  // const logoutWallet = async () => {
  //   try {
  //     // 清除应用程序中的状态
  //     setWalletAddress("");
  //     setIsLoggedIn(false);
  //     setUserRole(null);

  //     // 如果要尝试"忘记"这个站点连接
  //     if (window.ethereum && window.ethereum._metamask) {
  //       // 注意：这是非标准 API，可能在未来版本中变化或失效
  //       try {
  //         // 尝试调用 MetaMask 的内部方法断开当前站点
  //         await window.ethereum._metamask.disconnect();
  //         console.log("MetaMask 连接已断开");
  //       } catch (err) {
  //         console.log("无法通过 API 断开 MetaMask", err);
  //       }
  //     }

  //   } catch (error) {
  //     console.error("注销时出错:", error);
  //   }
  // };

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
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>选择角色</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={() => handleRoleSelect("sender")}
              className="w-full"
            >
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
            {/* <Button onClick={() => logoutWallet()} className="w-full">
              <User className="mr-2 h-4 w-4" /> 注销
            </Button> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {userRole === "sender" && (
          <SenderDashboard onRoleReset={resetUserRole} />
        )}
        {userRole === "courier" && (
          <CourierDashboard onRoleReset={resetUserRole} />
        )}
        {userRole === "receiver" && (
          <ReceiverDashboard onRoleReset={resetUserRole} />
        )}
      </main>
    </div>
  );
}
