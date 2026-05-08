declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key:         string;
  amount:      number;
  currency:    string;
  name:        string;
  description: string;
  order_id:    string;
  prefill?:    { name?: string; email?: string };
  theme?:      { color?: string };
  handler:     (response: RazorpayPaymentResponse) => void;
  modal?:      { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id:  string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id  = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  plan:      "pro" | "enterprise";
  cycle:     "monthly" | "annual";
  userName?: string;
  email?:    string;
  onSuccess: (plan: string, expiresAt: string) => void;
  onError:   (message: string) => void;
}

export async function openCheckout(opts: CheckoutOptions) {
  await loadRazorpayScript();

  const orderRes = await fetch("/api/payments/create-order", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ plan: opts.plan, cycle: opts.cycle }),
  });

  if (!orderRes.ok) {
    const { error } = await orderRes.json();
    opts.onError(error ?? "Failed to create order");
    return;
  }

  const { orderId, amount } = await orderRes.json();

  const planLabel = opts.plan === "pro" ? "Pro" : "Enterprise";
  const cycleLabel = opts.cycle === "monthly" ? "Monthly" : "Annual";

  const rzp = new window.Razorpay({
    key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount,
    currency:    "INR",
    name:        "AI Interview Trainer",
    description: `${planLabel} Plan — ${cycleLabel}`,
    order_id:    orderId,
    prefill:     { name: opts.userName, email: opts.email },
    theme:       { color: "#f59e0b" },
    handler: async (response) => {
      const verifyRes = await fetch("/api/payments/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...response,
          plan:   opts.plan,
          cycle:  opts.cycle,
          amount,
        }),
      });

      if (!verifyRes.ok) {
        const { error } = await verifyRes.json();
        opts.onError(error ?? "Payment verification failed");
        return;
      }

      const { plan, expiresAt } = await verifyRes.json();
      opts.onSuccess(plan, expiresAt);
    },
    modal: {
      ondismiss: () => opts.onError("Payment cancelled"),
    },
  });

  rzp.open();
}
