import { Link } from '@inertiajs/react';

export default function ApplicationLogo({ mobile, ...props }) {
    return (
        <Link href={route('home')} className="flex items-center gap-1.5" {...props}>
            <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Work</span>
                <span className="text-[#14a800]">Bridge</span>
            </span>
        </Link>
    );
}
