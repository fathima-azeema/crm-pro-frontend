"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Target,
  DollarSign,
  CheckSquare,
  Plus,
  CalendarClock,
  ArrowUpRight,
  Clock,
  TrendingUp,
  TrendingDown,
  UserPlus,
  User,
  FileText,
  CheckCircle,
  Phone,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

// ── Animated Counter ──
function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 600;
    const steps = 15;
    const step = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{count}</span>;
}

// ── Tiny Sparkline ──
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((val) => ({ val }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Stat Card ──
function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  colorClass,
  sparklineData,
  trendUp,
}: {
  title: string;
  value: number;
  trend: string;
  icon: any;
  colorClass: string;
  sparklineData: number[];
  trendUp: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", colorClass)}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                trendUp ? "text-green-600" : "text-red-600"
              )}
            >
              {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-3xl font-bold mt-1">
              <AnimatedCounter value={value} />
            </p>
          </div>
          <div className="mt-4">
            <Sparkline data={sparklineData} color={trendUp ? "#10b981" : "#ef4444"} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Dashboard Page ──
export default function DashboardPage() {
  // Fetch dashboard stats
  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/reports/dashboard").then((res) => res.data),
  });

  // Fetch upcoming follow‑ups (for Today's Meetings)
  const { data: followups = [] } = useQuery({
    queryKey: ["today-followups"],
    queryFn: () =>
      api
        .get("/calendar/events", {
          params: {
            start: format(new Date(), "yyyy-MM-dd"),
            end: format(new Date(), "yyyy-MM-dd"),
          },
        })
        .then((res) => res.data.events || []),
  });

  // Fetch upcoming tasks (due today or future)
  const { data: upcomingTasks = [] } = useQuery({
    queryKey: ["upcoming-tasks"],
    queryFn: () =>
      api.get("/tasks", { params: { status: "Pending", limit: 5 } }).then((res) => res.data.data || []),
  });

  if (dashLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const {
    totalCustomers = 0,
    activeCustomers = 0,
    totalLeads = 0,
    wonLeads = 0,
    pendingTasks = 0,
    monthlyRevenue = 0,
    recentCustomers = [],
    leadsByStatus = [],
    customerGrowth = [],
  } = dashData || {};

  // Demo data for sparklines
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      trend: "+12%",
      icon: Users,
      colorClass: "bg-blue-500",
      sparklineData: [2, 3, 3, 4, 5, 4, totalCustomers],
      trendUp: true,
    },
    {
      title: "Total Leads",
      value: totalLeads,
      trend: "+5%",
      icon: Target,
      colorClass: "bg-purple-500",
      sparklineData: [1, 2, 2, 3, 4, 3, totalLeads],
      trendUp: true,
    },
    {
      title: "Monthly Revenue",
      value: monthlyRevenue || 0,
      trend: "—",
      icon: DollarSign,
      colorClass: "bg-green-500",
      sparklineData: [0, 0, 0, 0, 0, 0, monthlyRevenue],
      trendUp: true,
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      trend: `${pendingTasks} left`,
      icon: CheckSquare,
      colorClass: "bg-orange-500",
      sparklineData: [1, 3, 2, 4, 2, 3, pendingTasks],
      trendUp: false,
    },
  ];

  // Prepare chart data with demo fallback
  const customerGrowthData =
    customerGrowth && customerGrowth.length > 0
      ? customerGrowth.map((row: any) => ({
          month: format(new Date(row.month), "MMM yy"),
          customers: Number(row.count),
        }))
      : [
          { month: "Jan", customers: 1 },
          { month: "Feb", customers: 2 },
          { month: "Mar", customers: 3 },
          { month: "Apr", customers: 3 },
          { month: "May", customers: 4 },
          { month: "Jun", customers: 4 },
          { month: "Jul", customers: 4 },
        ];

  const leadPieData =
    leadsByStatus && leadsByStatus.length > 0
      ? leadsByStatus.map((item: any) => ({
          name: item.status,
          value: Number(item.count),
        }))
      : [
          { name: "New", value: 3 },
          { name: "Contacted", value: 2 },
          { name: "Won", value: 1 },
        ];

  // Recent activities
  const activities = [
    ...recentCustomers.map((c: any) => ({
      type: "customer",
      text: `${c.name} added as customer`,
      time: c.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Meetings */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Link href="/customers/new">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" /> Customer
              </Button>
            </Link>
            <Link href="/leads">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" /> Lead
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" /> Task
              </Button>
            </Link>
            <Link href="/employees">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" /> Employee
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            {followups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No follow‑ups today.</p>
            ) : (
              <ul className="space-y-3">
                {followups.slice(0, 3).map((event: any) => (
                  <li key={event.id} className="flex items-start gap-2">
                    <CalendarClock className="h-4 w-4 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending tasks.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingTasks.slice(0, 4).map((task: any) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      )}
                    />
                    <span className="text-sm">{task.title}</span>
                    {task.due_date && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(new Date(task.due_date), "MMM d")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activities.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}