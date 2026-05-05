import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  EllipsisVertical,
  Flag,
  Image,
  Info,
  MapPin,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  PauseCircle,
  Copy
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Reports.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";
const maleAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";
const adminAvatar = maleAvatar;

const initialReports = [
  { id: "RPT-78234", type: "Inappropriate Photos", severity: "High", reportedBy: "Maya D.", userId: "12894", target: "Sharon K.", profileId: "9912", location: "Nairobi", received: "10 min ago", status: "Open", town: "Nairobi" },
  { id: "RPT-78233", type: "Fake Information", severity: "Medium", reportedBy: "Zuri Love", userId: "23411", target: "Lily M.", profileId: "8821", location: "Mombasa", received: "1 hour ago", status: "Open", town: "Mombasa" },
  { id: "RPT-78232", type: "Duplicate Ad", severity: "Low", reportedBy: "John K.", userId: "55212", target: "Carly B.", profileId: "7710", location: "Kisumu", received: "2 hours ago", status: "Open", town: "Kisumu" },
  { id: "RPT-78231", type: "Scam Risk", severity: "High", reportedBy: "Mary W.", userId: "99221", target: "Angel C.", profileId: "6608", location: "Nairobi", received: "3 hours ago", status: "Open", town: "Nairobi" },
  { id: "RPT-78230", type: "Underage Concern", severity: "Urgent", reportedBy: "Anonymous", userId: "N/A", target: "New Profile", profileId: "10543", location: "Eldoret", received: "4 hours ago", status: "Open", town: "Eldoret" },
  { id: "RPT-78229", type: "Inappropriate Photos", severity: "Medium", reportedBy: "Brian M.", userId: "33122", target: "Tasha T.", profileId: "5521", location: "Thika Superhighway", received: "5 hours ago", status: "Under Review", town: "Thika" },
  { id: "RPT-78228", type: "Fake Information", severity: "Low", reportedBy: "Achieng' P.", userId: "11903", target: "Bella V.", profileId: "4402", location: "Nakuru", received: "6 hours ago", status: "Resolved", town: "Nakuru" },
  { id: "RPT-78227", type: "Duplicate Ad", severity: "Low", reportedBy: "James O.", userId: "77421", target: "Mia L.", profileId: "3307", location: "Limuru Road", received: "7 hours ago", status: "Resolved", town: "Nairobi" }
];

const typeIcons = {
  "Inappropriate Photos": Image,
  "Fake Information": Info,
  "Duplicate Ad": Copy,
  "Scam Risk": AlertTriangle,
  "Underage Concern": User
};

function Topbar({ query, setQuery, onPost }) {
  return (
    <header className="reports-topbar">
      <div>
        <h1>Reports & Moderation</h1>
        <p>Review, manage and take action on user reports.</p>
      </div>
      <div className="reports-topbar-actions">
        <label className="reports-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="reports-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>3</span></button>
        <div className="reports-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="post-report-ad" type="button" onClick={onPost}><Plus size={21} />Post New Ad</button>
      </div>
    </header>
  );
}

