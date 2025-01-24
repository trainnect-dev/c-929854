import { CourseState, CourseType } from '@/types/courseCreation';

interface CourseResponseHandlerProps {
  message: string;
  courseState: CourseState;
  setCourseState: (state: CourseState) => void;
}

export const CourseResponseHandler = ({ message, courseState, setCourseState }: CourseResponseHandlerProps) => {
  const handleCourseTypeResponse = (message: string) => {
    const courseType = message.trim() as CourseType;
    if (!['New Outline', 'New Full Course', 'Updating an existing course'].includes(courseType)) {
      return `Please choose one of the following options:
      - New Outline
      - New Full Course
      - Updating an existing course`;
    }

    setCourseState(prev => ({ ...prev, courseType }));
    
    if (courseType === 'Updating an existing course') {
      return "Please navigate to the 'course_output' folder to select and update your existing course.";
    }
    
    return `What is the topic of the ${courseType} you would like to create?`;
  };

  const handleCourseTopicResponse = (message: string) => {
    setCourseState(prev => ({ ...prev, courseTopic: message }));
    return `What is the target audience for this ${courseState.courseType}?`;
  };

  const handleCourseLevelResponse = (message: string) => {
    setCourseState(prev => ({ ...prev, courseLevel: message }));
    return `Great! I'll now start creating your ${courseState.courseType} about "${courseState.courseTopic}" for ${message} audience. Please confirm if you'd like to proceed.`;
  };

  if (!courseState.courseType) {
    return handleCourseTypeResponse(message);
  } else if (!courseState.courseTopic) {
    return handleCourseTopicResponse(message);
  } else if (!courseState.courseLevel) {
    return handleCourseLevelResponse(message);
  }
  
  return null;
};