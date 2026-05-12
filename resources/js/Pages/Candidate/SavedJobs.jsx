import { Link, Head } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import JobCard from '@/Components/JobCard';
import Pagination from '@/Components/Pagination';
import { Button } from '@/ui/button';

export default function SavedJobs({ savedJobs }) {
    return (
        <AppLayout title="Saved Jobs">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1f36]">Saved Jobs</h1>
                <p className="text-sm text-gray-500 mt-1">Jobs you've bookmarked for later</p>
            </div>

            {savedJobs.data?.length > 0 ? (
                <>
                    <div className="space-y-3">
                        {savedJobs.data.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                    <div className="mt-4">
                        <Pagination data={savedJobs} />
                    </div>
                </>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">No saved jobs yet</p>
                    <p className="text-xs text-gray-400 mt-1">Save jobs to review them later.</p>
                    <Link href={route('jobs.index')}>
                        <Button variant="outline" size="sm" className="mt-4 text-xs">Browse Jobs</Button>
                    </Link>
                </div>
            )}
        </AppLayout>
    );
}
