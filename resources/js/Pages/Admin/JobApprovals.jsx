import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Textarea } from '@/ui/textarea';
import { ChevronDown, ChevronUp, Check, X, Eye } from 'lucide-react';

const badgeStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    approved: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function JobApprovals({ jobs, filter }) {
    const [rejectDialog, setRejectDialog] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    const approve = (id) => {
        router.patch(route('admin.jobs.approve', id));
    };

    const reject = () => {
        router.patch(route('admin.jobs.reject', rejectDialog), { reason: rejectReason });
        setRejectDialog(null);
        setRejectReason('');
    };

    const setFilter = (value) => {
        router.get(route('admin.approvals.index'), { status: value === 'all' ? 'all' : value }, { preserveState: true });
    };

    const toggleExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <AppLayout title="Job Approvals">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Pending Job Approvals</h1>
                    <p className="text-sm text-gray-500 mt-1">{jobs.total} jobs awaiting review</p>
                </div>
                <Select defaultValue={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40 h-10 rounded-lg border-gray-200 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="all">All Jobs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-medium text-gray-500 h-10 w-8"></TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Title</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Employer</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Category</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Status</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Submitted</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.data?.length > 0 ? (
                                jobs.data.map(job => (
                                    <>
                                        <TableRow key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                            <TableCell className="py-3.5">
                                                <button
                                                    onClick={() => toggleExpand(job.id)}
                                                    className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    {expandedRow === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                            </TableCell>
                                            <TableCell className="py-3.5">
                                                <span className="text-sm font-medium text-[#1a1f36]">{job.title}</span>
                                                <span className="text-xs text-gray-400 ml-2">({job.company_name})</span>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-sm text-gray-500">{job.employer_name}</TableCell>
                                            <TableCell className="py-3.5 text-sm text-gray-500">{job.category?.name || '-'}</TableCell>
                                            <TableCell className="py-3.5">
                                                <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${badgeStyles[job.status] || ''}`}>
                                                    {job.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3.5 text-sm text-gray-500">{job.created_at}</TableCell>
                                            <TableCell className="py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('jobs.show', job.slug)}>
                                                        <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-[#14a800]">
                                                            <Eye className="h-3.5 w-3.5 mr-1" />View
                                                        </Button>
                                                    </Link>
                                                    {job.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => approve(job.id)}
                                                                className="h-8 px-3 text-xs bg-[#14a800] hover:bg-[#108a00] text-white rounded-lg"
                                                            >
                                                                <Check className="h-3 w-3 mr-1" />Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setRejectDialog(job.id)}
                                                                className="h-8 px-3 text-xs border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 rounded-lg"
                                                            >
                                                                <X className="h-3 w-3 mr-1" />Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedRow === job.id && (
                                            <TableRow key={`${job.id}-expanded`} className="bg-gray-50/50">
                                                <TableCell colSpan={7} className="p-0">
                                                    <div className="px-6 py-4 border-t border-gray-100">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-4">{job.description}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requirements</h4>
                                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-4">{job.requirements}</p>
                                                                {job.benefits && (
                                                                    <>
                                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Benefits</h4>
                                                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-3">{job.benefits}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                                                            <span>📍 {job.location}</span>
                                                            <span>💼 {job.work_type}</span>
                                                            {job.salary_min && <span>💰 EGP {Number(job.salary_min).toLocaleString()} — {Number(job.salary_max).toLocaleString()}</span>}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <p className="text-sm font-medium text-gray-500">No jobs found</p>
                                        <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Job Listing</DialogTitle>
                        <DialogDescription>Provide a reason for rejecting this job listing.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Rejection reason..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        className="rounded-lg border-gray-200 resize-none"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialog(null)} className="rounded-lg">Cancel</Button>
                        <Button variant="destructive" onClick={reject} className="rounded-lg">Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
