"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Package,
  DollarSign,
  ShoppingBag,
  Smartphone,
  Clock,
  Bell,
  Wifi,
  WifiOff
} from "lucide-react";
import { generateExitToken, validateExitToken, calculateRiskScore } from "@/lib/smart-exit/exit-system";
import type { ExitToken, RiskLevel } from "@/lib/smart-exit/types";

export default function EmployeeScanner() {
  const [scannedToken, setScannedToken] = useState<ExitToken | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simula detecção de conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simula notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "High-risk transaction detected at Register 3",
        "Peak hour approaching - expect increased traffic",
        "System update completed successfully",
      ];
      
      if (Math.random() > 0.95 && notifications.length < 3) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setNotifications(prev => [...prev, randomMessage]);
        
        // Remove notificação após 5 segundos
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n !== randomMessage));
        }, 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [notifications]);

  // Simula escaneamento de QR Code
  const handleScan = () => {
    if (!isOnline) {
      setErrorMessage("No internet connection. Please check your network.");
      setScanStatus("error");
      return;
    }

    setScanStatus("scanning");
    setErrorMessage("");
    
    // Simula delay de escaneamento
    setTimeout(() => {
      // Gera um token de exemplo para demonstração
      const mockToken = generateExitToken({
        totalValue: Math.random() > 0.5 ? 450.00 : 89.90,
        itemCount: Math.floor(Math.random() * 20) + 1,
        categories: ["electronics", "food", "clothing"],
        hasHighValueItems: Math.random() > 0.6,
        hasSmallItems: Math.random() > 0.5,
        usedSelfCheckout: Math.random() > 0.5,
        hasAnomalies: Math.random() > 0.8
      });

      const validation = validateExitToken(mockToken);
      
      if (validation.valid) {
        setScannedToken(mockToken);
        setScanStatus("success");
      } else {
        setErrorMessage(validation.reason || "Invalid token");
        setScanStatus("error");
      }
    }, 1500);
  };

  // Simula escaneamento de diferentes cenários
  const handleTestScan = (scenario: "green" | "yellow" | "red" | "expired" | "used") => {
    if (!isOnline) {
      setErrorMessage("No internet connection. Please check your network.");
      setScanStatus("error");
      return;
    }

    setScanStatus("scanning");
    setErrorMessage("");
    
    setTimeout(() => {
      let mockToken: ExitToken;
      
      switch (scenario) {
        case "green":
          mockToken = generateExitToken({
            totalValue: 45.90,
            itemCount: 5,
            categories: ["food"],
            hasHighValueItems: false,
            hasSmallItems: false,
            usedSelfCheckout: false,
            hasAnomalies: false
          });
          break;
        case "yellow":
          mockToken = generateExitToken({
            totalValue: 189.90,
            itemCount: 8,
            categories: ["electronics", "food"],
            hasHighValueItems: true,
            hasSmallItems: false,
            usedSelfCheckout: false,
            hasAnomalies: false
          });
          break;
        case "red":
          mockToken = generateExitToken({
            totalValue: 850.00,
            itemCount: 15,
            categories: ["electronics", "cosmetics"],
            hasHighValueItems: true,
            hasSmallItems: true,
            usedSelfCheckout: true,
            hasAnomalies: true
          });
          break;
        case "expired":
          mockToken = generateExitToken({
            totalValue: 100.00,
            itemCount: 5,
            categories: ["food"],
            hasHighValueItems: false,
            hasSmallItems: false,
            usedSelfCheckout: false,
            hasAnomalies: false
          });
          mockToken.expiresAt = new Date(Date.now() - 60000); // Expirado há 1 minuto
          break;
        case "used":
          mockToken = generateExitToken({
            totalValue: 100.00,
            itemCount: 5,
            categories: ["food"],
            hasHighValueItems: false,
            hasSmallItems: false,
            usedSelfCheckout: false,
            hasAnomalies: false
          });
          mockToken.used = true;
          break;
        default:
          mockToken = generateExitToken({
            totalValue: 100.00,
            itemCount: 5,
            categories: ["food"],
            hasHighValueItems: false,
            hasSmallItems: false,
            usedSelfCheckout: false,
            hasAnomalies: false
          });
      }

      const validation = validateExitToken(mockToken);
      
      if (validation.valid) {
        setScannedToken(mockToken);
        setScanStatus("success");
      } else {
        setErrorMessage(validation.reason || "Invalid token");
        setScanStatus("error");
      }
    }, 1500);
  };

  const resetScanner = () => {
    setScannedToken(null);
    setScanStatus("idle");
    setErrorMessage("");
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
    }
  };

  const getRiskBgColor = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
      case "high":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return <CheckCircle2 className="h-16 w-16 text-green-500" />;
      case "medium":
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
      case "high":
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getRiskAction = (level: RiskLevel) => {
    switch (level) {
      case "low":
        return "Release Customer";
      case "medium":
        return "Quick Check (1-2 items)";
      case "high":
        return "Full Manual Check";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Connection Status & Notifications */}
      <div className="space-y-3">
        {!isOnline && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              No internet connection. Scanner functionality is limited.
            </AlertDescription>
          </Alert>
        )}

        {notifications.map((notification, index) => (
          <Alert key={index} className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              {notification}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Scanner Principal */}
      {scanStatus === "idle" && (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <QrCode className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Scan QR Code</CardTitle>
            <CardDescription>
              Point the camera at the customer's receipt QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleScan}
              size="lg"
              disabled={!isOnline}
              className="w-full h-16 text-lg gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
            >
              <QrCode className="h-6 w-6" />
              Start Scanning
            </Button>

            {/* Connection Status Badge */}
            <div className="flex items-center justify-center gap-2 text-sm">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400 font-medium">Offline</span>
                </>
              )}
            </div>

            {/* Botões de Teste */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
                Demo Mode - Test Scenarios:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => handleTestScan("green")}
                  variant="outline"
                  size="sm"
                  disabled={!isOnline}
                  className="gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Green
                </Button>
                <Button 
                  onClick={() => handleTestScan("yellow")}
                  variant="outline"
                  size="sm"
                  disabled={!isOnline}
                  className="gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Yellow
                </Button>
                <Button 
                  onClick={() => handleTestScan("red")}
                  variant="outline"
                  size="sm"
                  disabled={!isOnline}
                  className="gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  Red
                </Button>
                <Button 
                  onClick={() => handleTestScan("expired")}
                  variant="outline"
                  size="sm"
                  disabled={!isOnline}
                  className="gap-2"
                >
                  <Clock className="h-3 w-3" />
                  Expired
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Escaneando */}
      {scanStatus === "scanning" && (
        <Card className="border-2 border-blue-500">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                  <QrCode className="h-12 w-12 text-blue-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Scanning QR Code...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Validating exit token
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erro */}
      {scanStatus === "error" && (
        <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/30">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-24 w-24 text-red-500" />
              <div className="text-center">
                <p className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
                  Invalid QR Code
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              </div>
              <Button 
                onClick={resetScanner}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado do Scan */}
      {scanStatus === "success" && scannedToken && (
        <div className="space-y-4">
          {/* Indicador de Risco Principal */}
          <Card className={`border-4 ${getRiskBgColor(scannedToken.riskLevel)}`}>
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-4">
                {getRiskIcon(scannedToken.riskLevel)}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {getRiskAction(scannedToken.riskLevel)}
                  </h3>
                  <Badge 
                    className={`${getRiskColor(scannedToken.riskLevel)} text-white text-sm px-4 py-1`}
                  >
                    Risk Level: {scannedToken.riskScore}/100
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Compra */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Purchase Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ${scannedToken.transaction.totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Items</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {scannedToken.transaction.itemCount}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories:
                </p>
                <div className="flex flex-wrap gap-2">
                  {scannedToken.transaction.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {scannedToken.transaction.usedSelfCheckout && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Self-checkout transaction
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avisos de Risco */}
          {(scannedToken.transaction.hasHighValueItems || 
            scannedToken.transaction.hasSmallItems || 
            scannedToken.transaction.hasAnomalies) && (
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scannedToken.transaction.hasHighValueItems && (
                  <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5"></div>
                    <span>Contains high-value items</span>
                  </div>
                )}
                {scannedToken.transaction.hasSmallItems && (
                  <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5"></div>
                    <span>Contains small items (easy concealment)</span>
                  </div>
                )}
                {scannedToken.transaction.hasAnomalies && (
                  <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5"></div>
                    <span>Transaction anomalies detected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            <Button 
              onClick={resetScanner}
              variant="outline"
              className="flex-1"
            >
              New Scan
            </Button>
            <Button 
              onClick={resetScanner}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Confirm Exit
            </Button>
          </div>
        </div>
      )}

      {/* Informações do Sistema */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Smart Exit System v1.0</span>
            <Badge variant="outline" className="gap-1">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
