import {
  LayoutDashboard,
  Layers,
  Users,
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    adminOnly: false,
  },
  {
    id: 'fields',
    label: 'Fields',
    icon: Layers,
    path: '/dashboard/fields',
    adminOnly: false,
  },
  {
    id: 'manage-users',
    label: 'Manage Users',
    icon: Users,
    path: '/dashboard/manage-users',
    adminOnly: true,
  },
];