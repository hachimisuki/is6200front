export const LOGISTIC_ADDRESS = "0xe67e4fe18bc110975b7E43599e8943C274eD4b8C";
export const USER_MANAGEMENT_ADDRESS =
  "0x3b1056cCd251990f5ac0c2AA44F57C17A0c49a85";

export const logistic_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_receiverAddr",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "_senderLoc",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "_receiverLoc",
        "type": "string",
      },
    ],
    "name": "createOrder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_logiToken",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_userManagement",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_feeManagement",
        "type": "address",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ltkReward",
        "type": "uint256",
      },
    ],
    "name": "LTKTransfered",
    "type": "event",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_orderID",
        "type": "uint256",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "_newStatus",
        "type": "uint8",
      },
    ],
    "name": "modifyOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
    ],
    "name": "OrderCancelled",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "senderAddr",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256",
      },
    ],
    "name": "OrderCreated",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
    ],
    "name": "OrderDelivered",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum LogisticsPlatform.OrderRating",
        "name": "rating",
        "type": "uint8",
      },
    ],
    "name": "OrderRated",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
    ],
    "name": "OrderTaken",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "newStatus",
        "type": "uint8",
      },
    ],
    "name": "OrderTransitting",
    "type": "event",
  },
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_orderID",
        "type": "uint256",
      },
    ],
    "name": "takeOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "feeManagement",
    "outputs": [
      {
        "internalType": "contract FeeManagement",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "logiToken",
    "outputs": [
      {
        "internalType": "contract LogiToken",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "orderMap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "senderAddr",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "receiverAddr",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "senderLoc",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "receiverLoc",
        "type": "string",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "status",
        "type": "uint8",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderRating",
        "name": "rating",
        "type": "uint8",
      },
      {
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "ltkReward",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "userManagement",
    "outputs": [
      {
        "internalType": "contract UserManagement",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
export const logistic_ABI2 = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_receiverAddr",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "_senderLoc",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "_receiverLoc",
        "type": "string",
      },
    ],
    "name": "createOrder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_logiToken",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_userManagement",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_feeManagement",
        "type": "address",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ltkReward",
        "type": "uint256",
      },
    ],
    "name": "LTKTransfered",
    "type": "event",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_orderID",
        "type": "uint256",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "_newStatus",
        "type": "uint8",
      },
    ],
    "name": "modifyOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
    ],
    "name": "OrderCancelled",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "senderAddr",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256",
      },
    ],
    "name": "OrderCreated",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
    ],
    "name": "OrderDelivered",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum LogisticsPlatform.OrderRating",
        "name": "rating",
        "type": "uint8",
      },
    ],
    "name": "OrderRated",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
    ],
    "name": "OrderTaken",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "newStatus",
        "type": "uint8",
      },
    ],
    "name": "OrderTransitting",
    "type": "event",
  },
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_orderID",
        "type": "uint256",
      },
    ],
    "name": "takeOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "feeManagement",
    "outputs": [
      {
        "internalType": "contract FeeManagement",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "logiToken",
    "outputs": [
      {
        "internalType": "contract LogiToken",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "orderMap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "orderID",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "senderAddr",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "receiverAddr",
        "type": "address",
      },
      {
        "internalType": "string",
        "name": "senderLoc",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "receiverLoc",
        "type": "string",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderStatus",
        "name": "status",
        "type": "uint8",
      },
      {
        "internalType": "enum LogisticsPlatform.OrderRating",
        "name": "rating",
        "type": "uint8",
      },
      {
        "internalType": "uint256",
        "name": "ethAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "ltkReward",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "totalOrderCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "userManagement",
    "outputs": [
      {
        "internalType": "contract UserManagement",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
export const userManagement_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
    ],
    "name": "CourierPenalized",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "courierAddr",
        "type": "address",
      },
    ],
    "name": "CourierRewarded",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "enum UserManagement.Role",
        "name": "role",
        "type": "uint8",
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string",
      },
    ],
    "name": "UserRegistered",
    "type": "event",
  },
  {
    "inputs": [],
    "name": "DEFAULT_REPUTATION",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "MAX_REPUTATION",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "MIN_REPUTATION",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "PENALTY_VALUE",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "REWARD_VALUE",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "courierReputation",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "isRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courierAddr",
        "type": "address",
      },
    ],
    "name": "penalizeCourier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courierAddr",
        "type": "address",
      },
    ],
    "name": "registerAsCourier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courierAddr",
        "type": "address",
      },
    ],
    "name": "registerAsReciever",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courierAddr",
        "type": "address",
      },
    ],
    "name": "registerAsSender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courierAddr",
        "type": "address",
      },
    ],
    "name": "rewardCourier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "userRoles",
    "outputs": [
      {
        "internalType": "enum UserManagement.Role",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
