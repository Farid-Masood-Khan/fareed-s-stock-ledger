
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Laptop, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Tool as WrenchIcon,
  Calendar,
  Filter,
  ShieldCheck,
  MonitorSmartphone,
  Headphones,
  Save,
  User,
  Phone,
  FileText,
  Edit,
  Trash,
  FileCheck,
  PieChart,
  MoreVertical,
  BarChart3,
  SlidersHorizontal
} from "lucide-react";
import { useNotificationSound } from "@/hooks/use-notification-sound";

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
  priority?: "Low" | "Medium" | "High";
  technicianNotes?: string;
  customerEmail?: string;
  warrantyPeriod?: number; // in days
}

const ServicesPage = () => {
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  
  // Initial service data
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
      notes: "Needs power supply replacement",
      priority: "High"
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
      notes: "Possibly RAM issue",
      priority: "Medium"
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
      notes: "Screen replaced, working perfectly",
      priority: "Medium"
    }
  ]);
  
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("dateReceived");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedService, setSelectedService] = useState<RepairService | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  
  // New service form state
  const [newService, setNewService] = useState<Omit<RepairService, "id" | "dateReceived">>({
    customerName: "",
    contact: "",
    deviceType: "Laptop",
    deviceDetails: "",
    issueDescription: "",
    status: "Pending",
    estimatedCost: 0,
    priority: "Medium",
    customerEmail: "",
    technicianNotes: "",
    warrantyPeriod: 30
  });
  
  // For editing existing service
  const [editingService, setEditingService] = useState<RepairService | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    highPriority: 0,
    averageCompletionTime: 0
  });

  // Update stats whenever services change
  useEffect(() => {
    const pending = services.filter(s => s.status === "Pending").length;
    const inProgress = services.filter(s => s.status === "In Progress").length;
    const completed = services.filter(s => s.status === "Completed").length;
    const cancelled = services.filter(s => s.status === "Cancelled").length;
    const highPriority = services.filter(s => s.priority === "High").length;
    
    // Calculate average completion time for completed services
    let totalCompletionTime = 0;
    let completedWithDates = 0;
    
    services.forEach(service => {
      if (service.status === "Completed" && service.dateCompleted) {
        const completionTime = service.dateCompleted.getTime() - service.dateReceived.getTime();
        totalCompletionTime += completionTime;
        completedWithDates++;
      }
    });
    
    const avgCompletionTime = completedWithDates > 0 
      ? Math.round(totalCompletionTime / completedWithDates / (1000 * 60 * 60 * 24)) // in days
      : 0;
    
    setStats({
      total: services.length,
      pending,
      inProgress,
      completed,
      cancelled,
      highPriority,
      averageCompletionTime: avgCompletionTime
    });
  }, [services]);
  
  const handleInputChange = (field: string, value: string | number | Date) => {
    setNewService({
      ...newService,
      [field]: value
    });
  };
  
  const handleEditInputChange = (field: string, value: string | number | Date) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        [field]: value
      });
    }
  };
  
  const handleAddService = () => {
    if (!newService.customerName || !newService.contact || !newService.deviceDetails || !newService.issueDescription) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      playSound("error");
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
      description: `Service ticket created for ${newService.customerName}`
    });
    playSound("success");

    // Reset form
    setNewService({
      customerName: "",
      contact: "",
      deviceType: "Laptop",
      deviceDetails: "",
      issueDescription: "",
      status: "Pending",
      estimatedCost: 0,
      priority: "Medium",
      customerEmail: "",
      technicianNotes: "",
      warrantyPeriod: 30
    });
  };
  
  const handleEditService = () => {
    if (!editingService) return;
    
    setServices(services.map(service => 
      service.id === editingService.id ? editingService : service
    ));
    
    setIsEditDialogOpen(false);
    setEditingService(null);
    
    toast({
      title: "Service Updated",
      description: "Service details have been updated successfully"
    });
    playSound("success");
  };
  
  const handleDeleteService = () => {
    if (!selectedService) return;
    
    setServices(services.filter(service => service.id !== selectedService.id));
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
    
    toast({
      title: "Service Deleted",
      description: "Service has been permanently deleted"
    });
    playSound("alert");
  };

  // Status update with animation and notification
  const updateServiceStatus = (id: string, newStatus: RepairService["status"]) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const updatedService = {
          ...service,
          status: newStatus
        };
        
        if (newStatus === "Completed" && !service.dateCompleted) {
          updatedService.dateCompleted = new Date();
          // Set final cost equal to estimated cost if not already set
          if (!updatedService.finalCost) {
            updatedService.finalCost = service.estimatedCost;
          }
        }
        
        return updatedService;
      }
      return service;
    }));
    
    toast({
      title: "Status Updated",
      description: `Service status changed to ${newStatus}`
    });
    
    playSound(newStatus === "Completed" ? "success" : "notification");
  };
  
  // Filter, sort, and categorize services
  const getFilteredAndSortedServices = () => {
    let result = [...services];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.customerName.toLowerCase().includes(query) || 
        service.deviceDetails.toLowerCase().includes(query) || 
        service.issueDescription.toLowerCase().includes(query) || 
        service.contact.includes(query)
      );
    }
    
    // Apply status filter
    if (filterStatus && filterStatus !== "all") {
      result = result.filter(service => service.status === filterStatus);
    }
    
    // Apply priority filter
    if (filterPriority && filterPriority !== "all") {
      result = result.filter(service => service.priority === filterPriority);
    }
    
    // Apply tab filter
    if (activeTab === "pending") {
      result = result.filter(service => service.status === "Pending");
    } else if (activeTab === "in-progress") {
      result = result.filter(service => service.status === "In Progress");
    } else if (activeTab === "completed") {
      result = result.filter(service => service.status === "Completed");
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dateReceived") {
        return sortOrder === "asc" 
          ? a.dateReceived.getTime() - b.dateReceived.getTime()
          : b.dateReceived.getTime() - a.dateReceived.getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        const priorityA = priorityOrder[a.priority || "Low"] || 0;
        const priorityB = priorityOrder[b.priority || "Low"] || 0;
        return sortOrder === "asc" 
          ? priorityA - priorityB
          : priorityB - priorityA;
      } else if (sortBy === "customerName") {
        return sortOrder === "asc"
          ? a.customerName.localeCompare(b.customerName)
          : b.customerName.localeCompare(a.customerName);
      } else if (sortBy === "estimatedCost") {
        return sortOrder === "asc"
          ? a.estimatedCost - b.estimatedCost
          : b.estimatedCost - a.estimatedCost;
      }
      return 0;
    });
    
    return result;
  };
  
  const filteredServices = getFilteredAndSortedServices();
  
  const getStatusColor = (status: RepairService["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "";
    }
  };
  
  const getPriorityColor = (priority?: RepairService["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const getStatusIcon = (status: RepairService["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "In Progress":
        return <WrenchIcon className="h-4 w-4 mr-1" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  // Calculate the time passed since date received
  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6 my-[28px] pb-12"
    >
      <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Computer Repair Services</h1>
          <p className="text-muted-foreground">Track and manage repair services with automated notifications</p>
        </div>
        <Button 
          onClick={() => setIsAddFormOpen(!isAddFormOpen)} 
          className="bg-brand-600 hover:bg-brand-700 btn-hover-effect"
        >
          <Plus className="h-4 w-4 mr-2" /> New Repair Ticket
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Repairs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-brand-100 dark:bg-brand-900/40 p-2 rounded-full">
                  <WrenchIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">{stats.highPriority}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Add Service Form */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="pro-card border-t-4 border-t-brand-500 overflow-hidden">
              <CardHeader className="bg-brand-50/50 dark:bg-brand-900/10">
                <div className="flex items-center">
                  <span className="bg-brand-100 dark:bg-brand-900/40 p-2 rounded-full mr-3">
                    <Laptop className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Create New Repair Ticket</CardTitle>
                    <CardDescription>Enter customer and device details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-500" /> Customer Name *
                    </Label>
                    <Input 
                      id="customerName" 
                      value={newService.customerName} 
                      onChange={e => handleInputChange("customerName", e.target.value)} 
                      placeholder="Enter customer name" 
                      className="focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand-500" /> Contact Number *
                    </Label>
                    <Input 
                      id="contact" 
                      value={newService.contact} 
                      onChange={e => handleInputChange("contact", e.target.value)} 
                      placeholder="Enter contact number" 
                      className="focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-brand-500" /> Email (Optional)
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newService.customerEmail || ""} 
                      onChange={e => handleInputChange("customerEmail", e.target.value)} 
                      placeholder="Enter email address" 
                      className="focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceType" className="flex items-center gap-2">
                      <MonitorSmartphone className="h-4 w-4 text-brand-500" /> Device Type
                    </Label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-brand-500" /> Priority
                    </Label>
                    <Select 
                      value={newService.priority} 
                      onValueChange={(value: "Low" | "Medium" | "High") => handleInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost" className="flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-brand-500" /> Estimated Cost (Rs.)
                    </Label>
                    <Input 
                      id="estimatedCost" 
                      type="number" 
                      value={newService.estimatedCost.toString()} 
                      onChange={e => handleInputChange("estimatedCost", Number(e.target.value))} 
                      placeholder="Enter estimated cost" 
                      className="focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceDetails" className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-brand-500" /> Device Details *
                  </Label>
                  <Input 
                    id="deviceDetails" 
                    value={newService.deviceDetails} 
                    onChange={e => handleInputChange("deviceDetails", e.target.value)} 
                    placeholder="Brand, model, specs, etc." 
                    className="focus:ring-brand-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issueDescription" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-500" /> Issue Description *
                  </Label>
                  <Textarea 
                    id="issueDescription" 
                    value={newService.issueDescription} 
                    onChange={e => handleInputChange("issueDescription", e.target.value)} 
                    placeholder="Describe the problem in detail" 
                    className="min-h-[100px] focus:ring-brand-500" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technicianNotes" className="flex items-center gap-2">
                      <WrenchIcon className="h-4 w-4 text-brand-500" /> Technician Notes
                    </Label>
                    <Textarea 
                      id="technicianNotes" 
                      value={newService.technicianNotes || ""} 
                      onChange={e => handleInputChange("technicianNotes", e.target.value)} 
                      placeholder="Internal notes about the repair" 
                      className="min-h-[80px] focus:ring-brand-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-500" /> Customer Notes
                    </Label>
                    <Textarea 
                      id="notes" 
                      value={newService.notes || ""} 
                      onChange={e => handleInputChange("notes", e.target.value)} 
                      placeholder="Additional information from customer" 
                      className="min-h-[80px] focus:ring-brand-500" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-500" /> Warranty Period (Days)
                  </Label>
                  <Input 
                    id="warrantyPeriod" 
                    type="number" 
                    value={newService.warrantyPeriod?.toString() || "30"} 
                    onChange={e => handleInputChange("warrantyPeriod", Number(e.target.value))} 
                    className="w-40 focus:ring-brand-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-brand-50/50 dark:bg-brand-900/10">
                <Button variant="outline" onClick={() => setIsAddFormOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddService}
                  className="bg-brand-600 hover:bg-brand-700 btn-hover-effect"
                >
                  <Save className="h-4 w-4 mr-2" /> Create Ticket
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-brand-100 dark:data-[state=active]:bg-brand-900/40 data-[state=active]:text-brand-900 dark:data-[state=active]:text-brand-300">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/40 data-[state=active]:text-amber-900 dark:data-[state=active]:text-amber-300">
              Pending
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-900 dark:data-[state=active]:text-blue-300">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/40 data-[state=active]:text-green-900 dark:data-[state=active]:text-green-300">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by name, device, or issue..." 
              className="pl-9" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          
          <div className="md:col-span-3">
            <Select value={filterPriority || "all"} onValueChange={value => setFilterPriority(value === "all" ? undefined : value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <SelectValue placeholder="Filter by priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateReceived">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="customerName">Customer</SelectItem>
                <SelectItem value="estimatedCost">Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Service Cards */}
      <motion.div className="grid gap-4" variants={containerVariants}>
        <AnimatePresence>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <motion.div 
                key={service.id} 
                variants={itemVariants}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="hover-lift"
                whileHover={{ scale: 1.01 }}
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-800 border-l-4 transition-all duration-300" 
                      style={{ 
                        borderLeftColor: service.priority === "High" 
                          ? "rgb(239, 68, 68)" 
                          : service.priority === "Medium" 
                            ? "rgb(245, 158, 11)" 
                            : "rgb(34, 197, 94)" 
                      }}>
                  <CardHeader className="pb-3 flex flex-row justify-between items-start">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="bg-brand-100 dark:bg-brand-900/40 p-1.5 rounded-full">
                          <Laptop className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <CardTitle className="text-lg">{service.customerName}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" /> {service.contact} 
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 text-muted-foreground" /> {getTimeSince(service.dateReceived)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Badge className={`flex items-center ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        {service.status}
                      </Badge>
                      {service.priority && (
                        <Badge className={`flex items-center ${getPriorityColor(service.priority)}`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {service.priority}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          <MonitorSmartphone className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" /> Device
                        </p>
                        <p className="text-sm text-muted-foreground">{service.deviceType}: {service.deviceDetails}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          <PieChart className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" /> Cost
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {service.finalCost ? `Rs. ${service.finalCost} (Final)` : `Rs. ${service.estimatedCost} (Est.)`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" /> Issue
                      </p>
                      <p className="text-sm text-muted-foreground">{service.issueDescription}</p>
                    </div>
                    
                    {service.notes && (
                      <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" /> Notes
                        </p>
                        <p className="text-sm text-muted-foreground">{service.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap justify-between mt-4">
                      <div className="flex flex-wrap gap-2">
                        {service.status !== "Completed" && service.status !== "Cancelled" && (
                          <>
                            {service.status === "Pending" && (
                              <Button 
                                size="sm" 
                                onClick={() => updateServiceStatus(service.id, "In Progress")} 
                                variant="outline"
                                className="transition-all"
                              >
                                <WrenchIcon className="h-3.5 w-3.5 mr-1.5" />
                                Start Repair
                              </Button>
                            )}
                            {service.status === "In Progress" && (
                              <Button 
                                size="sm" 
                                onClick={() => updateServiceStatus(service.id, "Completed")} 
                                className="bg-green-600 hover:bg-green-700 transition-all"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Mark as Complete
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateServiceStatus(service.id, "Cancelled")} 
                              className="text-red-500 hover:text-red-600 transition-all"
                            >
                              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedService(service);
                            setIsServiceDetailOpen(true);
                          }}
                        >
                          Details
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingService({...service});
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedService(service);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-brand-100 dark:bg-brand-900/40 p-4 rounded-full">
                    <Search className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters, or add a new service</p>
                  <Button 
                    onClick={() => {
                      setIsAddFormOpen(true);
                      setSearchQuery("");
                      setFilterStatus(undefined);
                      setFilterPriority(undefined);
                      setActiveTab("all");
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Service
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-brand-600" /> Edit Service Details
            </DialogTitle>
            <DialogDescription>
              Update the service details and save your changes
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customerName">Customer Name *</Label>
                  <Input
                    id="edit-customerName"
                    value={editingService.customerName}
                    onChange={e => handleEditInputChange("customerName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number *</Label>
                  <Input
                    id="edit-contact"
                    value={editingService.contact}
                    onChange={e => handleEditInputChange("contact", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-deviceType">Device Type</Label>
                  <Select
                    value={editingService.deviceType}
                    onValueChange={(value: "Laptop" | "Desktop" | "Other") => 
                      handleEditInputChange("deviceType", value)
                    }
                  >
                    <SelectTrigger id="edit-deviceType">
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
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingService.status}
                    onValueChange={(value: RepairService["status"]) => 
                      handleEditInputChange("status", value)
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingService.priority || "Medium"}
                    onValueChange={(value: "Low" | "Medium" | "High") => 
                      handleEditInputChange("priority", value)
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-estimatedCost">Estimated Cost (Rs.)</Label>
                  <Input
                    id="edit-estimatedCost"
                    type="number"
                    value={editingService.estimatedCost}
                    onChange={e => handleEditInputChange("estimatedCost", Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-deviceDetails">Device Details *</Label>
                <Input
                  id="edit-deviceDetails"
                  value={editingService.deviceDetails}
                  onChange={e => handleEditInputChange("deviceDetails", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-issueDescription">Issue Description *</Label>
                <Textarea
                  id="edit-issueDescription"
                  value={editingService.issueDescription}
                  onChange={e => handleEditInputChange("issueDescription", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingService.notes || ""}
                  onChange={e => handleEditInputChange("notes", e.target.value)}
                />
              </div>
              
              {editingService.status === "Completed" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-finalCost">Final Cost (Rs.)</Label>
                  <Input
                    id="edit-finalCost"
                    type="number"
                    value={editingService.finalCost || editingService.estimatedCost}
                    onChange={e => handleEditInputChange("finalCost", Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService} className="bg-brand-600 hover:bg-brand-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4">
                <p className="font-medium">{selectedService.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedService.deviceType}: {selectedService.deviceDetails}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteService}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Service Detail Dialog */}
      <Dialog open={isServiceDetailOpen} onOpenChange={setIsServiceDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-brand-600" /> Service Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this repair service
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="py-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedService.customerName}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {selectedService.contact}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`flex items-center ${getStatusColor(selectedService.status)}`}>
                    {getStatusIcon(selectedService.status)}
                    {selectedService.status}
                  </Badge>
                  {selectedService.priority && (
                    <Badge className={`flex items-center ${getPriorityColor(selectedService.priority)}`}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {selectedService.priority} Priority
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Device Information</h4>
                    <p className="font-medium">{selectedService.deviceType}: {selectedService.deviceDetails}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Issue Description</h4>
                    <p>{selectedService.issueDescription}</p>
                  </div>
                  
                  {selectedService.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Notes</h4>
                      <p>{selectedService.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Service Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-brand-100 dark:bg-brand-900/40 p-1.5 rounded-full mt-0.5">
                          <Calendar className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <p className="font-medium">Received</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedService.dateReceived.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {selectedService.dateCompleted && (
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-full mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Completed</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedService.dateCompleted.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Cost Details</h4>
                    <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span>Estimated Cost:</span>
                        <span>Rs. {selectedService.estimatedCost}</span>
                      </div>
                      
                      {selectedService.status === "Completed" && (
                        <div className="flex justify-between font-medium">
                          <span>Final Cost:</span>
                          <span>Rs. {selectedService.finalCost || selectedService.estimatedCost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedService.status === "Completed" && selectedService.warrantyPeriod && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Warranty Information</h4>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>
                            {selectedService.warrantyPeriod} days warranty
                            {selectedService.dateCompleted && (
                              <span className="block text-sm text-muted-foreground">
                                Valid until: {new Date(selectedService.dateCompleted.getTime() + (selectedService.warrantyPeriod * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsServiceDetailOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsServiceDetailOpen(false);
                    setEditingService({...selectedService});
                    setIsEditDialogOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServicesPage;
