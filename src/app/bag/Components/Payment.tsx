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
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState<Record<string, { rating: number; comment: string; submitting?: boolean; submitted?: boolean }>>({});

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
          // initialize per-product review state
          const initial: Record<string, { rating: number; comment: string; submitting?: boolean; submitted?: boolean }> = {};
          (data.data || []).forEach((p: any) => {
            initial[p.productId] = { rating: 0, comment: "" };
          });
          setReviews(initial);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    }
  };

  const submitReview = async (productId: string) => {
    try {
      const current = reviews[productId] || { rating: 0, comment: "" };
      if (!current.rating) {
        toast.error("Please select a rating");
        return;
      }
      setReviews((r) => ({ ...r, [productId]: { ...current, submitting: true } }));
      const res = await fetch(`https://api.targetboardstore.com/review/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user.id,
          rating: current.rating,
          comment: current.comment || "",
        }),
      });
      if (!res.ok) throw new Error("Review submit failed");
      toast.success("Thanks for your review!");
      setReviews((r) => ({ ...r, [productId]: { ...current, submitting: false, submitted: true } }));
    } catch (e) {
      console.error(e);
      toast.error("Unable to submit review");
      setReviews((r) => ({ ...r, [productId]: { ...(r[productId] || { rating: 0, comment: "" }), submitting: false } }));
    }
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
      {/* Payment Button (kept for later use) */}
      {/*
      <button
        className="w-full btn btn-secondary disabled:bg-blue-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold"
        disabled={!selectedAddressId}
        onClick={() => checkoutHandler(amount)}
      >
        Pay ₹{parseFloat(amount) + parseFloat(shipping_charge)}
      </button>
      */}

      {/* Ratings entry point */}
      {!showReview ? (
        <button
          className="w-full btn btn-primary disabled:bg-blue-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold"
          disabled={!selectedAddressId || data.length === 0}
          onClick={() => setShowReview(true)}
        >
          Rate Purchased Products
        </button>
      ) : (
        <div className="card bg-white border shadow-md mt-3">
          <div className="card-body !p-3">
            <h3 className="card-title">Rate your products</h3>
            <p className="text-sm text-gray-600">Your feedback helps others shop better.</p>
            <div className="space-y-4 mt-2">
              {(data || []).map((p: any) => (
                <div key={p.productId} className="border rounded-md p-2">
                  <div className="flex items-center gap-3">
                    <img src={p?.images?.[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`btn btn-xs ${reviews[p.productId]?.rating >= star ? "btn-warning" : "btn-ghost"}`}
                            onClick={() =>
                              setReviews((r) => ({
                                ...r,
                                [p.productId]: { ...(r[p.productId] || { rating: 0, comment: "" }), rating: star },
                              }))
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full mt-2"
                    placeholder="Write a short review (optional)"
                    value={reviews[p.productId]?.comment || ""}
                    onChange={(e) =>
                      setReviews((r) => ({
                        ...r,
                        [p.productId]: { ...(r[p.productId] || { rating: 0, comment: "" }), comment: e.target.value },
                      }))
                    }
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={reviews[p.productId]?.submitting || reviews[p.productId]?.submitted}
                      onClick={() => submitReview(p.productId)}
                    >
                      {reviews[p.productId]?.submitted
                        ? "Submitted"
                        : reviews[p.productId]?.submitting
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
