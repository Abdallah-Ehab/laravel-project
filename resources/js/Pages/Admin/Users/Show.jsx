import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { ArrowLeft, Briefcase, FileText, Calendar, ShieldCheck } from 'lucide-react';

const roleBadge = {
    employer: 'bg-blue-50 text-blue-600 border-blue-200',
    candidate: 'bg-purple-50 text-purple-600 border-purple-200',
};

const statusBadge = (bannedAt) =>
    bannedAt
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20';

const jobStatusBadge = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    approved: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

const appStatusBadge = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    accepted: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Show({ user }) {
    const [banDialog, setBanDialog] = useState(false);

    const ban = () => {
        router.patch(route('admin.users.ban', user.id), {}, {
            onSuccess: () => setBanDialog(false),
        });
    };

    const unban = () => {
        router.patch(route('admin.users.unban', user.id));
    };

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <AppLayout title={user.name}>
            <div className="mb-6">
                <Link href={route('admin.users.index')} className="inline-flex items-center text-sm text-gray-500 hover:text-[#14a800] transition mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Users
                </Link>

                <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-[#1a1f36]">{user.name}</h1>
                                        <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${roleBadge[user.role] || ''}`}>
                                            {user.role}
                                        </Badge>
                                        <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusBadge(user.banned_at)}`}>
                                            {user.banned_at ? 'Banned' : 'Active'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" /> Member since {user.created_at}
                                        </span>
                                        {user.email_verified_at && (
                                            <span className="flex items-center gap-1">
                                                <ShieldCheck className="h-3.5 w-3.5 text-[#14a800]" /> Email verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.banned_at ? (
                                    <Button
                                        onClick={unban}
                                        className="h-10 px-5 text-sm bg-[#14a800] hover:bg-[#108a00] text-white rounded-lg"
                                    >
                                        Unban User
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={() => setBanDialog(true)}
                                        className="h-10 px-5 text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
                                    >
                                        Ban User
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {user.bio && (
                <Card className="border border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-5">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bio</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
                    </CardContent>
                </Card>
            )}

            {/* Employer: Job Listings */}
            {user.role === 'employer' && user.jobs?.length > 0 && (
                <Card className="border border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <h3 className="text-sm font-semibold text-[#1a1f36]">Job Listings ({user.jobs.length})</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Title</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Status</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Applications</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Posted</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.jobs.map(job => (
                                    <TableRow key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <TableCell className="py-3 text-sm font-medium text-[#1a1f36]">{job.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${jobStatusBadge[job.status] || ''}`}>
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-gray-500">{job.applications_count}</TableCell>
                                        <TableCell className="py-3 text-sm text-gray-500">{job.created_at}</TableCell>
                                        <TableCell className="py-3 text-right">
                                            <Link href={route('jobs.show', job.slug)}>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-[#14a800]">
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Candidate: Applications */}
            {user.role === 'candidate' && user.applications?.length > 0 && (
                <Card className="border border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <h3 className="text-sm font-semibold text-[#1a1f36]">Job Applications ({user.applications.length})</h3>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Job Title</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Status</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9">Applied</TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 h-9 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.applications.map(app => (
                                    <TableRow key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <TableCell className="py-3 text-sm font-medium text-[#1a1f36]">{app.job_title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${appStatusBadge[app.status] || ''}`}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-gray-500">{app.created_at}</TableCell>
                                        <TableCell className="py-3 text-right">
                                            <Link href={route('jobs.show', app.job_slug)}>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-[#14a800]">
                                                    View Job
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Empty state for employer with no jobs */}
            {user.role === 'employer' && (!user.jobs || user.jobs.length === 0) && (
                <Card className="border border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-8 text-center">
                        <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">No job listings yet</p>
                        <p className="text-xs text-gray-400 mt-1">This employer hasn't posted any jobs.</p>
                    </CardContent>
                </Card>
            )}

            {/* Empty state for candidate with no applications */}
            {user.role === 'candidate' && (!user.applications || user.applications.length === 0) && (
                <Card className="border border-gray-100 shadow-sm mb-6">
                    <CardContent className="p-8 text-center">
                        <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-500">No applications yet</p>
                        <p className="text-xs text-gray-400 mt-1">This candidate hasn't applied to any jobs.</p>
                    </CardContent>
                </Card>
            )}

            <Dialog open={banDialog} onOpenChange={setBanDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to ban "{user.name}"? They will not be able to log in or use the platform. You can unban them at any time.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBanDialog(false)} className="rounded-lg">Cancel</Button>
                        <Button variant="destructive" onClick={ban} className="rounded-lg">Ban User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
