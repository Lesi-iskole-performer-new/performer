


import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronLeft, ChevronRight, Edit3, Expand, ImagePlus, MonitorPlay,
  Pause, Play, Plus, RotateCcw, Save, Settings2, Trash2, X
} from "lucide-react";
import "./styles.css";

const ASSET = "/assets";
const INTRO_SOUND = `${ASSET}/sounds/Achivers.mp3`;
const MONTHLY_SOUND = `${ASSET}/sounds/Monthlyperformerce.mp3`;
const TRAVEL_SOUND = `${ASSET}/sounds/Travel.mp3`;
const TRAVEL_CARD_SOUND = `${ASSET}/sounds/travelcard.mp3`;
const BATTLE_SOUND = `${ASSET}/sounds/Battle.mp3`;
const BATTLE_CARD_SOUND = `${ASSET}/sounds/Battlewosh.mp3`;
const MONTHLY_CARD_SOUND = `${ASSET}/sounds/Monthlywosh.mp3`;
const WEEKLY_CARD_SOUND = `${ASSET}/sounds/weekwoosh.mp3`;
const COMMISSION_SOUND = `${ASSET}/sounds/cashcpounting.mp3`;
const DEFAULT_SLIDE_DURATION_MS = 8000;
const SLOW_PERFORMER_SLIDE_DURATION_MS = 18000;
const LOCAL_STORAGE_KEY = "lesi-achievers-state";
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const digitSequence = Array.from({ length: 20 }, (_, index) => index % 10);

const confettiPieces = Array.from({ length: 72 }, (_, index) => ({
  id: index,
  x: (index * 37 + 11) % 100,
  delay: -((index * 0.17) % 5.6),
  duration: 4.8 + ((index * 13) % 24) / 10,
  rotation: (index * 67) % 360,
  drift: (index % 2 === 0 ? 1 : -1) * (24 + ((index * 19) % 90)),
  size: 5 + ((index * 7) % 8),
  hue: (index * 47) % 360,
  shape: index % 3
}));

const celebrationFireworks = [
  { id: 1, x: 12, y: 23, delay: -0.2, hue: 48, scale: 0.9 },
  { id: 2, x: 34, y: 16, delay: -1.6, hue: 196, scale: 0.72 },
  { id: 3, x: 69, y: 20, delay: -2.7, hue: 320, scale: 1.05 },
  { id: 4, x: 89, y: 32, delay: -0.9, hue: 42, scale: 0.78 },
  { id: 5, x: 23, y: 72, delay: -3.3, hue: 8, scale: 0.62 },
  { id: 6, x: 78, y: 72, delay: -2.1, hue: 220, scale: 0.68 }
];

const fireworkAngles = Array.from({ length: 16 }, (_, index) => index * 22.5);

const slideNames = [
  "Achievers", "Monthly Performers", "6th Month Performers",
  "Battle of the Products", "Commission Update", "Mission Unlock",
  "Weekly Performers", "Congratulations"
];

const starter = {
  members: [
    { id: "Chalani", name: "Chalani", image: `${ASSET}/members/Chalani.webp` },
    { id: "chamathka", name: "Chamathka", image: `${ASSET}/members/chamathka.webp` },
    { id: "Chamodinew", name: "Chamodi", image: `${ASSET}/members/Chamodinew.webp` },
    { id: "Dulari", name: "Dulari", image: `${ASSET}/members/Dulari.webp` },
    { id: "kaveesha", name: "Kaveesha", image: `${ASSET}/members/kaveesha.webp` },
    { id: "Kavindya", name: "Kavindya", image: `${ASSET}/members/Kavindya.webp` },
    { id: "lakmi", name: "Lakmi", image: `${ASSET}/members/lakmi.webp` },
    { id: "madushani", name: "Madushani", image: `${ASSET}/members/madushani.webp` },
    { id: "Nimna", name: "Nimna", image: `${ASSET}/members/Nimna.webp` },
    { id: "Oshadi", name: "Oshadi", image: `${ASSET}/members/Oshadi.webp` },
    { id: "pamoda", name: "Pamoda", image: `${ASSET}/members/pamoda.webp` },
    { id: "Piyumi", name: "Piyumi", image: `${ASSET}/members/Piyumi.webp` },
    { id: "Sachini", name: "Sachini", image: `${ASSET}/members/Sachini.webp` },
    { id: "shehara", name: "Shehara", image: `${ASSET}/members/shehara.webp` },
    { id: "Sithmi", name: "Sithmi", image: `${ASSET}/members/Sithmi.webp` },
    { id: "Thamara", name: "Thamara", image: `${ASSET}/members/Thamara.webp` },
    { id: "Thilakshi", name: "Thilakshi", image: `${ASSET}/members/Thilakshi.webp` }
  ],
  monthly: ["Nimna", "Thilakshi", "kaveesha", "Thamara", "shehara"],
  sixMonth: ["Nimna", "Thilakshi", "kaveesha", "Thamara", "shehara", "Chalani"],
  sixMonthBackground: `${ASSET}/bangkok-bg.jpg`,
  weekly: ["Nimna", "Thilakshi", "kaveesha", "Thamara", "shehara"],
  slideCounts: {
    monthly: {},
    sixMonth: {},
    weekly: {}
  },
  month: "JULY",
  week: "3RD WEEK",
  tourTitle: "BANGKOK TOUR",
  sales: 4651,
  commission: "1395300",
  congratulationsTitle: "Congratulations!",
  congratulationsMessage: "Excellent work from the whole team.",
  products: [
    { name: "PRIMARY MATHS", count: 1800, image: `${ASSET}/products/primary-maths.webp` },
    { name: "ENGLISH", count: 1490, image: `${ASSET}/products/english.webp` },
    { name: "O/L MISSION 6", count: 910, image: `${ASSET}/products/mission-6.webp` },
    { name: "SCHOLARSHIP", count: 451, image: `${ASSET}/products/scholarship.webp` }
  ]
};

