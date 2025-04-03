"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ReceiverDashboard = ({ onRoleReset }) => {
  const [activeTab, setActiveTab] = useState("pay");

  const renderContent = () => {
    switch (activeTab) {
      case "pay":
        return <PayOrder />;
      default:
        return <PayOrder />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>接收者面板</CardTitle>
        <Button variant="ghost" onClick={onRoleReset}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回选择身份
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
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
export default ReceiverDashboard;
