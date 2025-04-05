"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, User, Check } from "lucide-react";
import {
  USER_MANAGEMENT_ADDRESS,
  logistic_ABI,
  userManagement_ABI,
} from "@/utils/constants";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [roleStatus, setRoleStatus] = useState({
    sender: false,
    courier: false,
    receiver: false,
  });
  const router = useRouter();

  // 检查是否已连接钱包
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // 当钱包地址变化时，检查角色状态
  useEffect(() => {
    if (walletAddress) {
      checkRoleStatus();
    }
  }, [walletAddress]);

  // 检查用户拥有哪些角色
  const checkRoleStatus = async () => {
    try {
      if (!walletAddress) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userManagementContract = new ethers.Contract(
        USER_MANAGEMENT_ADDRESS,
        userManagement_ABI,
        provider
      );

      // 首先检查用户是否已注册
      const isRegistered = await userManagementContract.isRegistered(
        walletAddress
      );

      if (isRegistered) {
        // 如果已注册，获取用户角色
        const userRole = await userManagementContract.userRoles(walletAddress);

        // 根据合约中的角色枚举定义，判断用户角色
        // 假设枚举定义为：enum Role { None, Sender, Courier, Receiver }
        const roleEnum = parseInt(userRole.toString());

        // 更新用户角色状态
        setRoleStatus({
          sender: roleEnum === 0, // Role.Sender
          courier: roleEnum === 1, // Role.Courier
          receiver: roleEnum === 2, // Role.Receiver
        });

        console.log("用户已注册，角色代码:", roleEnum);
      } else {
        // 如果未注册，所有角色状态都是false
        setRoleStatus({
          sender: false,
          courier: false,
          receiver: false,
        });
        console.log("用户未注册");
      }
    } catch (error) {
      console.error("检查角色状态时出错:", error);
    }
  };

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
      // 如果用户已经注册了该角色，直接进入对应页面
      if (roleStatus[role]) {
        router.push(`/${role}`);
        return;
      }

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
      // 注意: 根据合约检查，注册函数不需要传入地址参数，会使用msg.sender
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
          tx = await userManagementContract.registerAsReciever(walletAddress);
          console.log("注册为接收者交易:", tx.hash);
          break;
        default:
          throw new Error("未知角色");
      }

      // 等待交易确认
      await tx.wait();
      console.log(`成功注册为${role}`);

      // 更新角色状态
      setRoleStatus((prev) => ({
        ...prev,
        [role]: true,
      }));

      // 注册成功后跳转到相应页面
      router.push(`/${role}`);
    } catch (error) {
      console.error("角色注册失败:", error);
      setError(`注册失败: ${error.message.substring(0, 100)}...`);
    } finally {
      setRegistering(false);
    }
  };

  const handleEnterRole = (role) => {
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
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>选择角色</CardTitle>
          <p className="text-sm text-gray-600">您可以注册并使用多个角色</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            {/* 发送者卡片 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">发送者</h3>
                </div>
                {roleStatus.sender && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> 已注册
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                作为发送者，您可以创建订单并发送物品
              </p>
              <div className="flex space-x-2">
                {roleStatus.sender ? (
                  <Button
                    onClick={() => handleEnterRole("sender")}
                    className="flex-1"
                    disabled={registering}
                  >
                    进入发送者面板
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("sender")}
                    className="flex-1"
                    disabled={registering}
                  >
                    注册为发送者
                  </Button>
                )}
              </div>
            </div>

            {/* 快递员卡片 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">快递员</h3>
                </div>
                {roleStatus.courier && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> 已注册
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                作为快递员，您可以接单并运送物品
              </p>
              <div className="flex space-x-2">
                {roleStatus.courier ? (
                  <Button
                    onClick={() => handleEnterRole("courier")}
                    className="flex-1"
                    disabled={registering}
                  >
                    进入快递员面板
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("courier")}
                    className="flex-1"
                    disabled={registering}
                  >
                    注册为快递员
                  </Button>
                )}
              </div>
            </div>

            {/* 接收者卡片 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">接收者</h3>
                </div>
                {roleStatus.receiver && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> 已注册
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                作为接收者，您可以接收物品并完成订单
              </p>
              <div className="flex space-x-2">
                {roleStatus.receiver ? (
                  <Button
                    onClick={() => handleEnterRole("receiver")}
                    className="flex-1"
                    disabled={registering}
                  >
                    进入接收者面板
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("receiver")}
                    className="flex-1"
                    disabled={registering}
                  >
                    注册为接收者
                  </Button>
                )}
              </div>
            </div>
          </div>

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
