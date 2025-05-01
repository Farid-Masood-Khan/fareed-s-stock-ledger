
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { Sale } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  generateReceiptMessage, 
  getWhatsAppShareUrl, 
  isMobileDevice,
  receiptToCanvas 
} from '@/utils/receipt-utils';

interface WhatsAppDialogProps {
  receiptRef: React.RefObject<HTMLDivElement>;
  sale: Sale;
}

const WhatsAppDialog: React.FC<WhatsAppDialogProps> = ({ receiptRef, sale }) => {
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      playSound('error');
      return;
    }

    try {
      // Generate message
      const message = generateReceiptMessage(sale);
      
      // Check if mobile device
      const mobile = isMobileDevice();
      
      // Get appropriate WhatsApp URL
      const url = getWhatsAppShareUrl(phoneNumber, message, mobile);
      
      // Open WhatsApp
      window.open(url, '_blank');
      
      toast({
        title: mobile ? "WhatsApp Opening" : "WhatsApp Web",
        description: mobile 
          ? "Redirecting to WhatsApp with your message" 
          : "Opening WhatsApp Web with your message. You'll need to send the receipt separately.",
      });
      
      playSound('success');
      setOpen(false);
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Could not share via WhatsApp",
        variant: "destructive",
      });
      playSound('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white hover:text-white border-green-600"
        >
          <MessageSquare className="h-4 w-4" />
          WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Receipt via WhatsApp</DialogTitle>
          <DialogDescription>
            Enter the phone number to share the receipt with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Include country code (e.g., +92 for Pakistan)
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleShare} 
            className="bg-green-500 hover:bg-green-600"
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Share via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppDialog;
