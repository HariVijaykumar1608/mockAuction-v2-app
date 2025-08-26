export default function Table({data}) {

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Player Name</th>
            <th className="px-4 py-2 text-left">Team</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr
              key={index}
              className="border-t hover:bg-gray-100 transition"
            >
              <td className="px-4 py-2">{row?.userName}</td>
              <td className="px-4 py-2">{row?.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
