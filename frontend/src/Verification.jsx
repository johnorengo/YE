import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Shield,
  Smile,
  X,
  XCircle
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Verification.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&q=80";
const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialQueue = [
  { id: 1, alias: "Maya D.", town: "Nairobi", road: "Thika Superhighway", submitted: "Today, 10:12 AM", level: "Standard", risk: 18, status: "Pending", county: "Nairobi" },
  { id: 2, alias: "Zuri Love", town: "Mombasa", road: "Nyali Road", submitted: "Today, 09:47 AM", level: "Enhanced", risk: 32, status: "Pending", county: "Mombasa" },
  { id: 3, alias: "Aisha K.", town: "Kisumu", road: "Oginga Odinga Road", submitted: "Today, 09:21 AM", level: "Standard", risk: 22, status: "Pending", county: "Kisumu" },
  { id: 4, alias: "Sharon K.", town: "Nakuru", road: "Nakuru - Eldoret Road", submitted: "Today, 08:55 AM", level: "Enhanced", risk: 41, status: "Pending", county: "Nakuru" },
  { id: 5, alias: "Lynn W.", town: "Eldoret", road: "Eldoret - Kitale Road", submitted: "Today, 08:33 AM", level: "Standard", risk: 16, status: "Pending", county: "Uasin Gishu" },
  { id: 6, alias: "Carla", town: "Nairobi", road: "Limuru Road", submitted: "Today, 08:05 AM", level: "Enhanced", risk: 27, status: "Pending", county: "Nairobi" },
  { id: 7, alias: "Nala", town: "Mombasa", road: "Mombasa Road", submitted: "Today, 07:42 AM", level: "Standard", risk: 19, status: "Pending", county: "Mombasa" }
];

function Topbar({ query, setQuery }) {
  return (
    <header className="verification-topbar">
      <h1>Verification Queue</h1>
      <div className="verification-topbar-actions">
        <label className="verification-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="verification-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>6</span></button>
        <div className="verification-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
      </div>
    </header>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <article className="verification-stat">
      <span className={`verification-stat-icon ${stat.tone}`}><Icon size={34} /></span>
      <div><h2>{stat.label}</h2><strong>{stat.value}</strong><p>{stat.note}</p></div>
      <em className={stat.bad ? "bad" : "good"}>{stat.delta}</em>
    </article>
  );
}

function LevelBadge({ level }) {
  return <span className={`verification-level ${level.toLowerCase()}`}>{level}</span>;
}

function RiskDot({ risk }) {
  return <span className={`risk-dot ${risk >= 40 ? "high" : risk >= 30 ? "medium" : "low"}`}>{risk}<i /></span>;
}

