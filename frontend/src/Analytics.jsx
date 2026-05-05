import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  LineChart,
  MousePointerClick,
  Search,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Analytics.css";

const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const townRows = [
  { town: "Nairobi", profiles: 5432, views: 58240, ads: 1248, revenue: 4286750, growth: 18.3 },
  { town: "Mombasa", profiles: 3128, views: 42108, ads: 752, revenue: 2871600, growth: 14.7 },
  { town: "Kisumu", profiles: 1842, views: 28792, ads: 421, revenue: 1254300, growth: 12.6 },
  { town: "Nakuru", profiles: 1256, views: 19650, ads: 312, revenue: 786900, growth: 10.5 },
  { town: "Eldoret", profiles: 892, views: 14218, ads: 201, revenue: 521800, growth: 9.1 }
];

const trafficSources = [
  ["Organic Search", 42, "#1264d8"],
  ["Direct Visits", 26, "#24a852"],
  ["Social Media", 18, "#ff9418"],
  ["Referrals", 9, "#7b4dd8"],
  ["Paid Ads", 5, "#ef3340"]
];

const roadPerformance = [
  ["Thika Superhighway", "2,145", "562", "Very High", "+ 16.8%"],
  ["Mombasa Road", "1,876", "497", "Very High", "+ 14.1%"],
  ["Waiyaki Way", "1,234", "312", "High", "+ 11.4%"],
  ["Ngong Road", "1,102", "287", "High", "+ 9.8%"]
];

function Topbar({ query, setQuery, onExport }) {
  return (
    <header className="analytics-topbar">
      <div>
        <h1>Analytics</h1>
        <p>Track platform growth, traffic, revenue, and profile performance.</p>
      </div>
      <div className="analytics-topbar-actions">
        <label className="analytics-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="analytics-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>6</span></button>
        <div className="analytics-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="analytics-export" type="button" onClick={onExport}><Download size={18} />Export</button>
      </div>
    </header>
  );
}

