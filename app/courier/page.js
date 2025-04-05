"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderList from "@/components/OrderList";

export default function CourierPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create-order");

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
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>快递员面板</CardTitle>
            <Button variant="ghost" onClick={handleRoleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回选择身份
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="create-order">
                  <Package className="mr-2 h-4 w-4" /> 创建订单
                </TabsTrigger>
                <TabsTrigger value="accept-order">
                  <Truck className="mr-2 h-4 w-4" /> 接单
                </TabsTrigger>
                <TabsTrigger value="modify-order">
                  <Edit className="mr-2 h-4 w-4" /> 修改订单
                </TabsTrigger>
                <TabsTrigger value="delete-order">
                  <Trash2 className="mr-2 h-4 w-4" /> 删除订单
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create-order">
                <CreateOrder />
              </TabsContent>

              <TabsContent value="accept-order">
                <OrderList showAll={true} />
              </TabsContent>

              <TabsContent value="modify-order">
                <ModifyOrder />
              </TabsContent>

              <TabsContent value="delete-order">
                <DeleteOrder />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function CreateOrder() {
  return <div>创建订单（表示空闲时间）的内容</div>;
}

function ModifyOrder() {
  return <div>修改订单的内容</div>;
}

function DeleteOrder() {
  return <div>删除订单的内容</div>;
}
