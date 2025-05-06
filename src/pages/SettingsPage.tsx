
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  DollarSign,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Bell,
  BellOff,
  RefreshCw,
  Save,
  Shield,
  Laptop,
  PanelLeft,
  Languages,
  Palette,
  Database,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("appearance");
  const { settings, updateSetting, hasChanges, saveSettings, resetSettings, toggleTheme, toggleMoneyVisibility, toggleSoundEnabled } = useSettings();
  const { playSound } = useNotificationSound();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Test notification sound
  const handleTestSound = () => {
    if (settings.soundEnabled) {
      playSound('notification');
      toast({
        title: "Sound Test",
        description: "Notification sound played successfully!",
      });
    } else {
      toast({
        title: "Sound Disabled",
        description: "Enable sounds in settings to hear notification sounds.",
        variant: "destructive",
      });
    }
  };

  // Save settings handler
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings handler
  const handleResetSettings = async () => {
    setIsResetting(true);
    try {
      await resetSettings();
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="settings-container pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and account settings</p>
        </div>
        <div className="flex gap-2 items-center">
          {hasChanges && (
            <span className="animate-pulse text-sm text-brand-500 dark:text-brand-400">
              Unsaved changes
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetSettings}
            disabled={isResetting || isSaving}
            className="btn-hover-effect"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
            Reset
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveSettings}
            disabled={!hasChanges || isResetting || isSaving}
            className={`bg-brand-600 hover:bg-brand-700 btn-hover-effect ${hasChanges ? "pulse-glow" : ""}`}
          >
            <Save className={`mr-2 h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-brand-50 data-[state=active]:text-brand-900 dark:data-[state=active]:bg-brand-900/20 dark:data-[state=active]:text-brand-300 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-brand-50 data-[state=active]:text-brand-900 dark:data-[state=active]:bg-brand-900/20 dark:data-[state=active]:text-brand-300 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-brand-50 data-[state=active]:text-brand-900 dark:data-[state=active]:bg-brand-900/20 dark:data-[state=active]:text-brand-300 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Privacy
            </TabsTrigger>
            <TabsTrigger value="company" className="data-[state=active]:bg-brand-50 data-[state=active]:text-brand-900 dark:data-[state=active]:bg-brand-900/20 dark:data-[state=active]:text-brand-300 flex items-center gap-2">
              <Database className="h-4 w-4" /> Company
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 animate-fade-in">
            <Card className="pro-card">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2 mr-3">
                    <Palette className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <CardTitle>Theme & Display</CardTitle>
                    <CardDescription>Customize the look and feel of your application</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      {settings.theme === "dark" ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                      Theme Mode
                    </Label>
                    <p className="settings-description">Choose between light and dark theme</p>
                  </div>
                  <div className="settings-control">
                    <div className="bg-muted rounded-full p-1 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-3 ${settings.theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-muted-foreground'}`}
                        onClick={() => updateSetting('theme', 'light')}
                      >
                        <Sun className="h-4 w-4 mr-2" /> Light
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-3 ${settings.theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-muted-foreground'}`}
                        onClick={() => updateSetting('theme', 'dark')}
                      >
                        <Moon className="h-4 w-4 mr-2" /> Dark
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      Font Size
                    </Label>
                    <p className="settings-description">Adjust the text size across the application</p>
                  </div>
                  <div className="settings-control">
                    <RadioGroup
                      value={settings.fontSize}
                      onValueChange={(value) => updateSetting('fontSize', value as "small" | "medium" | "large")}
                      className="flex gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small" className="text-sm">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="text-base">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large" className="text-lg">Large</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      <PanelLeft className="h-4 w-4" />
                      Animations
                    </Label>
                    <p className="settings-description">Toggle UI animations and transitions</p>
                  </div>
                  <div className="settings-control">
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(value) => updateSetting('animationsEnabled', value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="settings-footer">
                <p>
                  Theme settings are stored locally and applied immediately.
                </p>
              </CardFooter>
            </Card>

            <Card className="pro-card">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2 mr-3">
                    <Globe className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Set your preferred language and regional formats</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Language
                    </Label>
                    <p className="settings-description">Select your preferred language</p>
                  </div>
                  <div className="settings-control">
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      className="rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      <option value="en">English</option>
                      <option value="ur">Urdu</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Currency
                    </Label>
                    <p className="settings-description">Choose your preferred currency format</p>
                  </div>
                  <div className="settings-control">
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="rounded-md border border-input bg-transparent px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      <option value="PKR">Pakistani Rupee (PKR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 animate-fade-in">
            <Card className="pro-card">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-full p-2 mr-3">
                    <Bell className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how you receive notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      {settings.desktopNotifications ? <Bell className="h-4 w-4 text-green-500" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
                      Desktop Notifications
                    </Label>
                    <p className="settings-description">Receive notifications on your desktop</p>
                  </div>
                  <div className="settings-control">
                    <Switch
                      checked={settings.desktopNotifications}
                      onCheckedChange={(value) => updateSetting('desktopNotifications', value)}
                    />
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 className="h-4 w-4 text-green-500" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                      Sound Effects
                    </Label>
                    <p className="settings-description">Play sounds for notifications and actions</p>
                  </div>
                  <div className="settings-control flex items-center gap-4">
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={toggleSoundEnabled}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleTestSound}
                      disabled={!settings.soundEnabled}
                    >
                      Test
                    </Button>
                  </div>
                </div>

                {settings.soundEnabled && (
                  <div className="settings-row">
                    <div className="settings-label-group">
                      <Label className="settings-label">Volume</Label>
                      <p className="settings-description">Adjust notification volume</p>
                    </div>
                    <div className="settings-control w-full max-w-[200px]">
                      <Slider
                        value={[settings.volume]}
                        max={100}
                        step={1}
                        className="[&>span]:bg-brand-600"
                        onValueChange={(value) => updateSetting('volume', value[0])}
                      />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>{settings.volume}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="settings-footer">
                <p>
                  {settings.soundEnabled 
                    ? "Sound notifications are enabled. You'll hear audio cues for important events." 
                    : "Sound notifications are currently disabled."}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 animate-fade-in">
            <Card className="pro-card">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2 mr-3">
                    <Shield className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Control your data and security preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      {settings.isMoneyHidden ? <EyeOff className="h-4 w-4 text-brand-600" /> : <Eye className="h-4 w-4 text-green-500" />}
                      Hide Financial Details
                    </Label>
                    <p className="settings-description">Hide sensitive financial information</p>
                  </div>
                  <div className="settings-control">
                    <Switch
                      checked={settings.isMoneyHidden}
                      onCheckedChange={toggleMoneyVisibility}
                    />
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label flex items-center gap-2">
                      {settings.autoLock ? <Lock className="h-4 w-4 text-amber-500" /> : <Unlock className="h-4 w-4 text-muted-foreground" />}
                      Auto Lock
                    </Label>
                    <p className="settings-description">Automatically lock the application after inactivity</p>
                  </div>
                  <div className="settings-control">
                    <Switch
                      checked={settings.autoLock}
                      onCheckedChange={(value) => updateSetting('autoLock', value)}
                    />
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-label-group">
                    <Label className="settings-label">Data Collection</Label>
                    <p className="settings-description">Allow anonymous usage data collection for improvements</p>
                  </div>
                  <div className="settings-control">
                    <Switch
                      checked={settings.dataCollection}
                      onCheckedChange={(value) => updateSetting('dataCollection', value)}
                    />
                  </div>
                </div>

                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <AlertTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                    <Shield className="h-4 w-4" /> Privacy Notice
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    Your data is stored locally and not shared with any third parties. We only collect anonymous usage data if enabled.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6 animate-fade-in">
            <Card className="pro-card">
              <CardHeader>
                <div className="flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-2 mr-3">
                    <Database className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Manage your company details and branding</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName || ''}
                      onChange={(e) => updateSetting('companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyLogo">Logo URL</Label>
                    <Input
                      id="companyLogo"
                      value={settings.companyLogo || ''}
                      onChange={(e) => updateSetting('companyLogo', e.target.value)}
                      placeholder="Enter logo URL or upload"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.companyAddress || ''}
                    onChange={(e) => updateSetting('companyAddress', e.target.value)}
                    placeholder="Enter company address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail || ''}
                      onChange={(e) => updateSetting('companyEmail', e.target.value)}
                      placeholder="Enter company email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={settings.companyPhone || ''}
                      onChange={(e) => updateSetting('companyPhone', e.target.value)}
                      placeholder="Enter company phone"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={settings.lowStockThreshold.toString()}
                      onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <p className="text-sm text-muted-foreground">Items below this quantity will be marked as low stock</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="settings-footer">
                <p>
                  This information will be used on receipts, invoices, and across the application.
                </p>
              </CardFooter>
            </Card>

            {settings.lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(settings.lastUpdated).toLocaleString()}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
