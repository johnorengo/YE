import { useEffect, useState } from "react";
import AdminDashboard from "./Admindashboard.jsx";
import Ads from "./Ads.jsx";
import Analytics from "./Analytics.jsx";
import ClientDashboard from "./ClientDashboard.jsx";
import LandingPage from "./LandingPage.jsx";
import Location from "./location.jsx";
import Messages from "./Messages.jsx";
import Payments from "./Payments.jsx";
import Profile from "./profile.jsx";
import Road from "./Road.jsx";
import Reports from "./Reports.jsx";
import Settings from "./Settings.jsx";
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Verification from "./Verification.jsx";

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace("#", ""));

  useEffect(() => {
    function handleHashChange() {
      setRoute(window.location.hash.replace("#", ""));
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route === "signin") return <Signin />;
  if (route === "signup") return <Signup />;
  if (route === "client-dashboard") return <ClientDashboard />;
  if (route === "admin") return <AdminDashboard />;
  if (route === "ads-admin") return <Ads />;
  if (route === "profiles-admin") return <Profile />;
  if (route === "locations-admin") return <Location />;
  if (route === "roads-admin") return <Road />;
  if (route === "verification-admin") return <Verification />;
  if (route === "reports-admin") return <Reports />;
  if (route === "messages-admin") return <Messages />;
  if (route === "payments-admin") return <Payments />;
  if (route === "analytics-admin") return <Analytics />;
  if (route === "settings-admin") return <Settings />;

  return <LandingPage />;
}
