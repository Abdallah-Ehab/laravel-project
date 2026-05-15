import { Link, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';
import { User, Mail, Phone, Calendar, Briefcase, Bookmark, Settings } from 'lucide-react';

export default function Index({ applications_count, saved_jobs_count }) {
    const user = usePage().props.auth.user;
    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    const roleBadge = {
        candidate: 'bg-purple-50 text-purple-600 border-purple-200',
        employer: 'bg-blue-50 text-blue-600 border-blue-200',
    };

    return (
        <AppLayout title="My Profile">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1f36]">My Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="border border-gray-100 shadow-sm lg:col-span-1">
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-24 w-24 mx-auto">
                            {user.avatar ? <AvatarImage src={`/storage/${user.avatar}`} /> : null}
                            <AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">{initials}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg font-semibold text-[#1a1f36] mt-4">{user.name}</h2>
                        <div className="flex justify-center mt-2">
                            <Badge variant="outline" className={`text-[11px] font-medium capitalize px-3 py-1 rounded-full ${roleBadge[user.role] || ''}`}>
                                {user.role}
                            </Badge>
                        </div>
                        <div className="mt-4 space-y-2 text-left">
                            <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>Member since 2026</span>
                            </div>
                        </div>
                        <Link href={route('profile.edit')}>
                            <Button variant="outline" className="w-full mt-5 h-10 text-sm rounded-lg border-gray-200">
                                <Settings className="h-4 w-4 mr-2" />Edit Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio */}
                    {user.bio && (
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-semibold text-[#1a1f36] flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-gray-400" />About
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{user.bio}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                    <Briefcase className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1a1f36]">{applications_count}</p>
                                    <p className="text-xs text-gray-500">Applications Submitted</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                    <Bookmark className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1a1f36]">{saved_jobs_count}</p>
                                    <p className="text-xs text-gray-500">Saved Jobs</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Links */}
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                            <h3 className="text-sm font-semibold text-[#1a1f36] mb-3">Quick Links</h3>
                            <div className="space-y-2">
                                <Link href={route('candidate.applications.index')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 hover:text-[#1a1f36]">
                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                    View My Applications
                                </Link>
                                <Link href={route('candidate.saved-jobs.index')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600 hover:text-[#1a1f36]">
                                    <Bookmark className="h-4 w-4 text-gray-400" />
                                    View Saved Jobs
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