const places = [
  { label: "CHAMPION", color: "gold" },
  { label: "RUNNER UP", color: "silver" },
  { label: "THIRD PLACE", color: "bronze" },
  { label: "4TH PLACE", color: "violet" },
  { label: "5TH PLACE", color: "pink" },
  { label: "6TH PLACE", color: "cyan" }
];

const money = value => new Intl.NumberFormat("en-LK", {
  style: "currency", currency: "LKR", maximumFractionDigits: 0
}).format(value);

function zoneFor(sales) {
  if (sales >= 10000) return { key: "mega", name: "MEGA JACKPOT", amount: 3000000, note: "10,000+ SALES ACHIEVED" };
  if (sales >= 9000) return { key: "gold", name: "GOLD ZONE", amount: 2000000, note: "9,000–9,999 SALES ACHIEVED" };
  if (sales >= 8000) return { key: "silver", name: "SILVER ZONE", amount: 100000, note: "8,000–8,999 SALES ACHIEVED" };
  return { key: "danger", name: "DANGER ZONE", amount: 0, note: `${8000 - sales} MORE SALES TO UNLOCK` };
}



function mergeSavedState(saved) {
  if (!saved || typeof saved !== "object") return starter;

  const members = Array.isArray(saved.members) && saved.members.length
    ? saved.members
    : starter.members;
  const validIds = new Set(members.map(member => member.id));
  const fallbackList = starter.monthly;
  const cleanList = (list, size = 5) => {
    const source = Array.isArray(list) ? list : fallbackList;
    const fixed = source.map(id => {
      if (validIds.has(id)) return id;
      const match = members.find(member => member.id.toLowerCase() === String(id).toLowerCase());
      return match?.id || null;
    }).filter(Boolean);
    const memberFallback = members.map(member => member.id);
    return [...fixed, ...memberFallback.filter(id => !fixed.includes(id) && validIds.has(id))].slice(0, size);
  };

  const monthly = cleanList(saved.monthly, 5);
  const sixMonth = cleanList(saved.sixMonth, 6);
  const weekly = cleanList(saved.weekly, 5);

  const cleanCounts = (key, list) => {
    const savedCounts = saved.slideCounts?.[key] || {};
    return list.reduce((result, id) => {
      const savedValue = savedCounts[id];
      if (savedValue !== undefined && savedValue !== null && savedValue !== "") {
        result[id] = Number(savedValue);
        return result;
      }

      // One-time migration from the older shared member count model.
      const oldMemberCount = Number(members.find(member => member.id === id)?.count || 0);
      if (oldMemberCount > 0) result[id] = oldMemberCount;
      return result;
    }, {});
  };

  return {
    ...starter,
    ...saved,
    members: members.map(({ count, ...member }) => member),
    monthly,
    sixMonth,
    weekly,
    slideCounts: {
      monthly: cleanCounts("monthly", monthly),
      sixMonth: cleanCounts("sixMonth", sixMonth),
      weekly: cleanCounts("weekly", weekly)
    },
    products: Array.isArray(saved.products) && saved.products.length === 4
      ? saved.products.map((product, index) => ({
          ...starter.products[index],
          ...product,
          image: typeof product.image === "string" && product.image.startsWith("data:image/")
            ? product.image
            : starter.products[index].image
        }))
      : starter.products
  };
}

function loadLocalPresentation() {
  try {
    const local = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? mergeSavedState(JSON.parse(local)) : null;
  } catch {
    return null;
  }
}

function saveLocalPresentation(data) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function Brand({ small = false }) {
  return <img className={`brand ${small ? "brand-small" : ""}`} src={`${ASSET}/lesiiskole-logo.png`} alt="Lesi Iskole" />;
}

function SparkField({ count = 24, color = "gold" }) {
  return <div className={`spark-field ${color}`}>{Array.from({ length: count }, (_, i) =>
    <i key={i} style={{ "--x": `${(i * 47) % 97}%`, "--y": `${(i * 71) % 91}%`, "--d": `${(i % 9) * .17}s`, "--s": `${3 + (i % 5)}px` }} />
  )}</div>;
}

function GoldTitle({ eyebrow, children, compact = false }) {
  return <header className={`gold-title reveal title-reveal ${compact ? "compact" : ""}`}>
    {eyebrow && <span>{eyebrow}</span>}<h1>{children}</h1>
  </header>;
}

function Portrait({ member }) {
  if (!member) return <div className="portrait portrait-empty">?</div>;
  return member.image
    ? <img className="portrait" src={member.image} alt={member.name} />
    : <div className="portrait portrait-empty">{member.name.slice(0, 1)}</div>;
}

