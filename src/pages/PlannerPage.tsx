import React from 'react';
import PlannerLayout from '../components/Planner/PlannerLayout';
import { TasksProvider } from '../contexts/TasksContext';

const PlannerPage: React.FC = () => {
    return (
        <TasksProvider>
            <div className="h-screen pt-20 pb-4 overflow-hidden flex flex-col container mx-auto px-4 max-w-7xl">
                <PlannerLayout />
            </div>
        </TasksProvider>
    );
};

export default PlannerPage;
