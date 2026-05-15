import { usePage, Link, Head, router } from '@inertiajs/react';
import { MapPin, Briefcase, DollarSign, Clock, Calendar, CheckCircle, BookmarkPlus, BookmarkCheck, Users, Eye, ChevronRight } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';
import { Separator } from '@/ui/separator';

const experienceLabels = { junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', any: 'Any Level' };

export default function Show({ job, hasApplied, isSaved, relatedJobs }) {
    const { auth } = usePage().props;

    const toggleSave = () => {
        if (!auth?.user) return;
        router.post(route('candidate.jobs.save', job.slug));
    };

    const initials = job.company_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CO';

    return (
        <AppLayout title={job.title}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href={route('home')} className="hover:text-[#14a800] transition">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href={route('jobs.index')} className="hover:text-[#14a800] transition">Jobs</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-600 truncate max-w-[200px]">{job.title}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-5">
                    {/* Job Header */}
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 rounded-xl bg-[#f0faf0] flex items-center justify-center shrink-0">
                                    {job.company_logo ? (
                                        <img src={job.company_logo} alt={job.company_name} className="h-14 w-14 rounded-xl object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold text-[#14a800]">{initials}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl md:text-2xl font-bold text-[#1a1f36]">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-sm font-medium text-gray-600">{job.company_name}</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                                        <Badge variant="secondary" className="text-[11px] font-medium bg-[#f0faf0] text-[#14a800] border-0 rounded-full px-2.5">{job.work_type}</Badge>
                                        <span className="text-xs text-gray-400">{job.created_at}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2.5">
                                            {experienceLabels[job.experience_level]}
                                        </Badge>
                                        {job.category && (
                                            <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2.5">
                                                {job.category.name}
                                            </Badge>
                                        )}
                                        {job.deadline && (
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />Deadline: {job.deadline}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-6">
                            <h2 className="text-base font-semibold text-[#1a1f36] mb-3">About the role</h2>
                            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {job.requirements && (
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="text-base font-semibold text-[#1a1f36] mb-3">Requirements</h2>
                                <ul className="space-y-2">
                                    {job.requirements.split('\n').filter(Boolean).map((req, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#14a800] mt-2 shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="text-base font-semibold text-[#1a1f36] mb-3">Benefits</h2>
                                <ul className="space-y-2">
                                    {job.benefits.split('\n').filter(Boolean).map((ben, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-[#14a800] mt-0.5 shrink-0" />
                                            {ben}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:w-[360px] shrink-0 space-y-4">
                    <div className="sticky top-24 space-y-4">
                        {/* Apply Card */}
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5">
                                {job.salary_min && (
                                    <div className="mb-4">
                                        <p className="text-lg font-bold text-[#14a800]">
                                            EGP {Number(job.salary_min).toLocaleString()} — {Number(job.salary_max).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-400">per month</p>
                                    </div>
                                )}

                                {auth?.user?.role === 'candidate' && (
                                    <div className="space-y-2">
                                        {!hasApplied ? (
                                            <Link href={route('candidate.apply.create', job.slug)}>
                                                <Button className="w-full bg-[#14a800] hover:bg-[#108a00] text-white h-11 rounded-lg text-sm">
                                                    Apply Now
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button className="w-full bg-[#14a800] text-white h-11 rounded-lg text-sm" disabled>
                                                Applied ✓
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={toggleSave}
                                            className="w-full h-11 rounded-lg text-sm border-gray-200"
                                        >
                                            {isSaved ? (
                                                <><BookmarkCheck className="h-4 w-4 mr-2 text-[#14a800]" />Saved</>
                                            ) : (
                                                <><BookmarkPlus className="h-4 w-4 mr-2" />Save Job</>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {!auth?.user && (
                                    <div className="space-y-2">
                                        <Link href={route('login')}>
                                            <Button className="w-full bg-[#14a800] hover:bg-[#108a00] text-white h-11 rounded-lg text-sm">
                                                Log in to Apply
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                <Separator className="my-4" />

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Applicants</span>
                                        <span className="font-medium text-gray-700">{job.applications_count || 0}</span>
                                    </div>
                                    {job.deadline && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Deadline</span>
                                            <span className="font-medium text-gray-700">{job.deadline}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />Views</span>
                                        <span className="font-medium text-gray-700">{job.views || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Card */}
                        <Card className="border border-gray-100 shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-12 w-12 rounded-xl bg-[#f0faf0] flex items-center justify-center shrink-0">
                                        {job.company_logo ? (
                                            <img src={job.company_logo} alt={job.company_name} className="h-12 w-12 rounded-xl object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-[#14a800]">{initials}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a1f36]">{job.company_name}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-[#14a800]">
                                            <CheckCircle className="h-3 w-3" />Verified Employer
                                        </span>
                                    </div>
                                </div>
                                {job.company_description && (
                                    <p className="text-sm text-gray-500 leading-relaxed">{job.company_description}</p>
                                )}
                                <Link href={route('jobs.index', { company: job.company_name })} className="text-sm text-[#14a800] hover:text-[#108a00] font-medium mt-2 inline-block">
                                    View all jobs by {job.company_name} →
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs?.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-lg font-bold text-[#1a1f36] mb-4">Related Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedJobs.map(rj => (
                            <Link key={rj.id} href={route('jobs.show', rj.slug)} className="block group">
                                <Card className="border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                                    <CardContent className="p-4">
                                        <h3 className="text-sm font-semibold text-[#1a1f36] group-hover:text-[#14a800] transition-colors truncate">{rj.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{rj.company_name}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary" className="text-[11px] font-medium bg-[#f0faf0] text-[#14a800] border-0 rounded-full px-2">{rj.work_type}</Badge>
                                            <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2">{rj.location}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </AppLayout>
    );
}
