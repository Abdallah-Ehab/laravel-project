import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';

const experienceLabels = { junior: 'Junior', mid: 'Mid-Level', senior: 'Senior', any: 'Any Level' };

export default function JobCard({ job }) {
    const initials = job.company_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CO';

    return (
        <Link href={route('jobs.show', job.slug)} className="block group">
            <Card className="hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 border border-border/80 overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Company logo */}
                        <div className="h-12 w-12 rounded-lg bg-[#f0faf0] flex items-center justify-center shrink-0">
                            {job.company_logo ? (
                                <img src={job.company_logo} alt={job.company_name} className="h-12 w-12 rounded-lg object-cover" />
                            ) : (
                                <span className="text-sm font-bold text-[#14a800]">{initials}</span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Title row */}
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#1a1f36] group-hover:text-[#14a800] transition-colors truncate">
                                    {job.title}
                                </h3>
                                <Badge variant="secondary" className="shrink-0 text-[11px] font-medium bg-[#f0faf0] text-[#14a800] border-0 rounded-full px-2.5 py-0.5">
                                    {job.work_type}
                                </Badge>
                            </div>

                            {/* Company + location row */}
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600 font-medium">{job.company_name}</span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />{job.location}
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-500">{job.created_at}</span>
                            </div>

                            {/* Description snippet */}
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                {job.description}
                            </p>

                            {/* Bottom row: salary + badges + CTA */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {job.salary_min && (
                                        <span className="text-sm font-semibold text-[#14a800]">
                                            EGP {Number(job.salary_min).toLocaleString()} — {Number(job.salary_max).toLocaleString()}
                                        </span>
                                    )}
                                    <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2.5">
                                        {experienceLabels[job.experience_level] || job.experience_level}
                                    </Badge>
                                    {job.category && (
                                        <Badge variant="outline" className="text-[11px] font-medium text-gray-500 border-gray-200 rounded-full px-2.5">
                                            {job.category.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
