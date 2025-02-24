
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SocialAuthProps {
  onEmailClick: () => void;
}

export const SocialAuth = ({ onEmailClick }: SocialAuthProps) => {
  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
        onClick={() => handleSocialAuth('google')}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
      
      <Button
        className="w-full bg-black hover:bg-gray-900 text-white"
        onClick={() => handleSocialAuth('apple')}
      >
        <Apple className="w-5 h-5 mr-2" />
        Continue with Apple
      </Button>
      
      <Button
        className="w-full"
        variant="outline"
        onClick={onEmailClick}
      >
        <svg
          className="w-5 h-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Continue with Email
      </Button>
    </div>
  );
};
