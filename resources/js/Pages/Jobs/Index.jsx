import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import JobCard from '@/Components/JobCard';
import JobFilters from '@/Components/JobFilters';
import Pagination from '@/Components/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

export default function Index({ jobs, categories, filters }) {
    const [sort, setSort] = useState('recent');

    return (
        <AppLayout title="Browse Jobs">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1f36]">Find Your Next Opportunity</h1>
                <p className="text-sm text-gray-500 mt-1">Browse thousands of jobs from top employers</p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="hidden lg:block w-[280px] shrink-0">
                    <div className="sticky top-24">
                        <JobFilters categories={categories} filters={filters} />
                    </div>
                </div>

                {/* Main */}
                <div className="flex-1 min-w-0">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium text-[#1a1f36]">{jobs.total}</span> jobs
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Sort by:</span>
                            <Select defaultValue={sort} onValueChange={setSort}>
                                <SelectTrigger className="h-8 w-40 text-sm border-gray-200 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Most Recent</SelectItem>
                                    <SelectItem value="salary">Highest Salary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Job Cards */}
                    {jobs.data?.length > 0 ? (
                        <div className="space-y-3">
                            {jobs.data.map(job => <JobCard key={job.id} job={job} />)}
                            <div className="pt-4">
                                <Pagination data={jobs} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                            <p className="text-gray-500 font-medium">No jobs found matching your criteria.</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile filters */}
            <div className="lg:hidden mt-6">
                <details className="bg-white rounded-xl border border-gray-100">
                    <summary className="px-4 py-3 text-sm font-medium text-[#1a1f36] cursor-pointer">Filters</summary>
                    <div className="px-4 pb-4">
                        <JobFilters categories={categories} filters={filters} />
                    </div>
                </details>
            </div>
        </AppLayout>
    );
}
