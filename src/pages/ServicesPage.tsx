
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, Search, Plus, CheckCircle, AlertCircle, Clock, WrenchIcon } from "lucide-react";

// Service types for computer/laptop repair
interface RepairService {
  id: string;
  customerName: string;
  contact: string;
  deviceType: "Laptop" | "Desktop" | "Other";
  deviceDetails: string;
  issueDescription: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  estimatedCost: number;
  finalCost?: number;
  dateReceived: Date;
  dateCompleted?: Date;
  notes?: string;
}

const ServicesPage = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<RepairService[]>([
    {
      id: "1",
      customerName: "Ahmed Ali",
      contact: "0300-1234567",
      deviceType: "Laptop",
      deviceDetails: "HP Pavilion - 8GB RAM, 512GB SSD",
      issueDescription: "Laptop not turning on, power issues",
      status: "In Progress",
      estimatedCost: 2500,
      dateReceived: new Date(Date.now() - 86400000 * 2), // 2 days ago
      notes: "Needs power supply replacement"
    },
    {
      id: "2",
      customerName: "Sarah Khan",
      contact: "0333-7654321",
      deviceType: "Desktop",
      deviceDetails: "Custom build - i5, 16GB RAM",
      issueDescription: "Blue screen errors, system crashing",
      status: "Pending",
      estimatedCost: 1500,
      dateReceived: new Date(),
      notes: "Possibly RAM issue"
    },
    {
      id: "3",
      customerName: "Usman Sheikh",
      contact: "0321-9876543",
      deviceType: "Laptop",
      deviceDetails: "Dell XPS 13",
      issueDescription: "Screen replacement",
      status: "Completed",
      estimatedCost: 12000,
      finalCost: 12000,
      dateReceived: new Date(Date.now() - 86400000 * 5), // 5 days ago
      dateCompleted: new Date(),
      notes: "Screen replaced, working perfectly"
    }
  ]);

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [newService, setNewService] = useState<Omit<RepairService, "id" | "dateReceived">>({
    customerName: "",
    contact: "",
    deviceType: "Laptop",
    deviceDetails: "",
    issueDescription: "",
    status: "Pending",
    estimatedCost: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setNewService({
      ...newService,
      [field]: value
    });
  };

  const handleAddService = () => {
    if (!newService.customerName || !newService.contact || !newService.deviceDetails || !newService.issueDescription) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newServiceEntry: RepairService = {
      ...newService,
      id: Date.now().toString(),
      dateReceived: new Date()
    };

    setServices([newServiceEntry, ...services]);
    setIsAddFormOpen(false);
    toast({
      title: "Service Added",
      description: `Service ticket created for ${newService.customerName}`,
    });

    // Reset form
    setNewService({
      customerName: "",
      contact: "",
      deviceType: "Laptop",
      deviceDetails: "",
      issueDescription: "",
      status: "Pending",
      estimatedCost: 0,
    });
  };

  const updateServiceStatus = (id: string, newStatus: RepairService["status"]) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const updatedService = { ...service, status: newStatus };
        if (newStatus === "Completed" && !service.dateCompleted) {
          updatedService.dateCompleted = new Date();
        }
        return updatedService;
      }
      return service;
    }));

    toast({
      title: "Status Updated",
      description: `Service status changed to ${newStatus}`,
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.deviceDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.contact.includes(searchQuery);
    
    const matchesStatus = !filterStatus || service.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RepairService["status"]) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Cancelled": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default: return "";
    }
  };

  const getStatusIcon = (status: RepairService["status"]) => {
    switch (status) {
      case "Pending": return <Clock className="h-4 w-4 mr-1" />;
      case "In Progress": return <WrenchIcon className="h-4 w-4 mr-1" />;
      case "Completed": return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Cancelled": return <AlertCircle className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" variants={itemVariants}>
        <div>
          <h1 className="text-2xl font-bold">Computer Repair Services</h1>
          <p className="text-muted-foreground">Track and manage computer repair services</p>
        </div>
        <Button 
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Service
        </Button>
      </motion.div>

      {isAddFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Service</CardTitle>
              <CardDescription>Enter customer and device details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input 
                    id="customerName" 
                    value={newService.customerName} 
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter customer name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input 
                    id="contact" 
                    value={newService.contact} 
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="Enter contact number" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceType">Device Type</Label>
                  <Select 
                    value={newService.deviceType} 
                    onValueChange={(value: "Laptop" | "Desktop" | "Other") => handleInputChange("deviceType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (Rs.)</Label>
                  <Input 
                    id="estimatedCost" 
                    type="number" 
                    value={newService.estimatedCost.toString()} 
                    onChange={(e) => handleInputChange("estimatedCost", Number(e.target.value))}
                    placeholder="Enter estimated cost" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceDetails">Device Details *</Label>
                <Input 
                  id="deviceDetails" 
                  value={newService.deviceDetails} 
                  onChange={(e) => handleInputChange("deviceDetails", e.target.value)}
                  placeholder="Brand, model, specs, etc." 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issueDescription">Issue Description *</Label>
                <Textarea 
                  id="issueDescription" 
                  value={newService.issueDescription} 
                  onChange={(e) => handleInputChange("issueDescription", e.target.value)}
                  placeholder="Describe the problem in detail" 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  value={newService.notes || ""} 
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddFormOpen(false)}>Cancel</Button>
              <Button onClick={handleAddService}>Add Service</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <motion.div className="flex flex-col md:flex-row gap-3 mb-4" variants={itemVariants}>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by name, device, or issue..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterStatus || ""} onValueChange={(value) => setFilterStatus(value || undefined)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div className="grid gap-4" variants={containerVariants}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-5 w-5 text-brand-600" />
                      <CardTitle>{service.customerName}</CardTitle>
                    </div>
                    <div className="flex items-center text-sm">
                      <Badge className={`flex items-center ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {service.contact} • {new Date(service.dateReceived).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold mb-1">Device</p>
                      <p className="text-sm text-muted-foreground">{service.deviceType}: {service.deviceDetails}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Cost</p>
                      <p className="text-sm text-muted-foreground">
                        {service.finalCost ? `Rs. ${service.finalCost} (Final)` : `Rs. ${service.estimatedCost} (Est.)`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1">Issue</p>
                    <p className="text-sm text-muted-foreground">{service.issueDescription}</p>
                  </div>
                  
                  {service.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{service.notes}</p>
                    </div>
                  )}
                  
                  {service.status !== "Completed" && service.status !== "Cancelled" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.status === "Pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateServiceStatus(service.id, "In Progress")}
                          variant="outline"
                        >
                          Start Repair
                        </Button>
                      )}
                      {service.status === "In Progress" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateServiceStatus(service.id, "Completed")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Complete
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateServiceStatus(service.id, "Cancelled")}
                        className="text-red-500 hover:text-red-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No services found. Add a new service to get started.</p>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ServicesPage;
