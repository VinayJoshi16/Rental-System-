import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Calendar, DollarSign, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyRentals = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: rentals, isLoading } = useQuery({
    queryKey: ["my-rentals", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          bikes (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const returnBikeMutation = useMutation({
    mutationFn: async (rentalId: string) => {
      const rental = rentals?.find((r) => r.id === rentalId);
      if (!rental) throw new Error("Rental not found");

      const startTime = new Date(rental.start_time);
      const endTime = new Date();
      const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
      const totalCost = hours * Number(rental.bikes.hourly_rate);

      // Update rental
      const { error: rentalError } = await supabase
        .from("rentals")
        .update({
          end_time: endTime.toISOString(),
          total_cost: totalCost,
          status: "completed",
        })
        .eq("id", rentalId);

      if (rentalError) throw rentalError;

      // Update bike status
      const { error: bikeError } = await supabase
        .from("bikes")
        .update({ status: "available" })
        .eq("id", rental.bike_id);

      if (bikeError) throw bikeError;

      return totalCost;
    },
    onSuccess: (totalCost) => {
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success(`Bike returned! Total cost: $${totalCost.toFixed(2)}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to return bike");
    },
  });

  if (authLoading || isLoading) {
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
          <h1 className="text-4xl font-bold mb-4">My Rentals</h1>
          <p className="text-muted-foreground text-lg">
            View and manage your bike rentals
          </p>
        </div>

        {rentals && rentals.length > 0 ? (
          <div className="space-y-4">
            {rentals.map((rental, index) => (
              <Card key={rental.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {rental.bikes.name}
                      <Badge variant={rental.status === "active" ? "default" : "secondary"}>
                        {rental.status}
                      </Badge>
                    </CardTitle>
                    {rental.status === "active" && (
                      <Button
                        variant="accent"
                        onClick={() => returnBikeMutation.mutate(rental.id)}
                        disabled={returnBikeMutation.isPending}
                      >
                        {returnBikeMutation.isPending ? "Returning..." : "Return Bike"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Started: {format(new Date(rental.start_time), "PPp")}
                    </span>
                  </div>
                  {rental.status === "active" && (
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>
                        Duration: {formatDistanceToNow(new Date(rental.start_time), { addSuffix: false })}
                      </span>
                    </div>
                  )}
                  {rental.end_time && (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Returned: {format(new Date(rental.end_time), "PPp")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>Total: ${Number(rental.total_cost).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No rentals yet</p>
            <Button variant="hero" onClick={() => navigate("/bikes")}>
              Browse Bikes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
