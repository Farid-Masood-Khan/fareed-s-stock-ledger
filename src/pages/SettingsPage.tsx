
import React from "react";
import { Moon, Sun, Type, Volume2, VolumeX, Zap, ZapOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { useToast } from "@/hooks/use-toast";

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
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
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
        
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={cardVariants}
        >
          <Card className="overflow-hidden border-l-4 border-l-brand-500 shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Control how your information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
