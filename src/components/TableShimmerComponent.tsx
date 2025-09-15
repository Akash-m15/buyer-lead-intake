// Shimmer row for table loading
const ShimmerRow = () => (
  <tr className="animate-pulse">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-6"> {/* increased py for height */}
          <div className="h-5 w-full max-w-xs rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </td>
      ))}
    </tr>
);


export default function TableShimmerComponent() {
  return (
    <>
      <ShimmerRow />
      <ShimmerRow />
      <ShimmerRow />
      <ShimmerRow />
      <ShimmerRow />
      <ShimmerRow />
      <ShimmerRow />
    </>
  );
}
