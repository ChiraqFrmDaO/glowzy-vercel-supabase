import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { MousePointerClick, Percent, Eye, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const [totalViews, setTotalViews] = useState(0);
  const [recentViews, setRecentViews] = useState(0);
  const [viewData, setViewData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/analytics/views?userId=${user!.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error('Failed to load analytics');
        setLoading(false);
        return;
      }

      const views = await response.json();

      setTotalViews(views.length);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      setRecentViews(views.filter((v: any) => new Date(v.created_at) > threeDaysAgo).length);

      // Build chart data (last 30 days)
      const chartMap: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        chartMap[d.toLocaleDateString("en", { month: "short", day: "numeric" })] = 0;
      }
      views.forEach((v: any) => {
        const key = new Date(v.created_at).toLocaleDateString("en", { month: "short", day: "numeric" });
        if (key in chartMap) chartMap[key]++;
      });
      setViewData(Object.entries(chartMap).map(([day, count]) => ({ day, views: count })));

      // Device breakdown
      const devices: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
      views.forEach((v: any) => { const d = v.device_type || "desktop"; devices[d] = (devices[d] || 0) + 1; });
    const colors = { desktop: "hsl(217, 91%, 60%)", mobile: "hsl(270, 60%, 50%)", tablet: "hsl(142, 71%, 45%)" };
    setDeviceData(Object.entries(devices).filter(([_, v]) => v > 0).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), value, color: colors[name as keyof typeof colors] || "#999",
    })));

    // Countries
    const countries: Record<string, number> = {};
    views.forEach((v: any) => { if (v.country) countries[v.country] = (countries[v.country] || 0) + 1; });
    setTopCountries(Object.entries(countries).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, count]) => ({ name, count })));

    setLoading(false);
  } catch (error) {
    console.error('Analytics loading error:', error);
    setLoading(false);
  }
  };   // <-- deze ontbrak
  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const stats = [
    { label: "Total Link Clicks", value: "0", sub: "Coming soon", icon: MousePointerClick },
    { label: "Click Rate", value: "0.00%", sub: "Coming soon", icon: Percent },
    { label: "Profile Views", value: totalViews.toString(), sub: `+${recentViews} in last 3 days`, icon: Eye },
    { label: "Average Daily Views", value: totalViews > 0 ? (totalViews / 30).toFixed(1) : "0", sub: "Last 30 days", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Account Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your profile performance and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-primary mb-4">Profile Views (Last 30 Days)</h3>
          {viewData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={viewData}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
          )}
        </motion.div>

        {deviceData.length > 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-primary mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {topCountries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-primary mb-4">Top Countries</h3>
          {topCountries.map((c) => (
            <div key={c.name} className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">{c.name}</span>
              <span className="text-sm text-muted-foreground">{c.count} views</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
