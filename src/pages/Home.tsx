import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Bike, Clock, Shield, Zap, Search, CreditCard, MapPin } from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroImage from "@/assets/hero-bikes.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/bikes", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user) {
    return null;
  }

  const statsInfo = {
    bikes: {
      title: "500+ Bikes & Scooties Available",
      description: "Our extensive fleet includes bikes (mountain, city, road, electric, hybrid) and scooties. All maintained to the highest standards and regularly serviced for your safety and comfort."
    },
    riders: {
      title: "10k+ Happy Riders",
      description: "Join our growing community of satisfied customers who trust PedalSync for their daily commutes, weekend adventures, and fitness journeys. Over 10,000 rides completed with 4.8/5 average rating."
    },
    support: {
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available around the clock to assist you with bookings, technical issues, or any questions. Reach us via chat, email, or phone anytime."
    }
  };

  const features = [
    {
      icon: Bike,
      title: "Wide Selection",
      description: "Choose from our diverse fleet of bikes and scooties for every need",
    },
    {
      icon: Clock,
      title: "Hourly Rentals",
      description: "Flexible pricing with transparent hourly rates",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and secure authentication system",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live availability tracking and instant confirmations",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Bikes and Scooties"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-pattern opacity-50" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl space-y-8">
            <p className="text-primary font-semibold tracking-wide uppercase text-sm animate-fade-in">
              Bikes & Scooties rental
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight animate-fade-in">
              Your Journey{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed animate-fade-in">
              Discover the freedom of riding. Rent premium bikes and scooties by the hour and explore your city in style.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in">
              <Button
                variant="hero"
                size="xl"
                className="rounded-xl shadow-lg"
                onClick={() => navigate("/plans")}
              >
                View Plans
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="rounded-xl border-2 bg-background/80 backdrop-blur-sm"
                onClick={() => navigate("/auth")}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Why Choose PedalSync?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make bike and scooty rental simple, secure, and seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              How It <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get on a bike or scooty in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, icon: Search, title: "Pick a plan", desc: "Choose Basic, Pro, or Premium and sign up in seconds." },
              { step: 2, icon: CreditCard, title: "Book a bike or scooty", desc: "Browse available bikes and scooties and rent by the hour with one click." },
              { step: 3, icon: MapPin, title: "Ride & return", desc: "Pick up your bike or scooty, explore, and return when you're done." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="relative text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
                {step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="group p-10 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 animate-scale-in" 
              style={{ animationDelay: "0.1s" }}
              onClick={() => setOpenDialog("bikes")}
            >
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-muted-foreground text-lg font-medium">Bikes & Scooties</p>
            </div>
            <div 
              className="group p-10 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 animate-scale-in" 
              style={{ animationDelay: "0.2s" }}
              onClick={() => setOpenDialog("riders")}
            >
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                10k+
              </div>
              <p className="text-muted-foreground text-lg font-medium">Happy Riders</p>
            </div>
            <div 
              className="group p-10 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 animate-scale-in" 
              style={{ animationDelay: "0.3s" }}
              onClick={() => setOpenDialog("support")}
            >
              <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-muted-foreground text-lg font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dialogs */}
      <Dialog open={openDialog === "bikes"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statsInfo.bikes.title}</DialogTitle>
            <DialogDescription>{statsInfo.bikes.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "riders"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statsInfo.riders.title}</DialogTitle>
            <DialogDescription>{statsInfo.riders.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "support"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statsInfo.support.title}</DialogTitle>
            <DialogDescription>{statsInfo.support.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow p-12 sm:p-16 text-center text-primary-foreground shadow-2xl hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] transition-shadow duration-500">
            <div className="absolute inset-0 bg-pattern opacity-10" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Ready to Ride?</h2>
              <p className="text-xl mb-10 opacity-95 max-w-xl mx-auto">
                Join thousands of happy riders and start your adventure today
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="secondary"
                  size="xl"
                  className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold shadow-lg hover:scale-105 active:scale-100 transition-transform"
                  onClick={() => navigate("/plans")}
                >
                  View Plans
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-semibold hover:scale-105 active:scale-100 transition-transform"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
