import { useEffect, useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Head title="Register" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Join our job board to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                        </div>
                        <div>
                            <Label>I am a...</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="candidate">Job Seeker</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>Create Account</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">Already have an account? <Link href={route('login')} className="text-primary hover:underline">Log in</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}