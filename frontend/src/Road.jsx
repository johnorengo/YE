import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Ellipsis,
  Filter,
  Plus,
  Search,
  Shield,
  TrendingUp
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Road.css";

const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialRoads = [
  { id: 1, name: "Thika Superhighway", code: "A2 Highway", towns: "Nairobi", type: "Highway", profiles: 2145, ads: 562, popularity: "Very High", status: "Active", traffic: "green" },
  { id: 2, name: "Mombasa Road", code: "A109 Highway", towns: "Nairobi, Mombasa", type: "Highway", profiles: 1876, ads: 497, popularity: "Very High", status: "Active", traffic: "green" },
  { id: 3, name: "Waiyaki Way", code: "C57 Road", towns: "Nairobi", type: "Major Road", profiles: 1234, ads: 312, popularity: "High", status: "Active", traffic: "green" },
  { id: 4, name: "Ngong Road", code: "C58 Road", towns: "Nairobi", type: "Major Road", profiles: 1102, ads: 287, popularity: "High", status: "Active", traffic: "green" },
  { id: 5, name: "Limuru Road", code: "D12 Road", towns: "Nairobi", type: "Major Road", profiles: 876, ads: 221, popularity: "Medium", status: "Active", traffic: "orange" },
  { id: 6, name: "Oginga Odinga Road", code: "C63 Road", towns: "Kisumu", type: "Major Road", profiles: 694, ads: 156, popularity: "Medium", status: "Active", traffic: "orange" },
  { id: 7, name: "Mombasa-Malindi Road", code: "B8 Highway", towns: "Mombasa, Kilifi", type: "Highway", profiles: 583, ads: 142, popularity: "Medium", status: "Under Review", traffic: "orange" },
  { id: 8, name: "Eldoret-Kisumu Road", code: "A1 Highway", towns: "Eldoret, Kisumu", type: "Highway", profiles: 512, ads: 128, popularity: "Medium", status: "Active", traffic: "orange" }
];

