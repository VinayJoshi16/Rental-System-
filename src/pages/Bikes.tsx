import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { BikeCard } from "@/components/BikeCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Bikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rentingBikeId, setRentingBikeId] = useState<string | null>(null);

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
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Available Bikes</h1>
          <p className="text-muted-foreground text-lg">
            Choose from our wide selection of premium bikes
          </p>
        </div>

        {bikes && bikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onRent={handleRent}
                isRenting={rentingBikeId === bike.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No bikes available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bikes;
