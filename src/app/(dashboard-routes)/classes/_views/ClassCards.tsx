"use client";

import { Calendar, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ClassData, fetchClassesByCourseIdAction } from "~/action/class.action";
import SuccessModal from "~/components/modals/response-modal";
import { useFetchData } from "~/hooks/useFetchData";
import { useHandleDelete } from "~/hooks/useHandleDelete";
import { useAuthStore } from "~/stores/authStore";
import { useCourseStore } from "~/stores/courseStore";
import ClassModal from "./ClassModal";
import WarningModal from "./WarningModal";

const ClassCards = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const { handleDeleteClass } = useHandleDelete();
  const courses = useCourseStore((state) => state.courses);
  const { loading, error } = useFetchData(token);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchClassesForCourse = useCallback(
    async (courseId: string) => {
      try {
        if (token) {
          const response = await fetchClassesByCourseIdAction(courseId, token);
          setClasses(response);
        } else {
          console.error("Token is undefined");
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    },
    [token],
  );

  useEffect(() => {
    if (courses.length > 0) {
      setActiveCategory(courses[0].title);
      fetchClassesForCourse(courses[0].id);
    }
  }, [courses, fetchClassesForCourse]);

  const handleCategoryChange = (category: string, courseId: string) => {
    setActiveCategory(category);
    fetchClassesForCourse(courseId);
  };

  // const filteredClasses = classes.filter((c) => c.title === activeCategory);

  // const selectedCourse = courses.find(
  //   (course) => course.title === activeCategory,
  // );
  // const filteredClasses = selectedCourse
  //   ? classes.filter((c) => c.courseId === selectedCourse.id)
  //   : [];

  const openClassModal = (classId: string) => {
    setSelectedClassId(classId);
    setClassModalOpen(true);
  };

  const confirmDelete = (courseId: string) => {
    if (selectedClassId) {
      handleDeleteClass(
        selectedClassId,
        courseId,
        () => setWarningModalOpen(false),
        () => fetchClassesForCourse(courseId), // Pass fetchClassesForCourse as a callback
      );
      setShowSuccessModal(true);
    }
  };

  const getCourseIdForClass = (classId: string): string | undefined => {
    const classInfo = classes.find((c) => c.id === classId);
    return classInfo?.course.id;
  };

  if (error) {
    return <p>Failed to fetch classes</p>;
  }

  if (loading) {
    return <p>Loading classes...</p>;
  }
  const handleContinue = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <ClassModal
        open={classModalOpen}
        setOpen={setClassModalOpen}
        onEdit={() => router.push(`classes/${selectedClassId}`)}
        onDelete={() => {
          setWarningModalOpen(true); // Open WarningModal when Delete is clicked
        }}
      />
      <WarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)} // Close WarningModal
        onConfirm={() => {
          const courseId = getCourseIdForClass(selectedClassId!);
          if (courseId) {
            confirmDelete(courseId); // Trigger delete function
          } else {
            console.error("Course ID not found for the selected class");
          }
        }}
      />
      <div className="flex justify-between">
        {courses.map((course, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium ${
              activeCategory === course.title
                ? "border-b-4 border-blue-700 text-blue-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleCategoryChange(course.title, course.id)}
          >
            {course.title}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-3">
        {!loading && classes.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            <p className="py-10">Opps... No class available for this course</p>
          </div>
        ) : (
          classes.map((classInfo, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-indigo-900">
                  {classInfo.title}
                </h3>
                <button
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
                  onClick={() => openClassModal(classInfo.id)}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    <p>Start Date:</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {classInfo.startDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    <p>Duration:</p>
                  </div>
                  <span className="text-sm">16 Weeks</span>
                </div>

                <hr />

                <div className="flex items-center justify-between pt-8 text-gray-600">
                  <p>Preference:</p>
                  <span className="font-medium">{classInfo.type}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Class Deleted Successfully"
        description="Selected Class has been deleted"
        actionLabel="Continue"
        onAction={handleContinue}
      />
    </>
  );
};

export default ClassCards;