function Topbar({ query, setQuery }) {
  return (
    <header className="road-topbar">
      <h1>Road Directory</h1>
      <div className="road-topbar-actions">
        <label className="road-global-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roads, towns, types..." />
        </label>
        <button className="road-bell" type="button" aria-label="Notifications">
          <Bell size={24} />
          <span>3</span>
        </button>
        <div className="road-admin">
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

function StatCard({ stat, active, onClick }) {
  const Icon = stat.icon;
  return (
    <button className={`road-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`road-stat-icon ${stat.tone}`}>
        <Icon size={35} />
      </span>
      <div>
        <h2>{stat.label}</h2>
        <strong>{stat.value}</strong>
        <p>{stat.note}</p>
      </div>
      <em className={stat.bad ? "bad" : "good"}>{stat.delta}</em>
    </button>
  );
}

function TypeBadge({ type }) {
  return <span className={`road-type ${type.toLowerCase().replace(" ", "-")}`}>{type}</span>;
}

function PopularityBadge({ popularity }) {
  return <span className={`road-popularity ${popularity.toLowerCase().replace(" ", "-")}`}>{popularity}</span>;
}

function StatusBadge({ status }) {
  return <span className={`road-status ${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

function Sparkline({ tone }) {
  return (
    <svg className={`sparkline ${tone}`} viewBox="0 0 110 28" aria-hidden="true">
      <polyline points="2,22 12,15 22,17 32,11 42,14 52,9 62,13 72,7 82,16 92,12 108,3" />
      {[12, 32, 52, 72, 92, 108].map((x, index) => <circle cx={x} cy={[15, 11, 9, 7, 12, 3][index]} r="2" key={x} />)}
    </svg>
  );
}

export default function Road() {
  const [roads, setRoads] = useState(initialRoads);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ town: "All Towns", type: "All Road Types", popularity: "All Popularity", status: "All Status" });

  const filteredRoads = useMemo(() => {
    const term = query.toLowerCase();
    return roads.filter((road) => {
      const matchesSearch = !term || [road.name, road.code, road.towns, road.type, road.popularity].join(" ").toLowerCase().includes(term);
      const matchesTown = filters.town === "All Towns" || road.towns.includes(filters.town);
      const matchesType = filters.type === "All Road Types" || road.type === filters.type;
      const matchesPopularity = filters.popularity === "All Popularity" || road.popularity === filters.popularity;
      const matchesStatus = filters.status === "All Status" || road.status === filters.status;
      return matchesSearch && matchesTown && matchesType && matchesPopularity && matchesStatus;
    });
  }, [roads, query, filters]);

  const activeRoads = roads.filter((road) => road.status === "Active").length;
  const reviewRoads = roads.filter((road) => road.status === "Under Review").length;
  const highTraffic = roads.filter((road) => road.popularity === "Very High").length;
  const stats = [
    { label: "Total Roads", value: "412", note: "+32 this month", delta: "+ 8.5%", icon: Filter, tone: "blue", filter: "All Status" },
    { label: "Active Roads", value: String(activeRoads), note: "90.0% of total", delta: "+ 6.3%", icon: Filter, tone: "green", filter: "Active" },
    { label: "High-Traffic Roads", value: String(highTraffic), note: "18.9% of total", delta: "+ 11.2%", icon: TrendingUp, tone: "orange", filter: "Very High" },
    { label: "Roads Needing Review", value: String(reviewRoads || 41), note: "Requires attention", delta: "+ 5.1%", icon: Shield, tone: "red", filter: "Under Review", bad: true }
  ];

  const topRoads = [...roads].sort((a, b) => b.profiles - a.profiles).slice(0, 5);
  const towns = ["All Towns", ...new Set(roads.flatMap((road) => road.towns.split(", ")))];

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleStatClick(stat) {
    if (stat.label === "High-Traffic Roads") {
      setFilter("popularity", stat.filter);
      return;
    }
    setFilter("status", stat.filter);
  }

  function addRoad() {
    const nextId = Math.max(...roads.map((road) => road.id)) + 1;
    setRoads((items) => [{
      id: nextId,
      name: `New Road ${nextId}`,
      code: "Draft Road",
      towns: "Nairobi",
      type: "Major Road",
      profiles: 0,
      ads: 0,
      popularity: "Medium",
      status: "Under Review",
      traffic: "orange"
    }, ...items]);
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Roads" />
      <div className="road-main">
        <Topbar query={query} setQuery={setQuery} />
        <main className="road-content">
          <section className="road-grid">
            <div className="road-left">
              <section className="road-stats">
                {stats.map((stat) => (
                  <StatCard
                    stat={stat}
                    active={filters.status === stat.filter || filters.popularity === stat.filter}
                    onClick={() => handleStatClick(stat)}
                    key={stat.label}
                  />
                ))}
              </section>

              <section className="road-filters">
                <label className="road-search-box">
                  <Search size={20} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roads..." />
                </label>
                <select value={filters.town} onChange={(event) => setFilter("town", event.target.value)}>
                  {towns.map((town) => <option key={town}>{town}</option>)}
                </select>
                <select value={filters.type} onChange={(event) => setFilter("type", event.target.value)}>
                  {["All Road Types", "Highway", "Major Road"].map((type) => <option key={type}>{type}</option>)}
                </select>
                <select value={filters.popularity} onChange={(event) => setFilter("popularity", event.target.value)}>
                  {["All Popularity", "Very High", "High", "Medium"].map((popularity) => <option key={popularity}>{popularity}</option>)}
                </select>
                <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
                  {["All Status", "Active", "Under Review"].map((status) => <option key={status}>{status}</option>)}
                </select>
                <button type="button"><Filter size={17} />Filters</button>
              </section>

              <section className="road-table-card">
                <div className="road-table-heading">
                  <h2>Road Directory <span>({filteredRoads.length})</span></h2>
                  <div>
                    <button type="button"><Download size={17} />Export <ChevronDown size={15} /></button>
                    <button className="road-add-button" type="button" onClick={addRoad}><Plus size={18} />Add Road</button>
                  </div>
                </div>
                <div className="road-table-wrap">
                  <table className="road-table">
                    <thead>
                      <tr>
                        <th>Road Name</th>
                        <th>Connected Town</th>
                        <th>Road Type</th>
                        <th>Profiles</th>
                        <th>Ads</th>
                        <th>Popularity</th>
                        <th>Trend (30 Days)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoads.slice(0, 8).map((road) => (
                        <tr key={road.id}>
                          <td><strong>{road.name}</strong><small>{road.code}</small></td>
                          <td>{road.towns}</td>
                          <td><TypeBadge type={road.type} /></td>
                          <td>{road.profiles.toLocaleString()}</td>
                          <td>{road.ads.toLocaleString()}</td>
                          <td><PopularityBadge popularity={road.popularity} /></td>
                          <td><Sparkline tone={road.traffic} /></td>
                          <td><StatusBadge status={road.status} /></td>
                          <td>
                            <div className="road-actions">
                              <button type="button"><Edit3 size={16} /></button>
                              <button type="button"><Ellipsis size={17} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="road-pagination">
                  <p>Showing 1 to {Math.min(8, filteredRoads.length)} of 412 roads</p>
                  <div>
                    <button type="button"><ChevronLeft size={17} /></button>
                    <button className="active" type="button">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <span>...</span>
                    <button type="button">52</button>
                    <button type="button"><ChevronRight size={17} /></button>
                  </div>
                </div>
              </section>
            </div>

            <aside className="road-rail">
              <section className="road-rail-card">
                <div className="road-rail-heading">
                  <h2>Top Roads</h2>
                  <a href="#roads-admin">View all <ChevronRight size={15} /></a>
                </div>
                <div className="top-road-list">
                  {topRoads.map((road, index) => (
                    <article key={road.id}>
                      <b>{index + 1}</b>
                      <span><strong>{road.name}</strong><small>{road.profiles.toLocaleString()} profiles</small></span>
                      <PopularityBadge popularity={road.popularity} />
                    </article>
                  ))}
                </div>
              </section>

              <section className="road-rail-card">
                <div className="road-rail-heading">
                  <h2>Road Map Preview</h2>
                  <a href="#roads-admin">View full map <ChevronRight size={15} /></a>
                </div>
                <div className="road-map-preview">
                  <span className="route route-one" />
                  <span className="route route-two" />
                  <span className="route route-three" />
                  <b className="node node-a" />
                  <b className="node node-b" />
                  <b className="node node-c" />
                  <strong className="map-label-nairobi">Nairobi</strong>
                  <strong className="map-label-thika">Thika</strong>
                  <em>A2</em>
                  <em className="map-code-a1">A1</em>
                  <em className="map-code-c58">C58</em>
                </div>
              </section>

              <section className="road-rail-card">
                <div className="road-rail-heading">
                  <h2>Road Performance Insights</h2>
                  <select defaultValue="Last 30 Days">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
                <div className="insights-list">
                  {[
                    ["Total Profile Views", "85,342", "+ 12.6%"],
                    ["Total Ad Impressions", "134,921", "+ 9.3%"],
                    ["Avg. Profiles per Road", "207", "+ 6.8%"],
                    ["Avg. Ads per Road", "55", "+ 4.1%"]
                  ].map(([label, value, growth]) => (
                    <p key={label}><span>{label}</span><strong>{value}</strong><em>{growth}</em></p>
                  ))}
                </div>
                <a className="road-report-link" href="#roads-admin">View full report <ChevronRight size={15} /></a>
              </section>
            </aside>
          </section>
        </main>
        <footer className="road-footer">
          <span>(c) 2025 Young Escorts Kenya. All rights reserved.</span>
          <nav>
            <a href="#roads-admin">Privacy Policy</a>
            <a href="#roads-admin">Terms of Use</a>
            <a href="#roads-admin">Support</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
