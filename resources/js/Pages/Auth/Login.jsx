import { useEffect, useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3] p-4">
            <Head title="Login" />
            <Card className="w-full max-w-[440px] border border-gray-100 shadow-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Link href={route('home')}>
                            <span className="text-2xl font-bold tracking-tight">
                                <span className="text-[#1a1f36]">Work</span>
                                <span className="text-[#14a800]">Bridge</span>
                            </span>
                        </Link>
                    </div>
                    <CardTitle className="text-xl text-[#1a1f36]">Welcome back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    {status && <div className="bg-[#f0faf0] text-[#14a800] text-sm p-3 rounded-lg mb-4">{status}</div>}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required autoFocus className="h-11 rounded-lg border-gray-200" />
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
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#14a800] focus:ring-[#14a800]"
                                />
                                <span className="text-sm text-gray-500">Remember me</span>
                            </label>
                            <Link href={route('password.request')} className="text-sm text-[#14a800] hover:underline font-medium">Forgot password?</Link>
                        </div>
                        <Button type="submit" className="w-full bg-[#14a800] hover:bg-[#108a00] text-white h-11 rounded-lg text-sm font-medium" disabled={processing}>
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pb-6">
                    <p className="text-sm text-gray-500">Don't have an account? <Link href={route('register')} className="text-[#14a800] hover:underline font-medium">Create one</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
