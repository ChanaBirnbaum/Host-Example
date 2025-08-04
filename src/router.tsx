import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './AppShell/Layout';
import KeepAlive from './components/KeepAlive';
const Dashboard = lazy(() => import('./AppShell/Zones/DashboardZone'));
const Notifications = lazy(() => import('notifications/NotificationsMFE'));
export default function AppRouter() {
return (
<BrowserRouter>
<Layout>
<Suspense fallback={<div>טוען>.../div>}>
<Routes>
<Route path="/" element={<Dashboard />} />
<Route
path="/notifications"
element={
<KeepAlive id="notifications">
<Notifications />
</KeepAlive>
}
/>
<Route path="*" element={<Navigate to="/" />} />
</Routes>
</Suspense>
</Layout>
</BrowserRouter>
);
}