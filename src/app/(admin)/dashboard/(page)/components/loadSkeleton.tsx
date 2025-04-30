import { Skeleton } from "@/components/ui/skeleton";

export function LoadSkeleton() {
  return (
    <div className="space-y-4">
      <table className="min-w-full table-auto border-collapse rounded-md border-t border-b border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
            <th className="py-3 px-0 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
            <th className="py-3 px-0 text-left text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-[22px] rounded-full bg-gray-300 animate-pulse" />
                  <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-full bg-gray-300 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
