import React from 'react';
import { Navigate } from 'react-router-dom';
import PlannerLayout from '../components/Planner/PlannerLayout';
import { TasksProvider } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';

const PlannerPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-[100dvh] flex items-center justify-center bg-transparent">
                <div className="w-12 h-12 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <TasksProvider>
            <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-transparent">
                <PlannerLayout />
            </div>
        </TasksProvider>
    );
};

export default PlannerPage;
