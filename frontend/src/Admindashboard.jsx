import { useMemo, useState } from "react";
import {
  AtSign,
  Bell,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  EllipsisVertical,
  ExternalLink,
  Filter,
  Mail,
  MessageCircle,
  Paperclip,
  Send,
  Search,
  Star,
  Ticket,
  User,
  XCircle,
  Zap
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Admindashboard.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80";
const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialConversations = [
  {
    id: 1,
    name: "Grace Mwangi",
    message: "Hi, I need help updating my location...",
    time: "10:24 AM",
    unread: 2,
    category: "General Support",
    online: true,
    assigned: false,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Nairobi, Westlands",
    phone: "0712 345 678",
    email: "grace.mwangi@email.com",
    ticketTitle: "Location update request",
    messages: [
      { from: "user", text: "Hi Admin,\nI need help updating my location. I have moved to Westlands area and want to update it on my profile.\n\nThank you.", time: "10:22 AM" },
      { from: "admin", text: "Hello Grace,\nSure, I can help you with that. Please confirm the exact suburb or area you want to set as your new location.", time: "10:24 AM" },
      { from: "user", text: "Westlands, near Sarit Centre.", time: "10:25 AM" },
      { from: "admin", text: "Thank you. I've updated your location to \"Westlands\". It should reflect on your profile shortly.", time: "10:26 AM" },
      { from: "user", text: "Perfect! It's updated. Thank you so much.", time: "10:27 AM" },
      { from: "admin", text: "You're welcome! Let me know if you need anything else.", time: "10:28 AM" }
    ]
  },
  {
    id: 2,
    name: "Mercy Akinyi",
    message: "My ad is not showing up in search...",
    time: "9:58 AM",
    unread: 1,
    category: "Reports & Abuse",
    online: false,
    assigned: false,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Kisumu, Milimani",
    phone: "0701 220 441",
    email: "mercy.akinyi@email.com",
    ticketTitle: "Profile not visible in search",
    messages: [
      { from: "user", text: "My ad is not showing up in search. Can you check it?", time: "9:58 AM" },
      { from: "admin", text: "I can help. I am checking the visibility settings now.", time: "10:02 AM" }
    ]
  },
  {
    id: 3,
    name: "Wanjiku Kimani",
    message: "How do I verify my account?",
    time: "9:30 AM",
    unread: 0,
    category: "Verification",
    online: false,
    assigned: true,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Nakuru, Lanet",
    phone: "0799 302 144",
    email: "wanjiku.kimani@email.com",
    ticketTitle: "Verification request",
    messages: [{ from: "user", text: "How do I verify my account?", time: "9:30 AM" }]
  },
  {
    id: 4,
    name: "Lilian Wairimu",
    message: "Payment for promotion failed...",
    time: "Yesterday",
    unread: 0,
    category: "Billing & Payments",
    online: false,
    assigned: true,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Mombasa, Nyali",
    phone: "0724 888 019",
    email: "lilian.wairimu@email.com",
    ticketTitle: "Payment failure",
    messages: [{ from: "user", text: "Payment for promotion failed but money was deducted.", time: "Yesterday" }]
  },
  {
    id: 5,
    name: "Aisha Njeri",
    message: "Can you remove my ad? It's no longer...",
    time: "Yesterday",
    unread: 0,
    category: "General Support",
    online: false,
    assigned: false,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Nairobi, Kilimani",
    phone: "0718 532 600",
    email: "aisha.njeri@email.com",
    ticketTitle: "Ad removal request",
    messages: [{ from: "user", text: "Can you remove my ad? It's no longer needed.", time: "Yesterday" }]
  },
  {
    id: 6,
    name: "Betty Maina",
    message: "I was reported by mistake.",
    time: "Yesterday",
    unread: 3,
    category: "Reports & Abuse",
    online: false,
    assigned: false,
    starred: true,
    resolved: false,
    blocked: false,
    location: "Eldoret, Elgon View",
    phone: "0741 903 287",
    email: "betty.maina@email.com",
    ticketTitle: "Report appeal",
    messages: [{ from: "user", text: "I was reported by mistake. Please review my profile.", time: "Yesterday" }]
  },
  {
    id: 7,
    name: "Sharon Otieno",
    message: "General inquiry about subscriptions.",
    time: "May 28",
    unread: 0,
    category: "Other",
    online: false,
    assigned: true,
    starred: false,
    resolved: false,
    blocked: false,
    location: "Kisii, Town Centre",
    phone: "0703 115 220",
    email: "sharon.otieno@email.com",
    ticketTitle: "Subscription question",
    messages: [{ from: "user", text: "I have a general inquiry about subscriptions.", time: "May 28" }]
  },
  {
    id: 8,
    name: "Caroline Nduta",
    message: "Thanks for the quick support!",
    time: "May 27",
    unread: 0,
    category: "Archived",
    online: false,
    assigned: true,
    starred: false,
    resolved: true,
    blocked: false,
    location: "Thika, Makongeni",
    phone: "0710 567 902",
    email: "caroline.nduta@email.com",
    ticketTitle: "Resolved support chat",
    messages: [{ from: "user", text: "Thanks for the quick support!", time: "May 27" }]
  }
];

const savedReplies = [
  ["Location Update", "I've updated your location as requested. It should reflect shortly."],
  ["Ad Visibility Help", "Your ad may need verification or may not meet our visibility rules. I can review it now."],
  ["Payment Issues", "Please check your payment details and try again. If money was deducted, share the receipt code."],
  ["General Thanks", "You're welcome! Let us know if you need anything else."]
];

function getTime() {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function Topbar({ query, setQuery, notificationCount }) {
  return (
    <header className="admin-topbar">
      <h1>Messages & Support</h1>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={22} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search profiles, towns, roads, ads..."
          />
        </label>
        <button className="icon-button notification" type="button" aria-label="Notifications">
          <Bell size={23} />
          {notificationCount > 0 && <span>{notificationCount}</span>}
        </button>
        <div className="admin-user">
          <img src={adminAvatar} alt="" />
          <span>
            <strong>Admin User</strong>
            <small>Super Administrator</small>
          </span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
      </div>
    </header>
  );
}

function MetricCard({ metric, active, onClick }) {
  const Icon = metric.icon;
  return (
    <button className={`metric-card ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`metric-icon ${metric.tone}`}>
        <Icon size={34} />
      </span>
      <div>
        <h2>{metric.label}</h2>
        <strong>{metric.value}</strong>
        <p>{metric.note}</p>
      </div>
      <em className={metric.tone === "green" || metric.tone === "purple" ? "good" : "urgent"}>{metric.delta}</em>
    </button>
  );
}

function ConversationsPanel({
  conversations,
  selectedId,
  setSelectedId,
  messageQuery,
  setMessageQuery,
  view,
  setView
}) {
  const unreadCount = conversations.reduce((total, item) => total + item.unread, 0);
  const unassignedCount = conversations.filter((item) => !item.assigned && !item.resolved).length;
  const starredCount = conversations.filter((item) => item.starred).length;
  const folderCounts = conversations.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});

  const inboxItems = [
    { label: "All Messages", count: unreadCount, icon: Mail, view: "all" },
    { label: "Unassigned", count: unassignedCount, icon: Bell, view: "unassigned" },
    { label: "Mentions", count: 1, icon: AtSign, view: "mentions" },
    { label: "Starred", count: starredCount, icon: Star, view: "starred" }
  ];

  const folders = ["General Support", "Billing & Payments", "Verification", "Reports & Abuse", "Other", "Archived"];

  return (
    <section className="conversations-card">
      <aside className="message-filters">
        <div className="panel-title">
          <h2>Conversations</h2>
          <Filter size={17} />
        </div>
        <label className="conversation-search">
          <Search size={17} />
          <input
            value={messageQuery}
            onChange={(event) => setMessageQuery(event.target.value)}
            placeholder="Search conversations..."
          />
        </label>
        <h3>Inbox</h3>
        {inboxItems.map(({ label, count, icon: Icon, view: itemView }) => (
          <button className={view === itemView ? "active" : ""} type="button" onClick={() => setView(itemView)} key={label}>
            <Icon size={17} />
            {label}
            {count !== undefined && <span>{count}</span>}
          </button>
        ))}
        <div className="folder-heading">
          <h3>Folders</h3>
          <b>+</b>
        </div>
        {folders.map((label) => (
          <button
            className={label === "Archived" ? "separated" : ""}
            type="button"
            onClick={() => setView(label)}
            key={label}
          >
            <Bookmark size={17} />
            {label}
            <span>{folderCounts[label] || 0}</span>
          </button>
        ))}
      </aside>

      <section className="conversation-list">
        <div className="conversation-toolbar">
          <button type="button" onClick={() => setView("all")}>All Messages <ChevronDown size={15} /></button>
          <button type="button">Sort: Newest <ChevronDown size={15} /></button>
        </div>
        {conversations.map((item) => (
          <button
            className={`conversation-item ${item.id === selectedId ? "active" : ""}`}
            type="button"
            onClick={() => setSelectedId(item.id)}
            key={item.id}
          >
            <img src={avatar} alt="" />
            <div>
              <strong>{item.name}</strong>
              <p>{item.message}</p>
            </div>
            <time>{item.time}</time>
            {item.unread > 0 && <b>{item.unread}</b>}
            {item.resolved && <CheckCircle2 className="resolved-mark" size={17} />}
          </button>
        ))}
        <div className="conversation-pagination">
          <p>Showing {conversations.length ? 1 : 0} to {conversations.length} of {conversations.length} conversations</p>
          <span>
            <button className="active" type="button">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <ChevronRight size={16} />
          </span>
        </div>
      </section>
    </section>
  );
}

function ChatPanel({ conversation, draft, setDraft, onSend, onToggleStar, onAssign }) {
  return (
    <section className="chat-card">
      <header className="chat-header">
        <img src={avatar} alt="" />
        <div>
          <h2>{conversation.name} {conversation.online && <span>Online</span>}</h2>
          <p>{conversation.location} - Member since Jan 2025 - ID: YEK-58214</p>
        </div>
        <div className="chat-actions">
          <button className={conversation.starred ? "active" : ""} type="button" onClick={onToggleStar} aria-label="Star conversation">
            <Star size={21} />
          </button>
          <button className={conversation.assigned ? "active" : ""} type="button" onClick={onAssign} aria-label="Assign agent">
            <User size={21} />
          </button>
          <button type="button" aria-label="More chat actions">
            <EllipsisVertical size={21} />
          </button>
        </div>
      </header>
      <div className="day-divider"><span>Today</span></div>
      <div className="chat-thread">
        {conversation.messages.map((message, index) => (
          <div className={`message-row ${message.from === "admin" ? "outgoing" : "incoming"} ${message.text.length < 45 ? "compact" : ""}`} key={`${message.time}-${index}`}>
            {message.from !== "admin" && <img src={avatar} alt="" />}
            <p>
              {message.text.split("\n").map((line, lineIndex) => (
                <span key={`${line}-${lineIndex}`}>
                  {line}
                  {lineIndex < message.text.split("\n").length - 1 && <br />}
                </span>
              ))}
              <time>{message.time}</time>
            </p>
          </div>
        ))}
      </div>
      <footer className="composer">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend();
          }}
          placeholder="Type your message..."
        />
        <div className="composer-tools">
          <span>
            <MessageCircle size={18} />
            <Paperclip size={18} />
            <Bookmark size={18} />
            <Zap size={18} />
          </span>
          <button type="button" onClick={onSend}>
            <Send size={18} />
            Send
            <ChevronDown size={16} />
          </button>
        </div>
      </footer>
    </section>
  );
}

function RightRail({ conversation, tickets, savedReplies, onReply, onAction }) {
  return (
    <aside className="support-rail">
      <section className="rail-card user-info">
        <h2>User Information</h2>
        <div className="profile-summary">
          <img src={avatar} alt="" />
          <div>
            <strong>{conversation.name} {conversation.online && <span>Online</span>}</strong>
            <p>ID: YEK-58214<br />{conversation.location}<br />Member since Jan 18, 2025</p>
            <small>{conversation.email}<br />{conversation.phone}</small>
          </div>
        </div>
        <button type="button" onClick={() => onAction("profile")}>View Full Profile <ExternalLink size={15} /></button>
      </section>

      <section className="rail-card">
        <div className="rail-heading">
          <h2>Recent Support Tickets</h2>
          <a href="#messages-admin">View all <ChevronRight size={14} /></a>
        </div>
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <button type="button" onClick={() => onAction("ticket", ticket)} key={ticket.id}>
              <div>
                <strong>{ticket.title}</strong>
                <p>{ticket.id} - {ticket.date}</p>
              </div>
              <span className={ticket.status.toLowerCase()}>{ticket.status}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rail-card">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button type="button" onClick={() => onAction("note")}><Bookmark size={18} />Add Note</button>
          <button type="button" onClick={() => onAction("assign")}><User size={18} />Assign Agent</button>
          <button type="button" onClick={() => onAction("resolve")}><Check size={18} />Mark as Resolved</button>
          <button type="button" onClick={() => onAction("block")}><XCircle size={18} />Block User</button>
        </div>
      </section>

      <section className="rail-card">
        <div className="rail-heading">
          <h2>Saved Replies</h2>
          <a href="#messages-admin">Manage</a>
        </div>
        <div className="reply-list">
          {savedReplies.map(([title, text]) => (
            <button type="button" onClick={() => onReply(text)} key={title}>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function AdminDashboard({ activeItem = "Dashboard" }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(1);
  const [globalQuery, setGlobalQuery] = useState("");
  const [messageQuery, setMessageQuery] = useState("");
  const [view, setView] = useState("all");
  const [draft, setDraft] = useState("");

  const selected = conversations.find((item) => item.id === selectedId) || conversations[0];
  const unreadCount = conversations.reduce((total, item) => total + item.unread, 0);
  const openTickets = conversations.filter((item) => !item.resolved && !item.blocked).length;
  const resolvedCount = conversations.filter((item) => item.resolved).length + 156;

  const metrics = [
    { key: "unread", label: "Unread Messages", value: String(unreadCount), note: "From users & support", delta: unreadCount ? "+ New" : "Clear", icon: MessageCircle, tone: "blue" },
    { key: "tickets", label: "Support Tickets", value: String(openTickets), note: "Requires attention", delta: "+ Open", icon: Ticket, tone: "orange" },
    { key: "response", label: "Avg. Response Time", value: "2h 24m", note: "This month", delta: "- 12.6%", icon: Clock3, tone: "green" },
    { key: "resolved", label: "Resolved Chats", value: String(resolvedCount), note: "This month", delta: "+ 18.4%", icon: CheckCircle2, tone: "purple" }
  ];

  const filteredConversations = useMemo(() => {
    const query = `${globalQuery} ${messageQuery}`.trim().toLowerCase();
    return conversations.filter((item) => {
      const matchesView =
        view === "all" ||
        view === "unread" && item.unread > 0 ||
        view === "tickets" && !item.resolved ||
        view === "resolved" && item.resolved ||
        view === "response" ||
        view === "unassigned" && !item.assigned && !item.resolved ||
        view === "starred" && item.starred ||
        view === "mentions" && item.message.toLowerCase().includes("admin") ||
        item.category === view;
      const matchesQuery = !query || [item.name, item.message, item.location, item.category, item.ticketTitle]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesView && matchesQuery;
    });
  }, [conversations, globalQuery, messageQuery, view]);

  const tickets = conversations.slice(0, 3).map((item, index) => ({
    id: `#TK-${4512 - index * 125}`,
    title: item.ticketTitle,
    date: index === 0 ? "Today" : index === 1 ? "May 20, 2025" : "May 10, 2025",
    status: item.resolved ? "Resolved" : item.blocked ? "Closed" : "Open",
    conversationId: item.id
  }));

  function updateSelected(updater) {
    setConversations((items) => items.map((item) => item.id === selected.id ? updater(item) : item));
  }

  function appendAdminMessage(text) {
    updateSelected((item) => ({
      ...item,
      message: text,
      time: "Now",
      unread: 0,
      messages: [...item.messages, { from: "admin", text, time: getTime() }]
    }));
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    appendAdminMessage(text);
    setDraft("");
  }

  function handleAction(action, ticket) {
    if (action === "ticket" && ticket) {
      setSelectedId(ticket.conversationId);
      return;
    }

    if (action === "profile") {
      appendAdminMessage(`Opened ${selected.name}'s profile for review.`);
      return;
    }

    if (action === "note") {
      appendAdminMessage(`Internal note added for ${selected.name}.`);
      return;
    }

    if (action === "assign") {
      updateSelected((item) => ({ ...item, assigned: true }));
      appendAdminMessage("This conversation has been assigned to Admin User.");
      return;
    }

    if (action === "resolve") {
      updateSelected((item) => ({ ...item, resolved: true, unread: 0 }));
      appendAdminMessage("Marked as resolved. The support ticket is now closed.");
      return;
    }

    if (action === "block") {
      updateSelected((item) => ({ ...item, blocked: true, unread: 0 }));
      appendAdminMessage("User has been blocked from sending new messages.");
    }
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem={activeItem} />
      <div className="admin-main">
        <Topbar query={globalQuery} setQuery={setGlobalQuery} notificationCount={Math.min(unreadCount, 9)} />
        <main className="support-content">
          <section className="metrics-grid" aria-label="Message statistics">
            {metrics.map((metric) => (
              <MetricCard
                metric={metric}
                active={view === metric.key}
                onClick={() => setView(metric.key)}
                key={metric.key}
              />
            ))}
          </section>
          <section className="support-grid">
            <ConversationsPanel
              conversations={filteredConversations}
              selectedId={selected.id}
              setSelectedId={setSelectedId}
              messageQuery={messageQuery}
              setMessageQuery={setMessageQuery}
              view={view}
              setView={setView}
            />
            <ChatPanel
              conversation={selected}
              draft={draft}
              setDraft={setDraft}
              onSend={handleSend}
              onToggleStar={() => updateSelected((item) => ({ ...item, starred: !item.starred }))}
              onAssign={() => handleAction("assign")}
            />
            <RightRail
              conversation={selected}
              tickets={tickets}
              savedReplies={savedReplies}
              onReply={setDraft}
              onAction={handleAction}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
