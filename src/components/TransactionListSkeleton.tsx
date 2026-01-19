import ListSkeleton from './ListSkeleton';

export default function TransactionListSkeleton() {
  return (
    <div className="animate-pulse">
      <ListSkeleton
        rows={6}
        className="divide-y divide-gray-200 dark:divide-gray-700"
        itemClassName="py-4"
        renderItem={() => (
          <div className="grid gap-3 sm:grid-cols-[140px_1.4fr_200px_120px_60px] sm:items-center">
            <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="ml-auto h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="ml-auto h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        )}
      />
    </div>
  );
}
