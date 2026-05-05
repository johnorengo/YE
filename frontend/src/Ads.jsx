import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  EllipsisVertical,
  Eye,
  Megaphone,
  Plus,
  Search,
  Send,
  Upload,
  AlertTriangle
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Add.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";
const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialAds = [
  { id: 1, title: "Professional & Discreet Companion in Nairobi", owner: "Lily W.", town: "Nairobi", road: "Thika Superhighway", plan: "Premium", publish: "May 27, 2025\n10:30 AM", expiry: "Jun 10, 2025\n10:30 AM", status: "Active", views: 2453, inquiries: 186 },
  { id: 2, title: "Elegant & Well-Spoken Company", owner: "Grace M.", town: "Mombasa", road: "Nyali Road", plan: "Standard", publish: "May 26, 2025\n09:15 AM", expiry: "Jun 9, 2025\n09:15 AM", status: "Active", views: 1892, inquiries: 134 },
  { id: 3, title: "Charming & Friendly Companion", owner: "Sarah K.", town: "Kisumu", road: "Oginga Odinga Road", plan: "Basic", publish: "May 23, 2025\n07:45 PM", expiry: "Jun 6, 2025\n07:45 PM", status: "Active", views: 1675, inquiries: 121 },
  { id: 4, title: "Sophisticated Companion for Outings", owner: "Amara T.", town: "Nairobi", road: "Limuru Road", plan: "Premium", publish: "May 20, 2025\n03:20 PM", expiry: "May 27, 2025\n03:20 PM", status: "Expired", views: 988, inquiries: 77 },
  { id: 5, title: "Weekend Companion Available", owner: "Zuri L.", town: "Eldoret", road: "Elgon Road", plan: "Standard", publish: "May 18, 2025\n11:10 AM", expiry: "May 25, 2025\n11:10 AM", status: "Scheduled", views: 842, inquiries: 52 }
];

function Topbar({ query, setQuery }) {
  return (
    <header className="ads-topbar">
      <h1>Ad Management</h1>
      <div className="ads-topbar-actions">
        <label className="ads-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="ads-bell" type="button" aria-label="Notifications"><Bell size={23} /><span>6</span></button>
        <div className="ads-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
      </div>
    </header>
  );
}