function RankCard({ member, count, rank, kind = "standard" }) {
  const place = places[rank - 1];
  const numericCount = count === "" || count === undefined || count === null ? null : Number(count);
  const isPlatinum = kind === "monthly" && Number(numericCount || 0) >= 325;
  const revealOrder = kind === "monthly" ? 6 - rank : rank;

  return <article
    className={`rank-card rank-${rank} ${place.color} ${kind} reveal card-reveal`}
    style={{ "--order": revealOrder }}
  >
    {rank === 1 && <div className="crown" aria-hidden><span>♛</span></div>}
    <div className="medal" aria-label={`Rank ${rank}`}><span>{rank}</span></div>
    <div className="portrait-ring"><Portrait member={member} /></div>
    {isPlatinum && <div className="platinum-badge"><span>PLATINUM</span><b>MEMBER</b></div>}
    <div className="ribbon">{place.label}</div>
    <div className="performer-details">
      <h2><span>{String(rank).padStart(2, "0")}.</span><em>{member?.name || "Add performer"}</em></h2>
      <strong>{numericCount === null ? "—" : numericCount.toLocaleString()}</strong>
    </div>
    {rank === 1 && <div className="champion-base"><b>1</b></div>}
  </article>;
}

function FlightBoardCard({ member, count, rank }) {
  const priority = rank <= 3 ? "priority" : "standby";
  const numericCount = count === "" || count === undefined || count === null ? null : Number(count);
  const revealOrder = 7 - rank;

  return <article
    className={`flight-board-card flight-rank-${rank} ${priority} reveal flight-card-reveal`}
    style={{ "--order": revealOrder }}
  >
    <div className="flight-rank-badge" aria-label={`Rank ${rank}`}><span>{rank}</span></div>
    <div className="flight-photo"><Portrait member={member}/></div>
    <div className="flight-pass-data">
      <h2>{member?.name || "ADD PERFORMER"}</h2>
      <strong>{numericCount === null ? "—" : numericCount.toLocaleString()}</strong>
    </div>
    <div className="flight-ticket-edge" aria-hidden><span>✈</span></div>
  </article>;
}

function SixMonthFlightSlide({ state, list }) {
  const performers = list.slice(0, 6).map(id => ({
    id,
    member: state.members.find(member => member.id === id),
    count: state.slideCounts?.sixMonth?.[id] ?? ""
  }));

  return <section
    className="slide six-month-flight-slide"
    style={{ "--bangkok-background": `url("${state.sixMonthBackground || `${ASSET}/bangkok-bg.jpg`}")` }}
  >
    <div className="bangkok-overlay"/>
    <SparkField count={20} color="gold"/>
    <div className="flight-board-header reveal title-reveal">
      <h1>{state.tourTitle || "BANGKOK TOUR"}</h1>
      <div><b>FLIGHT BOARD</b><small>TOP 6 MEMBERS</small></div>
    </div>
    <div className="flight-board-grid">
      {performers.map(({ id, member, count }, cardIndex) => <FlightBoardCard member={member} count={count} rank={cardIndex + 1} key={`${id || "empty"}-${cardIndex}`}/>) }
    </div>
    <div className="flight-board-final reveal flight-final-reveal">
      <span>TOUR STATUS</span><b>PENDING BANGKOK TOUR • COMPETITION NOT FINISHED</b><i>✈</i>
    </div>
    <Brand small/>
  </section>;
}

function PerformersSlide({ state, list, type }) {
  const listKey = type === "monthly" ? "monthly" : "weekly";
  const performers = list.map(id => ({
    id,
    member: state.members.find(m => m.id === id),
    count: state.slideCounts?.[listKey]?.[id] ?? ""
  }));
  const config = type === "monthly"
    ? { eyebrow: "MONTHLY RECOGNITION", title: `${state.month} TOP PERFORMERS`, badge: "PLATINUM MEMBER" }
    : type === "six"
      ? { eyebrow: `6TH MONTH • ${state.tourTitle}`, title: "TOP PERFORMERS", badge: "BANGKOK TOUR" }
      : { eyebrow: "WEEKLY RECOGNITION", title: `${state.week} TOP PERFORMERS`, badge: "" };
  return <section className={`slide performers-slide ${type}`}>
    <SparkField count={32} />
    <GoldTitle eyebrow={config.eyebrow}>{config.title}</GoldTitle>
    {type === "six" && <div className="plane reveal fly-in">✈</div>}
    <div className="rank-stage">
      {performers.map(({ id, member, count }, i) => <RankCard member={member} count={count} rank={i + 1} key={`${id}-${i}`} kind={type} />)}
    </div>
    <Brand small />
  </section>;
}

function IntroSlide() {
  return <section className="slide intro-slide">
    <SparkField count={30} color="blue" />
    <div className="radial-rays" />
    <Brand />
    <h1 className="achievers-title reveal achievers-reveal">ACHIEVERS</h1>
    <div className="gold-swoosh reveal swoosh-reveal" />
    <p className="intro-copy reveal footer-reveal">CELEBRATING EXCELLENCE • HONOURING SUCCESS</p>
  </section>;
}

