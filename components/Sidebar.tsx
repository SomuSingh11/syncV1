'use client';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  FileText,
  BarChart3,
  Users,
  FileStack,
  Map,
  PackageSearch,
  BotMessageSquare,
  UserCircle,
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'projects', name: 'Projects', icon: FileText },
  { id: 'resources', name: 'Resources', icon: PackageSearch },
  { id: 'logs', name: 'Logs', icon: BarChart3 },
  { id: 'aiAssistance', name: 'AI-Assistance', icon: BotMessageSquare },
  { id: 'collaboration', name: 'Collaboration', icon: Users },
  { id: 'requests', name: 'Requests', icon: FileStack },
  { id: 'maps', name: 'Maps', icon: Map },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const currentPath = pathname?.split('/').pop() || 'dashboard';
  const departmentId = user?.publicMetadata?.departmentId || 'default';

  return (
    <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-8">
        <h2 className="text-5xl font-bold text-gray-800 dark:text-gray-200">
          Sync City<span className="text-emerald-500">.</span>
        </h2>
        <p className="text-gray-500/50 text-md mt-3">Admin Dashboard</p>
      </div>
      <nav className="px-8 py-4 flex-grow">
        <ul className="space-y-4">
          {sidebarItems.map(item => (
            <li key={item.id}>
              <Link
                href={`/${item.id}`}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2 rounded-md relative transition-colors',
                  currentPath === item.id
                    ? 'text-emerald-600 bg-emerald-300/20 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <div
                  className={clsx(
                    'absolute left-0 top-0 h-full w-1.5 bg-emerald-500 rounded-r-md transition-all duration-300 ease-in-out',
                    currentPath === item.id
                      ? 'opacity-100 -ml-8 scale-y-100'
                      : 'opacity-0 -ml-8 scale-y-0'
                  )}
                />

                <item.icon size={25} />
                <span className={clsx(currentPath === item.id ? 'font-medium' : '')}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

          {isSignedIn && (
            <li>
              <Link
                href={`/department/${departmentId}/profile`}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2 rounded-md relative transition-colors',
                  currentPath === 'profile'
                    ? 'text-emerald-600 bg-emerald-300/20 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <div
                  className={clsx(
                    'absolute left-0 top-0 h-full w-1.5 bg-emerald-500 rounded-r-md transition-all duration-300 ease-in-out',
                    currentPath === 'profile'
                      ? 'opacity-100 -ml-8 scale-y-100'
                      : 'opacity-0 -ml-8 scale-y-0'
                  )}
                />
                <UserCircle size={25} />
                <span className={clsx(currentPath === 'profile' ? 'font-medium' : '')}>
                  Department Profile
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
