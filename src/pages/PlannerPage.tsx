import React from 'react';
import { Navigate } from 'react-router-dom';
import PlannerLayout from '../components/Planner/PlannerLayout';
import { TasksProvider } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/ui/Spinner';

const PlannerPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-[100dvh] flex items-center justify-center bg-transparent">
                <Spinner size="2xl" variant="fuchsia" />
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
