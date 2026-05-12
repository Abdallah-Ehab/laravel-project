import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input id="current_password" ref={currentPasswordInput} value={data.current_password} onChange={e => setData('current_password', e.target.value)} type="password" className="h-11 rounded-lg border-gray-200 mt-1" autoComplete="current-password" />
                    {errors.current_password && <p className="text-sm text-red-500 mt-1">{errors.current_password}</p>}
                </div>
                <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" ref={passwordInput} value={data.password} onChange={e => setData('password', e.target.value)} type="password" className="h-11 rounded-lg border-gray-200 mt-1" autoComplete="new-password" />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input id="password_confirmation" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} type="password" className="h-11 rounded-lg border-gray-200 mt-1" autoComplete="new-password" />
                    {errors.password_confirmation && <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>}
                </div>
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
