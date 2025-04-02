import CardWrapper from '@/components/admin/cards';
import { Suspense } from 'react';
import { RevenueChartSkeleton,LatestInvoicesSkeleton,CardSkeleton } from "@/components/admin/skeletons"
import Recentbooks from '@/components/admin/recentbooks';
 
export default async function Page() {
  return (
    <main>
      <h1 className={` mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardSkeleton/>}>
        <CardWrapper/>   
      </Suspense>
      </div>
      <div className="w-full">
        {/* <Suspense fallback={<RevenueChartSkeleton/>}>
          <RevenueChart/>
        </Suspense> */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <Recentbooks />
        </Suspense>
      </div>
    </main>
  );
}
