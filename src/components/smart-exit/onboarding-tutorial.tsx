"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, QrCode, Eye, Shield, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

interface OnboardingTutorialProps {
  open: boolean;
  onClose: () => void;
  userType: "manager" | "employee";
}

export default function OnboardingTutorial({ open, onClose, userType }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const employeeSteps = [
    {
      icon: <QrCode className="h-12 w-12 text-blue-500" />,
      title: "Welcome to Smart Exit!",
      description: "This quick tutorial will show you how to use the employee scanner effectively.",
    },
    {
      icon: <Eye className="h-12 w-12 text-green-500" />,
      title: "Scan QR Codes",
      description: "Simply tap 'Scan QR Code' and point your device at the customer's receipt. The system will instantly validate the exit token.",
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-500" />,
      title: "Understand Risk Levels",
      description: "🟢 GREEN = Release customer immediately\n🟡 YELLOW = Quick check (1-2 items)\n🔴 RED = Full manual check required",
    },
    {
      icon: <CheckCircle2 className="h-12 w-12 text-purple-500" />,
      title: "Review Purchase Details",
      description: "After scanning, you'll see the total value, item count, categories, and any risk alerts to help you make quick decisions.",
    },
  ];

  const managerSteps = [
    {
      icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
      title: "Welcome to Smart Exit Dashboard!",
      description: "Monitor your store's exit performance and security in real-time.",
    },
    {
      icon: <Eye className="h-12 w-12 text-green-500" />,
      title: "Track Key Metrics",
      description: "View total exits, direct releases, average exit time, and estimated loss prevention at a glance.",
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-500" />,
      title: "Analyze Check Distribution",
      description: "See the breakdown of green, yellow, and red checks to understand your store's risk profile.",
    },
    {
      icon: <Clock className="h-12 w-12 text-purple-500" />,
      title: "Identify Peak Times",
      description: "Monitor hourly traffic and risk levels to optimize staff allocation during busy periods.",
    },
  ];

  const steps = userType === "employee" ? employeeSteps : managerSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <DialogTitle className="text-center text-xl">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center whitespace-pre-line pt-4">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-blue-500"
                  : "w-2 bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
