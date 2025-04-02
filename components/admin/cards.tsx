import { dashboardData } from "@/lib/data";

export default async function CardWrapper() {
  const { totalBorrowed, totalUsers, totalBooks } = await dashboardData();
  return (
    <>
      <Card title="Borrwed Books" value={totalBorrowed} />
      <Card title="Users" value={totalUsers} />
      <Card title="TotalBooks" value={totalBooks} />
      <Card title="Request Pending" value={totalUsers-1} />
    </>
  );
}

export function Card({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
}
