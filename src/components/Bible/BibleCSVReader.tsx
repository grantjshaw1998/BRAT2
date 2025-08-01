import { useBibleCSV } from "../../hooks/useBibleCSV";

export default function BibleCSVReader() {
  const { bible, loading } = useBibleCSV();

  if (loading) return <p className="text-gray-400">Loading CSV...</p>;

  const john3 = bible.filter(v => v.book_id === "43" && v.chapter === "3");

  return (
    <div className="space-y-2">
      {john3.map(v => (
        <p key={`${v.book_id}-${v.chapter}-${v.verse}`}>
          <span className="text-gray-500 mr-2">{v.verse}</span>
          {v.text}
        </p>
      ))}
    </div>
  );
}