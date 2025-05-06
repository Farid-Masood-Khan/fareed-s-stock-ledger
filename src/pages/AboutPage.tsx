
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Laptop, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  User, 
  ShieldCheck, 
  Bookmark, 
  History, 
  Zap, 
  Star, 
  Clock,
  Tool,
  BarChart3,
  Users,
  Server,
  Cpu,
  HardDrive,
  Headphones,
  Monitor
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 md:px-0 space-y-12 py-8"
    >
      {/* Main heading with animation */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold mb-3 text-gradient">About Stock Ledger</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          A comprehensive inventory management system designed specifically for computer shops and retailers.
        </p>
        <div className="flex justify-center mt-6">
          <Separator className="w-24 bg-brand-400" />
        </div>
      </motion.div>

      {/* Shop Information */}
      <motion.div variants={itemVariants} className="hover-lift">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white">Subhan Computer</h2>
              <p className="text-white/80 mt-2 flex items-center gap-2">
                <Laptop className="h-5 w-5 text-brand-300" />
                Computer & Laptop Sales and Services
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-20">
              <Cpu className="h-64 w-64 text-white -translate-y-1/4 translate-x-1/4" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-10">
              <Monitor className="h-40 w-40 text-white translate-y-1/4 -translate-x-1/4" />
            </div>
          </div>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-card dark:bg-gray-900/90">
            <motion.div 
              className="space-y-8"
              variants={{ 
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                }
              }}
            >
              <motion.div className="flex items-start" variants={iconVariants}>
                <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Owner</h3>
                  <p className="text-muted-foreground">Ali Ahmad</p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={iconVariants}>
                <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Contact Numbers</h3>
                  <p className="text-muted-foreground">0315-2656365</p>
                  <p className="text-muted-foreground">0309-5171140</p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={iconVariants}>
                <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-muted-foreground">More Wala Chowk, Opposite Utility Store, Sahiwal</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={{ 
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                }
              }}
            >
              <div className="flex items-start mb-6">
                <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full mr-4">
                  <Laptop className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Services</h3>
                  <ul className="space-y-3 staggered-children">
                    <motion.li className="flex items-center pl-2 border-l-2 border-green-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-muted-foreground">Computer & Laptop Sales and Purchase</span>
                    </motion.li>
                    <motion.li className="flex items-center pl-2 border-l-2 border-green-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-muted-foreground">Computer & Laptop Repairs</span>
                    </motion.li>
                    <motion.li className="flex items-center pl-2 border-l-2 border-green-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-muted-foreground">Computer Accessories</span>
                    </motion.li>
                    <motion.li className="flex items-center pl-2 border-l-2 border-green-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-muted-foreground">Software Installation</span>
                    </motion.li>
                    <motion.li className="flex items-center pl-2 border-l-2 border-green-500">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-muted-foreground">Hardware Troubleshooting</span>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Developer Information */}
      <motion.div variants={itemVariants} className="hover-lift">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">DEVELOPER</Badge>
              <h2 className="text-3xl font-bold text-white">Meet the Developer</h2>
              <p className="text-white/80 mt-2">Creator of Stock Ledger Application</p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-10">
              <Server className="h-72 w-72 text-white -translate-y-1/3 translate-x-1/3" />
            </div>
          </div>
          
          <CardContent className="p-8 bg-card dark:bg-gray-900/90">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center gap-4"
                  variants={iconVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
                    <User className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">M. Farid Masood Khan</h3>
                    <p className="text-muted-foreground">Software Developer</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4"
                  variants={iconVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact</h3>
                    <p className="text-muted-foreground">+92-3026673322</p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div 
                  className="flex items-center gap-4"
                  variants={iconVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>
                      <a href="mailto:faridmasoodofficial@gmail.com" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors animated-underline">
                        faridmasoodofficial@gmail.com
                      </a>
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4"
                  variants={iconVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Website</h3>
                    <p>
                      <a
                        href="https://fminv8.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors animated-underline"
                      >
                        fminv8.site
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="mt-10 p-5 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800/30">
              <p className="text-center italic text-muted-foreground">
                "Creating tools that simplify business operations and help local businesses thrive in the digital age."
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Stock Ledger */}
      <motion.div variants={itemVariants} className="hover-lift">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand-500/20 to-brand-700/20 pb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-500/20 dark:bg-brand-500/10 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">About Stock Ledger</CardTitle>
                <CardDescription>
                  A comprehensive inventory management solution
                </CardDescription>
              </div>
            </div>
            
            <div className="pl-14">
              <p className="text-muted-foreground">
                Stock Ledger is an advanced inventory management system designed specifically for computer shops and retailers.
                It helps manage inventory, track sales, maintain customer relationships, and generate detailed reports.
                The system is built with modern technologies to ensure speed, reliability, and ease of use.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <motion.div 
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                  }
                }}
              >
                <h3 className="text-xl font-semibold flex items-center">
                  <Star className="mr-2 h-5 w-5 text-amber-500" /> Key Features
                </h3>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-3">
                      <HardDrive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <span className="font-medium">Inventory Management</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Keep track of all products, categories, stock levels, and pricing with ease.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium">Sales Tracking</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Record and analyze all sales transactions with detailed customer information.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium">Shopkeeper Accounts</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Manage supplier relationships and balance accounts efficiently.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="font-medium">Financial Reports</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Generate comprehensive financial reports for better decision making.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="space-y-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
                  }
                }}
              >
                <h3 className="text-xl font-semibold flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-brand-500" /> Benefits
                </h3>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <span className="font-medium">Time-saving Automation</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Automate repetitive tasks to focus on growing your business.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                      <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <span className="font-medium">Detailed History</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Keep track of all past transactions and inventory changes.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                      <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <span className="font-medium">Enhanced Security</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Protect your business data with user authentication and secure storage.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border shadow-sm hover-lift"
                  variants={iconVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start">
                    <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full mr-3">
                      <Zap className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <span className="font-medium">Improved Efficiency</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Streamline operations with an intuitive and responsive interface.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-12 p-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800/30"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-5 flex items-center justify-center">
                <Headphones className="mr-3 h-5 w-5 text-brand-600 dark:text-brand-400" /> 
                System Requirements & Support
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Laptop className="h-4 w-4 mr-2 text-brand-600 dark:text-brand-400" />
                    Recommended Hardware
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground pl-8 list-disc">
                    <li>Modern web browser (Chrome, Firefox, Edge)</li>
                    <li>4GB RAM or higher</li>
                    <li>Stable internet connection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Tool className="h-4 w-4 mr-2 text-brand-600 dark:text-brand-400" />
                    Support
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    For support and assistance, please contact the developer directly via email or phone. We offer comprehensive training and ongoing technical support.
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
