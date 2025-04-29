import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingStateProps {
  type: 'career' | 'analysis';
}

export function LoadingState({ type }: LoadingStateProps) {
  if (type === 'career') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-gray-800/50 space-y-4">
            <Skeleton height={24} width={120} />
            <Skeleton height={32} />
            <div className="space-y-2">
              <Skeleton height={20} width={80} />
              <Skeleton height={20} />
            </div>
            <div className="space-y-2">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Skeleton height={300} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton height={200} />
        <Skeleton height={200} />
      </div>
    </div>
  );
}