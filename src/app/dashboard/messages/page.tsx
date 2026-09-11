import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesInbox } from "@/components/dashboard/messages-inbox";
import { getAllMessages } from "@/lib/data/admin";

export default async function DashboardMessagesPage() {
  const messages = await getAllMessages();
  const inbox = messages.filter((m) => !m.is_archived);
  const archived = messages.filter((m) => m.is_archived);

  return (
    <Tabs defaultValue="inbox" className="flex flex-col gap-6">
      <TabsList>
        <TabsTrigger value="inbox">Inbox ({inbox.length})</TabsTrigger>
        <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <MessagesInbox messages={inbox} />
      </TabsContent>
      <TabsContent value="archived">
        <MessagesInbox messages={archived} />
      </TabsContent>
    </Tabs>
  );
}
