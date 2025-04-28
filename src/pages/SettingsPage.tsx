
import React from "react";
import { Moon, Sun, Type } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { theme, toggleTheme, fontSize, setFontSize, isMoneyHidden, toggleMoneyVisibility } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
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
          </CardContent>
        </Card>
        
        <Card>
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
      </div>
    </div>
  );
};

export default SettingsPage;
