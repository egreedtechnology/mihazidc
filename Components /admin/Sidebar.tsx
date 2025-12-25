import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCog, 
  Stethoscope,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: 'AdminDashboard' },
  { name: 'Appointments', icon: Calendar, href: 'AdminAppointments' },
  { name: 'Patients', icon: Users, href: 'AdminPatients' },
  { name: 'Staff', icon: UserCog, href: 'AdminStaff' },
  { name: 'Services', icon: Stethoscope, href: 'AdminServices' },
  { name: 'Billing', icon: CreditCard, href: 'AdminBilling' },
  { name: 'Invoices', icon: FileText, href: 'AdminInvoices' },
  { name: 'Reports', icon: BarChart3, href: 'AdminReports' },
  { name: 'Settings', icon: Settings, href: 'AdminSettings' },
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-20" : "lg:w-64",
        "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
                <Link to={createPageUrl('AdminDashboard')} className="flex items-center gap-3">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
                    alt="Muhazi Dental" 
                    className={cn("h-10 w-auto object-contain brightness-0 invert", isCollapsed && "h-8")}
                  />
                  {!isCollapsed && (
                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                  )}
                </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-white hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentPath.includes(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={createPageUrl(item.href)}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                        isActive 
                          ? "bg-teal-600 text-white" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="lg:block">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Toggle (Desktop only) */}
          <div className="hidden lg:block p-4 border-t border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full justify-center text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full font-medium transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
