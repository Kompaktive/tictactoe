import { useLocation } from "react-router";

const LobbyTemplate = () => {
  const location = useLocation();

  return (
    <main className="mx-8 flex h-screen flex-col items-center justify-center">
      <section className="bg-dark rounded-2xl p-4 text-white">
        Click to copy. Send this link to your friend
        <button
          className="bg-background w-full rounded-lg p-2"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
        >
          {window.location.href}
        </button>
      </section>
    </main>
  );
};

export default LobbyTemplate;
