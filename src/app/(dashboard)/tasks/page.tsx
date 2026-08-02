"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  GripVertical,
  Loader2,
  Kanban,
  List,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

// --------------------------------------------------------------------
// 1. Statuses & Priority Colors
// --------------------------------------------------------------------
const TASK_STATUSES = ["Pending", "In Progress", "Completed"];

const PRIORITY_COLORS: Record<string, string> = {
  Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// --------------------------------------------------------------------
// 2. Task Card Component (for Kanban)
// --------------------------------------------------------------------
function TaskCard({
  task,
  isDragging,
}: {
  task: any;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium text-sm">{task.title}</p>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-2">
        <Badge
          variant="secondary"
          className={`text-xs ${PRIORITY_COLORS[task.priority] || ""}`}
        >
          {task.priority}
        </Badge>
        {task.assigned_user_name && (
          <span className="text-xs text-muted-foreground">
            {task.assigned_user_name}
          </span>
        )}
      </div>
      {task.due_date && (
        <p className="text-xs text-muted-foreground mt-1">
          Due: {format(new Date(task.due_date), "MMM d, yyyy")}
        </p>
      )}
    </div>
  );
}

// --------------------------------------------------------------------
// 3. Kanban Column Component
// --------------------------------------------------------------------
function Column({
  status,
  tasks,
  onDragStart,
  onDragEnd,
}: {
  status: string;
  tasks: any[];
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <div className="flex-shrink-0 w-72 flex flex-col bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{status}</h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 flex-1 overflow-y-auto">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// --------------------------------------------------------------------
// 4. Add Task Dialog
// --------------------------------------------------------------------
function AddTaskDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    due_date: "",
    assigned_to: "",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      api.post("/tasks", {
        ...data,
        assigned_to: data.assigned_to ? Number(data.assigned_to) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: "",
        assigned_to: "",
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create task");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value || "Medium" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value || "Pending" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select
                value={formData.assigned_to}
                onValueChange={(value) =>
                  setFormData({ ...formData, assigned_to: value || "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------------------------------------------------
// 5. Main Tasks Page
// --------------------------------------------------------------------
export default function TasksPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeTask, setActiveTask] = useState<any>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((res) => res.data.data),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/tasks/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: () => toast.error("Failed to update task"),
  });

  // Group tasks by status for Kanban
  const columns = TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t: any) => t.status === status);
      return acc;
    },
    {} as Record<string, any[]>
  );

  // Drag handlers
  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t: any) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t: any) => t.id === active.id);
    const overColumn = over.data.current?.status || over.id;

    if (TASK_STATUSES.includes(overColumn as string) && activeTask) {
      const newStatus = overColumn as string;
      if (activeTask.status !== newStatus) {
        updateTaskMutation.mutate({ id: activeTask.id, status: newStatus });
      }
    }
    setActiveTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "kanban" | "list")}
          >
            <TabsList>
              <TabsTrigger value="kanban">
                <Kanban className="mr-2 h-4 w-4" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <AddTaskDialog />
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-12rem)]">
          {TASK_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={columns[status] || []}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task: any) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={PRIORITY_COLORS[task.priority] || ""}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      {task.due_date
                        ? format(new Date(task.due_date), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>{task.assigned_user_name || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DragOverlay>
        {activeTask ? (
          <div className="bg-card border rounded-lg p-3 shadow-lg w-72 opacity-90">
            <p className="font-medium text-sm">{activeTask.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
}