import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Edit3,
  Ellipsis,
  Eye,
  Flower2,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  Star,
  Users
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import { counties } from "./data/kenyaDirectory.js";
import "./location.css";

const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";
const townImage = "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=80&q=80";

const initialTowns = [
  { id: 1, name: "Nairobi", county: "Nairobi City", profiles: 5432, activeAds: 1248, featured: true, status: "Active", coverage: "Excellent", region: "Nairobi Region", growth: 18.3, addedOn: "May 10, 2025" },
  { id: 2, name: "Mombasa", county: "Mombasa", profiles: 3128, activeAds: 752, featured: true, status: "Active", coverage: "Excellent", region: "Coastal Region", growth: 14.7, addedOn: "May 12, 2025" },
  { id: 3, name: "Kisumu", county: "Kisumu", profiles: 1842, activeAds: 421, featured: false, status: "Active", coverage: "Good", region: "Western Region", growth: 12.6, addedOn: "May 15, 2025" },
  { id: 4, name: "Nakuru", county: "Nakuru", profiles: 1256, activeAds: 312, featured: false, status: "Active", coverage: "Good", region: "Rift Valley Region", growth: 10.5, addedOn: "May 18, 2025" },
  { id: 5, name: "Eldoret", county: "Uasin Gishu", profiles: 892, activeAds: 201, featured: true, status: "Active", coverage: "Good", region: "Rift Valley Region", growth: 9.1, addedOn: "May 20, 2025" },
  { id: 6, name: "Kitale", county: "Trans Nzoia", profiles: 212, activeAds: 58, featured: false, status: "Active", coverage: "Moderate", region: "Western Region", growth: 7.2, addedOn: "May 31, 2025" },
  { id: 7, name: "Malindi", county: "Kilifi", profiles: 198, activeAds: 43, featured: false, status: "Active", coverage: "Moderate", region: "Coastal Region", growth: 6.1, addedOn: "May 28, 2025" },
  { id: 8, name: "Nyeri", county: "Nyeri", profiles: 176, activeAds: 39, featured: false, status: "Active", coverage: "Moderate", region: "Eastern Region", growth: 5.8, addedOn: "May 26, 2025" },
  { id: 9, name: "Naivasha", county: "Nakuru", profiles: 155, activeAds: 34, featured: false, status: "Active", coverage: "Moderate", region: "Rift Valley Region", growth: 5.2, addedOn: "May 24, 2025" },
  { id: 10, name: "Garissa", county: "Garissa", profiles: 74, activeAds: 11, featured: false, status: "Inactive", coverage: "Limited", region: "Eastern Region", growth: -2.1, addedOn: "Apr 20, 2025" }
];

function Topbar({ search, setSearch, onAdd }) {
  return (
    <header className="location-topbar">
      <h1>Location Management</h1>
      <div className="location-topbar-actions">
        <label className="location-search">
          <Search size={22} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="location-bell" type="button" aria-label="Notifications">
          <Bell size={24} />
          <span>6</span>
        </button>
        <div className="location-admin">
          <img src={adminAvatar} alt="" />
          <span>
            <strong>Admin User</strong>
            <small>Super Administrator</small>
          </span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="add-location" type="button" onClick={onAdd}>
          <Plus size={21} />
          Add New Location
        </button>
      </div>
    </header>
  );
}

