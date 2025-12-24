"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  DollarSign
} from "lucide-react";
import { analyzeHistoricalPatterns } from "@/lib/smart-exit/exit-system";
import type { HistoricalData } from "@/lib/smart-exit/types";

export default function HistoricalAnalysisPanel() {
  // Dados simulados para demonstração
  const historicalData: HistoricalData[] = [
    { date: new Date("2024-01-15"), hour: 9, exitCount: 45, highRiskCount: 8, theftIncidents: 0, averageValue: 67.5 },
    { date: new Date("2024-01-15"), hour: 10, exitCount: 78, highRiskCount: 12, theftIncidents: 1, averageValue: 89.2 },
    { date: new Date("2024-01-15"), hour: 11, exitCount: 92, highRiskCount: 18, theftIncidents: 0, averageValue: 102.3 },
    { date: new Date("2024-01-15"), hour: 12, exitCount: 134, highRiskCount: 35, theftIncidents: 2, averageValue: 125.8 },
    { date: new Date("2024-01-15"), hour: 13, exitCount: 156, highRiskCount: 42, theftIncidents: 3, averageValue: 118.4 },
    { date: new Date("2024-01-15"), hour: 14, exitCount: 123, highRiskCount: 28, theftIncidents: 1, averageValue: 95.7 },
    { date: new Date("2024-01-15"), hour: 15, exitCount: 98, highRiskCount: 19, theftIncidents: 1, averageValue: 87.3 },
    { date: new Date("2024-01-15"), hour: 16, exitCount: 112, highRiskCount: 22, theftIncidents: 0, averageValue: 93.6 },
    { date: new Date("2024-01-15"), hour: 17, exitCount: 145, highRiskCount: 38, theftIncidents: 2, averageValue: 112.9 },
    { date: new Date("2024-01-15"), hour: 18, exitCount: 89, highRiskCount: 15, theftIncidents: 1, averageValue: 76.2 },
  ];

  const analysis = analyzeHistoricalPatterns(historicalData);

  const weeklyTrends = [
    { day: "Monday", exits: 1089, thefts: 8, rate: 0.73 },
    { day: "Tuesday", exits: 1156, thefts: 9, rate: 0.78 },
    { day: "Wednesday", exits: 1234, thefts: 11, rate: 0.89 },
    { day: "Thursday", exits: 1312, thefts: 13, rate: 0.99 },
    { day: "Friday", exits: 1567, thefts: 18, rate: 1.15 },
    { day: "Saturday", exits: 1789, thefts: 22, rate: 1.23 },
    { day: "Sunday", exits: 1423, thefts: 15, rate: 1.05 },
  ];

  const categoryRisk = [
    { category: "Electronics", riskScore: 85, incidents: 12, value: 45230 },
    { category: "Cosmetics", riskScore: 72, incidents: 8, value: 23450 },
    { category: "Clothing", riskScore: 45, incidents: 5, value: 18900 },
    { category: "Food", riskScore: 28, incidents: 2, value: 12340 },
    { category: "Home & Garden", riskScore: 38, incidents: 3, value: 15670 },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Theft Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analysis.averageTheftRate.toFixed(2)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span className={analysis.averageTheftRate < 1 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {analysis.averageTheftRate < 1 ? "Below" : "Above"} industry average
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Peak Hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analysis.highRiskHours.length}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {analysis.highRiskHours.map(h => `${h}:00`).join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              High-Risk Days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analysis.highRiskDays.length}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {analysis.highRiskDays.join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Prevention Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              94.2%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span className="text-green-600 dark:text-green-400">+12%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tendências semanais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Theft Patterns
          </CardTitle>
          <CardDescription>
            Incident rate by day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyTrends.map((trend) => (
              <div key={trend.day} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">
                      {trend.day}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        trend.rate > 1.1 
                          ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                          : trend.rate > 0.8
                          ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                          : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                      }
                    >
                      {trend.rate}% rate
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {trend.exits} exits
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {trend.thefts} incidents
                    </span>
                  </div>
                </div>
                <Progress 
                  value={(trend.thefts / trend.exits) * 100 * 50} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Category Risk Analysis
          </CardTitle>
          <CardDescription>
            Theft incidents and loss by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryRisk.map((category) => (
              <div 
                key={category.category}
                className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {category.category}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        category.riskScore > 70 
                          ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                          : category.riskScore > 50
                          ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
                          : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                      }
                    >
                      Risk: {category.riskScore}/100
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {category.incidents} incidents
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {(category.value / 1000).toFixed(1)}k loss
                    </span>
                  </div>
                </div>
                <Progress value={category.riskScore} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            Based on historical data analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              >
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
