
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, Phone, Mail, Globe, Map, User, ShieldCheck, Bookmark, History, Zap, Star, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 md:px-0 space-y-8 py-8"
    >
      {/* Main heading with animation */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold mb-3">About Stock Ledger</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A comprehensive inventory management system designed specifically for computer shops and retailers.
        </p>
        <div className="flex justify-center mt-6">
          <Separator className="w-24 bg-brand-400" />
        </div>
      </motion.div>

      {/* Shop Information */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-6">
            <h2 className="text-2xl font-bold text-white">Subhan Computer</h2>
            <p className="text-white/80">Computer & Laptop Sales and Services</p>
          </div>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Owner</h3>
                  <p className="text-muted-foreground">Ali Ahmad</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Contact Numbers</h3>
                  <p className="text-muted-foreground">0315-2656365</p>
                  <p className="text-muted-foreground">0309-5171140</p>
                </div>
              </div>

              <div className="flex items-start">
                <Map className="h-5 w-5 mr-3 text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-muted-foreground">More Wala Chowk, Opposite Utility Store, Sahiwal</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <Laptop className="h-5 w-5 mr-3 text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Services</h3>
                  <ul className="space-y-2 text-muted-foreground mt-2">
                    <li className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Computer & Laptop Sales and Purchase
                    </li>
                    <li className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Computer & Laptop Repairs
                    </li>
                    <li className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Computer Accessories
                    </li>
                    <li className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Software Installation
                    </li>
                    <li className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Hardware Troubleshooting
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Developer Information */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-brand-700 to-brand-900 p-6">
            <h2 className="text-2xl font-bold text-white">Developer Information</h2>
            <p className="text-white/80">Software developer and creator</p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-brand-500" />
                  <div>
                    <h3 className="font-semibold">Developer</h3>
                    <p className="text-muted-foreground">M. Farid Masood Khan</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-brand-500" />
                  <div>
                    <h3 className="font-semibold">Contact</h3>
                    <p className="text-muted-foreground">+92-3026673322</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-brand-500" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>
                      <a href="mailto:faridmasoodofficial@gmail.com" className="text-brand-600 hover:underline">
                        faridmasoodofficial@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-brand-500" />
                  <div>
                    <h3 className="font-semibold">Website</h3>
                    <p>
                      <a
                        href="https://fminv8.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        fminv8.site
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Stock Ledger */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand-500/20 to-brand-700/20">
            <CardTitle className="text-2xl">About Stock Ledger</CardTitle>
            <CardDescription>
              A complete inventory management solution for computer shops
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <p className="text-muted-foreground mb-6">
              Stock Ledger is a comprehensive inventory management system designed specifically for computer shops and retailers.
              It helps manage inventory, track sales, maintain customer relationships, and generate detailed reports.
              The system is built with modern technologies to ensure speed, reliability, and ease of use.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Star className="mr-2 h-5 w-5 text-brand-500" /> Key Features
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Bookmark className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Inventory Management</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Keep track of all products, categories, stock levels, and pricing with ease.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Bookmark className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Sales Tracking</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Record and analyze all sales transactions with detailed customer information.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Bookmark className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Shopkeeper Accounts</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Manage supplier relationships and balance accounts efficiently.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Bookmark className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Financial Reports</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Generate comprehensive financial reports for better decision making.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-brand-500" /> Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Time-saving Automation</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Automate repetitive tasks to focus on growing your business.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <History className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Detailed History</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Keep track of all past transactions and inventory changes.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Enhanced Security</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Protect your business data with user authentication and secure storage.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Improved Efficiency</span>
                      <p className="text-muted-foreground text-sm mt-1">
                        Streamline operations with an intuitive and responsive interface.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">System Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Recommended Hardware</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Modern web browser (Chrome, Firefox, Edge)</li>
                    <li>• 4GB RAM or higher</li>
                    <li>• Stable internet connection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Support</h4>
                  <p className="text-sm text-muted-foreground">
                    For support and assistance, please contact the developer directly via email or phone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
