import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAccount } from "wagmi";

const supabase = createClient(
  "https://bwlwdaajalymovfjpavs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bHdkYWFqYWx5bW92ZmpwYXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0OTE1OTYsImV4cCI6MjA1OTA2NzU5Nn0.JbVvC30kvXUrmXtndQxKfWjm1lh6d8ypBJsM6yeZOMs"
);

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

    const { data, error } = await supabase.from("rooms").insert([
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

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Room
      </button>
    </form>
  );
}
