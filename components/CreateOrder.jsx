import CONTRACT_ADDRESS from "../utils/constants";
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    receiverAddress: "",
    senderLocation: "",
    receiverLocation: "",
    ethAmount: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("处理中...");

    try {
      if (!window.ethereum) throw new Error("请安装MetaMask");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 替换为你的物流平台合约地址
      const contractAddress = "0xf00c8Ecb203e5C3ABbe7305F355dd273e0056FA0";
      const contractABI = [
        {
          "inputs": [
            { "name": "_receiverAddr", "type": "address" },
            { "name": "_senderLoc", "type": "string" },
            { "name": "_receiverLoc", "type": "string" },
          ],
          "name": "createOrder",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
        },
      ];

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.createOrder(
        formData.receiverAddress,
        formData.senderLocation,
        formData.receiverLocation,
        { value: ethers.utils.parseEther(formData.ethAmount) }
      );

      await tx.wait();
      setStatus("订单创建成功！");

      // 重置表单
      setFormData({
        receiverAddress: "",
        senderLocation: "",
        receiverLocation: "",
        ethAmount: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("创建失败: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">创建新订单</h2>

      {status && <p className="mb-4 text-sm">{status}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">接收者地址</label>
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
          <label className="block text-sm mb-1">发送位置</label>
          <input
            type="text"
            name="senderLocation"
            value={formData.senderLocation}
            onChange={handleChange}
            placeholder="深水埗..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">接收位置</label>
          <input
            type="text"
            name="receiverLocation"
            value={formData.receiverLocation}
            onChange={handleChange}
            placeholder="中环..."
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">支付金额 (ETH)</label>
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

        <Button type="submit" className="w-full">
          创建订单
        </Button>
      </form>
    </div>
  );
};
export default CreateOrder;
