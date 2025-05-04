
import React, { useState, useEffect } from "react";
import { 
  Moon, Sun, Type, Volume2, VolumeX, Zap, ZapOff, Save, Share2, 
  Palette, RotateCcw, Lock, Database, Bell, ShieldCheck, User, Globe, AlertTriangle
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useComponentLoading } from "@/hooks/use-loading-state";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
    hasChanges,
    isLoading: isSettingsLoading
  } = useSettings();
  
  const { playSound } = useNotificationSound();
  const { toast } = useToast();
  const { isLoading, withLoading } = useComponentLoading();
  
  // State for confirmation dialogs
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  // Handle save settings
  const handleSaveSettings = async () => {
    if (!hasChanges) return;
    
    withLoading(saveSettings())
      .catch(error => {
        console.error("Failed to save settings:", error);
        toast({
          title: "Error saving settings",
          description: "Your preferences could not be saved. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  // Handle reset settings
  const handleResetSettings = async () => {
    withLoading(resetSettings())
      .then(() => {
        setIsResetDialogOpen(false);
      })
      .catch(error => {
        console.error("Failed to reset settings:", error);
        toast({
          title: "Error resetting settings",
          description: "Your settings could not be reset. Please try again.",
          variant: "destructive"
        });
      });
  };

  const handleSoundToggle = () => {
    updateSetting("soundEnabled", !settings.soundEnabled);
    if (!settings.soundEnabled) {
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
    updateSetting("volume", newValue[0]);
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
            onClick={() => setIsResetDialogOpen(true)} 
            className="flex items-center gap-2"
            disabled={!hasChanges || isLoading}
          >
            <RotateCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveSettings} 
            className={cn(
              "flex items-center gap-2",
              hasChanges ? 'bg-brand-600 hover:bg-brand-700' : 'bg-muted text-muted-foreground'
            )}
            disabled={!hasChanges || isLoading}
            isLoading={isLoading}
            loadingText="Saving..."
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/30 rounded-lg p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <p className="text-sm text-brand-700 dark:text-brand-300">
              You have unsaved changes. Don't forget to save before leaving.
            </p>
          </div>
          <Button 
            size="sm" 
            variant="soft"
            onClick={handleSaveSettings}
            isLoading={isLoading}
          >
            Save now
          </Button>
        </motion.div>
      )}

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
                    onClick={() => updateSetting("theme", settings.theme === "light" ? "dark" : "light")} 
                    className={`transition-all h-10 w-10 ${settings.theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-blue-50 text-blue-900"}`}
                    aria-label={settings.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {settings.theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
                    value={settings.fontSize} 
                    onValueChange={(value) => updateSetting("fontSize", value as "small" | "medium" | "large")} 
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
                      checked={settings.animationsEnabled} 
                      onCheckedChange={(checked) => updateSetting("animationsEnabled", checked)} 
                      id="animations-toggle" 
                    />
                    <Label htmlFor="animations-toggle" className="flex items-center gap-2 cursor-pointer">
                      {settings.animationsEnabled ? (
                        <Zap className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <ZapOff className="h-5 w-5" />
                      )}
                      <span>{settings.animationsEnabled ? "Enabled" : "Disabled"}</span>
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
                      checked={settings.soundEnabled} 
                      onCheckedChange={handleSoundToggle} 
                      id="sound-toggle" 
                    />
                    <Label htmlFor="sound-toggle" className="flex items-center gap-2 cursor-pointer">
                      {settings.soundEnabled ? (
                        <Volume2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                      <span>{settings.soundEnabled ? "Enabled" : "Disabled"}</span>
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <Label className="text-base">Sound Volume</Label>
                    <span className="text-sm text-muted-foreground">{settings.volume}%</span>
                  </div>
                  <div className="px-1">
                    <Slider 
                      value={[settings.volume]} 
                      onValueChange={handleVolumeChange} 
                      max={100} 
                      step={5} 
                      className={settings.soundEnabled ? "" : "opacity-50"} 
                      disabled={!settings.soundEnabled} 
                      aria-label="Sound volume"
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
                      checked={settings.desktopNotifications}
                      onCheckedChange={(checked) => updateSetting("desktopNotifications", checked)}
                    />
                    <Label htmlFor="desktop-notifications" className="cursor-pointer">
                      {settings.desktopNotifications ? "Enabled" : "Disabled"}
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
                      checked={settings.isMoneyHidden} 
                      onCheckedChange={(checked) => updateSetting("isMoneyHidden", checked)}
                      id="money-toggle"
                    />
                    <Label htmlFor="money-toggle" className="cursor-pointer">
                      {settings.isMoneyHidden ? "Hidden" : "Visible"}
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
                      checked={settings.autoLock}
                      onCheckedChange={(checked) => updateSetting("autoLock", checked)}
                      id="autolock-toggle"
                    />
                    <Label htmlFor="autolock-toggle" className="cursor-pointer">
                      {settings.autoLock ? "Enabled" : "Disabled"}
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
                      checked={settings.dataCollection}
                      onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
                      id="data-collection-toggle"
                    />
                    <Label htmlFor="data-collection-toggle" className="cursor-pointer">
                      {settings.dataCollection ? "Enabled" : "Disabled"}
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
                  Configure database and system settings (for administrators)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="company-name">Company Name</Label>
                    <div className="text-sm text-muted-foreground">
                      Used in receipts, reports and other official documents
                    </div>
                  </div>
                  <div className="w-full sm:max-w-[250px]">
                    <Input 
                      id="company-name" 
                      value={settings.companyName || ''} 
                      onChange={(e) => updateSetting("companyName", e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive alerts when inventory falls below this level
                    </div>
                  </div>
                  <div className="w-full sm:max-w-[200px]">
                    <Input 
                      id="low-stock-threshold"
                      type="number"
                      min={1}
                      max={100}
                      value={settings.lowStockThreshold}
                      onChange={(e) => updateSetting("lowStockThreshold", parseInt(e.target.value) || 5)}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="currency">Currency</Label>
                    <div className="text-sm text-muted-foreground">
                      Default currency for transactions and reports
                    </div>
                  </div>
                  <div className="w-full sm:max-w-[200px]">
                    <select
                      id="currency"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                      value={settings.currency}
                      onChange={(e) => updateSetting("currency", e.target.value)}
                    >
                      <option value="PKR">PKR - Pakistani Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  These settings require administrator privileges.
                </p>
                <Button size="sm" variant="outline" className="gap-1">
                  <Database className="h-4 w-4" />
                  Connect Database
                </Button>
              </CardFooter>
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
                  Manage your account preferences and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="email">Email</Label>
                    <div className="text-sm text-muted-foreground">
                      Your email address is used for notifications and sign-in
                    </div>
                  </div>
                  <div className="w-full sm:max-w-[300px]">
                    <Input
                      id="email"
                      type="email"
                      value={settings.companyEmail || ''}
                      onChange={(e) => updateSetting("companyEmail", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-base" htmlFor="language">Language</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose your preferred language for the interface
                    </div>
                  </div>
                  <div className="w-full sm:max-w-[200px]">
                    <select
                      id="language"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                      value={settings.language}
                      onChange={(e) => updateSetting("language", e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                      <option value="ur">Urdu</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Account settings are synced across all your devices.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="subtle" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    Export Settings
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1">
                    Sign Out
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all settings</DialogTitle>
            <DialogDescription>
              This will reset all your settings to their default values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-md border border-muted">
            <p className="text-sm text-muted-foreground">
              The following settings will be reset:
            </p>
            <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
              <li>Theme preferences</li>
              <li>Font size and display settings</li>
              <li>Notification preferences</li>
              <li>Privacy and security settings</li>
              <li>Company information</li>
              <li>Language and regional settings</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleResetSettings}
              isLoading={isLoading}
            >
              Reset All Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
