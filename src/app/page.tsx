"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, QrCode, BarChart3, CheckCircle2, Clock, TrendingDown, HelpCircle, MessageSquare, LogOut, User } from "lucide-react";
import ManagerDashboard from "@/components/smart-exit/manager-dashboard";
import EmployeeScanner from "@/components/smart-exit/employee-scanner";
import OnboardingTutorial from "@/components/smart-exit/onboarding-tutorial";
import FeedbackDialog from "@/components/smart-exit/feedback-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SmartExitApp() {
  const { user, profile, loading, signOut, isManager } = useAuth();
  const [activeView, setActiveView] = useState<"manager" | "employee">(
    isManager ? "manager" : "employee"
  );
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage("smart-exit-tutorial-seen", false);

  // Mostrar tutorial automaticamente para novos usuários
  const handleViewChange = (view: "manager" | "employee") => {
    setActiveView(view);
    if (!hasSeenTutorial && view === "employee") {
      setShowTutorial(true);
      setHasSeenTutorial(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Exit</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent Exit System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTutorial(true)}
                className="text-gray-600 dark:text-gray-400"
                title="Help & Tutorial"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFeedback(true)}
                className="text-gray-600 dark:text-gray-400"
                title="Send Feedback"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              
              {/* Botões de visualização - apenas para managers */}
              {isManager && (
                <>
                  <Button
                    variant={activeView === "manager" ? "default" : "outline"}
                    onClick={() => handleViewChange("manager")}
                    className="gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Manager</span>
                  </Button>
                  <Button
                    variant={activeView === "employee" ? "default" : "outline"}
                    onClick={() => handleViewChange("employee")}
                    className="gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    <span className="hidden sm:inline">Employee</span>
                  </Button>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                </>
              )}

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || "Usuário"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="outline" className="w-fit mt-1">
                        {profile?.role === "manager" ? "Gerente" : profile?.role === "security" ? "Segurança" : "Funcionário"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isManager && activeView === "manager" ? (
          <ManagerDashboard />
        ) : (
          <EmployeeScanner />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>LGPD/GDPR compliant - No personal data collected</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Secure
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Fast
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingDown className="h-3 w-3" />
                Reduces Loss
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial 
        open={showTutorial} 
        onClose={() => setShowTutorial(false)}
        userType={activeView}
      />

      {/* Feedback Dialog */}
      <FeedbackDialog 
        open={showFeedback} 
        onClose={() => setShowFeedback(false)}
        userType={activeView}
      />
    </div>
  );
}
