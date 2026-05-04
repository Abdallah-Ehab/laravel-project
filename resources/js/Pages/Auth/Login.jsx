import { useEffect } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Head title="Login" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Log in to your account</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required autoFocus />
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>Log In</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-between w-full">
                    <Link href={route('register')} className="text-sm text-primary hover:underline">Create an account</Link>
                    <Link href={route('password.request')} className="text-sm text-primary hover:underline">Forgot password?</Link>
                </CardFooter>
            </Card>
        </div>
    );
}