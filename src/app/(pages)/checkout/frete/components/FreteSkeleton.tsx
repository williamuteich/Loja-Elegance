export default function FreteSkeleton() {
  return (
    <div className="mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-8"></div>
      <div className="space-y-4">
        <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
