
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Phone, MapPin, MessageSquare, CheckCircle, AlertCircle, User } from "lucide-react";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { Separator } from "@/components/ui/separator";

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
      className="max-w-5xl mx-auto px-4 md:px-0 space-y-8 py-8"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gradient">Get In Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about our services? Need technical support? We're here to help you with any inquiries.
        </p>
        <div className="flex justify-center mt-6">
          <Separator className="w-24 bg-brand-400" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-4"
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <Card className="pro-card h-full border-l-4 border-l-brand-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </span>
                Contact Information
              </CardTitle>
              <CardDescription>Reach out directly to discuss any questions or concerns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  <h3 className="font-medium text-lg">Farid Masood</h3>
                </div>
                <p className="text-muted-foreground pl-9">Software Developer</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  <h4 className="font-medium">Email</h4>
                </div>
                <p className="text-muted-foreground pl-9">
                  <a href="mailto:faridmasoodofficial@gmail.com" className="hover:text-brand-600 animated-underline transition-colors">
                    faridmasoodofficial@gmail.com
                  </a>
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <Phone className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  <h4 className="font-medium">Phone</h4>
                </div>
                <p className="text-muted-foreground pl-9">0315-2656365</p>
                <p className="text-muted-foreground pl-9">03095171140</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  <h4 className="font-medium">Location</h4>
                </div>
                <p className="text-muted-foreground pl-9">
                  More Wala Chowk, Opposite Utility Store, Sahiwal
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  "We value your feedback and are committed to providing excellent service."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-8"
          whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        >
          <Card className="pro-card border-l-4 border-l-brand-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full">
                  <Send className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </span>
                <div>
                  <CardTitle>Send a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Full Name *
                    </Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={e => handleInputChange("name", e.target.value)} 
                      placeholder="Enter your name" 
                      className="focus:ring-brand-500 focus:border-brand-500 transition-all duration-300"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Phone Number *
                    </Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={e => handleInputChange("phone", e.target.value)} 
                      placeholder="Enter your phone number" 
                      className="focus:ring-brand-500 focus:border-brand-500 transition-all duration-300"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => handleInputChange("email", e.target.value)} 
                    placeholder="Enter your email" 
                    className="focus:ring-brand-500 focus:border-brand-500 transition-all duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Message *
                  </Label>
                  <Textarea 
                    id="message" 
                    value={formData.message} 
                    onChange={e => handleInputChange("message", e.target.value)} 
                    placeholder="How can we help you?" 
                    className="min-h-[180px] focus:ring-brand-500 focus:border-brand-500 transition-all duration-300" 
                    required 
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <motion.div 
                className="w-full" 
                whileTap={{ scale: 0.98 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)" 
                }}
              >
                <Button 
                  className="w-full flex items-center justify-center bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 transition-all duration-300" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> 
                      Send Message
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        variants={itemVariants}
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-brand-50/50 dark:bg-brand-900/10 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-brand-100 dark:bg-brand-900/40 p-3 rounded-full">
                {isSubmitting ? (
                  <AlertCircle className="h-6 w-6 text-brand-600 dark:text-brand-400 animate-pulse" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-brand-600 dark:text-brand-400 icon-bounce" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">We're Here to Help</h3>
                <p className="text-muted-foreground">
                  Your message will be delivered directly to our team. We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