function ProductCard({ product, rank }) {
  const revealOrder = 5 - rank;
  const fallbackImage = starter.products[rank - 1].image;

  return <article className={`product-card product-rank-${rank} reveal product-reveal`} style={{ "--order": revealOrder }}>
    <div className="product-place"><b>{rank}</b><span>{["1ST", "2ND", "3RD", "4TH"][rank - 1]} PLACE</span></div>
    <div className="product-name">{product.name}</div>
    <img
      src={product.image || fallbackImage}
      alt={product.name}
      onError={event => {
        if (event.currentTarget.src.endsWith(fallbackImage)) return;
        event.currentTarget.src = fallbackImage;
      }}
    />
    <strong>{product.count.toLocaleString()} SALES</strong>
  </article>;
}

function ProductsSlide({ state }) {
  return <section className="slide products-slide">
    <SparkField count={28} color="blue" />
    <GoldTitle eyebrow="THE ULTIMATE">BATTLE OF THE PRODUCTS</GoldTitle>
    <div className="crossed-swords reveal title-reveal">⚔</div>
    <div className="product-stage">
      {state.products.map((product, i) => <ProductCard product={product} rank={i + 1} key={i} />)}
    </div>
  </section>;
}

function RollingCommissionNumber({ value, replay }) {
  const displayValue = String(value || "0");
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    setIsRolling(false);
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsRolling(true));
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [displayValue, replay]);

  let digitIndex = -1;
  return <div className={`rolling-number ${isRolling ? "is-rolling" : ""}`} aria-label={displayValue}>
    <span className="sr-only">{displayValue}</span>
    {displayValue.split("").map((character, characterIndex) => {
      if (!/\d/.test(character)) return <span className="odometer-separator" key={`${character}-${characterIndex}`} aria-hidden="true">{character}</span>;
      digitIndex += 1;
      const target = 10 + Number(character);
      return <span className="odometer-digit" key={`${characterIndex}-${character}`} style={{ "--stop": target, "--digit-index": digitIndex }} aria-hidden="true">
        <span className="odometer-strip">{digitSequence.map((digit, stripIndex) => <span key={stripIndex}>{digit}</span>)}</span>
      </span>;
    })}
    <span className="commission-sheen" aria-hidden="true"/>
  </div>;
}

function CommissionSlide({ state, replay }) {
  return <section className="slide commission-slide supplied-commission-slide animated-slide">
    <div className="commission-slide-content">
      <h1>YOUR COMMISSION UPDATE</h1>
      <div className="supplied-commission-number"><RollingCommissionNumber value={state.commission} replay={replay}/></div>
    </div>
    <Brand small/>
  </section>;
}

function CelebrationFirework({ firework }) {
  return <div className="celebration-firework" style={{
    "--firework-x": `${firework.x}%`, "--firework-y": `${firework.y}%`,
    "--firework-delay": `${firework.delay}s`, "--firework-hue": firework.hue, "--firework-scale": firework.scale
  }} aria-hidden="true">
    <span className="firework-core"/><span className="firework-ring"/>
    <span className="firework-sparks">{fireworkAngles.map(angle => <i key={angle} style={{ "--spark-angle": `${angle}deg` }}/>)}</span>
  </div>;
}

function CelebrationEffects() {
  return <div className="celebration-effects" aria-hidden="true">
    <div className="celebration-rays"/>
    <div className="celebration-rings"><span/><span/><span/></div>
    <div className="fireworks-layer">{celebrationFireworks.map(firework => <CelebrationFirework key={firework.id} firework={firework}/>)}</div>
    <div className="confetti-layer">{confettiPieces.map(piece => <i key={piece.id} className={`confetti-piece confetti-shape-${piece.shape}`} style={{
      "--confetti-x": `${piece.x}%`, "--confetti-delay": `${piece.delay}s`, "--confetti-duration": `${piece.duration}s`,
      "--confetti-rotation": `${piece.rotation}deg`, "--confetti-drift": `${piece.drift}px`, "--confetti-size": `${piece.size}px`, "--confetti-hue": piece.hue
    }}/>)}</div>
    <div className="celebration-sweep sweep-one"/><div className="celebration-sweep sweep-two"/>
  </div>;
}

function MissionSlide({ state }) {
  const zone = zoneFor(state.sales);
  const unlocked = zone.key !== "danger";
  return <section className={`slide mission-slide zone-${zone.key}`}>
    <SparkField count={34} color={zone.key} />
    <GoldTitle eyebrow="SALES MISSION">{unlocked ? "UNLOCKED MISSION" : "MISSION LOCKED"}</GoldTitle>
    <div className={`mission-chest reveal chest-reveal ${unlocked ? "is-open" : ""}`}>
      <div className="chest-glow" />
      <div className="chest-lid"><span /><span /></div>
      <div className="chest-body">
        <div className="zone-emblem">{unlocked ? "◆" : "!"}</div>
        <h2>{zone.name}</h2>
        <strong>{zone.amount ? money(zone.amount) : "NO COMMISSION"}</strong>
        <p>{zone.note}</p>
      </div>
    </div>
    <div className="zone-progress reveal footer-reveal">
      {[
        ["danger", "< 8,000"], ["silver", "8,000+"], ["gold", "9,000+"], ["mega", "10,000+"]
      ].map(([key, label]) => <div className={key === zone.key ? "active" : ""} key={key}><i /><span>{label}</span></div>)}
    </div>
  </section>;
}

