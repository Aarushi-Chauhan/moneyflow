"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs font-medium uppercase tracking-wider">
        Total Spent
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-xl font-bold tabular-nums">
        {formatCurrency(payload.totalRef || 0)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300 drop-shadow-md"
      />
    </g>
  );
};

export function ExpenseBreakdown() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get("/dashboard/spending");
        if (data) {
          setTotal(data.total);
          
          const formatted = data.categories.slice(0, 5).map((c: any, i: number) => ({
            name: c.category,
            value: c.amount,
            percentage: c.percentage,
            color: COLORS[i % COLORS.length],
            totalRef: data.total
          }));
          
          if (data.categories.length > 5) {
            const otherVal = data.categories.slice(5).reduce((sum: number, c: any) => sum + c.amount, 0);
            formatted.push({
              name: "Other",
              value: otherVal,
              percentage: (otherVal / data.total) * 100,
              color: "#64748b",
              totalRef: data.total
            });
          }
          setChartData(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="h-full flex flex-col hover:border-primary/20 transition-colors duration-300">
      <CardHeader className="pb-4">
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No expense data available
          </div>
        ) : (
          <>
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        opacity={activeIndex === index ? 1 : 0.6}
                        className="transition-opacity duration-300 outline-none hover:outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3">
              {chartData.map((item, index) => {
                // Mock a trend for UI demonstration per PRD
                const fakeTrend = (index % 2 === 0 ? 1 : -1) * (Math.random() * 10 + 1);
                const isPositive = fakeTrend > 0;
                
                return (
                  <Link 
                    href={`/transactions?search=${encodeURIComponent(item.name)}`}
                    key={`${item.name}-${index}`} 
                    className={`flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer block ${
                      activeIndex === index ? "bg-secondary/70 border border-border/50" : "hover:bg-secondary/40 border border-transparent"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3.5 h-3.5 rounded-full ring-2 ring-background shadow-sm" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${isPositive ? 'text-emerald-500' : 'text-foreground'}`}>
                          {isPositive ? '+' : '−'}{Math.abs(fakeTrend).toFixed(1)}% vs last month
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(item.value)}</span>
                      <span className="text-xs text-muted-foreground font-medium tabular-nums mt-0.5">
                        {Math.round((item.value / total) * 100)}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
