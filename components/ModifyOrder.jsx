import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ModifyOrder = ({ order, onBack }) => {
  const [formData, setFormData] = useState({
    receiverAddress: order.receiverAddr,
    senderLocation: order.senderLoc,
    receiverLocation: order.receiverLoc,
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("修改中...");

    try {
      // 这里添加实际修改订单的代码
      // 简单模拟成功
      setTimeout(() => {
        setStatus("修改成功！");
        // 2秒后返回订单列表
        setTimeout(() => {
          onBack();
        }, 2000);
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus("修改失败: " + err.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">修改订单 #{order.id}</h2>
        <Button size="sm" onClick={onBack}>
          返回列表
        </Button>
      </div>

      {status && <p className="mb-4 text-sm">{status}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">接收者地址</label>
          <input
            type="text"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
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
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          提交修改
        </Button>
      </form>
    </div>
  );
};

export default ModifyOrder;
