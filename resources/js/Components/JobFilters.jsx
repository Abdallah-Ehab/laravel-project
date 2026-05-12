import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';
import { Search, X } from 'lucide-react';

export default function JobFilters({ categories, filters }) {
    const [local, setLocal] = useState({
        keyword: filters.keyword || '',
        category: filters.category || '',
        work_type: filters.work_type || '',
        experience_level: filters.experience_level || '',
        salary_min: filters.salary_min || '',
        salary_max: filters.salary_max || '',
        date_posted: filters.date_posted || '',
    });

    const update = (key, value) => {
        const next = { ...local, [key]: value };
        setLocal(next);
    };

    const submitFilters = () => {
        const clean = Object.fromEntries(
            Object.entries(local).filter(([_, v]) => v !== '' && v !== undefined)
        );
        router.get(route('jobs.index'), clean, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setLocal({ keyword: '', category: '', work_type: '', experience_level: '', salary_min: '', salary_max: '', date_posted: '' });
        router.get(route('jobs.index'), {}, { preserveState: true, replace: true });
    };

    const hasFilters = Object.values(local).some(v => v && v !== '');
    const workTypes = ['remote', 'on-site', 'hybrid'];
    const experienceLevels = ['junior', 'mid', 'senior'];
    const dateOptions = [
        { value: '', label: 'Any time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
    ];

    return (
        <div className="bg-white border border-border rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1f36]">Filter Jobs</h3>
                {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-[#14a800] hover:text-[#108a00] font-medium transition">
                        Clear all
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search jobs or skills..."
                    value={local.keyword}
                    onChange={e => update('keyword', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitFilters()}
                    className="pl-9 h-10 text-sm rounded-lg border-gray-200"
                />
            </div>

            <Separator />

            {/* Category */}
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-2">
                    {categories?.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={local.category === cat.slug}
                                onChange={() => update('category', local.category === cat.slug ? '' : cat.slug)}
                                className="h-4 w-4 rounded border-gray-300 text-[#14a800] focus:ring-[#14a800]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Work Type */}
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Work Type</h4>
                <div className="space-y-2">
                    {workTypes.map(wt => (
                        <label key={wt} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="work_type"
                                checked={local.work_type === wt}
                                onChange={() => update('work_type', local.work_type === wt ? '' : wt)}
                                className="h-4 w-4 border-gray-300 text-[#14a800] focus:ring-[#14a800]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize transition">{wt}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Experience Level */}
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Experience Level</h4>
                <div className="space-y-2">
                    {experienceLevels.map(level => (
                        <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="experience_level"
                                checked={local.experience_level === level}
                                onChange={() => update('experience_level', local.experience_level === level ? '' : level)}
                                className="h-4 w-4 border-gray-300 text-[#14a800] focus:ring-[#14a800]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize transition">{level === 'mid' ? 'Mid-Level' : level}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Salary Range */}
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Salary Range</h4>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">EGP</span>
                        <Input
                            type="number"
                            placeholder="Min"
                            value={local.salary_min}
                            onChange={e => update('salary_min', e.target.value)}
                            className="pl-10 h-10 text-sm rounded-lg border-gray-200"
                        />
                    </div>
                    <span className="text-gray-300">—</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">EGP</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={local.salary_max}
                            onChange={e => update('salary_max', e.target.value)}
                            className="pl-10 h-10 text-sm rounded-lg border-gray-200"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Date Posted */}
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Date Posted</h4>
                <div className="space-y-2">
                    {dateOptions.map(opt => (
                        <label key={opt.value || 'any'} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="date_posted"
                                checked={local.date_posted === opt.value}
                                onChange={() => update('date_posted', opt.value)}
                                className="h-4 w-4 border-gray-300 text-[#14a800] focus:ring-[#14a800]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button
                onClick={submitFilters}
                className="w-full bg-[#14a800] hover:bg-[#108a00] text-white h-11 rounded-lg text-sm font-medium"
            >
                Apply Filters
            </Button>
        </div>
    );
}
