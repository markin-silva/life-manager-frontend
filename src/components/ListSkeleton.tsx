import type { ReactNode } from 'react';

type ListSkeletonProps = {
  rows?: number;
  className?: string;
  itemClassName?: string;
  renderItem?: (index: number) => ReactNode;
};

export default function ListSkeleton({
  rows = 6,
  className = '',
  itemClassName = '',
  renderItem,
}: ListSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={itemClassName}>
          {renderItem ? (
            renderItem(index)
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/5 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-2/5 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
