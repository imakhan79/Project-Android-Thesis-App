
import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Search, 
  Activity, 
  Settings, 
  TrendingUp, 
  PackageCheck,
  Zap
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  { id: 'static', label: 'Static Analysis', icon: <Search size={20} /> },
  { id: 'dynamic', label: 'Dynamic Analysis', icon: <Activity size={20} /> },
  { id: 'rl', label: 'RL Exploration', icon: <Zap size={20} /> },
  { id: 'ga', label: 'GA Prioritization', icon: <TrendingUp size={20} /> },
  { id: 'suites', label: 'Test Suites', icon: <PackageCheck size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const MOCK_MANIFEST = `
<manifest package="com.example.smartapp">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <application>
    <activity android:name=".MainActivity" />
    <activity android:name=".SettingsActivity" />
    <activity android:name=".ProfileActivity" />
  </application>
</manifest>
`;

export const REWARD_CONFIG_DEFAULT = {
  newState: 5,
  highRiskInteraction: 3,
  crash: 10,
  repeatedAction: -1,
  loops: -3
};

export const GA_CONFIG_DEFAULT = {
  popSize: 50,
  mutRate: 0.1,
  crossRate: 0.8,
  weights: {
    coverage: 0.4,
    fault: 0.3,
    novelty: 0.2,
    cost: 0.1
  }
};
