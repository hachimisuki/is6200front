"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderList from "@/components/OrderList";

export default function CourierPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("accept-order");

  // Check if the user is logged in
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
        console.error("Error verifying identity:", error);
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
            <CardTitle>Courier Panel</CardTitle>
            <Button variant="ghost" onClick={handleRoleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Select Identity
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="accept-order">
                  <Truck className="mr-2 h-4 w-4" /> Acceptable Orders
                </TabsTrigger>
                <TabsTrigger value="my-order">
                  <Package className="mr-2 h-4 w-4" /> Orders in delivery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="accept-order">
                <OrderList showAll={true} />
              </TabsContent>

              <TabsContent value="my-order">
                <OrderList getTakedOrder={true} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
