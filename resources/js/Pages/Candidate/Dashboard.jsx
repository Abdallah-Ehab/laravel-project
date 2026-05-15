import { Link, Head, usePage } from '@inertiajs/react';
import { Briefcase, CheckCircle, Clock, Bookmark, ArrowRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

const statusStyles = {
    pending: 'bg-orange-50 text-orange-600 border-orange-200',
    interview: 'bg-blue-50 text-blue-600 border-blue-200',
    accepted: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Dashboard({ stats, recentApplications, recommendedJobs }) {
    const { auth } = usePage().props;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const statCards = [
        { label: 'Total Applications', value: stats.total_applications, icon: Briefcase, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Pending Review', value: stats.pending_applications, icon: Clock, color: 'text-orange-500 bg-orange-50' },
        { label: 'Accepted', value: stats.accepted_applications, icon: CheckCircle, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Saved Jobs', value: stats.saved_jobs, icon: Bookmark, color: 'text-gray-600 bg-gray-100' },
    ];

    return (
        <AppLayout title="Candidate Dashboard">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1a1f36]">Good morning, {auth.user.name} 👋</h1>
                <p className="text-sm text-gray-500 mt-1">{today}</p>
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
                {/* Recent Applications */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[#1a1f36]">Recent Applications</h2>
                        <Link href={route('candidate.applications.index')} className="text-sm font-medium text-[#14a800] hover:text-[#108a00] transition flex items-center gap-1">
                            View all <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Job Title</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Company</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10">Applied</TableHead>
                                        <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentApplications?.length > 0 ? (
                                        recentApplications.map(app => (
                                            <TableRow key={app.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                <TableCell className="py-3.5">
                                                    <Link href={route('jobs.show', app.job_slug)} className="text-sm font-medium text-[#1a1f36] hover:text-[#14a800] transition">{app.job_title}</Link>
                                                </TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-500">{app.company_name}</TableCell>
                                                <TableCell className="py-3.5 text-sm text-gray-500">{app.created_at}</TableCell>
                                                <TableCell className="py-3.5 text-right">
                                                    <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${statusStyles[app.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-sm text-gray-400">No applications yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommended Jobs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-[#1a1f36]">Recommended for you</h2>
                        <Link href={route('jobs.index')} className="text-sm font-medium text-[#14a800] hover:text-[#108a00] transition">Browse all</Link>
                    </div>
                    <div className="space-y-3">
                        {recommendedJobs?.length > 0 ? (
                            recommendedJobs.map((job, i) => (
                                <Card key={i} className="border border-gray-100 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-[#f0faf0] flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-[#14a800]">
                                                    {job.company_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CO'}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold text-[#1a1f36] truncate">{job.title}</h3>
                                                <p className="text-xs text-gray-500">{job.company_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {job.tags?.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-[11px] font-medium bg-[#f0faf0] text-[#14a800] border-0 rounded-full px-2">{tag}</Badge>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">{job.posted}</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border border-gray-100 shadow-sm">
                                <CardContent className="p-6 text-center">
                                    <p className="text-sm text-gray-400">No recommendations yet.</p>
                                    <Link href={route('jobs.index')}>
                                        <Button variant="outline" size="sm" className="mt-3 text-xs">Browse Jobs</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