function FinaleSlide({ state }) {
  return <section className="slide congratulations-slide animated-slide">
    <div className="fireworks-background"/>
    <div className="celebration-glow"/>
    <CelebrationEffects/>
    <div className="celebration-content">
      <span className="celebration-kicker">Team achievement</span>
      <h2>{state.congratulationsTitle || "Congratulations!"}</h2>
      <p>{state.congratulationsMessage || "Excellent work from the whole team."}</p>
    </div>
    <img className="celebration-logo" src={`${ASSET}/lesiiskole-logo.png`} alt="Lesi Iskole"/>
  </section>;
}

function Stage({ index, state, replay }) {
  return <div className={`presentation-stage stage-${index}`} key={`${index}-${replay}`}>
    {index === 0 && <IntroSlide />}
    {index === 1 && <PerformersSlide state={state} list={state.monthly} type="monthly" />}
    {index === 2 && <SixMonthFlightSlide state={state} list={state.sixMonth} />}
    {index === 3 && <ProductsSlide state={state} />}
    {index === 4 && <CommissionSlide state={state} replay={replay} />}
    {index === 5 && <MissionSlide state={state} />}
    {index === 6 && <PerformersSlide state={state} list={state.weekly} type="weekly" />}
    {index === 7 && <FinaleSlide state={state} />}
  </div>;
}

function ImageUploader({ onImage, compact = false }) {
  const upload = file => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return <label className={`image-upload ${compact ? "compact" : ""}`}><ImagePlus size={16}/><span>{compact ? "" : "Upload image"}</span><input hidden type="file" accept="image/*" onChange={e => e.target.files?.[0] && upload(e.target.files[0])}/></label>;
}

function PerformerEditor({ state, setState, listKey }) {
  const selectedIds = state[listKey] || [];
  const rankCount = selectedIds.length || 5;

  const patchMember = (id, patch) => setState(current => ({
    ...current,
    members: current.members.map(member => member.id === id ? { ...member, ...patch } : member)
  }));

  const updateSlideCount = (id, rawValue) => setState(current => {
    const nextCounts = { ...(current.slideCounts?.[listKey] || {}) };
    if (rawValue === "") delete nextCounts[id];
    else nextCounts[id] = Math.max(0, Number(rawValue));

    return {
      ...current,
      slideCounts: {
        ...(current.slideCounts || {}),
        [listKey]: nextCounts
      }
    };
  });

  const addMember = () => {
    const id = `member-${Date.now()}`;
    setState(current => ({
      ...current,
      members: [...current.members, { id, name: "New Performer", image: "" }]
    }));
  };

  const removeMember = id => setState(current => {
    const nextSlideCounts = Object.fromEntries(
      Object.entries(current.slideCounts || {}).map(([key, counts]) => {
        const nextCounts = { ...counts };
        delete nextCounts[id];
        return [key, nextCounts];
      })
    );

    return {
      ...current,
      members: current.members.filter(member => member.id !== id),
      slideCounts: nextSlideCounts
    };
  });

  const updateRank = (rank, id) => setState(current => ({
    ...current,
    [listKey]: current[listKey].map((currentId, index) => index === rank ? id : currentId)
  }));

  return <>
    <div className="inspector-section">
      <div className="section-title"><span>Selected performers and slide counts</span><small>Each slide has different counts</small></div>
      {selectedIds.map((id, index) => {
        const selectedMember = state.members.find(member => member.id === id);
        const countValue = state.slideCounts?.[listKey]?.[id] ?? "";

        return <div className="selected-performer-editor" key={`${listKey}-${index}`}>
          <b>{index + 1}</b>
          <select value={id} onChange={event => updateRank(index, event.target.value)}>
            {state.members.map(member => <option value={member.id} key={member.id}>{member.name}</option>)}
          </select>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Enter count"
            value={countValue}
            onChange={event => updateSlideCount(id, event.target.value)}
            aria-label={`${selectedMember?.name || `Rank ${index + 1}`} count for this slide`}
          />
        </div>;
      })}
      <p className="helper">Counts update immediately and belong only to this slide. Empty counts stay blank instead of showing a default zero.</p>
    </div>

    <div className="inspector-section">
      <div className="section-title"><span>Shared performer library</span><button onClick={addMember}><Plus size={15}/>Add</button></div>
      {state.members.map(member => <div className="member-editor library-only" key={member.id}>
        <Portrait member={member}/>
        <div className="member-fields">
          <input value={member.name} onChange={event => patchMember(member.id, { name: event.target.value })} placeholder="Full performer name"/>
        </div>
        <ImageUploader compact onImage={image => patchMember(member.id, { image })}/>
        {state.members.length > rankCount && <button className="icon-danger" onClick={() => removeMember(member.id)}><Trash2 size={15}/></button>}
      </div>)}
      <p className="helper">The shared library stores only the performer’s full name and image. Select a performer above, then enter a separate count for Monthly, 6th Month, or Weekly.</p>
    </div>
  </>;
}

