import { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Ellipsis,
  Plus,
  RotateCcw,
  Search,
  Smartphone,
  Wallet,
  AlertCircle
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import "./Payments.css";

const avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";
const adminAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80";

const initialTransactions = [
  { id: "TXN-2025-005248", customer: "Maya D.", profileId: "12589", plan: "Premium Plus", method: "M-Pesa", amount: 4500, commission: 675, status: "Completed", date: "May 31, 2025\n10:24 AM" },
  { id: "TXN-2025-005247", customer: "Zuri Love", profileId: "12477", plan: "Premium", method: "Visa **** 4242", amount: 3000, commission: 450, status: "Completed", date: "May 31, 2025\n09:16 AM" },
  { id: "TXN-2025-005246", customer: "Aisha K.", profileId: "12612", plan: "Standard", method: "M-Pesa", amount: 1500, commission: 225, status: "Completed", date: "May 31, 2025\n08:45 AM" },
  { id: "TXN-2025-005245", customer: "Lj M.", profileId: "12133", plan: "Premium Plus", method: "Mastercard **** 8888", amount: 4500, commission: 675, status: "Pending Payout", date: "May 30, 2025\n11:30 PM" },
  { id: "TXN-2025-005244", customer: "Sharon K.", profileId: "12386", plan: "Premium", method: "Airtel Money", amount: 3000, commission: 450, status: "Completed", date: "May 30, 2025\n10:05 PM" }
];

const payouts = [
  { name: "Maya D.", method: "M-Pesa ****2541", amount: 4725, status: "Pending", date: "Today, 10:24 AM" },
  { name: "Zuri Love", method: "M-Pesa ****8123", amount: 3150, status: "Approved", date: "Today, 09:16 AM" },
  { name: "Aisha K.", method: "Bank Transfer", amount: 2625, status: "Approved", date: "Today, 08:45 AM" },
  { name: "Carla B.", method: "M-Pesa ****3412", amount: 1800, status: "Rejected", date: "May 30, 2025" },
  { name: "Sharon K.", method: "Airtel Money ****1166", amount: 3600, status: "Pending", date: "May 30, 2025" }
];

function Topbar({ query, setQuery, onPost }) {
  return (
    <header className="payments-topbar">
      <h1>Payments & Billing</h1>
      <div className="payments-topbar-actions">
        <label className="payments-search">
          <Search size={22} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search profiles, towns, roads, ads..." />
        </label>
        <button className="payments-bell" type="button" aria-label="Notifications"><Bell size={24} /><span>6</span></button>
        <div className="payments-admin">
          <img src={adminAvatar} alt="" />
          <span><strong>Admin User</strong><small>Super Administrator</small></span>
          <ChevronDown size={22} />
        </div>
        <a className="admin-logout" href="#">Logout</a>
        <button className="payments-post" type="button" onClick={onPost}><Plus size={21} />Post New Ad</button>
      </div>
    </header>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <article className="payments-stat">
      <span className={`payments-stat-icon ${stat.tone}`}><Icon size={34} /></span>
      <div><h2>{stat.label}</h2><strong>{stat.value}</strong><p>{stat.note}</p></div>
      {stat.delta && <em>{stat.delta}</em>}
    </article>
  );
}

function StatusBadge({ status }) {
  return <span className={`payment-status ${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

function PlanBadge({ plan }) {
  return <span className={`payment-plan ${plan.toLowerCase().replace(" ", "-")}`}>{plan}</span>;
}

function MethodIcon({ method }) {
  if (method.includes("M-Pesa")) return <Smartphone className="method-mpesa" size={17} />;
  if (method.includes("Airtel")) return <span className="method-airtel">Airtel</span>;
  if (method.includes("Mastercard")) return <span className="method-mastercard" />;
  return <span className="method-visa">VISA</span>;
}

export default function Payments() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ method: "All Methods", status: "All Statuses", plan: "All Plans" });

  const filteredTransactions = useMemo(() => {
    const term = query.toLowerCase();
    return transactions.filter((txn) => {
      const matchesSearch = !term || [txn.id, txn.customer, txn.profileId, txn.plan, txn.method, txn.status].join(" ").toLowerCase().includes(term);
      const matchesMethod = filters.method === "All Methods" || txn.method.includes(filters.method);
      const matchesStatus = filters.status === "All Statuses" || txn.status === filters.status;
      const matchesPlan = filters.plan === "All Plans" || txn.plan === filters.plan;
      return matchesSearch && matchesMethod && matchesStatus && matchesPlan;
    });
  }, [transactions, query, filters]);

  function resetFilters() {
    setFilters({ method: "All Methods", status: "All Statuses", plan: "All Plans" });
  }

  function addTransaction() {
    const next = transactions.length + 5249;
    setTransactions((items) => [{
      id: `TXN-2025-00${next}`,
      customer: "New Customer",
      profileId: "12990",
      plan: "Basic",
      method: "M-Pesa",
      amount: 500,
      commission: 75,
      status: "Pending Payout",
      date: "Today\nJust now"
    }, ...items]);
  }

  const stats = [
    { label: "Total Revenue", value: "KES 8,742,150", note: "vs last 30 days", delta: "+ 12.6%", icon: Wallet, tone: "blue" },
    { label: "Monthly Revenue", value: "KES 2,543,780", note: "This month", delta: "+ 8.9%", icon: BarChart3, tone: "orange" },
    { label: "Pending Payouts", value: "KES 1,284,500", note: "23 payouts", icon: Clock3, tone: "yellow" },
    { label: "Failed Transactions", value: "147", note: "vs last 30 days", delta: "+ 9.3%", icon: AlertCircle, tone: "red" }
  ];

  return (
    <div className="admin-shell">
      <Sidebar activeItem="Payments" />
      <div className="payments-main">
        <Topbar query={query} setQuery={setQuery} onPost={addTransaction} />
        <main className="payments-content">
          <section className="payments-stats">{stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</section>

          <section className="payments-filters">
            <label><span>Date Range</span><button type="button"><CalendarDays size={16} />May 1 - May 31, 2025 <ChevronDown size={16} /></button></label>
            <label><span>Payment Method</span><select value={filters.method} onChange={(event) => setFilters((current) => ({ ...current, method: event.target.value }))}>{["All Methods", "M-Pesa", "Visa", "Mastercard", "Airtel Money"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Transaction Status</span><select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>{["All Statuses", "Completed", "Pending Payout", "Failed"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Subscription Plan</span><select value={filters.plan} onChange={(event) => setFilters((current) => ({ ...current, plan: event.target.value }))}>{["All Plans", "Premium Plus", "Premium", "Standard", "Basic"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={resetFilters}><RotateCcw size={16} />Reset Filters</button>
          </section>

          <section className="payments-grid">
            <section className="revenue-card">
              <div className="payments-card-heading"><h2>Revenue Trend</h2><select defaultValue="Last 30 Days"><option>Last 30 Days</option></select></div>
              <div className="revenue-legend"><span>This Month</span><span>Last Month</span></div>
              <svg className="revenue-chart" viewBox="0 0 640 230">
                <polyline className="this-month" points="20,205 60,150 100,130 140,122 180,118 220,110 260,82 300,76 340,68 380,45 420,36 460,14 500,0 540,-2 580,-18 620,-44" />
                <polyline className="last-month" points="20,210 80,180 140,174 200,166 260,150 320,142 380,120 440,96 500,78 560,52 620,26" />
              </svg>
            </section>

            <section className="method-card">
              <h2>Payment Methods Breakdown</h2>
              <div className="method-wrap">
                <div className="method-donut"><strong>KES 8,742,150</strong><span>Total</span></div>
                <div className="method-list">
                  <p><i className="m1" />M-Pesa <b>56.2% <span>(KES 4,908,625)</span></b></p>
                  <p><i className="m2" />Card Payments <b>28.7% <span>(KES 2,507,830)</span></b></p>
                  <p><i className="m3" />Bank Transfer <b>10.6% <span>(KES 926,410)</span></b></p>
                  <p><i className="m4" />Airtel Money <b>4.5% <span>(KES 393,285)</span></b></p>
                </div>
              </div>
              <a href="#payments-admin">View full report <ChevronRight size={15} /></a>
            </section>

            <aside className="payments-rail">
              <section className="payments-rail-card">
                <h2>Top Subscription Plans</h2>
                <table className="plans-table"><thead><tr><th>Plan</th><th>Subscribers</th><th>Revenue</th></tr></thead><tbody>{[["Premium Plus", "1,248", "KES 4,286,750"], ["Premium", "2,134", "KES 2,871,600"], ["Standard", "1,876", "KES 1,254,300"], ["Basic", "643", "KES 329,500"]].map(([plan, subs, revenue]) => <tr key={plan}><td><CreditCard size={15} />{plan}</td><td>{subs}</td><td>{revenue}</td></tr>)}</tbody></table>
                <a href="#payments-admin">View all plans <ChevronRight size={15} /></a>
              </section>

              <section className="payments-rail-card payout-card">
                <div className="payments-card-heading"><h2>Recent Payout Requests</h2><a href="#payments-admin">View all <ChevronRight size={15} /></a></div>
                {payouts.map((payout) => <article key={`${payout.name}-${payout.amount}`}><img src={avatar} alt="" /><div><strong>{payout.name}</strong><small>{payout.method}</small></div><span><b>KES {payout.amount.toLocaleString()}</b><StatusBadge status={payout.status} /></span><time>{payout.date}</time></article>)}
                <a className="payout-link" href="#payments-admin">View all payout requests <ChevronRight size={15} /></a>
              </section>
            </aside>

            <section className="transactions-card">
              <h2>Transactions</h2>
              <div className="transactions-wrap">
                <table className="transactions-table">
                  <thead><tr><th>Transaction ID</th><th>Customer / Profile</th><th>Plan</th><th>Payment Method</th><th>Amount</th><th>Commission</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>{filteredTransactions.map((txn) => <tr key={txn.id}><td>{txn.id}</td><td><span className="txn-user"><img src={avatar} alt="" /><span><strong>{txn.customer}</strong><small>Profile ID: {txn.profileId}</small></span></span></td><td><PlanBadge plan={txn.plan} /></td><td><span className="txn-method"><MethodIcon method={txn.method} />{txn.method}</span></td><td>KES {txn.amount.toLocaleString()}</td><td>KES {txn.commission}<small>(15%)</small></td><td><StatusBadge status={txn.status} /></td><td>{txn.date.split("\n").map((line) => <span key={line}>{line}</span>)}</td><td><button className="txn-more" type="button"><Ellipsis size={17} /></button></td></tr>)}</tbody>
                </table>
              </div>
              <div className="payments-pagination"><p>Showing 1 to {filteredTransactions.length} of 254 results</p><div><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">26</button><button type="button"><ChevronRight size={17} /></button></div></div>
            </section>
          </section>
        </main>
        <footer className="payments-footer"><span>(c) 2025 Young Escorts Kenya. All rights reserved.</span><nav><a href="#payments-admin">Privacy Policy</a><a href="#payments-admin">Terms of Use</a><a href="#payments-admin">Support</a></nav></footer>
      </div>
    </div>
  );
}
