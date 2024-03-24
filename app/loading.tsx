'use client';
import DashboardSkeleton from '@/components/ui/skeletons';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  //@ts-ignore
  return (
    //     <div className="flex justify-center items-center h-screen">
    //  <RotatingLines
    //       strokeColor="grey"
    //       strokeWidth="5"
    //       animationDuration="0.75"
    //       width="96"
    //       visible={true}
    //     />
    // </div>
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
