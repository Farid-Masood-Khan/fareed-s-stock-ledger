import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Laptop, Phone, Mail, Globe, Map, User } from "lucide-react";
const AboutPage = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 my-[28px]">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={itemVariants}>
        {/* Shop Information */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-brand-100 dark:bg-gray-800">
            <CardTitle className="flex items-center gap-2">
              <Laptop className="h-6 w-6 text-brand-600" />
              Subhan Computer
            </CardTitle>
            <CardDescription>Computer & Laptop Sales and Services</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Owner</h3>
                <p>Ali Ahmad</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Contact Numbers</h3>
                <p>0315-2656365</p>
                <p>0309-5171140</p>
              </div>
            </div>

            <div className="flex items-start">
              <Map className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>More Wala Chowk, Opposite Utility Store, Sahiwal</p>
              </div>
            </div>

            <div className="flex items-start">
              <Laptop className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Services</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Computer & Laptop Sales and Purchase</li>
                  <li>Computer & Laptop Repairs</li>
                  <li>Computer Accessories</li>
                  <li>Software Installation</li>
                  <li>Hardware Troubleshooting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Information */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="bg-brand-100 dark:bg-gray-800">
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-brand-600" />
              Developer Information
            </CardTitle>
            <CardDescription>Software developer and creator</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Developer</h3>
                <p>M. Farid Masood Khan</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>+92-3026673322</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>
                  <a href="mailto:faridmasoodofficial@gmail.com" className="text-brand-600 hover:underline">
                    faridmasoodofficial@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe className="h-5 w-5 mr-2 text-brand-500 mt-0.5" />
              <div>
                <h3 className="font-semibold">Website</h3>
                <p>
                  <a href="https://fminv8.site" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    fminv8.site
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>About Stock Ledger</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-muted-foreground">
              Stock Ledger is a comprehensive inventory management system designed specifically for computer shops and retailers.
              It helps manage inventory, track sales, maintain customer relationships, and generate detailed reports.
              The system is built with modern technologies to ensure speed, reliability, and ease of use.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Inventory Management</li>
                  <li>Sales Tracking</li>
                  <li>Shopkeeper Accounts</li>
                  <li>Expense Tracking</li>
                  <li>Financial Reports</li>
                  <li>Computer Services Tracking</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Streamlined Inventory Control</li>
                  <li>Enhanced Customer Management</li>
                  <li>Detailed Financial Insights</li>
                  <li>Improved Business Decision Making</li>
                  <li>Time-saving Automation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>;
};
export default AboutPage;