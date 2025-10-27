import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { BikeCard } from "@/components/BikeCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Bikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rentingBikeId, setRentingBikeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: bikes, isLoading } = useQuery({
    queryKey: ["bikes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bikes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const rentBikeMutation = useMutation({
    mutationFn: async (bikeId: string) => {
      if (!user) throw new Error("Must be logged in to rent");

      // Start a transaction-like operation
      const { data: bike, error: bikeError } = await supabase
        .from("bikes")
        .select("*")
        .eq("id", bikeId)
        .single();

      if (bikeError) throw bikeError;
      if (bike.status !== "available") {
        throw new Error("This bike is no longer available");
      }

      // Create rental
      const { error: rentalError } = await supabase
        .from("rentals")
        .insert({
          user_id: user.id,
          bike_id: bikeId,
          status: "active",
        });

      if (rentalError) throw rentalError;

      // Update bike status
      const { error: updateError } = await supabase
        .from("bikes")
        .update({ status: "rented" })
        .eq("id", bikeId);

      if (updateError) throw updateError;

      return bikeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success("Bike rented successfully!");
      navigate("/my-rentals");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to rent bike");
    },
    onSettled: () => {
      setRentingBikeId(null);
    },
  });

  const handleRent = (bikeId: string) => {
    if (!user) {
      toast.error("Please sign in to rent a bike");
      navigate("/auth");
      return;
    }
    setRentingBikeId(bikeId);
    rentBikeMutation.mutate(bikeId);
  };

  // Filter and sort bikes
  const filteredAndSortedBikes = useMemo(() => {
    if (!bikes) return [];

    let filtered = bikes.filter((bike) => {
      const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bike.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || bike.type === typeFilter;
      const matchesStatus = statusFilter === "all" || bike.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort bikes
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
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Bikes</h1>
          <p className="text-muted-foreground text-lg">
            Choose from our wide selection of premium bikes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bikes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
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

          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedBikes.length} of {bikes?.length || 0} bikes
          </div>
        </div>

        {filteredAndSortedBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBikes.map((bike, index) => (
              <div key={bike.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <BikeCard
                  bike={bike}
                  onRent={handleRent}
                  isRenting={rentingBikeId === bike.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {bikes && bikes.length > 0
                ? "No bikes match your search criteria"
                : "No bikes available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bikes;
