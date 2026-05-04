import { Link } from '@inertiajs/react';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Badge } from '@/ui/badge';

const experienceLabels = { junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', any: 'Any Level' };

export default function JobCard({ job }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company_name}</p>
                    </div>
                    {job.company_logo && <img src={job.company_logo} alt={job.company_name} className="h-12 w-12 rounded object-cover" />}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="gap-1"><MapPin className="h-3 w-3" />{job.location}</Badge>
                    <Badge variant="secondary" className="gap-1"><Briefcase className="h-3 w-3" />{job.work_type}</Badge>
                    {job.salary_min && <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3" />${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}</Badge>}
                </div>
                {job.category && <Badge className="mt-2">{job.category.name}</Badge>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">{job.created_at}</span>
                <Link href={route('jobs.show', job.slug)}>
                    <span className="text-sm font-medium text-primary hover:underline">View Details</span>
                </Link>
            </CardFooter>
        </Card>
    );
}