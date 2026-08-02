"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import api from "@/lib/api";

type Event = {
  id: number;
  type: "followup" | "task";
  date: string;
  title: string;
  description: string;
  status: string;
  color: string;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate range for the full grid (including leading/trailing days)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const startStr = format(gridStart, "yyyy-MM-dd");
  const endStr = format(gridEnd, "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["calendar-events", startStr, endStr],
    queryFn: () =>
      api
        .get("/calendar/events", { params: { start: startStr, end: endStr } })
        .then((res) => res.data.events as Event[]),
  });

  const eventsByDate = (data || []).reduce(
    (acc, event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg w-40 text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              {/* Day names header */}
              <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const dayStr = format(day, "yyyy-MM-dd");
                  const events = eventsByDate[dayStr] || [];
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isDayToday = isToday(day);

                  return (
                    <button
                      key={dayStr}
                      onClick={() => setSelectedDate(dayStr)}
                      className={`
                        h-14 p-1 rounded-md border border-transparent
                        flex flex-col items-center justify-center
                        transition-colors
                        ${!isCurrentMonth ? "text-muted-foreground/30" : "text-foreground"}
                        ${isDayToday ? "bg-primary/10 border-primary" : "hover:bg-accent"}
                        ${selectedDate === dayStr ? "ring-2 ring-primary" : ""}
                      `}
                    >
                      <span className="text-sm font-medium">
                        {format(day, "d")}
                      </span>
                      {events.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {events.slice(0, 3).map((ev, i) => (
                            <span
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                ev.color === "green"
                                  ? "bg-green-500"
                                  : ev.color === "red"
                                  ? "bg-red-500"
                                  : ev.color === "orange"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events List for Selected Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? format(new Date(selectedDate), "MMMM d, yyyy")
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events for this day.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={`${event.type}-${event.id}`}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {event.type === "followup" ? "Follow-up" : "Task"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            event.status === "Completed"
                              ? "text-green-600 border-green-600"
                              : event.status === "Missed"
                              ? "text-red-600 border-red-600"
                              : ""
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}