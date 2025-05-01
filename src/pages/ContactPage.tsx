
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import { useNotificationSound } from "@/hooks/use-notification-sound";

const ContactPage = () => {
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      playSound("error");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // In a real implementation, this would send an email to the developer
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We will get back to you soon."
      });
      playSound("success");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
      playSound("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6 my-[28px] px-4 md:px-0 max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Contact Developer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about the Stock Ledger application? Get in touch with the developer directly using the form below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="h-full border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                Developer Contact
              </CardTitle>
              <CardDescription>Reach out directly to discuss any issues or enhancements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">Farid Masood</h3>
                <p className="text-muted-foreground">Software Developer</p>
              </div>
              
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-muted-foreground">
                  <a href="mailto:faridmasoodofficial@gmail.com" className="hover:text-brand-600 transition-colors">
                    faridmasoodofficial@gmail.com
                  </a>
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-muted-foreground">0315-2656365</p>
                <p className="text-muted-foreground">03095171140</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-8">
          <Card className="shadow-md hover:shadow-lg transition-all border-l-4 border-l-brand-500">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => handleInputChange("name", e.target.value)} 
                    placeholder="Enter your name" 
                    className="border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => handleInputChange("email", e.target.value)} 
                    placeholder="Enter your email" 
                    className="border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={e => handleInputChange("phone", e.target.value)} 
                    placeholder="Enter your phone number" 
                    className="border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium">Message *</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message} 
                    onChange={e => handleInputChange("message", e.target.value)} 
                    placeholder="How can we help you?" 
                    className="min-h-[150px] border-gray-300 focus:border-brand-500 focus:ring-brand-500" 
                    required 
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700 transition-colors" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> 
                    Send Message
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