function StatCard({ stat, active, onClick }) {
  const Icon = stat.icon;
  return (
    <button className={`reports-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`reports-stat-icon ${stat.tone}`}><Icon size={34} /></span>
      <div><h2>{stat.label}</h2><strong>{stat.value}</strong><p>{stat.note}</p></div>
      <em>{stat.delta}</em>
    </button>
  );
}

function SeverityBadge({ severity }) {
  return <span className={`severity-badge ${severity.toLowerCase()}`}>{severity}</span>;
}

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ severity: "All Severity", type: "All Types", town: "All Towns", status: "All Status" });

  const filteredReports = useMemo(() => {
    const term = query.toLowerCase();
    return reports.filter((report) => {
      const matchesSearch = !term || [report.type, report.reportedBy, report.target, report.location, report.id].join(" ").toLowerCase().includes(term);
      const matchesSeverity = filters.severity === "All Severity" || report.severity === filters.severity;
      const matchesType = filters.type === "All Types" || report.type === filters.type;
      const matchesTown = filters.town === "All Towns" || report.town === filters.town;
      const matchesStatus = filters.status === "All Status" || report.status === filters.status;
      return matchesSearch && matchesSeverity && matchesType && matchesTown && matchesStatus;
    });
  }, [reports, query, filters]);

  const stats = [
    { label: "Open Reports", value: String(reports.filter((report) => report.status === "Open").length || 124), note: "Needs attention", delta: "+ 18.2%", icon: Shield, tone: "red", filterKey: "status", filter: "Open" },
    { label: "Resolved Today", value: "38", note: "vs yesterday", delta: "+ 15.8%", icon: CheckCircle2, tone: "green", filterKey: "status", filter: "Resolved" },
    { label: "Urgent Cases", value: String(reports.filter((report) => report.severity === "Urgent").length || 16), note: "High priority", delta: "+ 23.5%", icon: AlertTriangle, tone: "orange", filterKey: "severity", filter: "Urgent" },
    { label: "Repeat Offenders", value: "23", note: "Flagged users", delta: "+ 9.1%", icon: Users, tone: "purple", filterKey: "status", filter: "All Status" }
  ];

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function updateStatus(id, status) {
    setReports((items) => items.map((report) => report.id === id ? { ...report, status } : report));
  }

  function addReport() {
    setReports((items) => [{
      id: `RPT-${78240 + items.length}`,
      type: "Fake Information",
      severity: "Medium",
      reportedBy: "New User",
      userId: "99901",
      target: "New Profile",
      profileId: "9910",
      location: "Nairobi",
      received: "Just now",
      status: "Open",
      town: "Nairobi"
    }, ...items]);
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Reports" />
      <div className="reports-main">
        <Topbar query={query} setQuery={setQuery} onPost={addReport} />
        <main className="reports-content">
          <section className="reports-stats">
            {stats.map((stat) => <StatCard stat={stat} active={filters[stat.filterKey] === stat.filter} onClick={() => setFilter(stat.filterKey, stat.filter)} key={stat.label} />)}
          </section>

          <section className="reports-filters">
            <label><span>Severity</span><select value={filters.severity} onChange={(event) => setFilter("severity", event.target.value)}>{["All Severity", "Low", "Medium", "High", "Urgent"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Report Type</span><select value={filters.type} onChange={(event) => setFilter("type", event.target.value)}>{["All Types", ...new Set(reports.map((report) => report.type))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Town</span><select value={filters.town} onChange={(event) => setFilter("town", event.target.value)}>{["All Towns", ...new Set(reports.map((report) => report.town))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Status</span><select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>{["All Status", "Open", "Under Review", "Resolved"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Date Range</span><button type="button">May 20 - May 27, 2025</button></label>
            <button type="button" onClick={() => setFilters({ severity: "All Severity", type: "All Types", town: "All Towns", status: "All Status" })}>Clear Filters</button>
            <button type="button"><Download size={16} />Export</button>
          </section>

          <section className="reports-layout">
            <section className="reports-table-card">
              <div className="reports-table-heading"><h2>Reports Queue</h2><span>{filteredReports.length || 124}</span></div>
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr><th>Report Type</th><th>Severity</th><th>Reported By</th><th>Target Profile</th><th>Location</th><th>Received</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => {
                      const Icon = typeIcons[report.type] || Flag;
                      return (
                        <tr key={report.id}>
                          <td><span className="report-type"><Icon size={20} /><strong>{report.type}</strong><small>#{report.id}</small></span></td>
                          <td><SeverityBadge severity={report.severity} /></td>
                          <td><span className="person-cell"><img src={report.reportedBy === "Anonymous" ? maleAvatar : avatar} alt="" /><span><strong>{report.reportedBy}</strong><small>User ID: {report.userId}</small></span></span></td>
                          <td><span className="person-cell"><img src={avatar} alt="" /><span><strong>{report.target}</strong><small>Profile ID: {report.profileId}</small></span></span></td>
                          <td><span className="location-cell"><MapPin size={16} />{report.location}</span></td>
                          <td>{report.received}</td>
                          <td><div className="report-actions"><button type="button" onClick={() => updateStatus(report.id, "Under Review")}>View</button><button type="button"><EllipsisVertical size={17} /></button></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="reports-pagination"><p>Showing 1 to {filteredReports.length} of 124 results</p><div><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><span>...</span><button type="button">16</button><button type="button"><ChevronRight size={17} /></button></div></div>
            </section>

            <aside className="reports-side">
              <section className="reports-card">
                <div className="reports-card-heading"><h2>Reports Over Time</h2><select defaultValue="Last 7 Days"><option>Last 7 Days</option></select></div>
                <svg className="reports-line-chart" viewBox="0 0 360 190"><polyline points="25,145 75,110 125,82 175,124 225,70 275,100 335,120" /><polygon points="25,145 75,110 125,82 175,124 225,70 275,100 335,120 335,170 25,170" /></svg>
              </section>
              <section className="reports-card">
                <h2>Reports by Category</h2>
                <div className="reports-category-wrap"><div className="reports-donut"><strong>124</strong><span>Total</span></div><div className="reports-category-list">{["Inappropriate Photos 42 (33.9%)", "Fake Information 28 (22.6%)", "Duplicate Ads 20 (16.1%)", "Scam Risk 16 (12.9%)", "Underage Concern 10 (8.1%)", "Other 8 (6.4%)"].map((item, index) => <p key={item}><i className={`cat-${index + 1}`} />{item}</p>)}</div></div>
                <a className="report-link" href="#reports-admin">View full report <ChevronRight size={15} /></a>
              </section>
            </aside>

            <aside className="moderator-card">
              <h2>Moderator Activity</h2>
              {[
                ["Maya D.", "Resolved report #RPT-78220", "Inappropriate Photos", "10 min ago", CheckCircle2, "green"],
                ["Admin User", "Marked report #RPT-78218", "as Under Review", "25 min ago", PauseCircle, "orange"],
                ["Zuri Love", "Removed profile", "ID: 7710 (Angel C.)", "45 min ago", Trash2, "red"],
                ["Peter K.", "Resolved report #RPT-78215", "Fake Information", "1 hour ago", CheckCircle2, "green"],
                ["Asha K.", "Escalated report #RPT-78212", "Underage Concern", "2 hours ago", Flag, "orange"]
              ].map(([name, action, detail, time, Icon, tone]) => (
                <article key={`${name}-${time}`}>
                  <span className={`activity-icon ${tone}`}><Icon size={18} /></span>
                  <img src={name === "Admin User" ? maleAvatar : avatar} alt="" />
                  <div><strong>{name}</strong><p>{action}<br />{detail}</p><small>{time}</small></div>
                </article>
              ))}
              <a href="#reports-admin">View full activity log <ChevronRight size={15} /></a>
            </aside>
          </section>
        </main>
        <footer className="reports-footer"><span>(c) 2025 Young Escorts Kenya. All rights reserved.</span><nav><a href="#reports-admin">Privacy Policy</a><a href="#reports-admin">Terms of Use</a><a href="#reports-admin">Support</a></nav></footer>
      </div>
    </div>
  );
}
