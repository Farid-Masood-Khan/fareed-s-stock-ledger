
import React, { useState, useEffect } from "react";
import { 
  Moon, Sun, Type, Volume2, VolumeX, Zap, ZapOff, Save, Share2, 
  Palette, RotateCcw, Lock, Database, Bell, ShieldCheck, User, Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  const {
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    isMoneyHidden,
    toggleMoneyVisibility,
    soundEnabled,
    toggleSoundEnabled,
    animationsEnabled,
    toggleAnimationsEnabled
  } = useSettings();
  
  const { playSound } = useNotificationSound();
  const { toast } = useToast();
  
  // State for volume slider
  const [volume, setVolume] = useState<number[]>([70]);
  // State for tracking if settings were changed
  const [settingsChanged, setSettingsChanged] = useState(false);
  // State for desktop notifications
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  // State for autolock feature
  const [autoLock, setAutoLock] = useState(true);
  // State for data collection consent
  const [dataCollection, setDataCollection] = useState(true);

  // Effect to track settings changes
  useEffect(() => {
    setSettingsChanged(true);
  }, [theme, fontSize, isMoneyHidden, soundEnabled, animationsEnabled, volume, desktopNotifications, autoLock, dataCollection]);

  const handleSoundToggle = () => {
    toggleSoundEnabled();
    if (!soundEnabled) {
      // Play a sound immediately when enabling sounds
      setTimeout(() => playSound('success'), 100);
      toast({
        title: "Sound notifications enabled",
        description: "You will now hear audio notifications for important events."
      });
    } else {
      toast({
        title: "Sound notifications disabled",
        description: "Audio notifications have been turned off."
      });
    }
  };

  // Handler for volume change
  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue);
    setSettingsChanged(true);
  };

  // Mock functions for saving settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully."
    });
    playSound('success');
    setSettingsChanged(false);
  };

  const handleResetSettings = () => {
    // Confirm reset with user
    if (confirm("Are you sure you want to reset all settings to their default values?")) {
      toast({
        title: "Settings reset",
        description: "All settings have been reset to their default values.",
        variant: "destructive"
      });
      playSound('alert');
      setSettingsChanged(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="space-y-6 my-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your application experience</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetSettings} 
            className="flex items-center gap-2"
            disabled={!settingsChanged}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveSettings} 
            className={`flex items-center gap-2 ${settingsChanged ? 'bg-brand-600 hover:bg-brand-700' : 'bg-muted text-muted-foreground'}`}
            disabled={!settingsChanged}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto flex flex-wrap justify-start">
          <TabsTrigger value="appearance" className="flex items-center gap-1.5">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1.5">
            <Database className="h-4 w-4" /> Advanced
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-brand-500" />
                  Theme & Display
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose between light and dark mode
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleTheme} 
                    className={`transition-all h-10 w-10 ${theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-blue-50 text-blue-900"}`}
                  >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Font Size</Label>
                    <div className="text-sm text-muted-foreground mb-4">
                      Change the size of text throughout the application
                    </div>
                  </div>
                  <RadioGroup 
                    value={fontSize} 
                    onValueChange={value => setFontSize(value as "small" | "medium" | "large")} 
                    className="flex flex-wrap gap-4"
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

                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable UI animations
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={animationsEnabled} 
                      onCheckedChange={toggleAnimationsEnabled} 
                      id="animations-toggle" 
                    />
                    <Label htmlFor="animations-toggle" className="flex items-center gap-2 cursor-pointer">
                      {animationsEnabled ? (
                        <Zap className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <ZapOff className="h-5 w-5" />
                      )}
                      <span>{animationsEnabled ? "Enabled" : "Disabled"}</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand-500" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Play sound when important events occur
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={soundEnabled} 
                      onCheckedChange={handleSoundToggle} 
                      id="sound-toggle" 
                    />
                    <Label htmlFor="sound-toggle" className="flex items-center gap-2 cursor-pointer">
                      {soundEnabled ? (
                        <Volume2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                      <span>{soundEnabled ? "Enabled" : "Disabled"}</span>
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <Label className="text-base">Sound Volume</Label>
                    <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                  </div>
                  <div className="px-1">
                    <Slider 
                      value={volume} 
                      onValueChange={handleVolumeChange} 
                      max={100} 
                      step={5} 
                      className={soundEnabled ? "" : "opacity-50"} 
                      disabled={!soundEnabled} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Desktop Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Display notifications when the app is in background
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="desktop-notifications" 
                      checked={desktopNotifications}
                      onCheckedChange={setDesktopNotifications}
                    />
                    <Label htmlFor="desktop-notifications" className="cursor-pointer">
                      {desktopNotifications ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-brand-500" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control how your information is displayed and protected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Financial Details</Label>
                    <div className="text-sm text-muted-foreground">
                      Hide monetary values on the dashboard and reports
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={isMoneyHidden} 
                      onCheckedChange={toggleMoneyVisibility}
                      id="money-toggle"
                    />
                    <Label htmlFor="money-toggle" className="cursor-pointer">
                      {isMoneyHidden ? "Hidden" : "Visible"}
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-lock Application</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically lock the app after 15 minutes of inactivity
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={autoLock}
                      onCheckedChange={setAutoLock}
                      id="autolock-toggle"
                    />
                    <Label htmlFor="autolock-toggle" className="cursor-pointer">
                      {autoLock ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Collection</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the app
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={dataCollection}
                      onCheckedChange={setDataCollection}
                      id="data-collection-toggle"
                    />
                    <Label htmlFor="data-collection-toggle" className="cursor-pointer">
                      {dataCollection ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3">
                <p className="text-xs text-muted-foreground">
                  Your data is stored locally and never shared with third parties without explicit permission.
                  <br />We use industry-standard encryption to protect all sensitive information.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-500" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Additional options for advanced users and data management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Export</Label>
                    <div className="text-sm text-muted-foreground">
                      Export all inventory and sales data as CSV
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Clear Cache</Label>
                    <div className="text-sm text-muted-foreground">
                      Clear locally stored cache data to free up space
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      Clear Cache
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base danger text-destructive">Reset All Data</Label>
                    <div className="text-sm text-muted-foreground">
                      Warning: This will reset all data and cannot be undone
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (confirm("Are you absolutely sure? This action cannot be undone.")) {
                          toast({
                            title: "Data Reset Initiated",
                            description: "All data is being reset. This may take a moment.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Reset Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-500" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    defaultValue="Subhan Computer" 
                    onChange={() => setSettingsChanged(true)}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue="info@subhancomputer.com" 
                    onChange={() => setSettingsChanged(true)}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="currency">Default Currency</Label>
                  <div className="relative">
                    <select 
                      id="currency" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      defaultValue="PKR"
                      onChange={() => setSettingsChanged(true)}
                    >
                      <option value="PKR">Pakistani Rupee (PKR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="language">Language</Label>
                  <div className="relative">
                    <select 
                      id="language" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      defaultValue="en"
                      onChange={() => setSettingsChanged(true)}
                    >
                      <option value="en">English</option>
                      <option value="ur">Urdu</option>
                      <option value="ar">Arabic</option>
                    </select>
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Your account is secure
                </div>
                <Button variant="link" size="sm" className="text-xs">
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
