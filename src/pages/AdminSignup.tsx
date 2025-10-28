import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const adminSignUpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  confirmPassword: z.string(),
  adminCode: z.string().min(1, "Admin code is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AdminSignup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  if (user) {
    navigate("/admin");
    return null;
  }

  const handleAdminSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fullName: formData.get("fullName") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      adminCode: formData.get("adminCode") as string,
    };

    try {
      adminSignUpSchema.parse(data);

      // Verify admin code (in production, this should be validated server-side)
      if (data.adminCode !== "ADMIN2024") {
        setErrors({ adminCode: "Invalid admin code" });
        setLoading(false);
        return;
      }

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Insert admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: "admin",
          });

        if (roleError) {
          toast.error("Failed to assign admin role");
          setLoading(false);
          return;
        }

        toast.success("Admin account created successfully!");
        navigate("/admin");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary-glow/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center">
              <Shield className="w-7 h-7 text-destructive-foreground" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
              Admin Portal
            </span>
          </div>
          <p className="text-muted-foreground">Create an administrator account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Registration</CardTitle>
            <CardDescription>
              This portal is for administrators only. You'll need a valid admin code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Admin Name"
                  required
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminCode">Admin Code</Label>
                <Input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  placeholder="Enter admin code"
                  required
                />
                {errors.adminCode && (
                  <p className="text-sm text-destructive">{errors.adminCode}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Admin Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;
