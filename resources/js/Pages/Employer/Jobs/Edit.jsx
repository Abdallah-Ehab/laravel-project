import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Card, CardContent } from '@/ui/card';
import { Separator } from '@/ui/separator';
import { Upload, MapPin, Save } from 'lucide-react';

export default function Edit({ job, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        title: job.title, category_id: job.category_id, description: job.description,
        requirements: job.requirements, benefits: job.benefits || '',
        salary_min: job.salary_min || '', salary_max: job.salary_max || '',
        location: job.location, work_type: job.work_type, experience_level: job.experience_level,
        deadline: job.deadline || '', company_name: job.company_name, company_logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        put(route('employer.jobs.update', job.id));
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('company_logo', file);
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const workTypes = ['remote', 'on-site', 'hybrid'];
    const experienceLevels = [
        { value: 'any', label: 'Any' },
        { value: 'junior', label: 'Junior' },
        { value: 'mid', label: 'Mid-Level' },
        { value: 'senior', label: 'Senior' },
    ];

    const toggleBtn = (name, value, options) => (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => {
                const val = opt.value || opt;
                const label = opt.label || opt.charAt(0).toUpperCase() + opt.slice(1);
                const isSelected = data[name] === val;
                return (
                    <button
                        key={val}
                        type="button"
                        onClick={() => setData(name, val)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                            isSelected
                                ? 'bg-[#f0faf0] border-[#14a800] text-[#14a800]'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <AppLayout title="Edit Job">
            <div className="max-w-[720px] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Edit Job</h1>
                    <p className="text-sm text-gray-500 mt-1">Update your job listing details</p>
                </div>

                <form onSubmit={submit}>
                    <Card className="border border-gray-100 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            {/* Section 1: Job Details */}
                            <div>
                                <h2 className="text-sm font-semibold text-[#1a1f36] uppercase tracking-wider">Job Details</h2>
                                <Separator className="my-3" />
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Job Title *</Label>
                                        <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} className="h-11 rounded-lg border-gray-200 mt-1" />
                                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <Label>Category *</Label>
                                        <Select value={data.category_id.toString()} onValueChange={v => setData('category_id', v)}>
                                            <SelectTrigger className="h-11 rounded-lg border-gray-200 mt-1">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Work Type *</Label>
                                        <div className="mt-1.5">
                                            {toggleBtn('work_type', data.work_type, workTypes)}
                                        </div>
                                        {errors.work_type && <p className="text-sm text-red-500 mt-1">{errors.work_type}</p>}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Experience Level *</Label>
                                        <div className="mt-1.5">
                                            {toggleBtn('experience_level', data.experience_level, experienceLevels)}
                                        </div>
                                        {errors.experience_level && <p className="text-sm text-red-500 mt-1">{errors.experience_level}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Description */}
                            <div>
                                <h2 className="text-sm font-semibold text-[#1a1f36] uppercase tracking-wider">Description</h2>
                                <Separator className="my-3" />
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} rows={6} className="mt-1 rounded-lg border-gray-200 resize-none" />
                                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="requirements">Requirements *</Label>
                                        <Textarea id="requirements" value={data.requirements} onChange={e => setData('requirements', e.target.value)} rows={5} className="mt-1 rounded-lg border-gray-200 resize-none" />
                                        {errors.requirements && <p className="text-sm text-red-500 mt-1">{errors.requirements}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="benefits">Benefits <span className="text-gray-400 font-normal">(optional)</span></Label>
                                        <Textarea id="benefits" value={data.benefits} onChange={e => setData('benefits', e.target.value)} rows={4} className="mt-1 rounded-lg border-gray-200 resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Compensation & Location */}
                            <div>
                                <h2 className="text-sm font-semibold text-[#1a1f36] uppercase tracking-wider">Compensation & Location</h2>
                                <Separator className="my-3" />
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="salary_min">Min Salary</Label>
                                            <div className="relative mt-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">EGP</span>
                                                <Input id="salary_min" type="number" value={data.salary_min} onChange={e => setData('salary_min', e.target.value)} className="h-11 rounded-lg border-gray-200 pl-12" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="salary_max">Max Salary</Label>
                                            <div className="relative mt-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">EGP</span>
                                                <Input id="salary_max" type="number" value={data.salary_max} onChange={e => setData('salary_max', e.target.value)} className="h-11 rounded-lg border-gray-200 pl-12" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location *</Label>
                                        <div className="relative mt-1">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input id="location" value={data.location} onChange={e => setData('location', e.target.value)} className="h-11 rounded-lg border-gray-200 pl-9" />
                                        </div>
                                        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="deadline">Application Deadline</Label>
                                        <Input id="deadline" type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className="h-11 rounded-lg border-gray-200 mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Company Info */}
                            <div>
                                <h2 className="text-sm font-semibold text-[#1a1f36] uppercase tracking-wider">Company Info</h2>
                                <Separator className="my-3" />
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="company_name">Company Name *</Label>
                                        <Input id="company_name" value={data.company_name} onChange={e => setData('company_name', e.target.value)} className="h-11 rounded-lg border-gray-200 mt-1" />
                                        {errors.company_name && <p className="text-sm text-red-500 mt-1">{errors.company_name}</p>}
                                    </div>
                                    <div>
                                        <Label>Company Logo</Label>
                                        {logoPreview || job.company_logo ? (
                                            <div className="mt-1 flex items-center gap-4 p-4 bg-[#f0faf0] border border-[#14a800]/20 rounded-xl">
                                                <img src={logoPreview || job.company_logo} alt="Logo preview" className="h-14 w-14 rounded-lg object-cover" />
                                                <div>
                                                    <p className="text-sm font-medium text-[#1a1f36]">Logo uploaded</p>
                                                    <button type="button" onClick={() => { setData('company_logo', null); setLogoPreview(null); }} className="text-xs text-red-500 hover:underline">Remove</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 mt-1 cursor-pointer hover:border-[#14a800] hover:bg-[#f0faf0]/50 transition group">
                                                <Upload className="h-6 w-6 text-gray-300 group-hover:text-[#14a800] transition" />
                                                <p className="text-sm text-gray-500 mt-1.5 group-hover:text-gray-700 transition">Click or drag your logo here</p>
                                                <Input id="company_logo" type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between mt-6">
                        <Link href={route('employer.jobs.index')}>
                            <Button type="button" variant="outline" className="h-11 px-6 rounded-lg text-sm border-gray-200">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-[#14a800] hover:bg-[#108a00] text-white h-11 px-6 rounded-lg text-sm" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />Update Job
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
