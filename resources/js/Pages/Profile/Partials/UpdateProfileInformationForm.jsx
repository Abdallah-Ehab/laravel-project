import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus autoComplete="name" className="h-11 rounded-lg border-gray-200 mt-1" />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required autoComplete="username" className="h-11 rounded-lg border-gray-200 mt-1" />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-700">
                            Your email address is unverified.{" "}
                            <Link href={route('verification.send')} method="post" as="button" className="text-amber-700 underline hover:text-amber-800 font-medium">
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="text-sm text-[#14a800] mt-1">A new verification link has been sent to your email address.</p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <Button type="submit" className="bg-[#14a800] hover:bg-[#108a00] text-white h-10 px-6 rounded-lg text-sm" disabled={processing}>
                        Save
                    </Button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-[#14a800]">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
