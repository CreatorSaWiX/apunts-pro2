import React from 'react';
import PlannerLayout from '../components/Planner/PlannerLayout';
import { TasksProvider } from '../contexts/TasksContext';

const PlannerPage: React.FC = () => {
    return (
        <TasksProvider>
            <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-transparent">
                <PlannerLayout />
            </div>
        </TasksProvider>
    );
};

export default PlannerPage;
