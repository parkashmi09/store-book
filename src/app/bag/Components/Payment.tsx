"use client";
import axios from "axios";
import { API_URL } from "@/util/base_url";
import Product from "@/app/bag/Components/MyBag";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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

  // Detect Cashfree return and show review on success
  useEffect(() => {
    const cfOrderId = searchParams?.get("order_id");
    const cfStatus = searchParams?.get("order_status");
    const cfPaymentId = searchParams?.get("payment_id");
    if (cfOrderId && cfStatus) {
      (async () => {
        try {
          if (cfStatus.toLowerCase() === "paid" || cfStatus.toLowerCase() === "success") {
            // Create the order AFTER successful payment as requested
            await createOrder(cfOrderId, cfPaymentId, "", true);
            toast.success("Order Processed Successfully");
            sessionStorage.setItem("settingtab", "1");
            sessionStorage.setItem("mybag", "0");
            setShowReview(true);
          } else {
            toast.error("Payment not completed");
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [searchParams]);

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
    cf_order_id: any,
    cf_payment_id: any,
    _unused: any,
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
            razorpay_order_id: cf_order_id,
            razorpay_payment_id: cf_payment_id,
            razorpay_signature: null,
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
    cf_order_id: any,
    cf_payment_id: any,
    _unused?: any
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
            razorpay_order_id: cf_order_id,
            razorpay_payment_id: cf_payment_id,
            razorpay_signature: null,
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
      const totalAmount = parseFloat(amount) + parseFloat(shipping_charge);
      const returnUrl = `${window.location.origin}/bag?order_id={order_id}&order_status={order_status}&payment_id={payment_id}`;

      // 1) Call existing checkout API first (as earlier with Razorpay)
      const token: any = sessionStorage.getItem("token") || "";
      const checkoutRes = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          amount: totalAmount,
          userId: user?.id,
          customerEmail: (address && (address.email || address.customerEmail)) || user?.email,
          customerPhone: (address && (address.phone || address.customerPhone || address.mobile)) || user?.phone,
        }),
      });
      const checkoutData = await checkoutRes.json();


      console.log("checkoutData", checkoutData);
      // Temporarily persist checkout data at order initiation time
      try {
        localStorage.setItem(
          "lastCheckoutData",
          JSON.stringify({
            data: checkoutData,
            storedAt: new Date().toISOString(),
          })
        );
      } catch (_) {}

      if (!checkoutRes.ok) {
        throw new Error(checkoutData?.error || "Checkout initialization failed");
      }
      const order = checkoutData?.order || {};

      // Common shapes we might receive from backend for Cashfree
      const cf = checkoutData?.cashfreeResponse || checkoutData?.order || checkoutData;

      // 2) Do NOT create order before payment; we'll create it after success

      // 3) Open Cashfree checkout using session from checkout response (no external call)
      const paymentSessionId = cf?.payment_session_id;
      if (!paymentSessionId) {
        throw new Error("Payment session ID missing");
      }
      const finalReturnUrl = cf?.order_meta?.return_url || returnUrl;

      // Save pending order context for redirect handler
      try {
        const pendingCtx = {
          userId: user?.id,
          products: data,
          addressId: selectedAddressId,
          amount,
          shipping_charge,
          discount_price: parseInt(discount_payment),
          offerId: offer?.offerId || 0,
          sub_amount,
        };
        localStorage.setItem("pendingOrderCtx", JSON.stringify(pendingCtx));
      } catch (_) {}

      // Try SDK checkout first (wait briefly if script hasn't finished loading)
      const waitForCashfree = async () => {
        const maxWaitMs = 3000;
        const stepMs = 100;
        let waited = 0;
        while (!(window as any).Cashfree && waited < maxWaitMs) {
          await new Promise((r) => setTimeout(r, stepMs));
          waited += stepMs;
        }
      };
      if (!(window as any).Cashfree) {
        await waitForCashfree();
      }
      const cashfreeFactory = (window as any).Cashfree;
      const cashfree = typeof cashfreeFactory === "function" ? cashfreeFactory({ mode: "sandbox" }) : null;
      if (cashfree && cashfree.checkout) {
        try {
          await cashfree.checkout({ paymentSessionId });
          return;
        } catch (sdkErr) {
          console.warn("Cashfree SDK checkout failed, falling back", sdkErr);
        }
      }

      // Fallback to hosted redirect
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.cashfree.com/pg/process/session";
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "payment_session_id";
      input.value = paymentSessionId;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error?.message || "Failed to initialize payment");
    }
  };

  return (
    <div className="w-full">
      <button
        className="w-full btn btn-secondary disabled:bg-blue-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold"
        disabled={!selectedAddressId || data.length === 0}
        onClick={() => checkoutHandler(amount)}
      >
        Pay ₹{parseFloat(amount) + parseFloat(shipping_charge)}
      </button>

      {/* Ratings entry point */}
      {showReview && (
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
