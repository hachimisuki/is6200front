"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, User, Check } from "lucide-react";
import {
  USER_MANAGEMENT_ADDRESS,
  logistic_ABI,
  userManagement_ABI,
} from "@/utils/constants";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [roleStatus, setRoleStatus] = useState({
    sender: false,
    courier: false,
    receiver: false,
  });
  const router = useRouter();

  // Check if the wallet is connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Check role status when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      checkRoleStatus();
    }
  }, [walletAddress]);

  // Check which roles the user has
  const checkRoleStatus = async () => {
    try {
      if (!walletAddress) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userManagementContract = new ethers.Contract(
        USER_MANAGEMENT_ADDRESS,
        userManagement_ABI,
        provider
      );

      // Check if the user is registered
      const isRegistered = await userManagementContract.isRegistered(
        walletAddress
      );

      if (isRegistered) {
        // If registered, get the user's role
        const userRole = await userManagementContract.userRoles(walletAddress);

        // Based on the enum definition in the contract, determine the user's role
        // Assume the enum is defined as: enum Role { None, Sender, Courier, Receiver }
        const roleEnum = parseInt(userRole.toString());

        // Update the user's role status
        setRoleStatus({
          sender: roleEnum === 0, // Role.Sender
          courier: roleEnum === 1, // Role.Courier
          receiver: roleEnum === 2, // Role.Receiver
        });

        console.log("User is registered, role code:", roleEnum);
      } else {
        // If not registered, all role statuses are false
        setRoleStatus({
          sender: false,
          courier: false,
          receiver: false,
        });
        console.log("User is not registered");
      }
    } catch (error) {
      console.error("Error checking role status:", error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsLoggedIn(true);
        }
      } else {
        setError("Please install MetaMask wallet!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleLogin = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        setWalletAddress(account);
        setIsLoggedIn(true);
        setError("");
      } else {
        setError("Please install MetaMask wallet!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setError("You rejected the wallet connection request.");
      } else {
        setError(`Error connecting wallet: ${error.message}`);
      }
    }
  };

  const handleRoleSelect = async (role) => {
    try {
      // If the user is already registered for the role, go directly to the corresponding page
      if (roleStatus[role]) {
        router.push(`/${role}`);
        return;
      }

      setRegistering(true);
      setError("");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Use the UserManagement contract
      const userManagementContract = new ethers.Contract(
        USER_MANAGEMENT_ADDRESS,
        userManagement_ABI,
        signer
      );

      let tx;

      // Call the corresponding registration function based on the selected role
      // Note: Based on the contract, the registration function does not require an address parameter, it will use msg.sender
      switch (role) {
        case "sender":
          tx = await userManagementContract.registerAsSender(walletAddress);
          console.log("Register as sender transaction:", tx.hash);
          break;
        case "courier":
          tx = await userManagementContract.registerAsCourier(walletAddress);
          console.log("Register as courier transaction:", tx.hash);
          break;
        case "receiver":
          tx = await userManagementContract.registerAsReciever(walletAddress);
          console.log("Register as receiver transaction:", tx.hash);
          break;
        default:
          throw new Error("Unknown role");
      }

      // Wait for the transaction to be confirmed
      await tx.wait();
      console.log(`Successfully registered as ${role}`);

      // Update role status
      setRoleStatus((prev) => ({
        ...prev,
        [role]: true,
      }));

      // After successful registration, navigate to the corresponding page
      router.push(`/${role}`);
    } catch (error) {
      console.error("Role registration failed:", error);
      setError(`Registration failed: ${error.message.substring(0, 100)}...`);
    } finally {
      setRegistering(false);
    }
  };

  const handleEnterRole = (role) => {
    router.push(`/${role}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full bg-black">
              Login with Wallet
            </Button>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Select Role</CardTitle>
          <p className="text-sm text-gray-600">
            You can register and use multiple roles
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Sender Card */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">Sender</h3>
                </div>
                {false && roleStatus.sender && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Registered
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                As a sender, you can create orders and send items
              </p>
              <div className="flex space-x-2">
                {true || roleStatus.sender ? (
                  <Button
                    onClick={() => handleEnterRole("sender")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Enter Sender Panel
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("sender")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Register as Sender
                  </Button>
                )}
              </div>
            </div>

            {/* Courier Card */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">Courier</h3>
                </div>
                {false && roleStatus.courier && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Registered
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                As a courier, you can accept orders and deliver items
              </p>
              <div className="flex space-x-2">
                {true || roleStatus.courier ? (
                  <Button
                    onClick={() => handleEnterRole("courier")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Enter Courier Panel
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("courier")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Register as Courier
                  </Button>
                )}
              </div>
            </div>

            {/* Receiver Card */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  <h3 className="font-medium">Receiver</h3>
                </div>
                {false && roleStatus.receiver && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Registered
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                As a receiver, you can receive items and complete orders
              </p>
              <div className="flex space-x-2">
                {true || roleStatus.receiver ? (
                  <Button
                    onClick={() => handleEnterRole("receiver")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Enter Receiver Panel
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRoleSelect("receiver")}
                    className="flex-1"
                    disabled={registering}
                  >
                    Register as Receiver
                  </Button>
                )}
              </div>
            </div>
          </div>

          {registering && (
            <p className="text-center text-sm text-gray-500">
              Registering, please wait for transaction confirmation...
            </p>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
