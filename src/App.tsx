import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { createClient } from "@supabase/supabase-js";
import CreateRoomForm from "./components/CreateRoomForm";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Spaces</h1>
      <ConnectMenu />
      <CreateRoomForm onRoomCreated={() => setRefreshFlag(!refreshFlag)} />
      <RoomList refreshFlag={refreshFlag} />
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div>
        <div>Connected account:</div>
        <div>{address}</div>
        <SignButton />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => connect({ connector: connectors[0] })}>
      Connect
    </button>
  );
}

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <>
      <button
        type="button"
        onClick={() => signMessage({ message: "hello world" })}
        disabled={isPending}
      >
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <>
          <div>Signature</div>
          <div>{data}</div>
        </>
      )}
      {error && (
        <>
          <div>Error</div>
          <div>{error.message}</div>
        </>
      )}
    </>
  );
}

function RoomList({ refreshFlag }: { refreshFlag: boolean }) {
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  async function fetchRooms() {
    const { data, error } = await supabase.from("Rooms").select("*");
    if (error) console.error(error);
    else setRooms(data);
  }

  useEffect(() => {
    fetchRooms();
  }, [refreshFlag]);

  return (
    <div>
      <h2 className="text-lg font-bold mt-4">Available Rooms</h2>
      <button
        onClick={fetchRooms}
        className="mb-4 px-3 py-2 bg-green-500 text-white rounded"
      >
        Refresh Rooms
      </button>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} className="p-2 border-b">
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