function Inspector({ index, state, setState, onClose, onSave, saving }) {
  const update = patch => setState(s => ({ ...s, ...patch }));
  const listKey = index === 1 ? "monthly" : index === 2 ? "sixMonth" : "weekly";
  return <aside className="inspector">
    <header><div><small>SLIDE {index + 1} OF 8</small><h2>{slideNames[index]}</h2></div><button onClick={onClose}><X/></button></header>
    <div className="inspector-scroll">
      {(index === 1 || index === 2 || index === 6) && <>
        <div className="inspector-section">
          {index === 1 && <label className="field"><span>Month</span><select value={state.month} onChange={e => update({ month: e.target.value })}>{MONTHS.map(month => <option value={month} key={month}>{month}</option>)}</select></label>}
          {index === 2 && <>
            <label className="field"><span>Flight-board title</span><input value={state.tourTitle} onChange={e => update({ tourTitle: e.target.value.toUpperCase() })}/></label>
            <label className="field"><span>Bangkok background image</span><ImageUploader onImage={sixMonthBackground => update({ sixMonthBackground })}/></label>
          </>}
          {index === 6 && <label className="field"><span>Week</span><input value={state.week} onChange={e => update({ week: e.target.value.toUpperCase() })}/></label>}
        </div>
        <PerformerEditor state={state} setState={setState} listKey={listKey}/>
      </>}
      {index === 3 && <div className="inspector-section">
        <div className="section-title"><span>Product rankings</span><small>1st to 4th</small></div>
        {state.products.map((product, i) => <div className="product-editor" key={i}>
          <b>{i + 1}</b><img src={product.image} alt=""/>
          <input value={product.name} onChange={e => update({ products: state.products.map((p, x) => x === i ? { ...p, name: e.target.value } : p) })}/>
          <input type="number" value={product.count} onChange={e => update({ products: state.products.map((p, x) => x === i ? { ...p, count: Number(e.target.value) } : p) })}/>
          <ImageUploader compact onImage={image => update({ products: state.products.map((p, x) => x === i ? { ...p, image } : p) })}/>
        </div>)}
      </div>}
      {index === 4 && <div className="inspector-section">
        <label className="field"><span>Total commission</span><input className="big-input" inputMode="numeric" value={state.commission ?? ""} onChange={e => update({ commission: e.target.value.replace(/[^0-9.,]/g, "") })} placeholder="1395300"/></label>
        <p className="helper">Enter the commission exactly as it should appear on the slide.</p>
      </div>}
      {index === 5 && <div className="inspector-section">
        <label className="field"><span>Sales count</span><input className="big-input" type="number" min="0" value={state.sales} onChange={e => update({ sales: Math.max(0, Number(e.target.value)) })}/></label>
        <div className="calculation-card"><span>300 LKR × {state.sales.toLocaleString()}</span><strong>{money(state.sales * 300)}</strong></div>
        <div className={`zone-preview ${zoneFor(state.sales).key}`}><span>Current result</span><b>{zoneFor(state.sales).name}</b><strong>{zoneFor(state.sales).amount ? money(zoneFor(state.sales).amount) : "NO COMMISSION"}</strong></div>
      </div>}
      {index === 7 && <div className="inspector-section">
        <label className="field"><span>Headline</span><input value={state.congratulationsTitle ?? ""} onChange={e => update({ congratulationsTitle: e.target.value })} placeholder="Congratulations!"/></label>
        <label className="field"><span>Message</span><textarea rows="5" value={state.congratulationsMessage ?? ""} onChange={e => update({ congratulationsMessage: e.target.value })} placeholder="Excellent work from the whole team."/></label>
      </div>}
      {index === 0 && <div className="inspector-section">
        <div className="locked-card"><Brand small/><h3>Cinematic brand slide</h3><p>This slide uses the supplied Lesi Iskole logo and the clean branded background.</p></div>
      </div>}
    </div>
    <footer><button className="primary-button" onClick={onSave}><Save size={17}/>{saving ? "Saving…" : "Save presentation"}</button></footer>
  </aside>;
}

function SlideRail({ index, onSelect }) {
  return <aside className="slide-rail">
    <div className="rail-title"><MonitorPlay size={17}/><span>SHOW FLOW</span></div>
    {slideNames.map((name, i) => <button className={index === i ? "active" : ""} onClick={() => onSelect(i)} key={name}>
      <b>{i + 1}</b><span>{name}</span><i/>
    </button>)}
  </aside>;
}

function StartOverlay({ onStart }) {
  return <div className="start-overlay">
    <Brand/>
    <span>INTERACTIVE AWARDS EXPERIENCE</span>
    <h1>ACHIEVERS SHOW</h1>
    <p>Monthly and travel boards reveal slowly; use Play/Pause during presentation.</p>
    <button onClick={onStart}><Play fill="currentColor"/>START AUTO SHOW</button>
  </div>;
}

