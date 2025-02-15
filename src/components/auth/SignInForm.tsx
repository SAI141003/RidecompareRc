
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

export const SignInForm = ({
  onSubmit,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: SignInFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl" 
        type="submit" 
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
};
