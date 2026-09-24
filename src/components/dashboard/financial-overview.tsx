"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload[0].value;
    const expense = payload[1].value;
    const savings = income - expense;
    
    return (
      <div className="bg-popover border border-border/50 text-popover-foreground rounded-xl shadow-xl p-4 text-sm animate-in zoom-in-95 duration-200 min-w-[200px]">
        <p className="font-semibold mb-3 text-foreground">{format(new Date(label), "MMMM dd, yyyy")}</p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center space-x-6">
            <span className="flex items-center text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              Income
            </span>
            <span className="font-bold text-foreground tabular-nums">{formatCurrency(income)}</span>
          </div>
          <div className="flex justify-between items-center space-x-6">
            <span className="flex items-center text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-destructive mr-2" />
              Expenses
            </span>
            <span className="font-bold text-foreground tabular-nums">{formatCurrency(expense)}</span>
          </div>
          <div className="pt-3 mt-3 border-t border-border/50 flex justify-between items-center space-x-6">
            <span className="text-muted-foreground font-medium">Cash Flow</span>
            <span className={`font-bold tabular-nums ${savings >= 0 ? "text-emerald-500" : "text-destructive"}`}>
              {savings >= 0 ? "+" : ""}
              {formatCurrency(savings)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function FinancialOverview() {
  const [range, setRange] = useState("30d");
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await api.get(`/dashboard/cash-flow?period=${range.toLowerCase()}`);
        if (data) {
          setChartData(data.flowData);
          setSummary({
            income: data.summary.income,
            expenses: data.summary.expenses,
            net: data.summary.net
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [range]);

  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </div>
        <div className="flex space-x-1 bg-secondary/50 rounded-lg p-1 border border-border/50">
          {["7d", "30d", "3m", "6m", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all ${range === r
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      
      {/* Top Summary Stats */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-4 border-b border-border/40">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Income</p>
          <p className="text-lg font-bold tabular-nums text-emerald-500">
            +{formatCurrency(summary.income)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Expenses</p>
          <p className="text-lg font-bold tabular-nums text-destructive">
            −{formatCurrency(summary.expenses)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Net Cash Flow</p>
          <p className={`text-lg font-bold tabular-nums ${summary.net >= 0 ? 'text-foreground' : 'text-destructive'}`}>
            {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}
          </p>
        </div>
      </div>

      <CardContent className="flex-1 min-h-[250px] pt-6 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No cash flow data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => format(new Date(val), "MMM dd")}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
                minTickGap={30}
              />
              <YAxis
                tickFormatter={(val) => `₹${val / 1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dx={-10}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }} 
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--destructive))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--destructive))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
