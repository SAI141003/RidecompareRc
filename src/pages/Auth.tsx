
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import WelcomeAnimation from "@/components/auth/WelcomeAnimation";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { Apple, Mail } from "lucide-react";

const Auth = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (user) {
    navigate("/");
    return null;
  }

  if (showWelcome) {
    return <WelcomeAnimation />;
  }

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (existingUser) {
          toast.error("Username is already taken");
          setLoading(false);
          return;
        }

        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message === "User already registered") {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(signUpError.message);
          }
          return;
        }

        const userId = data.user?.id;
        if (!userId) {
          toast.error("Failed to create user");
          return;
        }

        let avatarUrl = null;
        if (avatar) {
          try {
            const fileExt = avatar.name.split('.').pop();
            const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, avatar);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            avatarUrl = publicUrl;
          } catch (error: any) {
            toast.error("Failed to upload avatar");
            console.error("Avatar upload error:", error);
          }
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            username,
            full_name: fullName,
            avatar_url: avatarUrl,
          })
          .eq("id", userId);

        if (updateError) {
          toast.error("Failed to update profile");
          return;
        }

        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {showEmailForm ? (isSignUp ? "Create an account" : "Welcome back") : "Sign in"}
          </CardTitle>
          <CardDescription>
            {showEmailForm
              ? (isSignUp
                ? "Enter your details to create your account"
                : "Enter your email and password to login")
              : "Choose your preferred sign in method"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showEmailForm ? (
            <>
              {isSignUp ? (
                <SignUpForm
                  onSubmit={handleAuth}
                  loading={loading}
                  username={username}
                  setUsername={setUsername}
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  avatar={avatar}
                  setAvatar={setAvatar}
                  avatarPreview={avatarPreview}
                  setAvatarPreview={setAvatarPreview}
                />
              ) : (
                <SignInForm
                  onSubmit={handleAuth}
                  loading={loading}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              )}
              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </>
          ) : (
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
                onClick={() => setShowEmailForm(true)}
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