function StatCard({ stat, active, onClick }) {
  const Icon = stat.icon;
  return (
    <button className={`location-stat ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <span className={`location-stat-icon ${stat.tone}`}>
        <Icon size={34} />
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

function MiniMap({ selectedTown }) {
  const pins = [
    { name: "Eldoret", x: 20, y: 18 },
    { name: "Kisumu", x: 17, y: 40 },
    { name: "Nakuru", x: 34, y: 52 },
    { name: "Nairobi", x: 44, y: 68 },
    { name: "Mombasa", x: 63, y: 92 }
  ];

  return (
    <section className="map-card">
      <h2>Kenya Towns Map</h2>
      <div className="kenya-map">
        <strong>KENYA</strong>
        {pins.map((pin) => (
          <button
            className={selectedTown === pin.name ? "active" : ""}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            type="button"
            key={pin.name}
          >
            <MapPin size={27} />
            <span>{pin.name}</span>
          </button>
        ))}
        <div className="map-zoom">
          <button type="button">+</button>
          <button type="button">-</button>
        </div>
        <button className="map-fullscreen" type="button">⛶</button>
      </div>
    </section>
  );
}

export default function Location() {
  const [towns, setTowns] = useState(initialTowns);
  const [filters, setFilters] = useState({ county: "All Counties", status: "All Statuses", coverage: "All Coverage" });
  const [search, setSearch] = useState("");
  const [selectedTown, setSelectedTown] = useState("Nairobi");

  const filteredTowns = useMemo(() => {
    const term = search.toLowerCase();
    return towns.filter((town) => {
      const matchesSearch = !term || [town.name, town.county, town.region, town.coverage].join(" ").toLowerCase().includes(term);
      const matchesCounty = filters.county === "All Counties" || town.county === filters.county;
      const matchesStatus = filters.status === "All Statuses" || town.status === filters.status;
      const matchesCoverage = filters.coverage === "All Coverage" || town.coverage === filters.coverage;
      return matchesSearch && matchesCounty && matchesStatus && matchesCoverage;
    });
  }, [towns, filters, search]);

  const activeCount = towns.filter((town) => town.status === "Active").length;
  const inactiveCount = towns.length - activeCount;
  const stats = [
    { label: "Total Towns", value: towns.length.toString(), note: "+4 this month", delta: "+ 9.1%", icon: Users, tone: "blue", filter: "All Statuses" },
    { label: "Active Towns", value: activeCount.toString(), note: `${Math.round((activeCount / towns.length) * 100)}% of total`, delta: "+ 7.3%", icon: Users, tone: "green", filter: "Active" },
    { label: "New Towns This Month", value: "4", note: "vs last month", delta: "+ 100%", icon: Flower2, tone: "orange", filter: "All Statuses" },
    { label: "Inactive Locations", value: inactiveCount.toString(), note: `${Math.round((inactiveCount / towns.length) * 100)}% of total`, delta: "- 12.5%", icon: LocateFixed, tone: "red", filter: "Inactive", bad: true }
  ];

  const topTowns = [...towns].sort((a, b) => b.profiles - a.profiles).slice(0, 5);
  const recentTowns = [...towns].sort((a, b) => b.id - a.id).slice(0, 4);
  const regionCounts = towns.reduce((counts, town) => {
    counts[town.region] = (counts[town.region] || 0) + 1;
    return counts;
  }, {});

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function addLocation() {
    const nextCounty = counties.find((county) => !towns.some((town) => town.name === county.capital)) || counties[0];
    const nextId = Math.max(...towns.map((town) => town.id)) + 1;
    setTowns((items) => [{
      id: nextId,
      name: nextCounty.capital,
      county: nextCounty.name,
      profiles: 0,
      activeAds: 0,
      featured: false,
      status: "Inactive",
      coverage: "Limited",
      region: "Eastern Region",
      growth: 0,
      addedOn: "Today"
    }, ...items]);
  }

  function clearFilters() {
    setFilters({ county: "All Counties", status: "All Statuses", coverage: "All Coverage" });
  }

  function toggleFeatured(id) {
    setTowns((items) => items.map((town) => town.id === id ? { ...town, featured: !town.featured } : town));
  }

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Locations" />
      <div className="location-main">
        <Topbar search={search} setSearch={setSearch} onAdd={addLocation} />
        <main className="location-content">
          <section className="location-stats">
            {stats.map((stat) => (
              <StatCard
                stat={stat}
                active={filters.status === stat.filter}
                onClick={() => setFilter("status", stat.filter)}
                key={stat.label}
              />
            ))}
          </section>

          <section className="location-layout">
            <div className="location-left">
              <aside className="location-filters">
                <div>
                  <h2>Filters</h2>
                  <button type="button" onClick={clearFilters}>Reset</button>
                </div>
                <label>
                  County
                  <select value={filters.county} onChange={(event) => setFilter("county", event.target.value)}>
                    <option>All Counties</option>
                    {[...new Set(towns.map((town) => town.county))].map((county) => <option key={county}>{county}</option>)}
                  </select>
                </label>
                <label>
                  Town Status
                  <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <label>
                  Road Coverage
                  <select value={filters.coverage} onChange={(event) => setFilter("coverage", event.target.value)}>
                    <option>All Coverage</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Moderate</option>
                    <option>Limited</option>
                  </select>
                </label>
                <button className="apply-filters" type="button">Apply Filters</button>
              </aside>

              <div className="location-map-table">
                <MiniMap selectedTown={selectedTown} />
                <section className="town-table-card">
                  <div className="town-table-heading">
                    <h2>All Towns</h2>
                    <button type="button">
                      <Download size={17} />
                      Export
                    </button>
                  </div>
                  <div className="town-table-wrap">
                    <table className="town-table">
                      <thead>
                        <tr>
                          <th>Town Name</th>
                          <th>County</th>
                          <th>Profiles</th>
                          <th>Active Ads</th>
                          <th>Featured</th>
                          <th>Status</th>
                          <th>Road Coverage</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTowns.slice(0, 5).map((town) => (
                          <tr key={town.id}>
                            <td><img src={townImage} alt="" /><strong>{town.name}</strong></td>
                            <td>{town.county}</td>
                            <td>{town.profiles.toLocaleString()}</td>
                            <td>{town.activeAds.toLocaleString()}</td>
                            <td>
                              <button className="featured-toggle" type="button" onClick={() => toggleFeatured(town.id)}>
                                <Star size={15} />
                                {town.featured ? "Yes" : "No"}
                              </button>
                            </td>
                            <td><span className={`town-status ${town.status.toLowerCase()}`}>{town.status}</span></td>
                            <td>{town.coverage}</td>
                            <td>
                              <div className="town-actions">
                                <button type="button" onClick={() => setSelectedTown(town.name)}><Eye size={16} /></button>
                                <button type="button"><Edit3 size={16} /></button>
                                <button type="button"><Ellipsis size={17} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="town-pagination">
                    <p>Showing 1 to {Math.min(5, filteredTowns.length)} of {filteredTowns.length} results</p>
                    <div>
                      <button className="active" type="button">1</button>
                      <button type="button">2</button>
                      <button type="button">3</button>
                      <button type="button">4</button>
                      <button type="button">5</button>
                      <ChevronRight size={17} />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <aside className="location-rail">
              <section className="location-rail-card">
                <div className="rail-heading">
                  <h2>Top Performing Towns</h2>
                  <a href="#locations-admin">View all</a>
                </div>
                <table className="top-town-table">
                  <thead>
                    <tr><th>Town</th><th>Profiles</th><th>Active Ads</th><th>Growth</th></tr>
                  </thead>
                  <tbody>
                    {topTowns.map((town) => (
                      <tr key={town.id}>
                        <td><img src={townImage} alt="" />{town.name}</td>
                        <td>{town.profiles.toLocaleString()}</td>
                        <td>{town.activeAds.toLocaleString()}</td>
                        <td className="growth">↑ {town.growth}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="location-rail-card">
                <div className="rail-heading">
                  <h2>Recently Added Locations</h2>
                  <a href="#locations-admin">View all</a>
                </div>
                <table className="recent-town-table">
                  <thead>
                    <tr><th>Town</th><th>County</th><th>Added On</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentTowns.map((town) => (
                      <tr key={town.id}>
                        <td>{town.name}</td>
                        <td>{town.county}</td>
                        <td>{town.addedOn}</td>
                        <td><span className={`town-status ${town.status.toLowerCase()}`}>{town.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="location-rail-card coverage-card">
                <h2>Location Coverage by Region</h2>
                <div className="donut-wrap">
                  <div className="coverage-donut"><strong>{towns.length}</strong><span>Total Towns</span></div>
                  <div className="region-list">
                    {Object.entries(regionCounts).map(([region, count], index) => (
                      <p key={region}><span className={`region-dot region-${index + 1}`} />{region}<b>{count} ({Math.round((count / towns.length) * 100)}%)</b></p>
                    ))}
                  </div>
                </div>
                <a className="full-report" href="#locations-admin">View full report <ChevronRight size={15} /></a>
              </section>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
