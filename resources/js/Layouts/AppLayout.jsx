import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Bell, Menu, Home, Briefcase, Building2, ShieldCheck, Bookmark, FileText, User, Settings, LogOut, Users, X } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/ui/toast';
import { useToast } from '@/hooks/use-toast';

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const { toast, toasts } = useToast();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast({ description: flash.success });
        }
        if (flash?.error) {
            toast({ variant: 'destructive', description: flash.error });
        }
    }, []);

    const navLinks = {
        employer: [
            { label: 'Dashboard', href: route('employer.dashboard'), icon: Home },
            { label: 'Post a Job', href: route('employer.jobs.create'), icon: FileText },
            { label: 'My Jobs', href: route('employer.jobs.index'), icon: Briefcase },
        ],
        candidate: [
            { label: 'Dashboard', href: route('candidate.dashboard'), icon: Home },
            { label: 'My Profile', href: route('candidate.profile'), icon: User },
            { label: 'My Applications', href: route('candidate.applications.index'), icon: Briefcase },
            { label: 'Saved Jobs', href: route('candidate.saved-jobs.index'), icon: Bookmark },
        ],
        admin: [
            { label: 'Dashboard', href: route('admin.dashboard'), icon: Home },
            { label: 'Job Approvals', href: route('admin.approvals.index'), icon: ShieldCheck },
            { label: 'Users', href: route('admin.users.index'), icon: Users },
        ],
    };

    const role = auth?.user?.role;
    const links = role ? navLinks[role] : [];
    const initials = auth?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    const NavLink = ({ href, children, mobile }) => (
        <Link
            href={href}
            onClick={() => setOpen(false)}
            className={
                mobile
                    ? 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition'
                    : 'text-sm font-medium text-gray-300 hover:text-white transition px-3 py-1.5'
            }
        >
            {children}
        </Link>
    );

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#f5f5f3] flex flex-col">
                <Head title={title} />

                {/* Top Navigation */}
                <header className="sticky top-0 z-50 bg-workbridge-navy">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-16 flex items-center justify-between">
                            {/* Left: Logo */}
                            <div className="flex items-center gap-8">
                                <ApplicationLogo />

                                {/* Center: Nav links (hidden on mobile) */}
                                <nav className="hidden md:flex items-center gap-1">
                                    <Link
                                        href={route('jobs.index')}
                                        className="text-sm font-medium text-gray-300 hover:text-white transition px-3 py-1.5"
                                    >
                                        Find Jobs
                                    </Link>
                                    {links.map((link) => (
                                        <NavLink key={link.href} href={link.href}>
                                            {link.label}
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2">
                                {auth?.user ? (
                                    <>
                                        <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition">
                                            <Search className="h-4 w-4" />
                                        </button>
                                        <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition relative">
                                            <Bell className="h-4 w-4" />
                                            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#14a800] text-[10px] font-bold text-white flex items-center justify-center">3</span>
                                        </button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/30 transition ml-2">
                                                    <Avatar className="h-9 w-9">
                                                        {auth.user.avatar && <AvatarImage src={`/storage/${auth.user.avatar}`} />}
                                                        <AvatarFallback className="text-xs font-semibold bg-gray-600 text-white">{initials}</AvatarFallback>
                                                    </Avatar>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 mt-1.5">
                                                <DropdownMenuLabel className="font-normal">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{auth.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{auth.user.email}</span>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('profile.edit')} className="cursor-pointer"><User className="h-4 w-4 mr-2" />My Profile</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('dashboard')} className="cursor-pointer"><Home className="h-4 w-4 mr-2" />Dashboard</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('logout')} method="post" as="button" className="cursor-pointer"><LogOut className="h-4 w-4 mr-2" />Log Out</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </>
                                ) : (
                                    <div className="hidden md:flex items-center gap-3">
                                        <Link href={route('login')}>
                                            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">Log in</Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button className="bg-[#14a800] hover:bg-[#108a00] text-white shadow-sm">Register</Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile menu toggle */}
                                <div className="md:hidden ml-2">
                                    <Sheet open={open} onOpenChange={setOpen}>
                                        <SheetTrigger asChild>
                                            <button className="h-9 w-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition">
                                                <Menu className="h-5 w-5" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-72 bg-white p-0">
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-center justify-between px-4 h-16 border-b">
                                                    <ApplicationLogo />
                                                    <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Browse</p>
                                                    <NavLink href={route('jobs.index')} mobile>
                                                        <Search className="h-4 w-4" />Find Jobs
                                                    </NavLink>
                                                    {role && (
                                                        <>
                                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-4">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                                                            {links.map((link) => (
                                                                <NavLink key={link.href} href={link.href} mobile>
                                                                    <link.icon className="h-4 w-4" />{link.label}
                                                                </NavLink>
                                                            ))}
                                                        </>
                                                    )}
                                                </nav>
                                                {!auth?.user && (
                                                    <div className="border-t p-4 space-y-2">
                                                        <Link href={route('login')} onClick={() => setOpen(false)}>
                                                            <Button variant="outline" className="w-full">Log in</Button>
                                                        </Link>
                                                        <Link href={route('register')} onClick={() => setOpen(false)}>
                                                            <Button className="w-full bg-[#14a800] hover:bg-[#108a00]">Register</Button>
                                                        </Link>
                                                    </div>
                                                )}
                                                {auth?.user && (
                                                    <div className="border-t p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarFallback className="text-xs bg-gray-200">{initials}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{auth.user.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">{auth.user.email}</p>
                                                            </div>
                                                        </div>
                                                        <Link href={route('profile.edit')} onClick={() => setOpen(false)}>
                                                            <Button variant="outline" size="sm" className="w-full">Profile Settings</Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-workbridge-navy text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div>
                                <ApplicationLogo />
                                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                                    WorkBridge connects employers with top candidates across every industry. Find the right talent. Find the right job.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h3>
                                <ul className="space-y-2.5">
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">About Us</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Blog</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">For Employers</h3>
                                <ul className="space-y-2.5">
                                    <li><Link href={route('register')} className="text-sm text-gray-400 hover:text-white transition">Post a Job</Link></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Browse Candidates</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Pricing</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
                                <ul className="space-y-2.5">
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Help Center</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} WorkBridge. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">Privacy</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">Terms</a>
                            </div>
                        </div>
                    </div>
                </footer>

                <ToastViewport />
                {toasts.map((t) => (
                    <Toast key={t.id} variant={t.variant} open={true}>
                        <div className="grid gap-1">
                            <ToastDescription>{t.description}</ToastDescription>
                        </div>
                        <ToastClose />
                    </Toast>
                ))}
            </div>
        </ToastProvider>
    );
}
