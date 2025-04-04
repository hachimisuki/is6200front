"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReceiverDashboard from "@/components/ReceiverDashboard";

export default function ReceiverPage() {
  const router = useRouter();

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
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <ReceiverDashboard onRoleReset={handleRoleReset} />
      </main>
    </div>
  );
}