export default function Verification() {
  const [queue, setQueue] = useState(initialQueue);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");

  const selected = queue.find((item) => item.id === selectedId) || queue[0];
  const filteredQueue = useMemo(() => {
    const term = query.toLowerCase();
    return queue.filter((item) => !term || [item.alias, item.town, item.road, item.level, item.status].join(" ").toLowerCase().includes(term));
  }, [queue, query]);

  const stats = [
    { label: "Pending Verifications", value: String(queue.filter((item) => item.status === "Pending").length || 247), note: "Requires review", delta: "+ 12.6%", icon: Clock3, tone: "orange", bad: true },
    { label: "Approved Today", value: "58", note: "vs yesterday", delta: "+ 18.3%", icon: CheckCircle2, tone: "green" },
    { label: "Rejected Today", value: "14", note: "vs yesterday", delta: "+ 7.1%", icon: XCircle, tone: "red", bad: true },
    { label: "High-Risk Cases", value: String(queue.filter((item) => item.risk >= 40).length || 22), note: "Needs attention", delta: "+ 22.5%", icon: Shield, tone: "yellow", bad: true }
  ];

  function updateStatus(id, status) {
    setQueue((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  }

  const documents = [
    ["Government ID", "Verified"],
    ["Selfie (Live Photo)", "Verified"],
    ["Additional Photo", "Verified"],
    ["Proof of Address", "Pending"],
    ["Payment Proof", "Verified"]
  ];

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Verification" />
      <div className="verification-main">
        <Topbar query={query} setQuery={setQuery} />
        <main className="verification-content">
          <section className="verification-stats">{stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</section>
          <section className="verification-layout">
            <div className="verification-left">
              <section className="verification-table-card">
                <div className="verification-table-heading">
                  <div><h2>Pending Profiles</h2><span>{filteredQueue.length || 247}</span></div>
                  <div><button type="button"><Filter size={16} />Filters <ChevronDown size={15} /></button><button type="button">Sort: Newest <ChevronDown size={15} /></button></div>
                </div>
                <div className="verification-table-wrap">
                  <table className="verification-table">
                    <thead>
                      <tr><th><input type="checkbox" /></th><th>Photo</th><th>Alias</th><th>Town</th><th>Road</th><th>Submitted</th><th>Verification Level</th><th>Risk Score</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredQueue.map((item) => (
                        <tr className={item.id === selectedId ? "selected" : ""} key={item.id} onClick={() => setSelectedId(item.id)}>
                          <td><input type="checkbox" onClick={(event) => event.stopPropagation()} /></td>
                          <td><img src={avatar} alt="" /></td>
                          <td><strong>{item.alias}</strong></td>
                          <td>{item.town}</td>
                          <td>{item.road}</td>
                          <td>{item.submitted}</td>
                          <td><LevelBadge level={item.level} /></td>
                          <td><RiskDot risk={item.risk} /></td>
                          <td>
                            <div className="verification-row-actions">
                              <button type="button" onClick={(event) => { event.stopPropagation(); updateStatus(item.id, "Approved"); }}><Check size={17} /></button>
                              <button type="button" onClick={(event) => { event.stopPropagation(); updateStatus(item.id, "Rejected"); }}><X size={17} /></button>
                              <button type="button" onClick={(event) => event.stopPropagation()}><MessageSquare size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="verification-pagination"><p>Showing 1 to {filteredQueue.length} of 247 results</p><div><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">36</button><button type="button"><ChevronRight size={17} /></button></div></div>
              </section>

              <section className="verification-bottom">
                <section className="trend-card">
                  <div className="bottom-heading"><h2>Verification Trend</h2><select defaultValue="Last 7 Days"><option>Last 7 Days</option><option>Last 30 Days</option></select></div>
                  <div className="chart-legend"><span className="approved">Approved</span><span className="rejected">Rejected</span><span className="risk">High-Risk</span></div>
                  <svg className="verification-chart" viewBox="0 0 560 150">
                    <polyline className="approved-line" points="30,88 105,78 180,88 255,92 330,84 405,80 500,86" />
                    <polyline className="rejected-line" points="30,120 105,112 180,113 255,123 330,113 405,119 500,116" />
                    <polyline className="risk-line" points="30,136 105,135 180,135 255,139 330,134 405,135 500,134" />
                  </svg>
                </section>
                <section className="actions-card">
                  <div className="bottom-heading"><h2>Recent Verification Actions</h2><a href="#verification-admin">View all</a></div>
                  {[
                    ["Admin User approved Zuri Love", "Mombasa - Nyali Road", "Approved"],
                    ["Sarah M. rejected Tomi K.", "Nairobi - Mombasa Road", "Rejected"],
                    ["Admin User requested more info from Aisha K.", "Kisumu - Oginga Odinga Road", "More Info"]
                  ].map(([title, subtitle, status]) => <article key={title}><img src={status === "More Info" ? adminAvatar : avatar} alt="" /><div><strong>{title}</strong><small>{subtitle}</small></div><time>Today, 09:15 AM</time><span className={status.toLowerCase().replace(" ", "-")}>{status}</span></article>)}
                </section>
              </section>
            </div>

            <aside className="verification-rail">
              <section className="selected-profile">
                <div className="selected-summary">
                  <img src={avatar} alt="" />
                  <div><h2>{selected.alias}</h2><p>{selected.town} - {selected.road}</p><small>Submitted: {selected.submitted}</small></div>
                  <span>{selected.level} Level</span>
                  <b>Risk Score<strong>{selected.risk}</strong><i /></b>
                </div>
                <div className="profile-tabs"><button className="active" type="button">Details</button><button type="button">History</button><button type="button">Notes</button></div>
              </section>

              <section className="verification-detail-card">
                <h2>Submitted Documents</h2>
                {documents.map(([name, status]) => <p key={name}><span>{name}</span><b className={status.toLowerCase()}>{status}</b><CheckCircle2 size={16} /></p>)}
              </section>

              <section className="verification-detail-card">
                <h2>Selfie Match</h2>
                <div className="selfie-row"><Smile size={28} /><span>Match Score</span><strong>92%</strong></div>
                <div className="match-bar"><span /></div>
              </section>

              <section className="verification-detail-card">
                <h2>Contact Verification</h2>
                <p><span><Phone size={15} />Phone Number</span><b>Verified</b><CheckCircle2 size={16} /></p>
                <p><span><Mail size={15} />Email Address</span><b>Verified</b><CheckCircle2 size={16} /></p>
                <p><span><MessageSquare size={15} />WhatsApp</span><b>Verified</b><CheckCircle2 size={16} /></p>
              </section>

              <section className="verification-detail-card">
                <h2>Moderator Notes</h2>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="Add notes about this verification..." />
                <small>{note.length} / 500 characters</small>
              </section>

              <div className="verification-final-actions">
                <button type="button" onClick={() => updateStatus(selected.id, "Approved")}><Check size={18} />Approve</button>
                <button type="button" onClick={() => updateStatus(selected.id, "Rejected")}><X size={18} />Reject</button>
                <button type="button"><MessageSquare size={18} />Request More Info</button>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
