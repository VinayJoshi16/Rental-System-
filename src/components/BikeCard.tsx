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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary-glow/10">
        {bike.image_url ? (
          <img
            src={bike.image_url}
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Bike className="w-16 h-16 text-primary/30" />
          </div>
        )}
        <Badge
          className="absolute top-3 right-3"
          variant={isAvailable ? "default" : "secondary"}
        >
          {bike.status}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {bike.name}
          <Badge variant="outline">{bike.type}</Badge>
        </CardTitle>
        <CardDescription>{bike.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {bike.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{bike.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Clock className="w-4 h-4" />
          <span>${bike.hourly_rate}/hour</span>
        </div>
      </CardContent>

      <CardFooter>
        {onRent && (
          <Button
            variant={isAvailable ? "hero" : "secondary"}
            className="w-full"
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
