"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, User, Code2, Briefcase, 
  Award, GraduationCap, Trophy, Mail, 
  FileText, Image as ImageIcon, Settings, LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If we are on the login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Hero", href: "/admin/hero", icon: User },
    { name: "About", href: "/admin/about", icon: FileText },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Projects", href: "/admin/projects", icon: LayoutDashboard },
    { name: "Certifications", href: "/admin/certifications", icon: Award },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    { name: "Contact & Social", href: "/admin/contact", icon: Mail },
    { name: "Resume", href: "/admin/resume", icon: FileText },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-md flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink">
            CMS Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">Portfolio Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-accent-purple/20 text-accent-lavender border border-accent-purple/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-purple/10 via-[#050505] to-[#050505]">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
