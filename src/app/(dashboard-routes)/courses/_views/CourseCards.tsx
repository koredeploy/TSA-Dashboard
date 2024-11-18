import { MoreVertical } from "lucide-react";

interface CourseSchedule {
  weekday: number;
  weekend: number;
  online: number;
}

interface Course {
  title: string;
  description: string;
  schedule: CourseSchedule;
}

interface CourseGridProperties {
  courses?: Course[];
}

const CourseCards = ({ courses = [] }: CourseGridProperties) => {
  const defaultCourses: Course[] = [
    {
      title: "Fullstack Web Development",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tristique sapien nisi et tellus molestie. Augue massa viverra a amet. Odis sed augue. Lorem ipsum dolor sit amet consectetur.",
      schedule: {
        weekday: 16,
        weekend: 16,
        online: 16,
      },
    },
    {
      title: "UI/UX Product Design Immersive",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tristique sapien nisi et tellus molestie. Augue massa viverra a amet. Odis sed augue. Lorem ipsum dolor sit amet consectetur.",
      schedule: {
        weekday: 16,
        weekend: 16,
        online: 16,
      },
    },
    {
      title: "Data Science and Analysis",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tristique sapien nisi et tellus molestie. Augue massa viverra a amet. Odis sed augue. Lorem ipsum dolor sit amet consectetur.",
      schedule: {
        weekday: 16,
        weekend: 16,
        online: 16,
      },
    },
    {
      title: "Digital Marketing",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tristique sapien nisi et tellus molestie. Augue massa viverra a amet. Odis sed augue. Lorem ipsum dolor sit amet consectetur.",
      schedule: {
        weekday: 16,
        weekend: 16,
        online: 16,
      },
    },
    {
      title: "Cybersecurity",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tristique sapien nisi et tellus molestie. Augue massa viverra a amet. Odis sed augue. Lorem ipsum dolor sit amet consectetur.",
      schedule: {
        weekday: 16,
        weekend: 16,
        online: 16,
      },
    },
  ];

  const displayCourses = courses.length > 0 ? courses : defaultCourses;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayCourses.map((course, index) => (
        <div
          key={index}
          className="rounded-lg border-blue-700 bg-white p-4 transition-all hover:border-b-4"
        >
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {course.title}
            </h3>
            <button className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <span className="font-medium text-blue-500">Weekday:</span>
              <span className="ml-1 text-gray-600">
                {course.schedule.weekday} Weeks
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-orange-500">Weekend:</span>
              <span className="ml-1 text-gray-600">
                {course.schedule.weekend} Weeks
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-green-500">Online:</span>
              <span className="ml-1 text-gray-600">
                {course.schedule.online} Weeks
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCards;
