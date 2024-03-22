'use client'
import DashboardSkeleton from '@/components/ui/skeletons';

import { RotatingLines  } from 'react-loader-spinner';




export default function Loading() {
  //@ts-ignore
  return (
    <div className="flex justify-center items-center h-screen">
 <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
</div>
    
  )
}