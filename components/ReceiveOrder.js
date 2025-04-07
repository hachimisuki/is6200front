import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { LOGISTIC_ADDRESS, logistic_ABI2 } from "@/utils/constants.js";

const ReceiveOrder = ({ order, onCompleted }) => {
  const [rating, setRating] = useState("1"); // Default to "Good"
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Rating options
  const ratingOptions = [
    {
      value: "1",
      label: "Good",
      icon: <ThumbsUp className="w-4 h-4 text-green-500" />,
    },
    {
      value: "2",
      label: "Neutral",
      icon: <Minus className="w-4 h-4 text-yellow-500" />,
    },
    {
      value: "3",
      label: "Bad",
      icon: <ThumbsDown className="w-4 h-4 text-red-500" />,
    },
  ];

  const confirmReceive = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    setLoading(true);
    setStatus("Processing...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        LOGISTIC_ADDRESS,
        logistic_ABI2,
        signer
      );

      // Call the receiverOrder function in the contract
      const tx = await contract.receiverOrder(order.id, parseInt(rating));

      setStatus(
        "Transaction submitted successfully, waiting for confirmation..."
      );

      // Wait for the transaction to be confirmed
      await tx.wait();

      setStatus("Order received successfully! Thank you for your feedback.");

      // Notify the parent component to update
      if (onCompleted) {
        setTimeout(() => onCompleted(), 2000);
      }
    } catch (err) {
      console.error("Confirmation of receipt failed:", err);
      setStatus(
        "Confirmation of receipt failed: " +
          (err.message || err.reason || String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirm Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Order Information:</h3>
            <p className="text-sm">Order ID: #{order.id}</p>
            <p className="text-sm">Delivery Address: {order.receiverLoc}</p>
            <p className="text-sm">
              Courier: {order.courierAddr.slice(0, 6)}...
              {order.courierAddr.slice(-4)}
            </p>
            <p className="text-sm">Amount: {order.ethAmount} ETH</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Please rate the courier:</h3>

            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex flex-col space-y-2"
            >
              {ratingOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`rating-${option.value}`}
                  />
                  <Label
                    htmlFor={`rating-${option.value}`}
                    className="flex items-center cursor-pointer"
                  >
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {status && (
            <div
              className={`p-2 text-sm rounded ${
                status.includes("failed")
                  ? "bg-red-100 text-red-700"
                  : status.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {status}
            </div>
          )}

          <Button
            className="w-full"
            onClick={confirmReceive}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Receipt and Rate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiveOrder;
