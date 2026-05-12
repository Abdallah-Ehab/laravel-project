import { Link, Head } from '@inertiajs/react';
import { Trash2, Briefcase } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { router } from '@inertiajs/react';

const statusStyles = {
    pending: 'bg-orange-50 text-orange-600 border-orange-200',
    interview: 'bg-blue-50 text-blue-600 border-blue-200',
    accepted: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Applications({ applications }) {
    const withdraw = (id) => {
        router.delete(route('candidate.applications.destroy', id));
    };

    return (
        <AppLayout title="My Applications">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">My Applications</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your job applications</p>
                </div>
                <Link href={route('jobs.index')}>
                    <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 rounded-lg text-sm">
                        <Briefcase className="h-4 w-4 mr-2" />Browse Jobs
                    </Button>
                </Link>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Job</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Company</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Status</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10">Applied</TableHead>
                                <TableHead className="text-xs font-medium text-gray-500 h-10 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.data?.length > 0 ? (
                                applications.data.map(app => (
                                    <TableRow key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <TableCell className="py-3.5">
                                            <Link href={route('jobs.show', app.job_slug)} className="text-sm font-medium text-[#1a1f36] hover:text-[#14a800] transition">{app.job_title}</Link>
                                        </TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{app.company_name}</TableCell>
                                        <TableCell className="py-3.5">
                                            <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${statusStyles[app.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3.5 text-sm text-gray-500">{app.created_at}</TableCell>
                                        <TableCell className="py-3.5 text-right">
                                            {app.status === 'pending' && (
                                                <ConfirmDialog
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                    title="Withdraw Application"
                                                    description="Are you sure you want to withdraw this application?"
                                                    onConfirm={() => withdraw(app.id)}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center">
                                            <Briefcase className="h-10 w-10 text-gray-300 mb-3" />
                                            <p className="text-sm font-medium text-gray-500">No applications yet</p>
                                            <p className="text-xs text-gray-400 mt-1">Start applying to jobs you're interested in.</p>
                                            <Link href={route('jobs.index')}>
                                                <Button variant="outline" size="sm" className="mt-4 text-xs">Browse Jobs</Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {applications.data?.length > 0 && <div className="p-4 border-t border-gray-50"><Pagination data={applications} /></div>}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
