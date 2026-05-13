import { Link, Head } from '@inertiajs/react';
import { Search, Briefcase, Users, Star, ArrowRight, TrendingUp, FileText, UserCheck, MapPin, DollarSign, Clock } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';

export default function Welcome({ recentJobs, canLogin, canRegister }) {
    const stats = [
        { number: '12,400+', label: 'Jobs Posted' },
        { number: '8,200+', label: 'Candidates' },
        { number: '95%', label: 'Satisfaction Rate' },
    ];

    const howItWorks = [
        { icon: FileText, title: 'Post a Job', description: 'Create a detailed job listing in minutes and reach qualified candidates.' },
        { icon: UserCheck, title: 'Review Applicants', description: 'Browse through applications and find the perfect match for your team.' },
        { icon: TrendingUp, title: 'Hire the Best', description: 'Connect with top talent and grow your business with confidence.' },
    ];

    const categories = ['Technology', 'Design', 'Marketing', 'Finance', 'Sales', 'HR'];

    return (
        <AppLayout title="Home">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1f36] leading-tight max-w-4xl mx-auto">
                    Find the right talent.
                    <br />
                    <span className="text-[#14a800]">Find the right job.</span>
                </h1>
                <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                    WorkBridge connects employers with top candidates across every industry.
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Link href={route('register')}>
                        <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-12 px-8 text-base font-medium rounded-lg shadow-sm">
                            Find Talent
                        </Button>
                    </Link>
                    <Link href={route('jobs.index')}>
                        <Button variant="outline" className="h-12 px-8 text-base font-medium rounded-lg border-[#14a800] text-[#14a800] hover:bg-[#f0faf0]">
                            Find Jobs
                        </Button>
                    </Link>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const keyword = e.target.keyword.value.trim();
                        window.location.href = route('jobs.index', keyword ? { keyword } : {});
                    }}
                    className="max-w-2xl mx-auto mt-10 relative"
                >
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="flex-1 flex items-center px-4">
                            <Search className="h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="keyword"
                                placeholder="Search for jobs or skills..."
                                className="flex-1 h-14 px-3 text-sm outline-none border-0 bg-transparent"
                            />
                        </div>
                        <Button type="submit" className="h-14 px-6 bg-[#14a800] hover:bg-[#108a00] text-white rounded-none rounded-r-xl">
                            Search
                        </Button>
                    </div>
                </form>

                {/* Category Pills */}
                <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    {categories.map(cat => (
                        <Link key={cat} href={route('jobs.index', { category: cat.toLowerCase() })}>
                            <span className="inline-flex px-3.5 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:border-[#14a800] hover:text-[#14a800] transition cursor-pointer">
                                {cat}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white border-y border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {stats.map(stat => (
                            <div key={stat.label}>
                                <p className="text-3xl md:text-4xl font-bold text-[#14a800]">{stat.number}</p>
                                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-[#1a1f36] mb-10">How WorkBridge Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {howItWorks.map((item, i) => (
                            <Card key={i} className="border border-gray-100 shadow-sm text-center hover:shadow-md transition">
                                <CardContent className="pt-8 pb-6">
                                    <div className="h-14 w-14 rounded-full bg-[#f0faf0] flex items-center justify-center mx-auto">
                                        <item.icon className="h-7 w-7 text-[#14a800]" />
                                    </div>
                                    <h3 className="text-base font-semibold text-[#1a1f36] mt-4">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            {recentJobs?.length > 0 && (
                <section className="pb-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#1a1f36]">Latest Opportunities</h2>
                            <Link href={route('jobs.index')} className="text-sm font-medium text-[#14a800] hover:text-[#108a00] transition flex items-center gap-1">
                                Browse All Jobs <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {recentJobs.slice(0, 6).map(job => (
                                <Link key={job.id} href={route('jobs.show', job.slug)} className="block group">
                                    <Card className="border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 h-full">
                                        <CardContent className="p-5">
                                            <div className="h-10 w-10 rounded-lg bg-[#f0faf0] flex items-center justify-center mb-3">
                                                <span className="text-xs font-bold text-[#14a800]">
                                                    {job.company_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CO'}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#1a1f36] group-hover:text-[#14a800] transition-colors">{job.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{job.company_name}</p>
                                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{job.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                <Badge variant="secondary" className="text-[11px] font-medium bg-[#f0faf0] text-[#14a800] border-0 rounded-full px-2">{job.work_type}</Badge>
                                                {job.salary_min && (
                                                    <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2">
                                                        EGP {Number(job.salary_min).toLocaleString()}
                                                    </Badge>
                                                )}
                                                {job.location && (
                                                    <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2">
                                                        {job.location}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="bg-white border-t border-gray-100 py-16">
                <div className="text-center px-4">
                    <h2 className="text-2xl font-bold text-[#1a1f36]">Ready to get started?</h2>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">Join thousands of employers and candidates already using WorkBridge.</p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <Link href={route('register')}>
                            <Button className="bg-[#14a800] hover:bg-[#108a00] text-white h-12 px-8 text-base rounded-lg">Create an Account</Button>
                        </Link>
                        <Link href={route('jobs.index')}>
                            <Button variant="outline" className="h-12 px-8 text-base rounded-lg border-gray-300">Browse Jobs</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
