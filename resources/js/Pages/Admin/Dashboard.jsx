import { Link, Head } from '@inertiajs/react';
import { Users, Building2, Briefcase, CheckCircle, Clock, FileText, ArrowRight, TrendingUp, TrendingDown, UserPlus, UserCheck, Activity } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';

function TrendBadge({ current, previous }) {
    if (previous === 0) return null;
    const pct = Math.round(((current - previous) / previous) * 100);
    if (pct === 0) return null;
    const up = pct > 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-[#14a800]' : 'text-red-500'}`}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(pct)}%
        </span>
    );
}

const activityIcons = {
    new_candidate: { icon: UserPlus, bg: 'bg-purple-50', color: 'text-purple-500' },
    new_employer: { icon: UserCheck, bg: 'bg-blue-50', color: 'text-blue-500' },
    new_job: { icon: Briefcase, bg: 'bg-[#f0faf0]', color: 'text-[#14a800]' },
    new_application: { icon: FileText, bg: 'bg-amber-50', color: 'text-amber-500' },
};

export default function Dashboard({ stats, trends, activity }) {
    const statCards = [
        { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Employers', value: stats.total_employers, icon: Building2, color: 'text-blue-500 bg-blue-50' },
        { label: 'Candidates', value: stats.total_candidates, icon: Users, color: 'text-purple-500 bg-purple-50' },
        { label: 'Applications', value: stats.total_applications, icon: FileText, color: 'text-amber-500 bg-amber-50' },
    ];

    const trendCards = [
        { label: 'New Users', thisWeek: trends.users_this_week, lastWeek: trends.users_last_week, icon: Users },
        { label: 'New Jobs', thisWeek: trends.jobs_this_week, lastWeek: trends.jobs_last_week, icon: Briefcase },
        { label: 'New Applications', thisWeek: trends.apps_this_week, lastWeek: trends.apps_last_week, icon: FileText },
    ];

    const jobCards = [
        { label: 'Total Jobs', value: stats.total_jobs, icon: Briefcase, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Approved', value: stats.approved_jobs, icon: CheckCircle, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Pending Review', value: stats.pending_jobs, icon: Clock, color: 'text-amber-500 bg-amber-50' },
    ];

    return (
        <AppLayout title="Admin Dashboard">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Overview of the WorkBridge platform</p>
                </div>
                <Link href={route('admin.approvals.index')}>
                    <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm">
                        Pending Approvals <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </div>

            {/* Snapshot stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat) => (
                    <Card key={stat.label} className="border border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-[#1a1f36] mt-1">{stat.value}</p>
                                </div>
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Weekly trends */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {trendCards.map((t) => (
                    <Card key={t.label} className="border border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <t.icon className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">{t.label} This Week</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-bold text-[#1a1f36]">{t.thisWeek}</p>
                                        <TrendBadge current={t.thisWeek} previous={t.lastWeek} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job stats */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {jobCards.map((stat) => (
                            <Card key={stat.label} className="border border-gray-100 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                                            <p className="text-2xl font-bold text-[#1a1f36] mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-5">
                        <h3 className="text-sm font-semibold text-[#1a1f36] flex items-center gap-2 mb-4">
                            <Activity className="h-4 w-4 text-gray-400" />Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {activity.length > 0 ? (
                                activity.map((item, i) => {
                                    const meta = activityIcons[item.type] || { icon: Activity, bg: 'bg-gray-50', color: 'text-gray-500' };
                                    const Icon = meta.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`h-8 w-8 rounded-full ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                                <Icon className={`h-4 w-4 ${meta.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-700 leading-relaxed">{item.description}</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
