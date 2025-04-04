import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESS } from "../utils/constants";
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

  // 创建订单函数 - 修改为仅传递3个参数
  const sendOrder = async (
    receiverAddress,
    senderLocation,
    receiverLocation,
    itemInfo,
    ethAmount
  ) => {
    // 检查MetaMask是否安装
    if (!window.ethereum) {
      alert("请安装MetaMask!");
      throw new Error("未安装MetaMask");
    }

    try {
      // 连接到提供者
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // 请求用户授权
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 物流平台合约地址
      const contractAddress = CONTRACT_ADDRESS;
      // 合约ABI
      const contractABI = logistic_ABI;

      // 创建合约实例
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("准备创建订单，参数:", {
        receiverAddress,
        senderLocation,
        receiverLocation,
        itemInfo,
        ethAmount,
      });

      // 根据实际合约定义调整参数数量
      // 这里假设合约只接受3个参数：接收者地址、发送位置、接收位置
      const tx = await contract.createOrder(
        receiverAddress,
        senderLocation,
        receiverLocation,
        { value: ethers.utils.parseEther(ethAmount) }
      );

      console.log("交易已提交，等待确认...");
      console.log("交易哈希:", tx.hash);

      // 等待交易确认
      const receipt = await tx.wait();
      console.log("交易已确认，交易收据:", receipt);

      return receipt;
    } catch (error) {
      console.error("创建订单失败:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("处理中...");

    try {
      await sendOrder(
        formData.receiverAddress,
        formData.senderLocation,
        formData.receiverLocation,
        formData.itemInfo,
        formData.ethAmount
      );

      setStatus("订单创建成功！");

      // 重置表单
      setFormData({
        receiverAddress: "",
        senderLocation: "",
        receiverLocation: "",
        ethAmount: "",
        itemInfo: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("创建失败: " + (err.message || "未知错误"));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">创建新订单</h2>

      {status && (
        <p className="mb-4 text-sm bg-gray-100 p-2 rounded">{status}</p>
      )}

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
        {/* <div>
          <label className="block text-sm mb-1">物品信息</label>
          <input
            type="text"
            name="itemInfo"
            value={formData.itemInfo}
            onChange={handleChange}
            placeholder="请描述物品特性、尺寸等信息"
            className="w-full p-2 border rounded"
            required
          />
        </div> */}
        <Button type="submit" className="w-full">
          创建订单
        </Button>
      </form>
    </div>
  );
};

export default CreateOrder;