function StatCard({ label, value, note, trend, icon: Icon, tone, active, onClick }) {
  return (
    <button className={`analytics-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`analytics-stat-icon ${tone}`}><Icon size={32} /></span>
      <div>
        <h2>{label}</h2>
        <strong>{value}</strong>
        <p>{note}</p>
      </div>
      <em>{trend}</em>
    </button>
  );
}

function TrendChart({ mode }) {
  const points = mode === "Revenue"
    ? "24,170 70,138 116,122 162,112 208,98 254,86 300,66 346,54 392,40 438,25"
    : "24,150 70,128 116,112 162,118 208,88 254,74 300,82 346,54 392,46 438,28";

  return (
    <svg className="analytics-line-chart" viewBox="0 0 470 190" role="img" aria-label={`${mode} trend`}>
      {[30, 70, 110, 150].map((y) => <line x1="18" x2="455" y1={y} y2={y} key={y} />)}
      <polyline points={points} />
      {points.split(" ").map((point) => {
        const [cx, cy] = point.split(",");
        return <circle cx={cx} cy={cy} r="4" key={point} />;
      })}
    </svg>
  );
}

function Donut() {
  return (
    <div className="analytics-donut">
      <strong>182K</strong>
      <span>Visits</span>
    </div>
  );
}

export default function Analytics() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Last 30 Days");
  const [mode, setMode] = useState("Traffic");
  const [notice, setNotice] = useState("");

  const filteredTowns = useMemo(() => {
    const term = query.toLowerCase();
    return townRows.filter((row) => !term || Object.values(row).join(" ").toLowerCase().includes(term));
  }, [query]);

  const stats = [
    { label: "Total Visits", value: "182,450", note: period, trend: "+ 18.4%", icon: Eye, tone: "blue", mode: "Traffic" },
    { label: "Active Users", value: "24,892", note: "Currently engaged", trend: "+ 9.8%", icon: Users, tone: "green", mode: "Users" },
    { label: "Ad Clicks", value: "68,314", note: "Across active ads", trend: "+ 12.1%", icon: MousePointerClick, tone: "orange", mode: "Engagement" },
    { label: "Revenue", value: "KES 8.74M", note: "Gross platform revenue", trend: "+ 12.6%", icon: Wallet, tone: "red", mode: "Revenue" }
  ];

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Analytics" />
      <div className="analytics-main">
        <Topbar query={query} setQuery={setQuery} onExport={() => setNotice("Analytics report exported")} />
        <main className="analytics-content">
          {notice && <div className="analytics-toast">{notice}</div>}
          <section className="analytics-stats">
            {stats.map((stat) => <StatCard {...stat} active={mode === stat.mode} onClick={() => setMode(stat.mode)} key={stat.label} />)}
          </section>

          <section className="analytics-filters">
            <label><span>Date Range</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 7 Days</option><option>Last 30 Days</option><option>This Month</option><option>This Year</option></select></label>
            <label><span>Metric</span><select value={mode} onChange={(event) => setMode(event.target.value)}><option>Traffic</option><option>Users</option><option>Engagement</option><option>Revenue</option></select></label>
            <label><span>Town</span><select><option>All Towns</option><option>Nairobi</option><option>Mombasa</option><option>Kisumu</option></select></label>
            <button type="button" onClick={() => setNotice("Analytics filters applied")}><BarChart3 size={17} />Apply Filters</button>
          </section>

          <section className="analytics-grid">
            <section className="analytics-card analytics-chart-card">
              <div className="analytics-heading"><h2>{mode} Trend</h2><span>{period}</span></div>
              <TrendChart mode={mode} />
            </section>

            <section className="analytics-card">
              <div className="analytics-heading"><h2>Traffic Sources</h2><a href="#analytics-admin">View report <ChevronRight size={15} /></a></div>
              <div className="analytics-source-wrap">
                <Donut />
                <div className="analytics-source-list">
                  {trafficSources.map(([label, value, color]) => <p key={label}><i style={{ background: color }} />{label}<b>{value}%</b></p>)}
                </div>
              </div>
            </section>

            <section className="analytics-card analytics-road-card">
              <div className="analytics-heading"><h2>Road Performance</h2><a href="#roads-admin">View roads <ChevronRight size={15} /></a></div>
              {roadPerformance.map(([road, profiles, ads, level, growth]) => (
                <article key={road}>
                  <div><strong>{road}</strong><small>{profiles} profiles - {ads} ads</small></div>
                  <span className={level === "Very High" ? "very-high" : "high"}>{level}</span>
                  <em>{growth}</em>
                </article>
              ))}
            </section>

            <section className="analytics-card analytics-table-card">
              <div className="analytics-heading"><h2>Top Towns</h2><a href="#locations-admin">Manage locations <ChevronRight size={15} /></a></div>
              <table className="analytics-table">
                <thead><tr><th>Town</th><th>Profiles</th><th>Views</th><th>Active Ads</th><th>Revenue</th><th>Growth</th></tr></thead>
                <tbody>
                  {filteredTowns.map((row) => (
                    <tr key={row.town}>
                      <td>{row.town}</td>
                      <td>{row.profiles.toLocaleString()}</td>
                      <td>{row.views.toLocaleString()}</td>
                      <td>{row.ads.toLocaleString()}</td>
                      <td>KES {row.revenue.toLocaleString()}</td>
                      <td><span className="analytics-growth"><TrendingUp size={15} />{row.growth}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="analytics-pagination"><p>Showing 1 to {filteredTowns.length} of 48 towns</p><span><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button></span></div>
            </section>

            <section className="analytics-card analytics-insights">
              <h2>Platform Insights</h2>
              {[
                ["Profile conversion rate", "18.7%", "+ 3.2%"],
                ["Average session duration", "4m 26s", "+ 12.9%"],
                ["Repeat visitor rate", "36.4%", "+ 5.8%"],
                ["Report rate", "0.9%", "- 1.4%"]
              ].map(([label, value, trend]) => <p key={label}><span>{label}</span><strong>{value}</strong><em>{trend}</em></p>)}
              <a href="#analytics-admin">View full analytics report <ChevronRight size={15} /></a>
            </section>
          </section>
        </main>
        <footer className="analytics-footer"><span>(c) 2025 Young Escorts Kenya. All rights reserved.</span><nav><a href="#analytics-admin">Privacy Policy</a><a href="#analytics-admin">Terms of Use</a><a href="#analytics-admin">Support</a></nav></footer>
      </div>
    </div>
  );
}
