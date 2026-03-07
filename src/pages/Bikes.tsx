import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BikeCard } from "@/components/BikeCard";
import { BikeCardSkeleton } from "@/components/BikeCardSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Search, Filter, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AADHAR_LENGTH = 12;

function validateAadhar(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === AADHAR_LENGTH;
}

function validateLicense(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 6;
}

const Bikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rentingBikeId, setRentingBikeId] = useState<string | null>(null);
  const [bikeToRent, setBikeToRent] = useState<{ id: string; name: string } | null>(null);
  const [aadharInput, setAadharInput] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: bikes, isLoading } = useQuery({
    queryKey: ["bikes"],
    queryFn: () => api.bikes.list(),
  });

  const rentBikeMutation = useMutation({
    mutationFn: async ({
      bikeId,
      aadharCard,
      licenseNumber,
    }: {
      bikeId: string;
      aadharCard: string;
      licenseNumber: string;
    }) => {
      if (!user) throw new Error("Must be logged in to rent");
      await api.rentals.create(bikeId, aadharCard, licenseNumber);
      return bikeId;
    },
    onSuccess: () => {
      setBikeToRent(null);
      setAadharInput("");
      setAadharError("");
       setLicenseInput("");
       setLicenseError("");
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success("Rented successfully!");
      navigate("/my-rentals");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to rent");
    },
    onSettled: () => {
      setRentingBikeId(null);
    },
  });

  const handleRentClick = (bikeId: string, bikeName: string) => {
    if (!user) {
      toast.error("Please sign in to rent a bike or scooty");
      navigate("/auth");
      return;
    }
    setBikeToRent({ id: bikeId, name: bikeName });
    setAadharInput("");
    setAadharError("");
    setLicenseInput("");
    setLicenseError("");
  };

  const handleAadharSubmit = () => {
    const trimmed = aadharInput.trim();
    if (!trimmed) {
      setAadharError("Please enter your Aadhar card number");
      return;
    }
    if (!validateAadhar(trimmed)) {
      setAadharError("Aadhar number must be exactly 12 digits");
      return;
    }
    setAadharError("");

    const licenseTrimmed = licenseInput.trim();
    if (!licenseTrimmed) {
      setLicenseError("Please enter your licence number");
      return;
    }
    if (!validateLicense(licenseTrimmed)) {
      setLicenseError("Licence number must be at least 6 characters");
      return;
    }
    setLicenseError("");

    if (!bikeToRent) return;
    setRentingBikeId(bikeToRent.id);
    const digitsOnly = trimmed.replace(/\D/g, "").slice(0, AADHAR_LENGTH);
    const normalizedLicense = licenseTrimmed.toUpperCase();
    rentBikeMutation.mutate({ bikeId: bikeToRent.id, aadharCard: digitsOnly, licenseNumber: normalizedLicense });
  };

  const handleCloseAadharDialog = (open: boolean) => {
    if (!open) {
      setBikeToRent(null);
      setAadharInput("");
      setAadharError("");
      setLicenseInput("");
      setLicenseError("");
    }
  };

  const formatAadharInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, AADHAR_LENGTH);
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  };

  const filteredAndSortedBikes = useMemo(() => {
    if (!bikes) return [];

    let filtered = bikes.filter((bike) => {
      const matchesSearch =
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || bike.type === typeFilter;
      const matchesStatus = statusFilter === "all" || bike.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.hourly_rate) - Number(b.hourly_rate);
        case "price-high":
          return Number(b.hourly_rate) - Number(a.hourly_rate);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return (
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
      }
    });

    return filtered;
  }, [bikes, searchQuery, typeFilter, statusFilter, sortBy]);

  const bikeTypes = useMemo(() => {
    if (!bikes) return [];
    return [...new Set(bikes.map((bike) => bike.type))];
  }, [bikes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background bg-pattern flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-10 flex-1">
          <div className="mb-10">
            <div className="h-10 w-48 bg-muted animate-pulse rounded-xl mb-2" />
            <div className="h-5 w-72 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="mb-10 h-32 bg-muted/50 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BikeCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
            Available <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Bikes & Scooties</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose from our wide selection of premium bikes and scooties
          </p>
        </div>

        <div className="mb-10 p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bikes and scooties by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-2"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] rounded-xl h-11">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {bikeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl h-11">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-xl h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || typeFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground font-medium">
            Showing {filteredAndSortedBikes.length} of {bikes?.length || 0} bikes & scooties
          </div>
        </div>

        {filteredAndSortedBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedBikes.map((bike, index) => (
              <div
                key={bike.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <BikeCard
                  bike={bike}
                  onRent={() => handleRentClick(bike.id, bike.name)}
                  isRenting={rentingBikeId === bike.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-card/50">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {bikes && bikes.length > 0 ? "No matches" : "No bikes or scooties yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm text-center">
              {bikes && bikes.length > 0
                ? "Try adjusting your filters or search to find more bikes or scooties."
                : "Check back later for new bikes and scooties."}
            </p>
            {bikes && bikes.length > 0 && (
              <Button variant="outline" className="rounded-xl" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all"); }}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!bikeToRent} onOpenChange={handleCloseAadharDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Security verification
            </DialogTitle>
            <DialogDescription>
              For your security, please enter your Aadhar card number before renting{" "}
              {bikeToRent ? <strong>{bikeToRent.name}</strong> : "this vehicle"}. Your details are stored securely and used only for verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="aadhar">Aadhar card number (12 digits)</Label>
            <Input
              id="aadhar"
              type="text"
              inputMode="numeric"
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
              value={aadharInput}
              onChange={(e) => setAadharInput(formatAadharInput(e.target.value))}
              className="rounded-xl font-mono text-lg tracking-widest"
              disabled={rentBikeMutation.isPending}
              autoFocus
            />
            {aadharError && (
              <p className="text-sm text-destructive">{aadharError}</p>
            )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="license">Driving licence number</Label>
              <Input
                id="license"
                type="text"
                placeholder="Enter driving licence number"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                className="rounded-xl"
                disabled={rentBikeMutation.isPending}
              />
              {licenseError && (
                <p className="text-sm text-destructive">{licenseError}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => handleCloseAadharDialog(false)}
              disabled={rentBikeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              onClick={handleAadharSubmit}
              disabled={rentBikeMutation.isPending}
            >
              {rentBikeMutation.isPending ? "Renting..." : "Confirm & rent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Bikes;
