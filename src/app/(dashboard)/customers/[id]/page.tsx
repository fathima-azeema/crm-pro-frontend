"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  CalendarClock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch customer data
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => api.get(`/customers/${id}`).then((res) => res.data),
  });

  // Fetch notes
  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes", id],
    queryFn: () =>
      api.get(`/customers/${id}/notes`).then((res) => res.data.data),
  });

  // Fetch follow‑ups
  const { data: followups = [], isLoading: followupsLoading } = useQuery({
    queryKey: ["followups", id],
    queryFn: () =>
      api.get(`/customers/${id}/followups`).then((res) => res.data.data),
  });

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/customers/${id}`),
    onSuccess: () => {
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      router.push("/customers");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete customer");
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (description: string) =>
      api.post(`/customers/${id}/notes`, { description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });

  // Add follow‑up mutation
  const addFollowupMutation = useMutation({
    mutationFn: (data: { date: string; purpose: string }) =>
      api.post(`/customers/${id}/followups`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups", id] });
      toast.success("Follow‑up scheduled");
    },
    onError: () => toast.error("Failed to schedule follow‑up"),
  });

  // Update follow‑up status
  const updateFollowupMutation = useMutation({
    mutationFn: ({ followupId, status }: { followupId: number; status: string }) =>
      api.put(`/customers/${id}/followups/${followupId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups", id] });
      toast.success("Follow‑up updated");
    },
    onError: () => toast.error("Failed to update follow‑up"),
  });

  // Delete follow‑up
  const deleteFollowupMutation = useMutation({
    mutationFn: (followupId: number) =>
      api.delete(`/customers/${id}/followups/${followupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups", id] });
      toast.success("Follow‑up deleted");
    },
    onError: () => toast.error("Failed to delete follow‑up"),
  });

  const [newNote, setNewNote] = useState("");
  const [newFollowup, setNewFollowup] = useState({ date: "", purpose: "" });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote);
    setNewNote("");
  };

  const handleAddFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowup.date || !newFollowup.purpose.trim()) return;
    addFollowupMutation.mutate(newFollowup);
    setNewFollowup({ date: "", purpose: "" });
  };

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Customer not found.</p>
        <Button variant="link" asChild>
          <Link href="/customers">Back to customers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
            {customer.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/customers/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this customer?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquare className="mr-2 h-4 w-4" /> Notes ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="followups">
            <CalendarClock className="mr-2 h-4 w-4" /> Follow‑ups ({followups.length})
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.company || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.industry || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p>{new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Note</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="space-y-3">
                <Textarea
                  placeholder="Write a note about this customer..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button type="submit" disabled={addNoteMutation.isPending}>
                  {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {notesLoading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          ) : notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Add the first one above.
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note: any) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-wrap">{note.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Follow‑ups Tab */}
        <TabsContent value="followups" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule Follow‑up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFollowup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newFollowup.date}
                      onChange={(e) =>
                        setNewFollowup({ ...newFollowup, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input
                      placeholder="Call, Meeting, Email..."
                      value={newFollowup.purpose}
                      onChange={(e) =>
                        setNewFollowup({ ...newFollowup, purpose: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={addFollowupMutation.isPending}>
                  {addFollowupMutation.isPending ? "Scheduling..." : "Schedule"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {followupsLoading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          ) : followups.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No follow‑ups yet. Schedule one above.
            </p>
          ) : (
            <div className="space-y-3">
              {followups.map((f: any) => (
                <Card key={f.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{f.purpose}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(f.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {f.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {f.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateFollowupMutation.mutate({
                              followupId: f.id,
                              status: "Completed",
                            })
                          }
                        >
                          Mark Done
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Delete this follow‑up?"))
                            deleteFollowupMutation.mutate(f.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}