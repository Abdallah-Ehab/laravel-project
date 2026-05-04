import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Label } from '@/ui/label';

export default function JobFilters({ categories, filters }) {
    const submitFilters = (data) => {
        const clean = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== '' && v !== undefined));
        router.get(route('jobs.index'), clean, { preserveState: true, replace: true });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        submitFilters({ ...filters, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        submitFilters({ ...filters, [name]: value === 'all' ? '' : value });
    };

    const clearFilters = () => {
        router.get(route('jobs.index'), {}, { preserveState: true, replace: true });
    };

    const hasFilters = Object.values(filters).some(v => v && v !== '');

    return (
        <div className="bg-card border rounded-lg p-4 space-y-4">
            <div>
                <Label htmlFor="keyword">Search</Label>
                <Input id="keyword" name="keyword" placeholder="Job title or keyword..." defaultValue={filters.keyword || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label>Category</Label>
                    <Select defaultValue={filters.category || 'all'} onValueChange={(v) => handleSelectChange('category', v)}>
                        <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Location</Label>
                    <Input name="location" placeholder="City or region..." defaultValue={filters.location || ''} onChange={handleChange} />
                </div>
                <div>
                    <Label>Work Type</Label>
                    <Select defaultValue={filters.work_type || 'all'} onValueChange={(v) => handleSelectChange('work_type', v)}>
                        <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="on-site">On-site</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Experience</Label>
                    <Select defaultValue={filters.experience_level || 'all'} onValueChange={(v) => handleSelectChange('experience_level', v)}>
                        <SelectTrigger><SelectValue placeholder="All levels" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All levels</SelectItem>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid-Level</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="any">Any</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            )}
        </div>
    );
}