function App() {
  const [state, setState] = useState(starter);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("edit");
  const [inspector, setInspector] = useState(true);
  const [started, setStarted] = useState(false);
  const [replay, setReplay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);
  const introAudioRef = useRef(null);
  const monthlyAudioRef = useRef(null);
  const travelAudioRef = useRef(null);
  const travelCardAudioRef = useRef(null);
  const battleAudioRef = useRef(null);
  const commissionAudioRef = useRef(null);
  const battleCardAudioRef = useRef(null);
  const monthlyCardAudioRef = useRef(null);
  const weeklyCardAudioRef = useRef(null);
  const cardSoundTimersRef = useRef([]);
  const cardSoundInstancesRef = useRef([]);
  const travelCardTimersRef = useRef([]);
  const travelCardInstancesRef = useRef([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const data = loadLocalPresentation();
    if (active && data) setState(data);
    hasLoadedRef.current = true;

    return () => { active = false; };
  }, []);


  useEffect(() => {
    const introAudio = new Audio(INTRO_SOUND);
    const monthlyAudio = new Audio(MONTHLY_SOUND);
    const travelAudio = new Audio(TRAVEL_SOUND);
    const travelCardAudio = new Audio(TRAVEL_CARD_SOUND);
    const battleAudio = new Audio(BATTLE_SOUND);
    const commissionAudio = new Audio(COMMISSION_SOUND);
    const battleCardAudio = new Audio(BATTLE_CARD_SOUND);
    const monthlyCardAudio = new Audio(MONTHLY_CARD_SOUND);
    const weeklyCardAudio = new Audio(WEEKLY_CARD_SOUND);
    introAudio.preload = "auto";
    monthlyAudio.preload = "auto";
    travelAudio.preload = "auto";
    travelCardAudio.preload = "auto";
    battleAudio.preload = "auto";
    commissionAudio.preload = "auto";
    battleCardAudio.preload = "auto";
    monthlyCardAudio.preload = "auto";
    weeklyCardAudio.preload = "auto";
    introAudioRef.current = introAudio;
    monthlyAudioRef.current = monthlyAudio;
    travelAudioRef.current = travelAudio;
    travelCardAudioRef.current = travelCardAudio;
    battleAudioRef.current = battleAudio;
    commissionAudioRef.current = commissionAudio;
    battleCardAudioRef.current = battleCardAudio;
    monthlyCardAudioRef.current = monthlyCardAudio;
    weeklyCardAudioRef.current = weeklyCardAudio;

    return () => {
      cardSoundTimersRef.current.forEach(timer => window.clearTimeout(timer));
      cardSoundTimersRef.current = [];
      cardSoundInstancesRef.current.forEach(audio => { audio.pause(); audio.currentTime = 0; });
      cardSoundInstancesRef.current = [];
      travelCardTimersRef.current.forEach(timer => window.clearTimeout(timer));
      travelCardTimersRef.current = [];
      travelCardInstancesRef.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      travelCardInstancesRef.current = [];
      [introAudio, monthlyAudio, travelAudio, travelCardAudio, battleAudio, commissionAudio, battleCardAudio, monthlyCardAudio, weeklyCardAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      introAudioRef.current = null;
      monthlyAudioRef.current = null;
      travelAudioRef.current = null;
      travelCardAudioRef.current = null;
      battleAudioRef.current = null;
      commissionAudioRef.current = null;
      battleCardAudioRef.current = null;
      monthlyCardAudioRef.current = null;
      weeklyCardAudioRef.current = null;
    };
  }, []);

  const clearCardSounds = () => {
    cardSoundTimersRef.current.forEach(timer => window.clearTimeout(timer));
    cardSoundTimersRef.current = [];
    cardSoundInstancesRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    cardSoundInstancesRef.current = [];
  };

  const scheduleCardSounds = (source, delays) => {
    clearCardSounds();
    if (!source) return;
    cardSoundTimersRef.current = delays.map(delay => window.setTimeout(() => {
      const cardAudio = source.cloneNode();
      cardAudio.currentTime = 0;
      cardSoundInstancesRef.current.push(cardAudio);
      cardAudio.play().catch(() => {});
      cardAudio.addEventListener("ended", () => {
        cardSoundInstancesRef.current = cardSoundInstancesRef.current.filter(item => item !== cardAudio);
      }, { once: true });
    }, delay));
  };

  const clearTravelCardSounds = () => {
    travelCardTimersRef.current.forEach(timer => window.clearTimeout(timer));
    travelCardTimersRef.current = [];
    travelCardInstancesRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    travelCardInstancesRef.current = [];
  };

  const stopAllSounds = () => {
    clearTravelCardSounds();
    clearCardSounds();
    [introAudioRef.current, monthlyAudioRef.current, travelAudioRef.current, battleAudioRef.current, commissionAudioRef.current].forEach(audio => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const scheduleTravelCardSounds = () => {
    clearTravelCardSounds();
    const delays = [2400, 3950, 5500, 7050, 8600, 10150];
    travelCardTimersRef.current = delays.map(delay => window.setTimeout(() => {
      const source = travelCardAudioRef.current;
      if (!source) return;
      const cardAudio = source.cloneNode();
      cardAudio.currentTime = 0;
      travelCardInstancesRef.current.push(cardAudio);
      cardAudio.play().catch(() => {});
      cardAudio.addEventListener("ended", () => {
        travelCardInstancesRef.current = travelCardInstancesRef.current.filter(item => item !== cardAudio);
      }, { once: true });
    }, delay));
  };

  const playSoundForSlide = slideIndex => {
    stopAllSounds();
    const audio = slideIndex === 0
      ? introAudioRef.current
      : slideIndex === 1
        ? monthlyAudioRef.current
        : slideIndex === 2
          ? travelAudioRef.current
          : slideIndex === 3
            ? battleAudioRef.current
            : slideIndex === 4
              ? commissionAudioRef.current
              : null;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    if (slideIndex === 1) scheduleCardSounds(monthlyCardAudioRef.current, [2400, 3800, 5200, 6600, 8000]);
    if (slideIndex === 2) scheduleTravelCardSounds();
    if (slideIndex === 3) scheduleCardSounds(battleCardAudioRef.current, [1370, 2090, 2810, 3530]);
    if (slideIndex === 6) scheduleCardSounds(weeklyCardAudioRef.current, [1370, 2090, 2810, 3530, 4250]);
  };

  const togglePause = () => {
    setPaused(current => {
      const next = !current;
      if (next) {
        clearTravelCardSounds();
        clearCardSounds();
        [introAudioRef.current, monthlyAudioRef.current, travelAudioRef.current, battleAudioRef.current, commissionAudioRef.current].forEach(audio => audio?.pause());
      } else if (started && mode === "present") {
        setReplay(value => value + 1);
        playSoundForSlide(index);
      }
      return next;
    });
  };

  const playSlide = () => {
    setReplay(current => current + 1);
    if (started && mode === "present") playSoundForSlide(index);
  };

  const select = next => {
    const safe = (next + slideNames.length) % slideNames.length;
    setPaused(false);
    setIndex(safe);
    setReplay(current => current + 1);

    if (started && mode === "present") playSoundForSlide(safe);
    else stopAllSounds();
  };

  const start = () => {
    setStarted(true);
    setPaused(false);
    setMode("present");
    setInspector(false);
    setReplay(current => current + 1);

    playSoundForSlide(index);
  };

  const save = async () => {
    setSaving(true);
    try {
      saveLocalPresentation(state);
    } catch (error) {
      console.error("Unable to save the presentation locally", error);
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    if (!hasLoadedRef.current) return;
    const timer = window.setTimeout(() => saveLocalPresentation(state), 40);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (!started || mode !== "present" || paused) return undefined;

    const duration = index === 1 || index === 2 ? SLOW_PERFORMER_SLIDE_DURATION_MS : DEFAULT_SLIDE_DURATION_MS;
    const timer = window.setTimeout(() => {
      const next = (index + 1) % slideNames.length;
      setIndex(next);
      setReplay(current => current + 1);

      playSoundForSlide(next);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [started, mode, index, replay, paused]);

  useEffect(() => {
    const key = event => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === "ArrowRight") { event.preventDefault(); select(index + 1); }
      if (event.key === " ") { event.preventDefault(); togglePause(); }
      if (event.key === "ArrowLeft") select(index - 1);
      if (event.key.toLowerCase() === "r") playSlide();
      if (event.key.toLowerCase() === "e") { stopAllSounds(); setMode("edit"); setInspector(true); }
      if (event.key === "Escape" && mode === "present") { stopAllSounds(); setMode("edit"); setInspector(true); }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, mode]);

  return <main className={`show-app mode-${mode} ${paused ? "show-paused" : ""}`}>
    {!started && <StartOverlay onStart={start}/>}
    {mode === "edit" && <SlideRail index={index} onSelect={select}/>}
    <div className="workspace">
      {mode === "edit" && <header className="topbar">
        <div className="project-title"><Brand small/><div><small>LEසි ඉස්කෝලේ</small><b>Achievers Show</b></div></div>
        <div className="top-actions">
          <button onClick={togglePause}>{paused ? <Play size={16}/> : <Pause size={16}/>}{paused ? "Play show" : "Pause show"}</button>
          <button onClick={() => playSlide()}><RotateCcw size={16}/>Replay animation</button>
          <button className="present-button" onClick={start}><MonitorPlay size={18}/>Present</button>
        </div>
      </header>}
      <div className="stage-shell" ref={stageRef}>
        <Stage index={index} state={state} replay={replay}/>
        <div className="present-controls">
          <button onClick={() => select(index - 1)} aria-label="Previous slide"><ChevronLeft/></button>
          <button onClick={() => playSlide()} aria-label="Replay animation"><RotateCcw/></button>
          <button onClick={togglePause} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? <Play fill="currentColor"/> : <Pause fill="currentColor"/>}</button>
          <div className="slide-counter"><b>{String(index + 1).padStart(2, "0")}</b><span>/ 08</span></div>
          <button onClick={() => stageRef.current?.requestFullscreen()} aria-label="Fullscreen"><Expand/></button>
          {mode === "present" && <button onClick={() => { stopAllSounds(); setPaused(false); setMode("edit"); setInspector(true); }} aria-label="Editing mode"><Edit3/></button>}
          <button onClick={() => select(index + 1)} aria-label="Next slide"><ChevronRight/></button>
        </div>
        <div className="slide-dots">{slideNames.map((name, i) => <button className={i === index ? "active" : ""} onClick={() => select(i)} title={name} key={name}/>)}</div>
      </div>
    </div>
    {mode === "edit" && inspector && <Inspector index={index} state={state} setState={setState} onClose={() => setInspector(false)} onSave={save} saving={saving}/>}
    {mode === "edit" && !inspector && <button className="open-inspector" onClick={() => setInspector(true)}><Settings2/><span>Edit slide</span></button>}
  </main>;
}

createRoot(document.getElementById("root")).render(<App/>);
