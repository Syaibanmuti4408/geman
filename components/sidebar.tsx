"use client";

import Link from "@/components/custom-link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutAdmin, resetUsers } from "@/app/actions/auth";
import {
    Home,
    Settings,
    LogOut,
    Trash2,
    User,
    Menu,
    X,
    Sparkles,
    Palette,
    HelpCircle,
    ChevronUp,
    ChevronDown,
    FileText,
    ExternalLink
} from "lucide-react";

import { useEffect, useState } from "react";

interface SidebarProps {
    user: {
        id: number;
        email: string;
        role: string;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navigation = [
        {
            name: "Dashboard",
            href: "/",
            icon: Home,
        },
        {
            name: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ];

    const userMenuItems = [
        {
            name: "Account",
            icon: User,
            href: "/account"
        },
    ];

    const SidebarContent = () => (
        <>
            {/* Logo/Brand */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
                <img
                    src="/logo.svg"
                    alt="Geman"
                    className="h-8 w-auto"
                />
                <span className="ml-2 text-2xl font-extrabold text-gray-900">Geman</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4">
                <div className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
              `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon className="mr-3 size-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div>
                    <Link
                        href="/"
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-between`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex">
                            <FileText className="mr-3 size-5" />
                            Documentation
                        </div>
                        <ExternalLink className="size-5" />
                    </Link>
                </div>
            </nav>

            {/* User Menu at Bottom */}
            <div className="border-t border-gray-200 divide-y">
                {/* Expandable User Menu */}
                {isUserMenuOpen && (
                    <div className="px-4 py-2 space-y-1">
                        {userMenuItems.map((item) => (
                            <div key={item.name}>
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <item.icon className="mr-3 size-5" />
                                        {item.name}
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            // item.onClick?.();
                                            setIsUserMenuOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                                    >
                                        <item.icon className="mr-3 size-5" />
                                        {item.name}
                                    </Button>
                                )}
                            </div>
                        ))}

                        {/* Log out */}
                        <form action={signOutAdmin} className="w-full">
                            <button
                                type="submit"
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            >
                                <LogOut className="mr-3 size-5" />
                                Log out
                            </button>
                        </form>
                    </div>
                )}

                {/* User Info Button */}
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <div className="flex items-center">
                        {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-bold">
                            {user.email.charAt(0).toUpperCase()}
                        </div> */}
                        <div className="ml-2 text-left">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>
                    {isUserMenuOpen ? (
                        <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="size-5 text-gray-400" />
                    )}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-white"
                >
                    {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:flex h-full w-64 flex-col bg-white border-r border-gray-200">
                <SidebarContent />
            </div>

            {/* Mobile sidebar */}
            <div className={`
        lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <SidebarContent />
            </div>
        </>
    );
}