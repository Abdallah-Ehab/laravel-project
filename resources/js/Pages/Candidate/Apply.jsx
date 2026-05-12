import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

export default function Apply({ job }) {
    const { data, setData, post, processing, errors } = useForm({ resume: null, cover_note: '' });
    const [resumeName, setResumeName] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('candidate.apply.store', job.slug));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('resume', file);
            setResumeName(file.name);
        }
    };

    const clearFile = () => {
        setData('resume', null);
        setResumeName(null);
    };

    return (
        <AppLayout title={"Apply - " + job.title}>
            <div className="max-w-[600px] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Apply for Position</h1>
                    <p className="text-sm text-gray-500 mt-1">{job.title} — {job.company_name}</p>
                </div>

                <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Resume Upload */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Resume (PDF) *</Label>
                                {resumeName ? (
                                    <div className="flex items-center justify-between bg-[#f0faf0] border border-[#14a800]/20 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-[#14a800]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#1a1f36]">{resumeName}</p>
                                                <p className="text-xs text-[#14a800] flex items-center gap-1"><CheckCircle className="h-3 w-3" />Uploaded successfully</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={clearFile} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/50 text-gray-400 hover:text-red-500 transition">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#14a800] hover:bg-[#f0faf0]/50 transition group">
                                        <Upload className="h-8 w-8 text-gray-300 group-hover:text-[#14a800] transition" />
                                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-700 transition">Click or drag your resume here</p>
                                        <p className="text-xs text-gray-400 mt-1">PDF only, max 10MB</p>
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.resume && <p className="text-sm text-red-500 mt-1.5">{errors.resume}</p>}
                            </div>

                            {/* Cover Note */}
                            <div>
                                <Label htmlFor="cover_note" className="text-sm font-medium text-gray-700">Cover Note <span className="text-gray-400 font-normal">(optional)</span></Label>
                                <Textarea
                                    id="cover_note"
                                    value={data.cover_note}
                                    onChange={e => setData('cover_note', e.target.value)}
                                    rows={5}
                                    placeholder="Tell the employer why you're a great fit..."
                                    className="mt-1.5 rounded-lg border-gray-200 resize-none"
                                />
                                {errors.cover_note && <p className="text-sm text-red-500 mt-1.5">{errors.cover_note}</p>}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" className="bg-[#14a800] hover:bg-[#108a00] text-white h-11 px-6 rounded-lg text-sm font-medium" disabled={processing}>
                                    Submit Application
                                </Button>
                                <Link href={route('jobs.show', job.slug)}>
                                    <Button type="button" variant="ghost" className="h-11 px-4 text-sm text-gray-500 hover:text-gray-700">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
