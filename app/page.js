"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, User } from "lucide-react";
import {
  CONTRACT_ADDRESS,
  USER_MANAGEMENT_ADDRESS,
  logistic_ABI,
  userManagement_ABI,
} from "@/utils/constants";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
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

  const handleRoleSelect = async (role) => {
    try {
      setRegistering(true);
      setError("");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 使用UserManagement合约
      const userManagementContract = new ethers.Contract(
        USER_MANAGEMENT_ADDRESS,
        userManagement_ABI,
        signer
      );

      let tx;

      // 根据选择的角色调用相应的注册函数
      switch (role) {
        case "sender":
          tx = await userManagementContract.registerAsSender(walletAddress);
          console.log("注册为发送者交易:", tx.hash);
          break;
        case "courier":
          tx = await userManagementContract.registerAsCourier(walletAddress);
          console.log("注册为快递员交易:", tx.hash);
          break;
        case "receiver":
          tx = await userManagementContract.registerAsReceiver(walletAddress);
          console.log("注册为接收者交易:", tx.hash);
          break;
        default:
          throw new Error("未知角色");
      }

      // 等待交易确认
      await tx.wait();
      console.log(`成功注册为${role}`);

      // 注册成功后跳转到相应页面
      router.push(`/${role}`);
    } catch (error) {
      console.error("角色注册失败:", error);
      setError(`注册失败: ${error.message.substring(0, 100)}...`);
    } finally {
      setRegistering(false);
    }
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
          <Button
            onClick={() => handleRoleSelect("sender")}
            className="w-full"
            disabled={registering}
          >
            <Package className="mr-2 h-4 w-4" /> 发送者
          </Button>

          <Button
            onClick={() => handleRoleSelect("courier")}
            className="w-full"
            disabled={registering}
          >
            <Truck className="mr-2 h-4 w-4" /> 快递员
          </Button>

          <Button
            onClick={() => handleRoleSelect("receiver")}
            className="w-full"
            disabled={registering}
          >
            <User className="mr-2 h-4 w-4" /> 接收者
          </Button>

          {registering && (
            <p className="text-center text-sm text-gray-500">
              注册中，请等待交易确认...
            </p>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
