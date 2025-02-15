
import { User2 } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  rating?: number;
}

export const ProfileHeader = ({ username, rating = 4.90 }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{username}</h1>
        <div className="flex items-center">
          <span className="text-sm mr-2">★</span>
          <span className="text-sm">{rating}</span>
        </div>
      </div>
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
        <User2 className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
};
