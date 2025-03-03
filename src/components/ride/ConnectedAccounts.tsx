
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Link2Off, Car } from "lucide-react";
import { connectProvider, disconnectProvider, getConnectedProviders } from "@/services/rideService";
import { toast } from "sonner";

export const ConnectedAccounts = () => {
  const { data: connectedProviders, refetch: refetchProviders } = useQuery({
    queryKey: ['connected-providers'],
    queryFn: getConnectedProviders,
  });

  const handleConnect = async (provider: 'uber' | 'lyft') => {
    try {
      await connectProvider(provider);
      await refetchProviders();
      toast.success(`Successfully connected to ${provider.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Failed to connect to ${provider.toUpperCase()}: ${error.message}`);
    }
  };

  const handleDisconnect = async (provider: 'uber' | 'lyft') => {
    try {
      await disconnectProvider(provider);
      await refetchProviders();
      toast.success(`Successfully disconnected from ${provider.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Failed to disconnect from ${provider.toUpperCase()}: ${error.message}`);
    }
  };

  const isConnected = (provider: 'uber' | 'lyft') => {
    return connectedProviders?.some(p => p.provider_type === provider);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
          Connected Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4 flex flex-wrap gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <div className={`flex items-center ${isConnected('uber') ? 'opacity-100' : 'opacity-70'}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-black">
                <Car className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium ml-1">Uber</span>
              {isConnected('uber') && (
                <Badge variant="connected" className="ml-1 px-1.5 py-0 text-[10px]">
                  Connected
                </Badge>
              )}
            </div>
            
            <div className={`flex items-center ml-4 ${isConnected('lyft') ? 'opacity-100' : 'opacity-70'}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-600">
                <Car className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium ml-1">Lyft</span>
              {isConnected('lyft') && (
                <Badge variant="purple" className="ml-1 px-1.5 py-0 text-[10px]">
                  Connected
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {!isConnected('uber') && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handleConnect('uber')}
              >
                <Link className="h-3 w-3 mr-1" />
                Connect
              </Button>
            )}
            {!isConnected('lyft') && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handleConnect('lyft')}
              >
                <Link className="h-3 w-3 mr-1" />
                Connect
              </Button>
            )}
            {(isConnected('uber') || isConnected('lyft')) && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                onClick={() => {
                  if (isConnected('uber')) handleDisconnect('uber');
                  if (isConnected('lyft')) handleDisconnect('lyft');
                }}
              >
                <Link2Off className="h-3 w-3 mr-1" />
                Disconnect All
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
