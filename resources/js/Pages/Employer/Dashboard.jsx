import { Link, Head } from '@inertiajs/react';
import { Briefcase, CheckCircle, Clock, Users, Plus, Eye } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

const statusVariants = { pending: 'warning', approved: 'success', rejected: 'destructive' };

const badgeStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    approved: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Dashboard({ stats, recentJobs, recentApplicants }) {
    const statCards = [
        { label: 'Active Jobs', value: stats.active_jobs, icon: Briefcase, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Total Applicants', value: stats.total_applications, icon: Users, color: 'text-blue-500 bg-blue-50' },
        { label: 'Pending Approval', value: stats.pending_jobs, icon: Clock, color: 'text-amber-500 bg-amber-50' },
        { label: 'Total Jobs', value: stats.total_jobs, icon: CheckCircle, color: 'text-gray-600 bg-gray-100' },
    ];

    return (
        <AppLayout title="Employer Dashboard">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#1a1f36]">Dashboard</h1>
                <Link href={route('employer.jobs.create')}>
                    <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm">
                        <Plus className="h-4 w-4 mr-2" />Post a New Job
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Jobs */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[#1a1f36]">My Job Listings</h2>
                        <Link href={route('employer.jobs.index')} className="text-sm font-medium text-[#14a800] hover:text-[#108a00] transition">View all</Link>
                    </div>
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Job Title</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Applicants</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Status</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Posted</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentJobs?.length > 0 ? (
                                        recentJobs.map(job => (
                                            <TableRow key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                <TableCell className="py-3.5">
                                                    <span className="text-sm font-medium text-[#1a1f36]">{job.title}</span>
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-500">{job.applications_count}</TableCell>
                                                <TableCell className="py-3.5">
                                                    <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${badgeStyles[job.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                        {job.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-500">{job.created_at}</TableCell>
                                                <TableCell className="py-3.5 text-right">
                                                    <Link href={route('employer.applicants.index', job.slug)}>
                                                        <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-[#14a800]">
                                                            <Eye className="h-3.5 w-3.5 mr-1" />View
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-sm text-gray-400">No jobs posted yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Applicants */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[#1a1f36]">Recent Applicants</h2>
                        <Link href={route('employer.jobs.index')} className="text-sm font-medium text-[#14a800] hover:text-[#108a00] transition">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {recentApplicants?.length > 0 ? (
                            recentApplicants.map((app, i) => (
                                <Card key={i} className="border border-gray-100 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-gray-500">
                                                    {app.candidate_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-[#1a1f36] truncate">{app.candidate_name}</p>
                                                <p className="text-xs text-gray-400 truncate">Applied to {app.job_title}</p>
                                            </div>
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${badgeStyles[app.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {app.status}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border border-gray-100 shadow-sm">
                                <CardContent className="p-6 text-center">
                                    <p className="text-sm text-gray-400">No applicants yet.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
