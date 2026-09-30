/**
 * Barrel re-export — maintains backward compatibility.
 * All imports from `../contexts/RoadmapContext` continue to work unchanged.
 */
export {
    RoadmapProvider,
    useRoadmap,
    useTargetGrade,
    TargetGradeProvider,
    wouldCreateCycle,
} from './roadmap/RoadmapContext';

export type {
    SubjectStatus,
    ItineraryType,
    SubjectNodeData,
    DrawingStroke,
    ExperienceDetails,
    RoadmapState,
} from './roadmap/types';
