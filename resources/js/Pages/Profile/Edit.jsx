import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { User, Shield, Trash2 } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout title="Profile">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1a1f36]">Profile Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
                </div>

                <div className="space-y-6">
                    <Card className="border border-gray-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-[#1a1f36] flex items-center gap-2">
                                <User className="h-4 w-4 text-[#14a800]" />Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-[#1a1f36] flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#14a800]" />Update Password
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpdatePasswordForm />
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-100 shadow-sm border-red-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-red-600 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />Delete Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeleteUserForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
