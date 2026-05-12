import { Link, Head } from '@inertiajs/react';
import { Users, Building2, Briefcase, CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';

export default function Dashboard({ stats }) {
    const statCards = [
        { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-[#14a800] bg-[#f0faf0]' },
        { label: 'Employers', value: stats.total_employers, icon: Building2, color: 'text-blue-500 bg-blue-50' },
        { label: 'Candidates', value: stats.total_candidates, icon: Users, color: 'text-purple-500 bg-purple-50' },
        { label: 'Applications', value: stats.total_applications, icon: FileText, color: 'text-amber-500 bg-amber-50' },
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

            {/* User stats */}
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

            {/* Job stats */}
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
        </AppLayout>
    );
}
