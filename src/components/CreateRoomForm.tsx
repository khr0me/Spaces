import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAccount } from "wagmi";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10));

export default function CreateRoomForm({
  onRoomCreated,
}: {
  onRoomCreated?: () => void;
}) {
  const [roomName, setRoomName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const { address } = useAccount();

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!roomName || !address) return;

    console.log("Creating room with:", {
      name: roomName,
      is_public: isPublic,
      created_by: address,
    });

    const { data, error } = await supabase.from("Rooms").insert([
      {
        name: roomName,
        is_public: isPublic,
        created_by: address,
      },
    ]);

    if (error) {
      console.error("Error creating room:", error);
    } else {
      console.log("Room created:", data);
      onRoomCreated && onRoomCreated();
      setRoomName("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <input
        type="text"
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <span>Public room</span>
      </label>
      {!address && (
        <div className="text-red-600">
          ⚠️ Please connect your wallet before creating a room.
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Room
      </button>
    </form>
  );
}
