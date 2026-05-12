import { Link, Head } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { router } from '@inertiajs/react';

const badgeStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    approved: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Index({ jobs }) {
    const deleteJob = (id) => {
        router.delete(route('employer.jobs.destroy', id));
    };

    return (
        <AppLayout title="My Jobs">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">My Jobs</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your job listings</p>
                </div>
                <Link href={route('employer.jobs.create')}>
                    <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm">
                        <Plus className="h-4 w-4 mr-2" />Post a Job
                    </Button>
                </Link>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Title</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Status</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Applications</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Created</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.data?.length > 0 ? (
                                jobs.data.map(job => (
                                    <TableRow key={job.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <TableCell className="py-3.5">
                                            <span className="text-sm font-medium text-[#1a1f36]">{job.title}</span>
                                        </TableCell>
                                        <TableCell className="py-3.5">
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${badgeStyles[job.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {job.status === 'pending' ? 'Pending Approval' : job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{job.applications_count}</TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{job.created_at}</TableCell>
                                        <TableCell className="py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('employer.applicants.index', job.slug)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#14a800]">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('employer.jobs.edit', job.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <ConfirmDialog
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                    title="Delete Job"
                                                    description="Are you sure you want to delete this job? This action cannot be undone."
                                                    onConfirm={() => deleteJob(job.id)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <p className="text-sm font-medium text-gray-500">No jobs posted yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Create your first job listing.</p>
                                        <Link href={route('employer.jobs.create')}>
                                            <Button variant="outline" size="sm" className="mt-4 text-xs">Post a Job</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {jobs.data?.length > 0 && <div className="p-4 border-t border-gray-50"><Pagination data={jobs} /></div>}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
