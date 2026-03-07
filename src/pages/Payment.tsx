import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CreditCard, Zap, Crown, Loader2, ArrowLeft } from "lucide-react";

const planDetails: Record<string, { name: string; price: number; icon: typeof Zap }> = {
  pro: { name: "Pro", price: 9, icon: Zap },
  premium: { name: "Premium", price: 19, icon: Crown },
};

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "";
  const { user, loading: authLoading, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);

  const plan = planId && planDetails[planId] ? planDetails[planId] : null;

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to upgrade your plan");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!planId || !plan) {
      navigate("/plans");
    }
  }, [planId, plan, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !user) return;
    setProcessing(true);
    try {
      await api.plans.upgrade(planId as "pro" | "premium");
      const userData = { ...user, plan: planId };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome to ${plan.name}! You can now rent bikes and scooties with premium benefits.`);
      navigate("/bikes");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !plan) {
    return (
      <div className="min-h-screen bg-background bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-md">
        <Button
          variant="ghost"
          className="mb-6 rounded-lg"
          onClick={() => navigate("/plans")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>

        <Card className="rounded-2xl border border-border/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <plan.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{plan.name} Plan</CardTitle>
                <CardDescription>Complete payment to unlock premium benefits</CardDescription>
              </div>
            </div>
            <div className="pt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <form id="payment-form" onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp">Expiry</Label>
                  <Input id="exp" placeholder="MM/YY" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="rounded-xl" required />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a demo. No real payment is processed. Click "Complete Payment" to upgrade.
              </p>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="payment-form"
              variant="hero"
              className="w-full rounded-xl"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Payment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
