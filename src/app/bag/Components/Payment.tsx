import axios from "axios";
import { API_URL } from "@/util/base_url";
import Product from "@/app/bag/Components/MyBag";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentProps {
  productIds: any;
  address: any;
  amount: any;
  selectedAddressId: any;
  offer: any;
  shipping_charge: any;
  discount_payment: any;
  sub_amount: any;
}

const Payment = ({
  productIds,
  sub_amount,
  address,
  offer,
  amount,
  selectedAddressId,
  shipping_charge,
  discount_payment,
}: PaymentProps) => {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [isMobile, setIsMobile] = useState(false);

  let user: any = sessionStorage.getItem("user") || "{}";
  user = JSON.parse(user);

  useEffect(() => {
    // Check if device is mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    getProducts(productIds);
  }, [productIds]);

  const getProducts = async (para: string[]) => {
    const token: any = sessionStorage.getItem("token") || " ";
    let user: any;
    const userString = sessionStorage.getItem("user");
    if (userString) {
      user = JSON.parse(userString);
    } else {
      user = {};
    }

    if (Object.keys(user).length > 0) {
      try {
        const response = await fetch(`${API_URL}/get-match-products`, {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productIds: para,
            userId: user.id,
          }),
        });

        const data = await response.json();
        if (response.status === 201) {
          setData(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    }
  };

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setRazorpayLoaded(true);
    } else {
      // Fallback if script doesn't load automatically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  const checkBrowserSupport = () => {
    // Basic feature detection
    if (typeof window === "undefined") return false; // SSR case
    if (!("Promise" in window)) return false;
    if (!("fetch" in window)) return false;

    // Razorpay specific requirements
    const userAgent = navigator.userAgent;
    const isIE = /MSIE|Trident/.test(userAgent);

    return !isIE;
  };

  async function createOrder(
    razorpay_order_id: any,
    razorpay_payment_id: any,
    razorpay_signature: any,
    payment_status: any
  ) {
    try {
      if (data.length > 0) {
        const token: any = sessionStorage.getItem("token") || "";
        const response = await fetch(`${API_URL}/orders/create`, {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            products: data,
            addressId: selectedAddressId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            shipping_charge,
            discount_price: parseInt(discount_payment),
            offerId: offer.offerId || 0,
            sub_amount,
            payment_status,
          }),
        });

        if (response.status !== 200) {
          throw new Error("Failed to create order");
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error.message);
      toast.error("Failed to create order");
      throw error;
    }
  }

  async function updateOrder(
    razorpay_order_id: any,
    razorpay_payment_id: any,
    razorpay_signature: any
  ) {
    try {
      if (data.length > 0) {
        const token: any = sessionStorage.getItem("token") || "";
        const response = await fetch(`${API_URL}/orders/update`, {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            payment_status: true,
          }),
        });

        if (response.status !== 201) {
          throw new Error("Failed to update order");
        }
      }
    } catch (error: any) {
      console.error("Error updating order:", error.message);
      toast.error("Failed to update order");
      throw error;
    }
  }

  const checkoutHandler = async (amount: any) => {
    try {
      if (!checkBrowserSupport()) {
        toast.error(
          "Your browser is not supported. Please try Chrome, Firefox, or Edge."
        );
        return;
      }

      const key = "rzp_live_5FnnvEf6D23aU2";
      const token: any = sessionStorage.getItem("token");

      // Create Razorpay order
      const response = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          amount: parseFloat(amount) + parseFloat(shipping_charge),
        }),
      });

      const { order } = await response.json();

      // Create initial order record
      await createOrder(order.id, null, null, false);

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Target Board Store",
        description: "Purchase Payment",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const response1: any = await fetch(
              `${API_URL}/payment-verification`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": token,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const result = await response1.json();
            if (result.success) {
              await updateOrder(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              toast.success("Order Processed Successfully");
              sessionStorage.setItem("settingtab", "1");
              sessionStorage.setItem("mybag", "0");
              router.push("/account/orders");
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment Processing Failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: "Pay using QR",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr"], // Explicitly enable both QR and intent flows
                  },
                ],
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true, // Enable default display blocks
            },
          },
        },
        modal: {
          confirm_close: true,
          handleback: true,
          escape: false,
          animation: true,
          backdropClose: false,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
        notes: {
          address: "Target Board Store",
        },
        theme: {
          color: "#121212",
          backdrop_color: "rgba(0, 0, 0, 0.7)",
        },
      };
      //@ts-ignore
      const razor = new window.Razorpay(options);

      // Add specific event handlers for QR code
      razor.on("payment.failed", function (response: any) {
        toast.error("Payment Failed. Please try again.");
      });

      razor.on("ready", function (response: any) {
        // Force QR refresh when payment screen is ready
        if (isMobile) {
          const qrButton = document.querySelector('[data-test-id="qr-button"]');
          if (qrButton) {
            (qrButton as HTMLElement).click();
          }
        }
      });

      razor.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initialize payment");
    }
  };

  return (
    <div className="w-full">
      <button
        className="w-full btn btn-secondary disabled:bg-blue-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold"
        disabled={!selectedAddressId}
        onClick={() => checkoutHandler(amount)}
      >
        {razorpayLoaded
          ? `Pay ₹${parseFloat(amount) + parseFloat(shipping_charge)}`
          : "Loading payment..."}
        {/* Pay ₹{parseFloat(amount) + parseFloat(shipping_charge)} */}
      </button>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default Payment;
