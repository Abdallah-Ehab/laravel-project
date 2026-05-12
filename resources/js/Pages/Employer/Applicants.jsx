import { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Avatar, AvatarFallback } from '@/ui/avatar';
import { FileText, ChevronLeft, Check, X } from 'lucide-react';

const badgeStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    accepted: 'bg-[#f0faf0] text-[#14a800] border-[#14a800]/20',
    rejected: 'bg-red-50 text-red-500 border-red-200',
};

export default function Applicants({ job, applications }) {
    const [tab, setTab] = useState('all');
    const updateStatus = (id, status) => {
        router.patch(route('employer.applications.status', id), { status });
    };

    const filtered = tab === 'all' ? applications.data : applications.data?.filter(a => a.status === tab);
    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'rejected', label: 'Rejected' },
    ];

    const counts = {
        all: applications.total || 0,
        pending: applications.data?.filter(a => a.status === 'pending').length || 0,
        accepted: applications.data?.filter(a => a.status === 'accepted').length || 0,
        rejected: applications.data?.filter(a => a.status === 'rejected').length || 0,
    };

    return (
        <AppLayout title="Applicants">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <Link href={route('employer.jobs.index')} className="text-gray-400 hover:text-gray-600 transition">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Applicants for: {job.title}</h1>
                </div>
                <p className="text-sm text-gray-500 ml-7">{applications.total} total applicants · {counts.pending} pending review</p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                            tab === t.key
                                ? 'border-[#14a800] text-[#14a800]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t.label} ({counts[t.key]})
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered?.length > 0 ? (
                    filtered.map(app => {
                        const initials = app.candidate_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
                        return (
                            <Card key={app.id} className="border border-gray-100 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-xs font-medium bg-gray-100 text-gray-600">{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-[#1a1f36]">{app.candidate_name}</p>
                                                <span className="text-xs text-gray-400">Applied {app.created_at}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                {app.resume_path && (
                                                    <a href={`/storage/${app.resume_path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#14a800] hover:underline flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />Resume
                                                    </a>
                                                )}
                                                {app.cover_note && (
                                                    <span className="text-xs text-gray-400 italic truncate">"{app.cover_note.slice(0, 80)}..."</span>
                                                )}
                                                <span className="text-xs text-gray-400">{app.candidate_email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {app.status === 'pending' ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateStatus(app.id, 'accepted')}
                                                        className="h-8 px-3 text-xs bg-[#14a800] hover:bg-[#108a00] text-white rounded-lg"
                                                    >
                                                        <Check className="h-3 w-3 mr-1" />Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateStatus(app.id, 'rejected')}
                                                        className="h-8 px-3 text-xs border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 rounded-lg"
                                                    >
                                                        <X className="h-3 w-3 mr-1" />Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <Badge variant="outline" className={`text-[11px] font-medium px-3 py-1 rounded-full capitalize ${badgeStyles[app.status] || ''}`}>
                                                    {app.status === 'accepted' ? 'Accepted ✓' : 'Rejected'}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500">No applicants found.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
