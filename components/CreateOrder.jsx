import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { LOGISTIC_ADDRESS } from "../utils/constants";
import { logistic_ABI } from "../utils/constants";

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    receiverAddress: "",
    senderLocation: "",
    receiverLocation: "",
    ethAmount: "",
    itemInfo: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create order function - Adjusted to pass only 3 parameters
  const sendOrder = async (
    receiverAddress,
    senderLocation,
    receiverLocation,
    itemInfo,
    ethAmount
  ) => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      throw new Error("MetaMask not installed");
    }

    try {
      // Connect to provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Request user authorization
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Logistics platform contract address
      const contractAddress = LOGISTIC_ADDRESS;
      // Contract ABI
      const contractABI = logistic_ABI;

      // Create contract instance
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("Preparing to create order with parameters:", {
        receiverAddress,
        senderLocation,
        receiverLocation,
        itemInfo,
        ethAmount,
      });

      // Adjust the number of parameters based on the actual contract definition
      // Here we assume the contract only accepts 3 parameters: receiver address, sender location, receiver location
      const tx = await contract.createOrder(
        receiverAddress,
        senderLocation,
        receiverLocation,
        { value: ethers.utils.parseEther(ethAmount) }
      );

      console.log("Transaction submitted, waiting for confirmation...");
      console.log("Transaction hash:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed, receipt:", receipt);

      return receipt;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      await sendOrder(
        formData.receiverAddress,
        formData.senderLocation,
        formData.receiverLocation,
        formData.itemInfo,
        formData.ethAmount
      );

      setStatus("Order created successfully!");

      // Reset form
      setFormData({
        receiverAddress: "",
        senderLocation: "",
        receiverLocation: "",
        ethAmount: "",
        itemInfo: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("Failed to create order: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Create New Order</h2>

      {status && (
        <p className="mb-4 text-sm bg-gray-100 p-2 rounded">{status}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Receiver Address</label>
          <input
            type="text"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            placeholder="0x..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Sender Location</label>
          <input
            type="text"
            name="senderLocation"
            value={formData.senderLocation}
            onChange={handleChange}
            placeholder="Sham Shui Po..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Receiver Location</label>
          <input
            type="text"
            name="receiverLocation"
            value={formData.receiverLocation}
            onChange={handleChange}
            placeholder="Central..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Payment Amount (LTK)</label>
          <input
            type="text"
            name="ethAmount"
            value={formData.ethAmount}
            onChange={handleChange}
            placeholder="0.01"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* <div>
          <label className="block text-sm mb-1">Item Information</label>
          <input
            type="text"
            name="itemInfo"
            value={formData.itemInfo}
            onChange={handleChange}
            placeholder="Please describe the item's characteristics, dimensions, etc."
            className="w-full p-2 border rounded"
            required
          />
        </div> */}
        <Button type="submit" className="w-full">
          Create Order
        </Button>
      </form>
    </div>
  );
};

export default CreateOrder;
