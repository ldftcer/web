import { AdminSidebar } from '@/components/admin/sidebar';
import { ContentManagement } from '@/components/admin/content-management';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminContent() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-card shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Content Management</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search content..."
                  className="pl-10 w-60"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="relative">
                <Button variant="outline" size="icon" className="relative">
                  <i className="relative">
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </i>
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <ContentManagement />
        </div>
      </div>
    </div>
  );
}
