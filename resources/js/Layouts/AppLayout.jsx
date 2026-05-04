import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Menu, X, Briefcase, Home, Building2, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/ui/button';
import { Avatar, AvatarFallback } from '@/ui/avatar';
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
            { label: 'My Jobs', href: route('employer.jobs.index'), icon: Briefcase },
        ],
        candidate: [
            { label: 'Dashboard', href: route('candidate.dashboard'), icon: Home },
            { label: 'My Applications', href: route('candidate.applications.index'), icon: Briefcase },
            { label: 'Saved Jobs', href: route('candidate.saved-jobs.index'), icon: Building2 },
        ],
        admin: [
            { label: 'Dashboard', href: route('admin.dashboard'), icon: Home },
            { label: 'Job Approvals', href: route('admin.approvals.index'), icon: ShieldCheck },
        ],
    };

    const links = auth?.user ? navLinks[auth.user.role] : [];

    const NavLinks = ({ mobile }) => (
        <div className={mobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-6'}>
            <Link href={route('jobs.index')} className={mobile ? 'text-lg' : 'text-sm font-medium text-muted-foreground hover:text-foreground transition'}>
                Browse Jobs
            </Link>
            {auth?.user && links.map((link) => (
                <Link key={link.href} href={link.href} className={mobile ? 'text-lg' : 'text-sm font-medium text-muted-foreground hover:text-foreground transition'}>
                    {link.label}
                </Link>
            ))}
        </div>
    );

    const initials = auth?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background flex flex-col">
                <Head title={title} />
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href={route('home')} className="text-xl font-bold text-primary flex items-center gap-2">
                                <Briefcase className="h-6 w-6" />
                                <span>JobBoard</span>
                            </Link>
                            <nav className="hidden md:flex items-center space-x-6">
                                <NavLinks />
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{auth.user.name}</DropdownMenuLabel>
                                            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">{auth.user.email}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={route('profile.edit')}>Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('logout')} method="post" as="button">Logout</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href={route('login')}>
                                        <Button variant="ghost">Log in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button>Register</Button>
                                    </Link>
                                </div>
                            )}
                            <div className="md:hidden">
                                <Sheet open={open} onOpenChange={setOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-80">
                                        <nav className="flex flex-col space-y-4 mt-8">
                                            <NavLinks mobile />
                                            {!auth?.user && (
                                                <div className="flex flex-col gap-2 pt-4">
                                                    <Link href={route('login')}><Button className="w-full" variant="outline">Log in</Button></Link>
                                                    <Link href={route('register')}><Button className="w-full">Register</Button></Link>
                                                </div>
                                            )}
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="border-t py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} JobBoard. All rights reserved.
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