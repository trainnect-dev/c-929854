export type CourseType = 'New Outline' | 'New Full Course' | 'Updating an existing course';
export type CourseState = {
  courseTopic?: string;
  courseType?: CourseType;
  courseLevel?: string;
};

export type CourseQuestion = {
  id: string;
  text: string;
  dependsOn?: {
    question: string;
    answer: string;
  };
};