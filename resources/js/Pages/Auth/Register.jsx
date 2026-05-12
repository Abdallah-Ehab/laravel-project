import { useEffect, useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Briefcase, User, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3] p-4">
            <Head title="Register" />
            <Card className="w-full max-w-[480px] border border-gray-100 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <span className="text-2xl font-bold tracking-tight">
                            <span className="text-[#1a1f36]">Work</span>
                            <span className="text-[#14a800]">Bridge</span>
                        </span>
                    </div>
                    <CardTitle className="text-xl text-[#1a1f36]">Create an account</CardTitle>
                    <CardDescription>Join WorkBridge to find the right opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-5">
                        {/* Role Toggle */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2.5 block">I am a...</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('role', 'candidate')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition cursor-pointer ${
                                        data.role === 'candidate'
                                            ? 'border-[#14a800] bg-[#f0faf0]'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <User className={`h-6 w-6 ${data.role === 'candidate' ? 'text-[#14a800]' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${data.role === 'candidate' ? 'text-[#14a800]' : 'text-gray-600'}`}>Candidate</span>
                                    <span className="text-xs text-gray-400">I'm looking for work</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('role', 'employer')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition cursor-pointer ${
                                        data.role === 'employer'
                                            ? 'border-[#14a800] bg-[#f0faf0]'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <Briefcase className={`h-6 w-6 ${data.role === 'employer' ? 'text-[#14a800]' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${data.role === 'employer' ? 'text-[#14a800]' : 'text-gray-600'}`}>Employer</span>
                                    <span className="text-xs text-gray-400">I want to hire talent</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus className="h-11 rounded-lg border-gray-200" />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className="h-11 rounded-lg border-gray-200" />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    className="h-11 rounded-lg border-gray-200 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Minimum 8 characters with uppercase, lowercase, and a number.</p>
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required className="h-11 rounded-lg border-gray-200" />
                        </div>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 mt-0.5 rounded border-gray-300 text-[#14a800] focus:ring-[#14a800]" required />
                            <span className="text-sm text-gray-500">I agree to the <a href="#" className="text-[#14a800] hover:underline">Terms of Service</a> and <a href="#" className="text-[#14a800] hover:underline">Privacy Policy</a></span>
                        </label>
                        <Button type="submit" className="w-full bg-[#14a800] hover:bg-[#108a00] text-white h-11 rounded-lg text-sm font-medium" disabled={processing}>
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pb-6">
                    <p className="text-sm text-gray-500">Already have an account? <Link href={route('login')} className="text-[#14a800] hover:underline font-medium">Sign in</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
