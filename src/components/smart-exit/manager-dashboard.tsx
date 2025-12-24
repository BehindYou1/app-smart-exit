"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Store,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import SecurityAlertsPanel from "./security-alerts-panel";
import EmployeeNotesPanel from "./employee-notes-panel";
import HistoricalAnalysisPanel from "./historical-analysis-panel";

export default function ManagerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today");
  
  // Dados simulados para demonstração
  const stats = {
    totalExits: 1247,
    greenExits: 1059,
    yellowExits: 156,
    redExits: 32,
    avgExitTime: 8.5,
    estimatedLossPrevention: 12450,
    queueReduction: 73
  };

  const hourlyData = [
    { hour: "08:00", exits: 45, risk: "low" },
    { hour: "09:00", exits: 78, risk: "low" },
    { hour: "10:00", exits: 92, risk: "medium" },
    { hour: "11:00", exits: 134, risk: "medium" },
    { hour: "12:00", exits: 187, risk: "high" },
    { hour: "13:00", exits: 156, risk: "high" },
    { hour: "14:00", exits: 123, risk: "medium" },
    { hour: "15:00", exits: 98, risk: "medium" },
    { hour: "16:00", exits: 112, risk: "medium" },
    { hour: "17:00", exits: 145, risk: "high" },
    { hour: "18:00", exits: 77, risk: "low" },
  ];

  const trendData = {
    today: { exits: 1247, change: 12, lossPrevention: 12450 },
    week: { exits: 8456, change: 8, lossPrevention: 87230 },
    month: { exits: 35678, change: 15, lossPrevention: 368450 }
  };

  const storeComparison = [
    { name: "Store A (Current)", exits: 1247, efficiency: 85, loss: 12450 },
    { name: "Store B", exits: 1089, efficiency: 78, loss: 15230 },
    { name: "Store C", exits: 1456, efficiency: 82, loss: 13890 },
    { name: "Store D", exits: 987, efficiency: 71, loss: 18760 },
  ];

  const greenPercentage = Math.round((stats.greenExits / stats.totalExits) * 100);
  const yellowPercentage = Math.round((stats.yellowExits / stats.totalExits) * 100);
  const redPercentage = Math.round((stats.redExits / stats.totalExits) * 100);

  const currentTrend = trendData[selectedPeriod];

  const handleExportReport = () => {
    console.log("Exporting advanced report...");
    // Simula download de relatório
    alert("Report exported successfully! (Demo mode)");
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manager Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Complete theft prevention and analytics system</p>
        </div>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
      </div>

      {/* TAB: Overview */}
      <TabsContent value="overview" className="space-y-6">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tabs value={selectedPeriod} onValueChange={(v: any) => setSelectedPeriod(v)} className="w-auto">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Exits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currentTrend.exits.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span className="text-green-600 dark:text-green-400 font-medium">+{currentTrend.change}%</span> vs previous period
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Direct Release
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {greenPercentage}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats.greenExits} customers without check
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Average Time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.avgExitTime}s
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span className="text-green-600 dark:text-green-400 font-medium">-45%</span> vs manual check
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loss Prevention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${(currentTrend.lossPrevention / 1000).toFixed(1)}k
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Estimated for {selectedPeriod}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição de Checagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Check Distribution Analysis
            </CardTitle>
            <CardDescription>
              Risk analysis of today's exits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Green - Direct Release
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {stats.greenExits}
                  </span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                    {greenPercentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={greenPercentage} className="h-2 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Yellow - Quick Check
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {stats.yellowExits}
                  </span>
                  <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300">
                    {yellowPercentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={yellowPercentage} className="h-2 bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Red - Full Check
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {stats.redExits}
                  </span>
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
                    {redPercentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={redPercentage} className="h-2 bg-gray-200 dark:bg-gray-800" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horários de Maior Risco */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Peak Hours Analysis
              </CardTitle>
              <CardDescription>
                Traffic flow and risk by hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyData.map((data) => (
                  <div 
                    key={data.hour}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 w-16">
                        {data.hour}
                      </span>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {data.exits}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          exits
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        data.risk === "high" 
                          ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                          : data.risk === "medium"
                          ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                          : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      }
                    >
                      {data.risk === "high" ? "High Risk" : data.risk === "medium" ? "Medium" : "Low Risk"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Multi-Store Comparison
              </CardTitle>
              <CardDescription>
                Performance across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storeComparison.map((store, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      index === 0 
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700" 
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {store.name}
                        </span>
                        {index === 0 && (
                          <Badge className="bg-blue-500 text-white">You</Badge>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {store.exits} exits
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Efficiency</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{store.efficiency}%</span>
                      </div>
                      <Progress value={store.efficiency} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="text-gray-600 dark:text-gray-400">Loss Prevention</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${(store.loss / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Queue Reduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {stats.queueReduction}%
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                Less waiting time at exit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Active Prevention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {stats.redExits + stats.yellowExits}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Checks performed today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                100%
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                No personal data collected
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* TAB: Security */}
      <TabsContent value="security" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityAlertsPanel />
          <EmployeeNotesPanel />
        </div>
      </TabsContent>

      {/* TAB: Reports */}
      <TabsContent value="reports" className="space-y-6">
        <EmployeeNotesPanel />
      </TabsContent>

      {/* TAB: Analytics */}
      <TabsContent value="analytics" className="space-y-6">
        <HistoricalAnalysisPanel />
      </TabsContent>
    </Tabs>
  );
}
