import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const BikeCardSkeleton = () => (
  <Card className="overflow-hidden rounded-2xl border border-border/80 shadow-sm h-full flex flex-col">
    <Skeleton className="h-52 w-full rounded-none" />
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-[75%] mt-1" />
    </CardHeader>
    <CardContent className="space-y-3 flex-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-20" />
    </CardContent>
    <CardFooter className="pt-2">
      <Skeleton className="h-11 w-full rounded-xl" />
    </CardFooter>
  </Card>
);
