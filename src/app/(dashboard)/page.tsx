"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, DollarSign, CheckSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const stats = [
  { title: "Total Customers", icon: Users, value: "0", change: "+0%" },
  { title: "Active Leads", icon: Target, value: "0", change: "+0%" },
  { title: "Monthly Revenue", icon: DollarSign, value: "$0", change: "+0%" },
  { title: "Pending Tasks", icon: CheckSquare, value: "0", change: "0" },
];

export default function DashboardPage() {
  // Later we'll fetch real data
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
