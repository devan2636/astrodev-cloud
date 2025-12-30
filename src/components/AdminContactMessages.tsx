interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface AdminContactMessagesProps {
  contactMessages: ContactMessage[];
  contactLoading: boolean;
  contactsRef?: React.RefObject<HTMLDivElement>;
}

export function AdminContactMessages({ contactMessages, contactLoading, contactsRef }: AdminContactMessagesProps) {
  return (
    <div ref={contactsRef} className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-accent-blue font-semibold">Contact messages</p>
          <h3 className="text-xl font-semibold">Latest inquiries</h3>
          <p className="text-sm text-muted-foreground">Form submissions from the public contact section.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="grid grid-cols-[1.6fr,1.6fr,2.4fr,1fr] bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
          <div>Name</div>
          <div>Email</div>
          <div>Message</div>
          <div className="text-right">Received</div>
        </div>
        <div className="divide-y divide-border/60 max-h-96 overflow-auto">
          {contactLoading && (
            <div className="px-3 py-3 text-sm text-muted-foreground">Loading messages…</div>
          )}
          {!contactLoading && contactMessages.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground">No messages yet.</div>
          )}
          {!contactLoading && contactMessages.map((m) => (
            <div key={m.id} className="grid grid-cols-[1.6fr,1.6fr,2.4fr,1fr] px-3 py-2 text-sm">
              <div className="font-medium text-foreground">{m.name}</div>
              <div className="text-blue-600 truncate">
                <a href={`mailto:${m.email}`} className="hover:underline">{m.email}</a>
              </div>
              <div className="text-muted-foreground line-clamp-2">{m.message}</div>
              <div className="text-right text-muted-foreground text-xs">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
