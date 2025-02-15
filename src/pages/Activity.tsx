
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Car } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  provider: string;
  ride_type: string;
}

const getStatusColor = (status: Ride['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'confirmed':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const Activity = () => {
  const { data: rides, isLoading } = useQuery({
    queryKey: ['rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ride[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Ride Activity</h1>
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides?.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>
                    {new Date(ride.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">From: {ride.pickup_location}</span>
                      <span className="text-sm">To: {ride.dropoff_location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>{ride.provider} - {ride.ride_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>${ride.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatusColor(ride.status)} text-white`}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Activity;
