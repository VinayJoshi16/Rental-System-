import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Bike, Clock, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bikes.jpg";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bike,
      title: "Wide Selection",
      description: "Choose from our diverse fleet of bikes for every need",
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
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Bikes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Your Journey Starts{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Here
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the freedom of cycling with PedalSync. Rent premium bikes by the hour and explore your city in style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate("/bikes")}
              >
                Browse Bikes
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate("/auth")}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Why Choose PedalSync?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make bike rental simple, secure, and seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-muted-foreground text-lg">Bikes Available</p>
            </div>
            <div className="p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                10k+
              </div>
              <p className="text-muted-foreground text-lg">Happy Riders</p>
            </div>
            <div className="p-8 animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-muted-foreground text-lg">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-4xl font-bold mb-4">Ready to Ride?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of happy riders and start your adventure today
            </p>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate("/auth")}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
