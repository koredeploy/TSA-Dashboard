"use client";

import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";

import { useActivityStore } from "~/stores/activityStore";
import { useAuthStore } from "~/stores/authStore";

const formatDateTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

const RecentTable = () => {
  const { activities, isLoading, error, fetchActivities, page, totalPages } =
    useActivityStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchActivities(token, page);
    }
  }, [fetchActivities, token, page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No activities found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activities
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-950">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-950">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-950">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {activity.activity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {activity.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatDateTime(activity.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">10 Entries per page</p>
            <p className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (token) fetchActivities(token, page - 1);
                }}
                disabled={page <= 1 || !token} // Added !token check
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (token) fetchActivities(token, page + 1);
                }}
                disabled={page >= totalPages || !token} // Added !token check
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTable;
