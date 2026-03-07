import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Crown, Bike } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Pay as you go. Perfect for occasional riders.",
    price: "Free",
    period: "No commitment",
    icon: Bike,
    features: [
      "Standard hourly rates",
      "Access to all bikes & scooties",
      "Email support",
      "Cancel anytime",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For regular riders. Save more, ride more.",
    price: "$9",
    period: "per month",
    icon: Zap,
    features: [
      "10% off all rentals",
      "Priority bike & scooty reservation",
      "Extended rental window",
      "24/7 chat support",
      "Free helmet rental",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "The ultimate experience. Best value for frequent riders.",
    price: "$19",
    period: "per month",
    icon: Crown,
    features: [
      "20% off all rentals",
      "First hour free every week",
      "Priority access to new bikes & scooties",
      "Dedicated support",
      "Free accessories",
      "Early access to promotions",
    ],
    cta: "Upgrade to Premium",
    popular: false,
  },
];

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planId: string) => {
    if (planId === "basic") {
      if (user) {
        navigate("/bikes");
      } else {
        navigate("/auth");
      }
    } else {
      if (user) {
        navigate(`/payment?plan=${planId}`);
      } else {
        toast.error("Please sign in to upgrade your plan");
        navigate("/auth");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Choose Your <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock more savings and benefits with our membership plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary shadow-lg scale-105 md:scale-110"
                  : "border-border/80 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-glow py-1.5 text-center">
                  <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={plan.popular ? "pt-10" : ""}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center mb-3">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full rounded-xl"
                  onClick={() => handlePlanClick(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-12">
          All plans include access to our full fleet of bikes & scooties. Upgrade or downgrade anytime.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Plans;
