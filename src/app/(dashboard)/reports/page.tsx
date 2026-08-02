"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

export default function ReportsPage() {
  // Fetch dashboard data
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/reports/dashboard").then((res) => res.data),
  });

  // Fetch task stats
  const { data: taskStats, isLoading: taskLoading } = useQuery({
    queryKey: ["report-tasks"],
    queryFn: () => api.get("/reports/tasks").then((res) => res.data),
  });

  if (dashLoading || taskLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const {
    customerGrowth = [],
    leadsByStatus = [],
    totalCustomers,
    totalLeads,
    wonLeads,
  } = dashboard || {};

  const taskCompletionData = taskStats?.byStatus || [];
  const completionRate = taskStats?.completionRate || 0;

  // Format customer growth for chart
  const growthData = (customerGrowth || []).map((row: any) => ({
    month: new Date(row.month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    customers: Number(row.count),
  }));

  // Leads by status for pie
  const leadPieData = (leadsByStatus || []).map((item: any) => ({
    name: item.status,
    value: Number(item.count),
  }));

  // Task status for pie/bar
  const taskPieData = taskCompletionData.map((item: any) => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">{wonLeads} won</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer Growth Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {leadPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {leadPieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks by Status Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {taskPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskPieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}