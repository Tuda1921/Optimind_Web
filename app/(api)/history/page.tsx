// // app/history/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar, Clock, TrendingUp, Award, Coins } from "lucide-react";
// import { format } from "date-fns";

// interface StudySession {
//   id: string;
//   startTime: string;
//   endTime: string | null;
//   duration: number | null;
//   focusScore: number | null;
//   coinsEarned: number;
//   expEarned: number;
//   taskId: string | null;
//   task?: {
//     title: string;
//   };
// }

// interface Analytics {
//   period: string;
//   totalSessions: number;
//   totalMinutes: number;
//   avgFocusScore: number;
//   totalCoins: number;
//   totalExp: number;
// }

// export default function HistoryPage() {
//   const [sessions, setSessions] = useState<StudySession[]>([]);
//   const [analytics, setAnalytics] = useState<Analytics | null>(null);
//   const [period, setPeriod] = useState("week");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchHistory();
//     fetchAnalytics();
//   }, [period]);

//   const fetchHistory = async () => {
//     try {
//       const res = await fetch("/api/sessions/history?limit=20");
//       if (res.ok) {
//         const data = await res.json();
//         setSessions(data.sessions);
//       }
//     } catch (error) {
//       console.error("Failed to fetch history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAnalytics = async () => {
//     try {
//       const res = await fetch(`/api/sessions/analytics?period=${period}`);
//       if (res.ok) {
//         const data = await res.json();
//         setAnalytics(data.analytics);
//       }
//     } catch (error) {
//       console.error("Failed to fetch analytics:", error);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Study History</h1>
//           <p className="text-muted-foreground">Xem lại lịch sử học tập của bạn</p>
//         </div>
//         <Select value={period} onValueChange={setPeriod}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="day">Hôm nay</SelectItem>
//             <SelectItem value="week">Tuần này</SelectItem>
//             <SelectItem value="month">Tháng này</SelectItem>
//             <SelectItem value="all">Tất cả</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Analytics Cards */}
//       {analytics && (
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Số phiên</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{analytics.totalSessions}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Tổng thời gian</CardTitle>
//               <Clock className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{analytics.totalMinutes} phút</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{analytics.avgFocusScore}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Coins</CardTitle>
//               <Coins className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{analytics.totalCoins}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">EXP</CardTitle>
//               <Award className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{analytics.totalExp}</div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Sessions List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Study Sessions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {sessions.length > 0 ? (
//               sessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
//                 >
//                   <div className="space-y-1">
//                     <p className="font-medium">{session.task?.title || "No task"}</p>
//                     <div className="flex gap-4 text-sm text-muted-foreground">
//                       <span>{format(new Date(session.startTime), "PPP p")}</span>
//                       {session.duration && (
//                         <span>{session.duration} phút</span>
//                       )}
//                       {session.focusScore && (
//                         <span>Focus: {session.focusScore}%</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     {session.coinsEarned > 0 && (
//                       <Badge variant="secondary">+{session.coinsEarned} coins</Badge>
//                     )}
//                     {session.expEarned > 0 && (
//                       <Badge variant="outline">+{session.expEarned} exp</Badge>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-muted-foreground">Không có phiên học nào</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, TrendingUp, Award, Coins, Flame, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from "recharts";

// --- Types ---
interface StudySession {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  focusScore: number | null;
  coinsEarned: number;
  expEarned: number;
  taskTitle?: string;
}

interface Analytics {
  totalSessions: number;
  totalMinutes: number;
  avgFocusScore: number;
  totalCoins: number;
  totalExp: number;
  streak: number;
  chartData: any[];
}

interface SessionDetailAnalysis {
  session: StudySession;
  analysis: {
    chartData: { time: string; score: number }[];
    distribution: { high: number; medium: number; low: number };
  };
}

