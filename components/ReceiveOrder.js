import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

const ReceiveOrder = ({ order, onCompleted }) => {
  const [rating, setRating] = useState("1"); // 默认好评
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // 评价选项
  const ratingOptions = [
    {
      value: "1",
      label: "好评",
      icon: <ThumbsUp className="w-4 h-4 text-green-500" />,
    },
    {
      value: "2",
      label: "中评",
      icon: <Minus className="w-4 h-4 text-yellow-500" />,
    },
    {
      value: "3",
      label: "差评",
      icon: <ThumbsDown className="w-4 h-4 text-red-500" />,
    },
  ];

  const confirmReceive = async () => {
    if (!window.ethereum) return alert("需要安装MetaMask!");

    setLoading(true);
    setStatus("处理中...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // 合约地址和ABI
      const contractAddress = "0x你的合约地址"; // 替换为实际合约地址
      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_orderID",
              "type": "uint256",
            },
            {
              "internalType": "enum LogisticsPlatform.OrderRating",
              "name": "_rating",
              "type": "uint8",
            },
          ],
          "name": "receiverOrder",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
      ];

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // 调用合约的receiverOrder函数
      const tx = await contract.receiverOrder(order.id, parseInt(rating));

      setStatus("交易提交成功，等待确认...");

      // 等待交易确认
      await tx.wait();

      setStatus("收货成功！感谢您的评价");

      // 通知父组件更新
      if (onCompleted) {
        setTimeout(() => onCompleted(), 2000);
      }
    } catch (err) {
      console.error("确认收货失败:", err);
      setStatus("确认收货失败: " + (err.message || err.reason || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>确认收货</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">订单信息：</h3>
            <p className="text-sm">订单编号: #{order.id}</p>
            <p className="text-sm">配送地址: {order.receiverLoc}</p>
            <p className="text-sm">
              快递员: {order.courierAddr.slice(0, 6)}...
              {order.courierAddr.slice(-4)}
            </p>
            <p className="text-sm">金额: {order.ethAmount} ETH</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">请为快递员评价：</h3>

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
                status.includes("失败")
                  ? "bg-red-100 text-red-700"
                  : status.includes("成功")
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
            {loading ? "处理中..." : "确认收货并评价"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiveOrder;
