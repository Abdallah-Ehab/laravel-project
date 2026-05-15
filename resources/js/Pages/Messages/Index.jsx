import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent } from '@/ui/card';
import { MessageCircle } from 'lucide-react';

export default function Index({ conversations }) {
    return (
        <AppLayout title="Messages">
            <Head title="Messages" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1f36]">Messages</h1>
                <p className="text-sm text-gray-500 mt-1">Your conversations with employers and candidates</p>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#1a1f36]">Inbox coming soon</p>
                    <p className="text-xs text-gray-400 mt-1">Conversation list will appear here</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
