"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Archive, ArchiveRestore, Mail, MailOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { DeleteButton } from "@/components/dashboard/delete-button";
import type { Message } from "@/types/database.types";
import { archiveMessage, deleteMessage, markMessageRead } from "@/app/dashboard/messages/actions";

export function MessagesInbox({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [active, setActive] = useState<Message | null>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = messages.filter((m) => {
    if (unreadOnly && m.is_read) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject ?? "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });
  const unreadCount = messages.filter((m) => !m.is_read).length;

  function openMessage(message: Message) {
    setActive(message);
    if (!message.is_read) {
      startTransition(async () => {
        await markMessageRead(message.id, true);
        router.refresh();
      });
    }
  }

  function toggleArchive(message: Message) {
    startTransition(async () => {
      const result = await archiveMessage(message.id, !message.is_archived);
      if (result.success) {
        toast.success(message.is_archived ? "Moved to inbox" : "Archived");
        setActive(null);
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, message…"
            className="pl-8"
          />
        </div>
        {unreadCount > 0 ? (
          <Button
            type="button"
            size="sm"
            variant={unreadOnly ? "default" : "outline"}
            onClick={() => setUnreadOnly((v) => !v)}
          >
            <Mail className="size-3.5" />
            {unreadOnly ? "Showing unread" : `Unread (${unreadCount})`}
          </Button>
        ) : null}
      </div>

      <div className="glass flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl">
        {filtered.map((message) => (
          <button
            key={message.id}
            onClick={() => openMessage(message)}
            className={cn(
              "flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/20",
              !message.is_read && "bg-primary/5"
            )}
          >
            {message.is_read ? (
              <MailOpen className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Mail className="size-4 shrink-0 text-cerulean" />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm", !message.is_read && "font-semibold")}>
                  {message.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">{message.email}</span>
              </div>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {message.subject ? `${message.subject} — ` : ""}
                {message.message}
              </p>
            </div>
            {message.is_archived ? (
              <Badge variant="secondary" className="shrink-0">
                Archived
              </Badge>
            ) : null}
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </button>
        ))}
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground">
            {messages.length === 0
              ? "No messages here."
              : "No messages match your search."}
          </p>
        ) : null}
      </div>

      <Sheet open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent side="right" className="bg-card sm:max-w-lg">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">{active.subject || "Message"}</SheetTitle>
                <SheetDescription>
                  From {active.name} ({active.email}) ·{" "}
                  {formatDistanceToNow(new Date(active.created_at), { addSuffix: true })}
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <p className="text-pretty text-sm leading-relaxed whitespace-pre-wrap">
                  {active.message}
                </p>
              </div>
              <SheetFooter className="flex-row justify-between gap-2">
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${active.email}`}>Reply by email</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => toggleArchive(active)}
                  >
                    {active.is_archived ? (
                      <ArchiveRestore className="size-3.5" />
                    ) : (
                      <Archive className="size-3.5" />
                    )}
                    {active.is_archived ? "Unarchive" : "Archive"}
                  </Button>
                </div>
                <DeleteButton
                  itemLabel="message"
                  action={async () => {
                    const result = await deleteMessage(active.id);
                    if (result.success) {
                      setActive(null);
                      router.refresh();
                    }
                    return result;
                  }}
                />
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
