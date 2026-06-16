import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  School,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  Bell,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { dashboardService } from '@/services/dataService';
import {
  monthlyEnrollmentData,
  attendanceData,
  gradeDistributionData,
  schoolTypeData,
} from '@/data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard() {
  const navigate = useNavigate();
  const stats = dashboardService.getStats();
  const recentActivity = dashboardService.getRecentActivity();
  const upcomingEvents = dashboardService.getUpcomingEvents();

  const getEventBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      event: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      holiday: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      training: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      exam: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Administrator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your regional schools today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
            className="rounded-xl h-10"
          >
            View Reports
          </Button>
          <Button
            onClick={() => navigate('/announcements')}
            className="rounded-xl h-10"
          >
            <Bell className="mr-2 h-4 w-4" />
            Announcements
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Schools"
          value={stats.totalSchools}
          description="Active institutions"
          trend="up"
          trendValue="+2 this year"
          icon={<School className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          description="Enrolled across all schools"
          trend="up"
          trendValue="+156 this month"
          icon={<Users className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          description="Active faculty members"
          trend="up"
          trendValue="+15 this quarter"
          icon={<GraduationCap className="h-5 w-5" />}
          color="amber"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          description="Active class sections"
          trend="neutral"
          trendValue="No change"
          icon={<Calendar className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Enrollment Trends"
          description="Student and teacher enrollment over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyEnrollmentData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis
                dataKey="month"
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorStudents)"
                name="Students"
              />
              <Area
                type="monotone"
                dataKey="teachers"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTeachers)"
                name="Teachers"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekly Attendance"
          description="Student attendance patterns this week"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis
                dataKey="day"
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="currentColor"
                strokeOpacity={0.5}
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 & Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Grade Distribution" description="Overall grade performance">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gradeDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {gradeDistributionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="School Types" description="Distribution by institution type">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={schoolTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ type, percentage }) => `${type} ${percentage}%`}
              >
                {schoolTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Activity */}
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports')}
                className="h-8 rounded-lg"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/announcements')}
              className="h-8 rounded-lg"
            >
              View calendar
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] mt-1 capitalize ${getEventBadgeColor(event.type)}`}
                  >
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
