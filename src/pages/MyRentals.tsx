import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Calendar, DollarSign, Clock, Bike } from "lucide-react";
import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function getRentalDurationHours(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const minutes = (now - start) / (1000 * 60);
  return Math.ceil(minutes / 60); // round up to full hours for billing
}

function getEstimatedCost(hourlyRate: number, startTime: string): number {
  const hours = getRentalDurationHours(startTime);
  return hours * Number(hourlyRate);
}

function formatDuration(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const totalMinutes = differenceInMinutes(now, start);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

const MyRentals = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [returnRentalId, setReturnRentalId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: rentals, isLoading } = useQuery({
    queryKey: ["my-rentals", user?.id],
    queryFn: () => api.rentals.list(),
    enabled: !!user,
  });

  const returnBikeMutation = useMutation({
    mutationFn: async (rentalId: string) => {
      const rental = rentals?.find((r) => r.id === rentalId);
      if (!rental) throw new Error("Rental not found");
      const { totalCost } = await api.rentals.return(rentalId);
      return totalCost;
    },
    onSuccess: (totalCost) => {
      setReturnRentalId(null);
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      toast.success(`Returned successfully! Total cost: $${totalCost.toFixed(2)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to return");
    },
  });

  const handleReturnClick = (rentalId: string) => setReturnRentalId(rentalId);
  const confirmReturn = () => {
    if (returnRentalId) returnBikeMutation.mutate(returnRentalId);
  };
  const returnRental = returnRentalId ? rentals?.find((r) => r.id === returnRentalId) : null;

  if (authLoading || isLoading) {
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

      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
            My <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Rentals</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            View and manage your bike & scooty rentals
          </p>
        </div>

        {rentals && rentals.length > 0 ? (
          <div className="space-y-6">
            {rentals.map((rental, index) => (
              <Card
                key={rental.id}
                className="animate-fade-in rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {rental.bikes?.name ?? "Vehicle"}
                      <Badge variant={rental.status === "active" ? "default" : "secondary"}>
                        {rental.status}
                      </Badge>
                    </CardTitle>
                    {rental.status === "active" && (
                      <Button
                        variant="accent"
                        className="rounded-xl hover:scale-105 active:scale-100 transition-transform"
                        onClick={() => handleReturnClick(rental.id)}
                        disabled={returnBikeMutation.isPending}
                      >
                        {returnBikeMutation.isPending ? "Returning..." : "Return"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {format(new Date(rental.start_time), "PPp")}</span>
                  </div>
                  {rental.status === "active" && (
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>
                        Duration:{" "}
                        {formatDistanceToNow(new Date(rental.start_time), {
                          addSuffix: false,
                        })}
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
                        <span>Total: ${Number(rental.total_cost ?? 0).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-card/50">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Bike className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No rentals yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm text-center">
              Head to browse bikes & scooties to rent your first vehicle and start exploring.
            </p>
            <Button variant="hero" className="rounded-xl shadow-md hover:scale-105 transition-transform" onClick={() => navigate("/bikes")}>
              Browse Bikes & Scooties
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={!!returnRentalId} onOpenChange={(open) => !open && setReturnRentalId(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Return vehicle & pay</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-2">
                {returnRental && (
                  <>
                    <p>
                      You are about to return <strong>{returnRental.bikes?.name ?? "this vehicle"}</strong>. 
                      Confirm the payment below to complete the return.
                    </p>
                    <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Rental duration
                        </span>
                        <span className="font-medium">{formatDuration(returnRental.start_time)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hourly rate</span>
                        <span className="font-medium">${Number(returnRental.bikes?.hourly_rate ?? 0).toFixed(2)}/hr</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between items-center">
                        <span className="font-semibold">Amount to pay</span>
                        <span className="text-lg font-bold text-primary">
                          ${getEstimatedCost(Number(returnRental.bikes?.hourly_rate ?? 0), returnRental.start_time).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-primary hover:bg-primary/90"
              onClick={confirmReturn}
              disabled={returnBikeMutation.isPending}
            >
              {returnBikeMutation.isPending ? "Processing..." : "Confirm & pay"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default MyRentals;
