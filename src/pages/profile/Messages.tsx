
import { Card } from "@/components/ui/card";

const Messages = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <Card className="bg-gray-900 p-6">
          <p className="text-center text-gray-400">No messages yet</p>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
