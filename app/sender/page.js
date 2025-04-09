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

  // Check if the user is logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if the wallet is connected
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length === 0) {
          // If no wallet is connected, redirect to the homepage
          router.push("/");
        } else {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error verifying identity:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  const handleRoleReset = () => {
    router.push("/"); // Return to role selection page
  };

  const renderContent = () => {
    switch (activeTab) {
      case "create-order":
        return <CreateOrder />;
      case "orders":
        return <OrderList />;
      default:
        return <CreateOrder />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sender Panel</CardTitle>
            <Button variant="ghost" onClick={handleRoleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Select Identity
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="create-order">
                  <Package className="mr-2 h-4 w-4" />
                  Create Order
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
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
