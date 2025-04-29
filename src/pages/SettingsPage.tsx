
import React from "react";
import { Moon, Sun, Type, Volume2, VolumeX, Zap, ZapOff, Save, Share2, Palette, RotateCcw } from "lucide-react";
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

  const handleSoundToggle = () => {
    toggleSoundEnabled();
    if (!soundEnabled) {
      // Play a sound immediately when enabling sounds
      setTimeout(() => playSound('success'), 100);
      toast({
        title: "Sound notifications enabled",
        description: "You will now hear audio notifications for important events.",
      });
    } else {
      toast({
        title: "Sound notifications disabled",
        description: "Audio notifications have been turned off.",
      });
    }
  };

  // Mock functions for saving settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully.",
    });
    playSound('success');
  };

  const handleResetSettings = () => {
    toast({
      title: "Settings reset",
      description: "All settings have been reset to their default values.",
      variant: "destructive",
    });
    playSound('alert');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={cardVariants}
          >
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-brand-500" />
                  Theme & Display
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
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
                    className={`transition-all ${theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-blue-50 text-blue-900"}`}
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
                    onValueChange={(value) => setFontSize(value as "small" | "medium" | "large")}
                    className="flex space-x-4"
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
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable UI animations
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={animationsEnabled}
                      onCheckedChange={toggleAnimationsEnabled}
                      id="animations-toggle"
                    />
                    <Label htmlFor="animations-toggle" className="cursor-pointer">
                      {animationsEnabled ? <Zap className="h-5 w-5 text-yellow-500" /> : <ZapOff className="h-5 w-5" />}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={cardVariants}
          >
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-brand-500" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Play sound when important events occur
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={soundEnabled}
                      onCheckedChange={handleSoundToggle}
                      id="sound-toggle"
                    />
                    <Label htmlFor="sound-toggle" className="cursor-pointer">
                      {soundEnabled ? <Volume2 className="h-5 w-5 text-green-500" /> : <VolumeX className="h-5 w-5" />}
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-base">Sound Volume</Label>
                    <span className="text-sm text-muted-foreground">{soundEnabled ? "Active" : "Muted"}</span>
                  </div>
                  <Slider 
                    defaultValue={[70]} 
                    max={100}
                    step={10} 
                    className={soundEnabled ? "" : "opacity-50"}
                    disabled={!soundEnabled}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Desktop Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Display notifications when the app is in background
                    </div>
                  </div>
                  <div>
                    <Switch id="desktop-notifications" defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={cardVariants}
          >
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>
                  Control how your information is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Hide Financial Details</Label>
                    <div className="text-sm text-muted-foreground">
                      Hide monetary values on the dashboard
                    </div>
                  </div>
                  <Switch 
                    checked={isMoneyHidden}
                    onCheckedChange={toggleMoneyVisibility}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-lock Application</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically lock the app after 15 minutes of inactivity
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Collection</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the app
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3">
                <p className="text-xs text-muted-foreground">
                  Your data is stored locally and never shared with third parties without explicit permission.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={cardVariants}
          >
            <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Additional options for advanced users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Export</Label>
                    <div className="text-sm text-muted-foreground">
                      Export all inventory and sales data as CSV
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Export
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Clear Cache</Label>
                    <div className="text-sm text-muted-foreground">
                      Clear locally stored cache data
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    Clear
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base danger">Reset All Data</Label>
                    <div className="text-sm text-muted-foreground">
                      Warning: This will reset all data and cannot be undone
                    </div>
                  </div>
                  <Button variant="destructive" className="flex items-center gap-2">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
