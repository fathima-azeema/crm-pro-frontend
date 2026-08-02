"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Users, Target, CheckSquare, Loader2 } from "lucide-react";
import api from "@/lib/api";

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Toggle with Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "K" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch data from all three endpoints (limit to 50 each for speed)
  const { data: customers = [] } = useQuery({
    queryKey: ["command-customers"],
    queryFn: () =>
      api.get("/customers", { params: { limit: 50 } }).then((res) => res.data.data || []),
    enabled: open,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["command-leads"],
    queryFn: () =>
      api.get("/leads", { params: { limit: 50 } }).then((res) => res.data.data || []),
    enabled: open,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["command-tasks"],
    queryFn: () =>
      api.get("/tasks", { params: { limit: 50 } }).then((res) => res.data.data || []),
    enabled: open,
  });

  const isLoading = !customers.length && !leads.length && !tasks.length; // simplified

  const handleSelect = useCallback(
    (type: string, id: number) => {
      setOpen(false);
      switch (type) {
        case "customer":
          router.push(`/customers/${id}`);
          break;
        case "lead":
          router.push(`/leads`); // you could add lead detail page
          break;
        case "task":
          router.push(`/tasks`);
          break;
        default:
          break;
      }
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search customers, leads, tasks..." />
      <CommandList>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>

            {/* Customers */}
            {customers.length > 0 && (
              <CommandGroup heading="Customers">
                {customers.map((customer: any) => (
                  <CommandItem
                    key={`cust-${customer.id}`}
                    value={`customer-${customer.name}-${customer.company || ""}`}
                    onSelect={() => handleSelect("customer", customer.id)}
                  >
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{customer.name}</span>
                    {customer.company && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {customer.company}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Leads */}
            {leads.length > 0 && (
              <CommandGroup heading="Leads">
                {leads.map((lead: any) => (
                  <CommandItem
                    key={`lead-${lead.id}`}
                    value={`lead-${lead.name}-${lead.company || ""}`}
                    onSelect={() => handleSelect("lead", lead.id)}
                  >
                    <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{lead.name}</span>
                    {lead.company && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {lead.company}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Tasks */}
            {tasks.length > 0 && (
              <CommandGroup heading="Tasks">
                {tasks.map((task: any) => (
                  <CommandItem
                    key={`task-${task.id}`}
                    value={`task-${task.title}`}
                    onSelect={() => handleSelect("task", task.id)}
                  >
                    <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{task.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {task.status}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}