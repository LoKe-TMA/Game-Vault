import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/** CONFIG */
const BOT_USERNAME = "Game_VauIt_bot";
const ADSGRAM_BLOCK_ID = "int-14145";

/** Price Tables */
const PUBG_UC_PACKS = [
  { uc: 60, price: 4500 },
  { uc: 180, price: 13500 },
  { uc: 325, price: 21000 },
  { uc: 385, price: 25500 },
  { uc: 660, price: 41000 },
  { uc: 720, price: 45000 },
  { uc: 985, price: 61000 },
  { uc: 1800, price: 100000 },
];

const MLBB_DIAMOND_PACKS = [
  { diamond: "Weekly Pass", price: 6500 },
  { diamond: 86, price: 5500 },
  { diamond: 172, price: 11000 },
  { diamond: 257, price: 16500 },
  { diamond: 343, price: 21500 },
  { diamond: 429, price: 27000 },
  { diamond: 706, price: 43000 },
  { diamond: 1049, price: 63000 },
];

const DEMO_BANNERS = [
  { id: 1, img: "https://picsum.photos/seed/game1/1200/360", href: "https://example.com/ad1" },
  { id: 2, img: "https://picsum.photos/seed/game2/1200/360", href: "https://example.com/ad2" },
  { id: 3, img: "https://picsum.photos/seed/game3/1200/360", href: "https://example.com/ad3" },
];

/** Telegram init hook */
function useTelegram() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    try {
      tg?.ready?.();
      tg?.expand?.();
      tg?.enableClosingConfirmation?.();
      setUser(tg?.initDataUnsafe?.user || null);
      setInitData(tg?.initData || "");
    } catch (e) {}
  }, []);

  return { user, initData };
}

/** Adsgram hook */
function useAdsgram({ blockId, onReward, onError }) {
  const AdControllerRef = useRef(undefined);

  useEffect(() => {
    AdControllerRef.current = window?.Adsgram?.init?.({ blockId });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => onReward?.())
        .catch((result) => onError?.(result));
    } else {
      onError?.({ error: true, done: false, state: "load", description: "Adsgram script not loaded" });
    }
  }, [onError, onReward]);
}

/** Loading screen */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        <p className="text-lg tracking-wide">Loading Game Vault…</p>
      </div>
    </div>
  );
}

/** TopBar component */
function TopBar({ profile, coins, onTab, tab }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profile?.photo_url || "https://api.dicebear.com/9.x/thumbs/svg?seed=gv"}
            alt="avatar"
            className="w-9 h-9 rounded-xl"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">
              {profile?.first_name || "Guest"} {profile?.last_name || ""}
            </div>
            <div className="text-xs text-gray-500">@{profile?.username || "guest"}</div>
          </div>
        </div>
        <div className="px-3 py-1 rounded-xl bg-gray-900 text-white text-sm font-semibold">
          {coins.toLocaleString()} Coins
        </div>
      </div>
      <nav className="max-w-screen-md mx-auto px-2 pb-2">
        <div className="grid grid-cols-4 gap-2">
          {["Home", "Tasks", "Refer", "Order"].map((t) => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className={`py-2 rounded-2xl text-sm font-medium border ${
                tab === t ? "bg-gray-900 text-white" : "bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

/** Banner Carousel */
function BannerCarousel({ items, onClick, intervalMs = 10000 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  const current = items[index];
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md">
      <img
        src={current.img}
        alt={`banner-${current.id}`}
        className="w-full h-36 object-cover"
        onClick={() => onClick?.(current)}
      />
      <div className="absolute bottom-2 right-2 flex gap-1">
        {items.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}

/** Games Section */
function GamesSection({ title, items, type }) {
  return (
    <section className="mt-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="border rounded-xl p-3 flex flex-col items-center gap-2 hover:shadow-lg cursor-pointer">
            <div className="text-sm font-semibold">{type === "PUBG" ? item.uc + " UC" : item.diamond + " Diamond"}</div>
            <div className="text-gray-500 text-xs">{item.price} MMK</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** App component */
export default function App() {
  const { user } = useTelegram();
  const [coins, setCoins] = useState(100);
  const [tab, setTab] = useState("Home");
  const showAd = useAdsgram({
    blockId: ADSGRAM_BLOCK_ID,
    onReward: () => setCoins((c) => c + 50),
    onError: console.log,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar profile={user} coins={coins} onTab={setTab} tab={tab} />
      <main className="max-w-screen-md mx-auto px-4 py-3">
        {tab === "Home" && (
          <>
            <BannerCarousel items={DEMO_BANNERS} onClick={(item) => window.open(item.href, "_blank")} />
            <GamesSection title="PUBG UC Packs" items={PUBG_UC_PACKS} type="PUBG" />
            <GamesSection title="MLBB Diamond Packs" items={MLBB_DIAMOND_PACKS} type="MLBB" />
          </>
        )}
        {tab === "Tasks" && (
          <button
            onClick={showAd}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold mt-4"
          >
            Watch Ad & Earn Coins
          </button>
        )}
        {tab === "Refer" && <p className="text-gray-500 mt-4">Share your referral link: t.me/{BOT_USERNAME}?start={user?.id}</p>}
        {tab === "Order" && <p className="text-gray-500 mt-4">Order history coming soon...</p>}
      </main>
    </div>
  );
}
