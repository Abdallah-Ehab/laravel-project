import { Link, Head } from '@inertiajs/react';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Card, CardContent } from '@/ui/card';

export default function Welcome({ recentJobs, canLogin, canRegister }) {
    return (
        <AppLayout title="Home">
            <section className="text-center py-16 px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Connect with top employers and discover opportunities that match your skills and passion.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href={route('jobs.index')}><Button size="lg">Browse Jobs</Button></Link>
                    {!canLogin && <Link href={route('register')}><Button size="lg" variant="outline">Get Started</Button></Link>}
                </div>
            </section>

            <section className="py-8">
                <h2 className="text-2xl font-bold mb-6">Recent Job Openings</h2>
                {recentJobs?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentJobs.map(job => (
                            <Link key={job.id} href={route('jobs.show', job.slug)}>
                                <Card className="hover:shadow-md transition cursor-pointer h-full">
                                    <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold">{job.title}</h3>
                                        <p className="text-muted-foreground">{job.company_name}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <Badge variant="secondary" className="gap-1 text-xs"><MapPin className="h-3 w-3" />{job.location}</Badge>
                                            <Badge variant="secondary" className="gap-1 text-xs"><Briefcase className="h-3 w-3" />{job.work_type}</Badge>
                                            {job.salary_min && <Badge variant="secondary" className="gap-1 text-xs"><DollarSign className="h-3 w-3" />${job.salary_min.toLocaleString()}</Badge>}
                                        </div>
                                        {job.category && <Badge className="mt-2">{job.category.name}</Badge>}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">No jobs available yet.</p>
                )}
                <div className="text-center mt-8">
                    <Link href={route('jobs.index')}><Button variant="outline">View All Jobs</Button></Link>
                </div>
            </section>
        </AppLayout>
    );
}