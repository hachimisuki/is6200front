"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SenderDashboard = ({ onRoleReset }) => {
  const [activeTab, setActiveTab] = useState("create-order");

  const renderContent = () => {
    switch (activeTab) {
      case "create-order":
        return <CreateOrder />;
      case "modify-order":
        return <ModifyOrder />;
      case "delete-order":
        return <DeleteOrder />;
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
              <Package className="mr-2 h-4 w-4" /> 创建订单
            </TabsTrigger>
            <TabsTrigger value="modify-order">
              <Edit className="mr-2 h-4 w-4" /> 修改订单
            </TabsTrigger>
            <TabsTrigger value="delete-order">
              <Trash2 className="mr-2 h-4 w-4" /> 删除订单
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

function CreateOrder() {
  return <div>创建订单的内容</div>;
}

function ModifyOrder() {
  return <div>修改订单的内容</div>;
}

function DeleteOrder() {
  return <div>删除订单的内容</div>;
}

function PayOrder() {
  return <div>支付订单的内容</div>;
}
export default SenderDashboard;
