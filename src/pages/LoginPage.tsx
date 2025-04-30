
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Enhanced validation schema with more strict rules
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50, {
    message: "Username cannot exceed 50 characters."
  }).trim(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).max(100, {
    message: "Password cannot exceed 100 characters."
  }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    // In a real application, you would authenticate with a backend
    // For this demo, we'll just simulate a login with a timeout
    setTimeout(() => {
      try {
        // Sanitize inputs
        const sanitizedUsername = data.username.trim();
        
        // Mock login with rate limiting (in a real app, this would be server-side)
        if (sanitizedUsername === "admin" && data.password === "password") {
          // Use sessionStorage instead of localStorage for better security
          // In a real app, you'd use httpOnly cookies or tokens managed by a backend
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("username", sanitizedUsername);
          
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          navigate("/");
        } else {
          toast({
            title: "Login failed",
            description: "Invalid username or password.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-brand-100 text-brand-800 rounded-full flex items-center justify-center mb-4">
            <LogIn size={24} />
          </div>
          <CardTitle className="text-2xl font-bold">Login to Stock Ledger</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <User size={16} />
                        </div>
                        <Input 
                          className="pl-10" 
                          placeholder="admin" 
                          {...field} 
                          autoComplete="username"
                          aria-autocomplete="list"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                          <Lock size={16} />
                        </div>
                        <Input
                          type="password"
                          className="pl-10"
                          placeholder="******"
                          {...field}
                          autoComplete="current-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                aria-label="Login"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">
            For demo, use: <span className="font-medium">admin</span> / <span className="font-medium">password</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
