import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState(null);

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        {avatarPreview ? (
                            <AvatarImage src={avatarPreview} />
                        ) : user.avatar ? (
                            <AvatarImage src={`/storage/${user.avatar}`} />
                        ) : null}
                        <AvatarFallback className="text-sm font-semibold bg-gray-100 text-gray-600">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-[#14a800] hover:text-[#108a00]">
                            Change Photo
                        </Label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData('avatar', file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or WebP. Max 2MB.</p>
                    </div>
                </div>

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
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} autoComplete="tel" className="h-11 rounded-lg border-gray-200 mt-1" placeholder="+20 100 000 0000" />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={e => setData('bio', e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] resize-none"
                        placeholder="Tell us about yourself..."
                    />
                    {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
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
