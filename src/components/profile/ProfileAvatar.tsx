
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string;
  previewUrl: string;
  firstName: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({
  avatarUrl,
  previewUrl,
  firstName,
  onAvatarChange,
}: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur" />
        <Avatar className="h-24 w-24 cursor-pointer relative">
          <AvatarImage src={previewUrl || avatarUrl} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            {firstName ? firstName.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload avatar"
          />
        </Avatar>
      </div>
      <p className="text-sm text-muted-foreground">Click to change avatar</p>
    </div>
  );
};
