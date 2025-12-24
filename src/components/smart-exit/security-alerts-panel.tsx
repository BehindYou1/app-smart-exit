"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Package,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import type { SecurityAlert } from "@/lib/smart-exit/types";
import { useState } from "react";

interface SecurityAlertsPanelProps {
  alerts?: SecurityAlert[];
}

export default function SecurityAlertsPanel({ alerts: initialAlerts }: SecurityAlertsPanelProps) {
  // Dados simulados para demonstração
  const [alerts, setAlerts] = useState<SecurityAlert[]>(initialAlerts || [
    {
      id: "alert-1",
      type: "high_risk_transaction",
      severity: "high",
      message: "High-risk transaction detected: $487.50 with 12 items including electronics",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      resolved: false,
      metadata: { tokenId: "SE-ABC123", riskScore: 78 }
    },
    {
      id: "alert-2",
      type: "unusual_pattern",
      severity: "medium",
      message: "Unusual purchase pattern: Frequent high-risk purchases, Exclusive self-checkout usage",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      resolved: false,
      metadata: { patternScore: 65 }
    },
    {
      id: "alert-3",
      type: "peak_hour",
      severity: "medium",
      message: "High-risk transaction during peak hours (12:00-14:00) - extra attention recommended",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      resolved: false,
      metadata: { hour: 13 }
    },
    {
      id: "alert-4",
      type: "inventory_discrepancy",
      severity: "critical",
      message: "Inventory discrepancy detected: 3 items sold exceed stock count",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      resolved: false,
      metadata: { affectedItems: 3 }
    },
    {
      id: "alert-5",
      type: "high_risk_transaction",
      severity: "high",
      message: "Multiple voids detected in transaction with high-value items",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      resolved: true,
      metadata: { riskScore: 82 }
    }
  ]);

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const criticalCount = unresolvedAlerts.filter(a => a.severity === "critical").length;
  const highCount = unresolvedAlerts.filter(a => a.severity === "high").length;

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: SecurityAlert["type"]) => {
    switch (type) {
      case "high_risk_transaction":
        return <AlertTriangle className="h-5 w-5" />;
      case "unusual_pattern":
        return <TrendingUp className="h-5 w-5" />;
      case "inventory_discrepancy":
        return <Package className="h-5 w-5" />;
      case "peak_hour":
        return <Clock className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: SecurityAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700";
      case "high":
        return "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
      case "low":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Security Alerts
            </CardTitle>
            <CardDescription>Real-time theft prevention monitoring</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            {highCount > 0 && (
              <Badge className="bg-orange-500 text-white">
                {highCount} High
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No security alerts at the moment
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    alert.resolved 
                      ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60" 
                      : `${getSeverityColor(alert.severity)}`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${alert.resolved ? "text-gray-400" : ""}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={alert.resolved ? "bg-gray-100 dark:bg-gray-800" : ""}
                          >
                            {alert.type.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                          {!alert.resolved && (
                            <Badge 
                              variant="outline"
                              className={getSeverityColor(alert.severity)}
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                          )}
                          {alert.resolved && (
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              RESOLVED
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        {alert.message}
                      </p>
                      {alert.metadata && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
                          {alert.metadata.tokenId && (
                            <div>Token: {alert.metadata.tokenId}</div>
                          )}
                          {alert.metadata.riskScore && (
                            <div>Risk Score: {alert.metadata.riskScore}/100</div>
                          )}
                          {alert.metadata.patternScore && (
                            <div>Pattern Score: {alert.metadata.patternScore}/100</div>
                          )}
                          {alert.metadata.affectedItems && (
                            <div>Affected Items: {alert.metadata.affectedItems}</div>
                          )}
                        </div>
                      )}
                      {!alert.resolved && (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleResolve(alert.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Mark Resolved
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => handleDismiss(alert.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
