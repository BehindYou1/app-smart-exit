"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  userType: "manager" | "employee";
}

export default function FeedbackDialog({ open, onClose, userType }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "improvement">("improvement");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Simula envio de feedback
    console.log("Feedback submitted:", {
      type: feedbackType,
      message,
      userType,
      timestamp: new Date().toISOString(),
    });

    setSubmitted(true);
    
    // Reset após 2 segundos
    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
      setFeedbackType("improvement");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setSubmitted(false);
    setMessage("");
    setFeedbackType("improvement");
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Thank You!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your feedback has been submitted successfully.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Smart Exit by sharing your thoughts, reporting bugs, or suggesting new features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Feedback Type</Label>
            <RadioGroup value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug" className="font-normal cursor-pointer">
                  🐛 Report a Bug
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature" id="feature" />
                <Label htmlFor="feature" className="font-normal cursor-pointer">
                  ✨ Request a Feature
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="improvement" id="improvement" />
                <Label htmlFor="improvement" className="font-normal cursor-pointer">
                  💡 Suggest an Improvement
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
