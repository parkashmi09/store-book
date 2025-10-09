"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_URL } from "@/util/base_url";
import toast from "react-hot-toast";

function PaymentRedirectClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [statusText, setStatusText] = useState<string>("verifying");

  useEffect(() => {
    const run = async () => {
      const orderId = searchParams?.get("order_id");
      if (!orderId) {
        setStatusText("error");
        return;
      }

      try {
        const token: any = sessionStorage.getItem("token") || "";
        const ctxRaw = localStorage.getItem("pendingOrderCtx");
        const ctx = ctxRaw ? JSON.parse(ctxRaw) : {};

        // 1) Create order first
        const createRes = await fetch(`${API_URL}/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            userId: ctx?.userId,
            products: ctx?.products || [],
            addressId: ctx?.addressId,
            cf_order_id: orderId,
            cf_payment_id: null,
            razorpay_signature: null,
            amount: ctx?.amount,
            shipping_charge: ctx?.shipping_charge,
            discount_price: ctx?.discount_price,
            offerId: ctx?.offerId || 0,
            sub_amount: ctx?.sub_amount,
            payment_status: false,
          }),
        });

        if (!createRes.ok) {
          setStatusText("failed");
          return;
        }

        // 2) Verify payment with backend
        const verifyRes = await fetch(`${API_URL}/payment-verification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({ orderId }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData?.success) {
          setStatusText("failed");
          return;
        }

        // 3) Cleanup and go to orders
        localStorage.removeItem("pendingOrderCtx");
        setStatusText("success");
        toast.success("Payment successful!");
        setTimeout(() => router.push("/account/orders"), 1200);
      } catch (e) {
        console.error(e);
        setStatusText("error");
      }
    };
    run();
  }, [searchParams, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      {statusText === "verifying" && <p>Verifying payment...</p>}
      {statusText === "success" && <p>Payment successful! Redirecting...</p>}
      {statusText === "failed" && <p>Payment failed! Please try again.</p>}
      {statusText === "error" && (
        <p>Error verifying payment. Please contact support.</p>
      )}
    </div>
  );
}

export default function PaymentRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <PaymentRedirectClient />
    </Suspense>
  );
}
