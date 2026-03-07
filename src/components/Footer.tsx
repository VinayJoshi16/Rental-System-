import { Link } from "react-router-dom";
import { Bike, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/80 bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                PedalSync
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Bikes & Scooties rental for everyone. Choose a plan, pick a bike or scooty, and start your journey.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-muted-foreground hover:text-primary transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link to="/bikes" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Bikes & Scooties
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                support@pedalsync.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                Downtown Station
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/80 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PedalSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
