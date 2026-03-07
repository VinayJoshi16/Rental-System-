import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Bike, Users, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const bikeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  type: z.string().trim().min(1, "Type is required").max(50),
  description: z.string().trim().max(500).optional(),
  hourly_rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Rate must be a positive number",
  }),
  location: z.string().trim().max(200).optional(),
  image_url: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
});

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.admin.stats(),
    enabled: !!user && isAdmin,
  });

  const { data: bikes } = useQuery({
    queryKey: ["admin-bikes"],
    queryFn: () => api.bikes.list(),
    enabled: !!user && isAdmin,
  });

  const addBikeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = {
        name: formData.get("name") as string,
        type: selectedType || (formData.get("type") as string),
        description: formData.get("description") as string,
        hourly_rate: formData.get("hourly_rate") as string,
        location: formData.get("location") as string,
        image_url: formData.get("image_url") as string,
      };

      const validated = bikeSchema.parse(data);

      await api.bikes.create({
        name: validated.name,
        type: validated.type,
        description: validated.description || undefined,
        hourly_rate: Number(validated.hourly_rate),
        location: validated.location || undefined,
        image_url: validated.image_url || undefined,
        status: "available",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bikes"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Bike / Scooty added successfully!");
      setIsDialogOpen(false);
      setFormErrors({});
      setSelectedType("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add bike / scooty");
    },
  });

  const handleAddBike = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    const formData = new FormData(e.currentTarget);

    try {
      addBikeMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
            Admin <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage bikes, scooties and monitor system activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bikes & Scooties</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats?.totalBikes ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats?.activeRentals ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bike & Scooty Fleet</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bike
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Bike or Scooty</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddBike} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name*</Label>
                      <Input id="name" name="name" required />
                      {formErrors.name && (
                        <p className="text-sm text-destructive">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type*</Label>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bike">Bike</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Cruiser">Cruiser</SelectItem>
                          <SelectItem value="Roadster">Roadster</SelectItem>
                          <SelectItem value="Adventure">Adventure</SelectItem>
                          <SelectItem value="Neo Retro">Neo Retro</SelectItem>
                          <SelectItem value="Scooty">Scooty</SelectItem>
                          <SelectItem value="Scooter">Scooter</SelectItem>
                          <SelectItem value="Electric Scooter">Electric Scooter</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.type && (
                        <p className="text-sm text-destructive">{formErrors.type}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} />
                      {formErrors.description && (
                        <p className="text-sm text-destructive">{formErrors.description}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate">Hourly Rate ($)*</Label>
                      <Input
                        id="hourly_rate"
                        name="hourly_rate"
                        type="number"
                        step="0.01"
                        required
                      />
                      {formErrors.hourly_rate && (
                        <p className="text-sm text-destructive">{formErrors.hourly_rate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" />
                      {formErrors.location && (
                        <p className="text-sm text-destructive">{formErrors.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        type="url"
                        placeholder="https://example.com/bike-image.jpg"
                      />
                      {formErrors.image_url && (
                        <p className="text-sm text-destructive">{formErrors.image_url}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      disabled={addBikeMutation.isPending}
                    >
                      {addBikeMutation.isPending ? "Adding..." : "Add Bike / Scooty"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {bikes && bikes.length > 0 ? (
              <div className="space-y-4">
                {bikes.map((bike) => (
                  <div
                    key={bike.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {bike.image_url ? (
                      <img
                        src={bike.image_url}
                        alt={bike.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <Bike className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{bike.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bike.type} • ${bike.hourly_rate}/hr
                      </p>
                      {bike.location && (
                        <p className="text-xs text-muted-foreground mt-1">📍 {bike.location}</p>
                      )}
                    </div>
                    <Badge variant={bike.status === "available" ? "default" : "secondary"}>
                      {bike.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No bikes or scooties yet. Add your first vehicle to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
