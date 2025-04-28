'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateWorkspaceButton } from '@/components/workspace/CreateWorkspaceButton';
import { WorkspaceList } from '@/components/workspace/WorkspaceList';

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="relative mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Mes espaces de travail
        </h1>
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle>Espaces de travail</CardTitle>
            <CreateWorkspaceButton />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <WorkspaceList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 