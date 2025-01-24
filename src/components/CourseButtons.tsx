interface CourseButtonsProps {
  onSendMessage: (message: string) => void;
}

const CourseButtons = ({ onSendMessage }: CourseButtonsProps) => {
  const handleNewFullCourse = () => {
    onSendMessage("New Full Course");
  };

  const handleUpdateExistingCourse = () => {
    onSendMessage("Updating an existing course");
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      <button 
        className="relative flex h-[42px] items-center gap-1.5 rounded-full border border-[#383737] px-3 py-2 text-start text-[13px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed"
        onClick={handleNewFullCourse}
      >
        New Full Course
      </button>
      <button 
        className="relative flex h-[42px] items-center gap-1.5 rounded-full border border-[#383737] px-3 py-2 text-start text-[13px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed"
        onClick={handleUpdateExistingCourse}
      >
        Update Existing Course
      </button>
    </div>
  );
};

export default CourseButtons;