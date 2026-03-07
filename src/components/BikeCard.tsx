import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bike, MapPin, Clock } from "lucide-react";

interface BikeCardProps {
  bike: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    hourly_rate: number;
    status: string;
    location: string | null;
    image_url: string | null;
  };
  onRent?: (bikeId: string) => void;
  isRenting?: boolean;
}

export const BikeCard = ({ bike, onRent, isRenting }: BikeCardProps) => {
  const isAvailable = bike.status === "available";

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10">
        {bike.image_url ? (
          <img
            src={bike.image_url}
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Bike className="w-16 h-16 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Badge
          className="absolute top-3 right-3 rounded-lg shadow-md capitalize"
          variant={isAvailable ? "default" : "secondary"}
        >
          {bike.status}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <span className="line-clamp-1">{bike.name}</span>
          <Badge variant="outline" className="rounded-lg shrink-0">{bike.type}</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {bike.description || "Premium bike or scooty for your ride."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {bike.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{bike.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-lg font-bold text-primary">
          <Clock className="w-5 h-5" />
          <span>${bike.hourly_rate}<span className="text-sm font-normal text-muted-foreground">/hour</span></span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {onRent && (
          <Button
            variant={isAvailable ? "hero" : "secondary"}
            className="w-full rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
            disabled={!isAvailable || isRenting}
            onClick={() => onRent(bike.id)}
          >
            {isRenting ? "Renting..." : isAvailable ? "Rent Now" : "Unavailable"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