// --- Main Component ---
export default function HistoryPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  // State cho phần xem chi tiết
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailAnalysis | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchMainData();
  }, [period]);

  // Fetch data chi tiết khi click vào phiên học
  useEffect(() => {
    if (selectedSessionId) {
      const fetchDetail = async () => {
        setLoadingDetail(true);
        try {
          const res = await fetch(`/api/sessions/${selectedSessionId}`);
          if (res.ok) {
            const data = await res.json();
            setSessionDetail(data);
          }
        } catch (error) {
          console.error("Failed to fetch details", error);
        } finally {
          setLoadingDetail(false);
        }
      };
      fetchDetail();
    } else {
      setSessionDetail(null);
    }
  }, [selectedSessionId]);

  const fetchMainData = async () => {
    setLoading(true);
    try {
      const [histRes, anaRes] = await Promise.all([
        fetch("/api/sessions?limit=50"),
        fetch(`/api/sessions/analytics?period=${period}`)
      ]);

      if (histRes.ok) setSessions((await histRes.json()).sessions);
      if (anaRes.ok) setAnalytics((await anaRes.json()).analytics);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lịch Sử Học Tập</h1>
          <p className="text-muted-foreground">Theo dõi quá trình và cải thiện hiệu suất</p>
        </div>
        <div className="flex items-center gap-2">
          {analytics && analytics.streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full border border-orange-200 font-bold mr-2">
              <Flame className="w-5 h-5 fill-orange-500" />
              <span>{analytics.streak} Ngày Streak</span>
            </div>
          )}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Số phiên" value={analytics.totalSessions} icon={<Calendar className="h-4 w-4" />} />
          <StatCard title="Tổng thời gian" value={`${analytics.totalMinutes}p`} icon={<Clock className="h-4 w-4" />} />
          <StatCard title="Điểm TB" value={`${analytics.avgFocusScore}%`} icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard title="Coins" value={analytics.totalCoins} icon={<Coins className="h-4 w-4" />} />
          <StatCard title="EXP" value={analytics.totalExp} icon={<Award className="h-4 w-4" />} />
        </div>
      )}

      {/* Main Charts */}
      {analytics?.chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
            <CardHeader><CardTitle>Thời gian học (Phút)</CardTitle></CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Phút" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Độ tập trung (%)</CardTitle></CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={2} name="Độ tập trung" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Phiên Học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSessionId(session.id)}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-slate-800">{session.taskTitle || "Học tự do"}</p>
                    {session.duration && session.duration > 30 * 60 && <Badge variant="outline" className="text-xs">Long Session</Badge>}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(session.startTime), "dd/MM HH:mm")}</span>
                    {session.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(session.duration / 60)} phút</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  {session.focusScore !== null && (
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        session.focusScore >= 80 ? 'text-green-600' : session.focusScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(session.focusScore)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Tập trung</div>
                    </div>
                  )}
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                    +{session.coinsEarned} 💰
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DETAIL DIALOG (Phần hiển thị phân tích chi tiết) */}
      <Dialog open={!!selectedSessionId} onOpenChange={(open) => !open && setSelectedSessionId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi Tiết Phiên Học</DialogTitle>
            <DialogDescription>
              {sessionDetail ? format(new Date(sessionDetail.session.startTime), "EEEE, dd MMMM yyyy - HH:mm", { locale: vi }) : "Đang tải..."}
            </DialogDescription>
          </DialogHeader>

          {loadingDetail ? (
            <div className="h-60 flex items-center justify-center">Đang tải phân tích...</div>
          ) : sessionDetail ? (
            <div className="space-y-6">
              {/* 1. Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Thời gian</div>
                  <div className="text-xl font-bold">{Math.round((sessionDetail.session.duration || 0) / 60)} phút</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Điểm Focus</div>
                  <div className="text-xl font-bold text-indigo-600">{Math.round(sessionDetail.session.focusScore || 0)}%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Coins</div>
                  <div className="text-xl font-bold text-yellow-600">+{sessionDetail.session.coinsEarned}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">EXP</div>
                  <div className="text-xl font-bold text-blue-600">+{sessionDetail.session.expEarned}</div>
                </div>
              </div>

              {/* 2. Focus Trend Chart */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Diễn biến độ tập trung
                </h3>
                <div className="h-[200px] w-full border rounded-lg p-2 bg-white">
                  {sessionDetail.analysis.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sessionDetail.analysis.chartData}>
                        <defs>
                          <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="time" fontSize={10} minTickGap={30} />
                        <YAxis domain={[0, 100]} fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorFocus)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">Chưa có dữ liệu biểu đồ cho phiên này</div>
                  )}
                </div>
              </div>

              {/* 3. Quality Distribution */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Chất lượng phiên học
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <DistributionBar 
                    label="Tập trung cao (>80%)" 
                    percent={sessionDetail.analysis.distribution.high} 
                    color="bg-green-500" 
                  />
                  <DistributionBar 
                    label="Bình thường (50-80%)" 
                    percent={sessionDetail.analysis.distribution.medium} 
                    color="bg-yellow-500" 
                  />
                  <DistributionBar 
                    label="Mất tập trung (<50%)" 
                    percent={sessionDetail.analysis.distribution.low} 
                    color="bg-red-500" 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>Không tìm thấy dữ liệu</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Components phụ
function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function DistributionBar({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div className="p-3 border rounded-lg bg-slate-50">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}