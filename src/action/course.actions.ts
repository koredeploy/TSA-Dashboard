import { courseFormData } from "~/schemas";
import { CourseData } from "~/stores/courseStore";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/courses`;

// Fetch courses action

// interface Duration {
//   online: number;
//   weekday: number;
//   weekend: number;
// }

// interface CourseData {
//   id: string;
//   title: string;
//   description: string;
//   duration: Duration;
// }

// Resource types
// interface CourseResource {
//   audio: any[];
//   video: any[];
//   document: any[];
// }

// Duration interface
interface CourseDuration {
  online: number;
  weekday: number;
  weekend: number;
}

// Class count interface
interface ClassCount {
  onlineCount: number;
  weekdayCount: number;
  weekendCount: number;
}

// Course interface
interface Course {
  id: string;
  title: string;
  description: string;
  duration: CourseDuration;
  // resources: CourseResource;
  // tutors: any[];
  classCount: ClassCount;
  createdAt: string;
}

// Response data structure
interface CourseResponseData {
  data?: Course[];
  results?: Course[];
}

// Type for the mapped course data returned by fetchCoursesAction
interface CourseData {
  id: string;
  title: string;
  description: string;
  duration: {
    online: number;
    weekday: number;
    weekend: number;
  };
}

// Updated fetch courses action with proper typing
export const fetchCoursesAction = async (
  token: string,
): Promise<CourseData[]> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const data = (await response.json()) as CourseResponseData;
    const courses = data.data || data.results || [];

    return courses.map((course: Course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: {
        online: course.duration.online,
        weekday: course.duration.weekday,
        weekend: course.duration.weekend,
      },
    }));
  } catch (error) {
    console.error("Error in fetchCoursesAction:", error);
    throw error;
  }
};

// export const fetchCoursesAction = async (
//   token: string,
// ): Promise<CourseData[]> => {
//   try {
//     const response = await fetch(`${BASE_URL}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch courses: ${response.statusText}`);
//     }

//     const data = await response.json();
//     const courses = data.data || data.results || [];

//     console.log(courses);

//     return courses.map((course: any)  => ({
//       id: course.id,
//       title: course.title,
//       description: course.description,
//       duration: {
//         online: course.duration.online,
//         weekday: course.duration.weekday,
//         weekend: course.duration.weekend,
//       },
//     }));
//   } catch (error) {
//     console.error("Error in fetchCoursesAction:", error);
//     throw error;
//   }
// };

// Create course action
export const createCourseAction = async (
  data: courseFormData,
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to create course: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error in createCourseAction:", error);
    throw error;
  }
};

// Get course by ID
export const getCourseByIdAction = async (
  id: string,
  token: string,
): Promise<CourseData> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const course = await response.json();

    return {
      id: course.data.id,
      title: course.data.title,
      description: course.data.description,
      duration: {
        online: course.data.duration.online,
        weekday: course.data.duration.weekday,
        weekend: course.data.duration.weekend,
      },
    };
  } catch (error) {
    console.error("Error in getCourseByIdAction:", error);
    throw error;
  }
};

// Update course action
export const updateCourseAction = async (
  id: string,
  data: courseFormData,
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorBody = await response.json();
      throw {
        status: response.status,
        message: errorBody.message || "Failed to update course",
        details: errorBody,
      };
    }
  } catch (error) {
    console.error("Error in updateCourseAction:", error);
    throw error; // Rethrow to pass it up
  }
};

export const deleteCourseAction = async (
  id: string,
  token: string,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