function StatCard({ stat, active, onClick }) {
  const Icon = stat.icon;
  return (
    <button className={`ads-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`ads-stat-icon ${stat.tone}`}><Icon size={34} /></span>
      <div><h2>{stat.label}</h2><strong>{stat.value}</strong><p>{stat.note}</p></div>
      <em className={stat.bad ? "bad" : "good"}>{stat.delta}</em>
    </button>
  );
}

function StatusBadge({ status }) {
  return <span className={`ad-status ${status.toLowerCase()}`}>{status}</span>;
}

function PlanBadge({ plan }) {
  return <span className={`ad-plan ${plan.toLowerCase()}`}>{plan}</span>;
}

export default function Ads() {
  const [ads, setAds] = useState(initialAds);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ town: "All Towns", road: "All Roads", type: "All Types", status: "All Statuses" });

  const filteredAds = useMemo(() => {
    const term = query.toLowerCase();
    return ads.filter((ad) => {
      const matchesSearch = !term || [ad.title, ad.owner, ad.town, ad.road, ad.plan, ad.status].join(" ").toLowerCase().includes(term);
      const matchesTown = filters.town === "All Towns" || ad.town === filters.town;
      const matchesRoad = filters.road === "All Roads" || ad.road === filters.road;
      const matchesType = filters.type === "All Types" || ad.plan === filters.type;
      const matchesStatus = filters.status === "All Statuses" || ad.status === filters.status;
      return matchesSearch && matchesTown && matchesRoad && matchesType && matchesStatus;
    });
  }, [ads, query, filters]);

  const counts = {
    Active: ads.filter((ad) => ad.status === "Active").length,
    Scheduled: ads.filter((ad) => ad.status === "Scheduled").length,
    Expired: ads.filter((ad) => ad.status === "Expired").length,
    Reported: ads.filter((ad) => ad.status === "Reported").length
  };

  const stats = [
    { label: "Active Ads", value: "3,896", note: "Currently live", delta: "+ 5.7%", icon: Megaphone, tone: "green", filter: "Active" },
    { label: "Scheduled Ads", value: "218", note: "Awaiting publication", delta: "+ 8.2%", icon: CalendarDays, tone: "blue", filter: "Scheduled" },
    { label: "Expired Ads", value: "146", note: "Past expiry date", delta: "- 12.4%", icon: Clock3, tone: "orange", filter: "Expired", bad: true },
    { label: "Reported Ads", value: String(counts.Reported || 27), note: "Require attention", delta: "+ 18.2%", icon: AlertTriangle, tone: "red", filter: "Reported", bad: true }
  ];

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function addAd() {
    const nextId = Math.max(...ads.map((ad) => ad.id)) + 1;
    setAds((items) => [{
      id: nextId,
      title: `New Ad Draft ${nextId}`,
      owner: "Admin User",
      town: "Nairobi",
      road: "Thika Superhighway",
      plan: "Basic",
      publish: "Today\nDraft",
      expiry: "Not set\nDraft",
      status: "Scheduled",
      views: 0,
      inquiries: 0
    }, ...items]);
  }

  function updateAdStatus(id, status) {
    setAds((items) => items.map((ad) => ad.id === id ? { ...ad, status } : ad));
  }

  const approvals = ads.filter((ad) => ad.status === "Scheduled").slice(0, 3);
  const topAds = [...ads].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Ads" />
      <div className="ads-main">
        <Topbar query={query} setQuery={setQuery} />
        <main className="ads-content">
          <section className="ads-stats">
            {stats.map((stat) => <StatCard stat={stat} active={filters.status === stat.filter} onClick={() => setFilter("status", stat.filter)} key={stat.label} />)}
          </section>

          <section className="ads-filters">
            <label><span>Town</span><select value={filters.town} onChange={(event) => setFilter("town", event.target.value)}>{["All Towns", ...new Set(ads.map((ad) => ad.town))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Road</span><select value={filters.road} onChange={(event) => setFilter("road", event.target.value)}>{["All Roads", ...new Set(ads.map((ad) => ad.road))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Ad Type</span><select value={filters.type} onChange={(event) => setFilter("type", event.target.value)}>{["All Types", "Premium", "Standard", "Basic"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Status</span><select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>{["All Statuses", "Active", "Scheduled", "Expired", "Reported"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="date-field"><span>Date Range</span><button type="button"><CalendarDays size={16} />May 1, 2025 - May 31, 2025</button></label>
            <button className="clear-button" type="button" onClick={() => setFilters({ town: "All Towns", road: "All Roads", type: "All Types", status: "All Statuses" })}>Clear Filters</button>
            <button className="search-button" type="button"><Search size={17} />Search</button>
          </section>

          <section className="ads-table-card">
            <div className="ads-heading">
              <div><h2>All Ads</h2><span>4,287 results</span></div>
              <div><button type="button"><Upload size={16} />Export</button><button className="post-ad-button" type="button" onClick={addAd}><Plus size={18} />Post New Ad</button></div>
            </div>
            <div className="ads-table-wrap">
              <table className="ads-table">
                <thead>
                  <tr><th>Ad Preview</th><th>Ad Title</th><th>Owner / Alias</th><th>Town</th><th>Road</th><th>Plan</th><th>Publish Date</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredAds.slice(0, 5).map((ad) => (
                    <tr key={ad.id}>
                      <td><img className="ad-preview" src={avatar} alt="" /></td>
                      <td className="ad-title-cell">{ad.title}</td>
                      <td><span className="ad-owner">{ad.owner}<Check size={14} /></span></td>
                      <td>{ad.town}</td>
                      <td>{ad.road}</td>
                      <td><PlanBadge plan={ad.plan} /></td>
                      <td>{ad.publish.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                      <td>{ad.expiry.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                      <td><StatusBadge status={ad.status} /></td>
                      <td><div className="ad-row-actions"><button type="button"><Eye size={15} />View</button><button type="button"><EllipsisVertical size={17} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ads-pagination"><p>Showing 1 to {Math.min(5, filteredAds.length)} of 4,287 results</p><div><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><span>...</span><button type="button">858</button><button type="button"><ChevronRight size={17} /></button></div></div>
          </section>

          <section className="ads-bottom-grid">
            <section className="ads-panel">
              <div className="panel-heading"><h2>Ad Approval Queue</h2><span>{approvals.length} pending</span></div>
              {approvals.map((ad) => <article className="approval-item" key={ad.id}><img src={avatar} alt="" /><div><strong>{ad.owner}</strong><small>{ad.town} - {ad.road}</small></div><button type="button" onClick={() => updateAdStatus(ad.id, "Active")}>Approve</button><button type="button" onClick={() => updateAdStatus(ad.id, "Expired")}>Reject</button></article>)}
            </section>
            <section className="ads-panel">
              <div className="panel-heading"><h2>Recently Boosted Ads</h2><a href="#ads-admin">View all <ChevronRight size={15} /></a></div>
              {ads.slice(0, 3).map((ad) => <article className="boosted-item" key={ad.id}><img src={avatar} alt="" /><div><strong>{ad.title}</strong><small>{ad.town} - {ad.road}</small></div><em>Boosted</em><p>May 27, 2025<br />by Admin User</p></article>)}
            </section>
            <section className="ads-panel">
              <div className="panel-heading"><h2>Top Performing Ads</h2><a href="#ads-admin">View all <ChevronRight size={15} /></a></div>
              {topAds.map((ad, index) => <article className="top-ad-item" key={ad.id}><b>{index + 1}</b><img src={avatar} alt="" /><div><strong>{ad.title}</strong><small>{ad.town} - {ad.road}</small></div><p>Views<strong>{ad.views.toLocaleString()}</strong></p><p>Inquiries<strong>{ad.inquiries}</strong></p></article>)}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
