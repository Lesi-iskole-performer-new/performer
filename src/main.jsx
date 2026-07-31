import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronLeft, ChevronRight, Edit3, Expand, MonitorPlay,
  Pause, Play, RotateCcw, Save, Settings2, Volume2, VolumeX, X
} from "lucide-react";
import "./styles.css";

const ASSET = "/assets";
const INTRO_SOUND = `${ASSET}/sounds/Achivers.mp3`;
const MONTHLY_SOUND = `${ASSET}/sounds/Monthlyperformerce.mp3`;
const WEEKLY_SOUND = `${ASSET}/sounds/Weeklyperfrmer.mp3`;
const TRAVEL_SOUND = `${ASSET}/sounds/Travel.mp3`;
const TRAVEL_CARD_SOUND = `${ASSET}/sounds/travelcard.mp3`;
const TRAVEL_SPOTLIGHT_SOUND = `${ASSET}/sounds/cardelectric.mp3`;
const BATTLE_SOUND = `${ASSET}/sounds/Battlebackround.mp3`;
const BATTLE_CARD_SOUND = `${ASSET}/sounds/Battle.mp3`;
const MONTHLY_CARD_SOUND = `${ASSET}/sounds/Monthlywosh.mp3`;
const WEEKLY_CARD_SOUND = `${ASSET}/sounds/weekwoosh.mp3`;
const COMMISSION_INTRO_SOUND = `${ASSET}/sounds/ganata.mp3`;
const COMMISSION_COUNT_SOUND = `${ASSET}/sounds/cashcpounting.mp3`;
const DANGER_ZONE_SOUND = `${ASSET}/sounds/dangerzone.mp3`;
const SILVER_ZONE_SOUND = `${ASSET}/sounds/silverzone.mp3`;
const GOLD_ZONE_SOUND = `${ASSET}/sounds/goldzone.mp3`;
const MEGA_ZONE_SOUND = `${ASSET}/sounds/megajackpot.mp3`;
const MISSION_CARD_SOUND = `${ASSET}/sounds/GunshotElectric.mp3`;
const CELEBRATE_SOUND = `${ASSET}/sounds/celebrate.mp3`;
const DEFAULT_SLIDE_DURATION_MS = 8000;
const SLOW_PERFORMER_SLIDE_DURATION_MS = 18000;
const SIX_MONTH_SLIDE_DURATION_MS = 15000;
const SIX_MONTH_CARD_SOUND_DELAYS_MS = [550, 1170, 1790, 2410, 3030, 3650];
const SIX_MONTH_SPOTLIGHT_SOUND_DELAYS_MS = [4750, 7550, 10350];
const WEEKLY_CARD_SEQUENCE_MS = 1000 + (5 * 1400) + 2050;
const WEEKLY_FINAL_HOLD_MS = 8000;
const WEEKLY_PERFORMER_SLIDE_DURATION_MS = WEEKLY_CARD_SEQUENCE_MS + WEEKLY_FINAL_HOLD_MS;
const MISSION_CARD_REVEAL_MS = 3450;
const MISSION_ANIMATION_DURATION_MS = 5600;
const SLOW_BATTLE_SLIDE_DURATION_MS = 13000;
const COMMISSION_TITLE_FALLBACK_DURATION_MS = 1200;
const COMMISSION_COUNTING_DURATION_MS = 9000;
const COMMISSION_FINAL_DISPLAY_MS = 5000;
const COMMISSION_CASH_SEQUENCE_MS = COMMISSION_COUNTING_DURATION_MS + COMMISSION_FINAL_DISPLAY_MS;
const LOCAL_STORAGE_KEY = "lesi-achievers-state";
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const WEEKS = ["1ST WEEK", "2ND WEEK", "3RD WEEK", "4TH WEEK", "5TH WEEK"];
const digitSequence = Array.from({ length: 10 }, (_, index) => index);
const zeroDigitSequence = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

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

const SLIDE = Object.freeze({
  ACHIEVERS: 0,
  WEEKLY: 1,
  PRODUCTS: 2,
  MONTHLY: 3,
  SIX_MONTH: 4,
  COMMISSION: 5,
  MISSION: 6,
  CONGRATULATIONS: 7
});

const slideNames = [
  "Achievers", "Weekly Performers", "Battle of the Products",
  "Monthly Performers", "6th Month Performers", "Commission Update",
  "Mission Unlock", "Congratulations"
];

const SOUND_MODES = Object.freeze({
  OFF: "off",
  REPEAT: "repeat",
  ONCE: "once"
});

const starter = {
  members: [
    { id: "Chalani", name: "Chalani", image: `${ASSET}/members/Chalani.webp` },
    { id: "chamathka", name: "Chamathka", image: `${ASSET}/members/chamathka.webp` },
    { id: "Chamodinew", name: "Chamodi", image: `${ASSET}/members/Chamodinew.webp` },
    { id: "ChamodiHansika", name: "Chamodi Hansika", image: `${ASSET}/members/Chamodi.webp` },
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
    { id: "Thilakshi", name: "Thilakshi", image: `${ASSET}/members/Thilakshi.webp` },
    { id: "Shalani", name: "Shalani", image: `${ASSET}/members/Shalani.webp` }
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
    { id: "primary-maths", name: "PRIMARY MATHS", count: 1800, image: `${ASSET}/products/primary-maths.webp` },
    { id: "english", name: "ENGLISH", count: 1490, image: `${ASSET}/products/english.webp` },
    {
      id: "ol-mission-6-scholarship",
      name: "O/L MISSION 6 + SCHOLARSHIP",
      count: 1361,
      image: `${ASSET}/products/mission-6.webp`,
      secondaryImage: `${ASSET}/products/scholarship.webp`
    }
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
  const achievedSales = Math.max(0, Number(sales || 0));
  const achievedNote = `${achievedSales.toLocaleString()} SALES ACHIEVED`;
  if (achievedSales >= 10000) return { key: "mega", name: "MEGA JACKPOT", amount: 3000000, note: achievedNote };
  if (achievedSales >= 7500) return { key: "gold", name: "GOLD ZONE", amount: 2000000, note: achievedNote };
  if (achievedSales >= 6500) return { key: "silver", name: "SILVER ZONE", amount: 1000000, note: achievedNote };
  return { key: "danger", name: "DANGER ZONE", amount: 0, note: achievedNote };
}

const isMissingCount = value => value === "" || value === null || value === undefined;
const isValidCount = value => {
  const number = Number(value);
  return Number.isFinite(number) && Number.isInteger(number) && number >= 0;
};

function validateRankedCounts({ values, expected, slideIndex, label, enforceRanking = true }) {
  if (values.length !== expected || values.some(isMissingCount)) {
    return {
      slideIndex,
      title: "COUNT VALUES REQUIRED",
      message: `${label}: Please enter every count value. Then you can present the show.`
    };
  }

  if (values.some(value => !isValidCount(value))) {
    return {
      slideIndex,
      title: "INVALID NUMBER",
      message: `${label}: Please enter valid whole numbers for every ${enforceRanking ? "rank" : "performer"}.`
    };
  }

  if (!enforceRanking) return null;

  const counts = values.map(Number);
  const invalidRank = counts.findIndex((count, index) => index > 0 && count > counts[index - 1]);
  if (invalidRank >= 1) {
    return {
      slideIndex,
      title: "INVALID RANKING",
      message: `${label}: Rank ${invalidRank + 1} cannot have a higher count than Rank ${invalidRank}. Please enter valid numbers.`
    };
  }

  return null;
}

function validatePresentation(state) {
  const performerGroups = [
    { key: "monthly", expected: 5, slideIndex: SLIDE.MONTHLY, label: "Monthly Performers" },
    { key: "sixMonth", expected: 6, slideIndex: SLIDE.SIX_MONTH, label: "6th Month Performers", enforceRanking: false },
    { key: "weekly", expected: 5, slideIndex: SLIDE.WEEKLY, label: "Weekly Performers" }
  ];

  for (const group of performerGroups) {
    const values = (state[group.key] || []).map(id => state.slideCounts?.[group.key]?.[id]);
    const problem = validateRankedCounts({ ...group, values });
    if (problem) return problem;
  }

  const productProblem = validateRankedCounts({
    values: (state.products || []).map(product => product.count),
    expected: 3,
    slideIndex: SLIDE.PRODUCTS,
    label: "Battle of the Products"
  });
  if (productProblem) return productProblem;

  if (isMissingCount(state.sales)) {
    return {
      slideIndex: SLIDE.COMMISSION,
      title: "TOTAL SALES REQUIRED",
      message: "Commission Update: Please enter Total Sales. Then you can present the show."
    };
  }

  if (!isValidCount(state.sales)) {
    return {
      slideIndex: SLIDE.COMMISSION,
      title: "INVALID TOTAL SALES",
      message: "Commission Update: Please enter a valid whole number for Total Sales."
    };
  }

  return null;
}



function mergeSavedState(saved) {
  if (!saved || typeof saved !== "object") return starter;

  const savedMembers = Array.isArray(saved.members) && saved.members.length
    ? saved.members
    : starter.members;
  const memberKey = value => String(value || "").trim().toLowerCase();
  const isShalaniKey = value => ["shalani", "shalni"].includes(memberKey(value));
  const isOriginalChamodiId = value => memberKey(value) === "chamodinew";
  const isChamodiHansikaId = value => memberKey(value) === "chamodihansika";
  const isLegacyChamodiId = value => memberKey(value) === "chamodi";
  const isChamodiHansikaName = value =>
    ["chamodi hansika", "chamodi hansaika", "chamodi hansike"].includes(memberKey(value));
  const isChamodiMemberId = value =>
    isOriginalChamodiId(value) || isChamodiHansikaId(value);
  const usesFixedMemberImage = value =>
    isShalaniKey(value) || isChamodiHansikaId(value);
  const matchesMember = (member, defaultMember) => {
    const memberId = memberKey(member?.id);
    const memberName = memberKey(member?.name);
    const defaultId = memberKey(defaultMember.id);

    // Keep the original Chamodi and Chamodi Hansika as two separate people,
    // while safely migrating the older shared "Chamodi" ID.
    if (isOriginalChamodiId(defaultId)) {
      return memberId === defaultId ||
        (isLegacyChamodiId(memberId) && !isChamodiHansikaName(memberName));
    }
    if (isChamodiHansikaId(defaultId)) {
      return memberId === defaultId ||
        (isLegacyChamodiId(memberId) && isChamodiHansikaName(memberName));
    }

    return memberId === defaultId ||
      memberName === defaultId ||
      (isShalaniKey(defaultId) && (isShalaniKey(memberId) || isShalaniKey(memberName)));
  };
  const resolveLegacyChamodiId = value => {
    if (!isLegacyChamodiId(value)) return value;

    const legacyHansikaMember = savedMembers.find(member =>
      isLegacyChamodiId(member?.id) && isChamodiHansikaName(member?.name)
    );
    return legacyHansikaMember
      ? "ChamodiHansika"
      : "Chamodinew";
  };
  const members = starter.members.map(defaultMember => {
    const savedMember = savedMembers.find(member => matchesMember(member, defaultMember));
    if (!savedMember) return { ...defaultMember };

    return {
      ...defaultMember,
      ...savedMember,
      id: isChamodiMemberId(defaultMember.id)
        ? defaultMember.id
        : savedMember.id || defaultMember.id,
      name: isChamodiHansikaId(defaultMember.id)
        ? defaultMember.name
        : savedMember.name || defaultMember.name,
      image: usesFixedMemberImage(defaultMember.id)
        ? defaultMember.image
        : savedMember.image || defaultMember.image
    };
  });
  savedMembers.forEach(member => {
    if (!starter.members.some(defaultMember => matchesMember(member, defaultMember))) {
      members.push(member);
    }
  });
  const validIds = new Set(members.map(member => member.id));
  const fallbackList = starter.monthly;
  const cleanList = (list, size = 5) => {
    const source = Array.isArray(list) ? list : fallbackList;
    const fixed = [];

    source.forEach(rawId => {
      const id = resolveLegacyChamodiId(rawId);
      let resolvedId = null;
      if (validIds.has(id)) resolvedId = id;
      const match = members.find(member => member.id.toLowerCase() === String(id).toLowerCase());
      if (!resolvedId) resolvedId = match?.id || null;
      if (resolvedId && !fixed.includes(resolvedId)) fixed.push(resolvedId);
    });

    const memberFallback = members.map(member => member.id);
    return [...fixed, ...memberFallback.filter(id => !fixed.includes(id) && validIds.has(id))].slice(0, size);
  };

  const monthly = cleanList(saved.monthly, 5);
  const sixMonth = cleanList(saved.sixMonth, 6);
  const weekly = cleanList(saved.weekly, 5);
  const hasSavedSales = Object.prototype.hasOwnProperty.call(saved, "sales");
  const savedSalesIsBlank = hasSavedSales && isMissingCount(saved.sales);
  const savedSales = savedSalesIsBlank ? Number.NaN : Number(saved.sales);
  const legacyCommissionText = String(saved.commission ?? "").replace(/[^0-9.]/g, "");
  const legacyCommission = legacyCommissionText ? Number(legacyCommissionText) : Number.NaN;
  const sales = savedSalesIsBlank
    ? ""
    : Number.isFinite(savedSales)
      ? Math.max(0, savedSales)
      : Number.isFinite(legacyCommission)
        ? Math.max(0, Math.round(legacyCommission / 300))
        : starter.sales;

  const savedProducts = Array.isArray(saved.products) ? saved.products : [];
  const findSavedProduct = (...ids) => savedProducts.find(product => ids.includes(product?.id));
  const mergeFixedProduct = catalogProduct => {
    const savedProduct = findSavedProduct(catalogProduct.id);
    return {
      ...catalogProduct,
      ...(savedProduct || {}),
      id: catalogProduct.id,
      name: catalogProduct.name,
      image: typeof savedProduct?.image === "string" && savedProduct.image
        ? savedProduct.image
        : catalogProduct.image,
      secondaryImage: typeof savedProduct?.secondaryImage === "string" && savedProduct.secondaryImage
        ? savedProduct.secondaryImage
        : catalogProduct.secondaryImage
    };
  };
  const savedCombo = findSavedProduct("ol-mission-6-scholarship");
  const savedMission = findSavedProduct("ol-mission-6");
  const savedScholarship = findSavedProduct("scholarship");
  const comboCatalog = starter.products[2];
  const comboCount = savedCombo?.count ?? (
    savedMission || savedScholarship
      ? Number(savedMission?.count || 0) + Number(savedScholarship?.count || 0)
      : comboCatalog.count
  );
  const fixedProducts = [
    mergeFixedProduct(starter.products[0]),
    mergeFixedProduct(starter.products[1]),
    {
      ...comboCatalog,
      ...(savedCombo || {}),
      id: comboCatalog.id,
      name: comboCatalog.name,
      count: comboCount,
      image: savedCombo?.image || savedMission?.image || comboCatalog.image,
      secondaryImage: savedCombo?.secondaryImage || savedScholarship?.image || comboCatalog.secondaryImage
    }
  ];

  const cleanCounts = (key, list) => {
    const savedCounts = saved.slideCounts?.[key] || {};
    return list.reduce((result, id) => {
      const matchingSavedCount = Object.entries(savedCounts).find(([savedId]) =>
        memberKey(resolveLegacyChamodiId(savedId)) === memberKey(id)
      );
      const savedValue = savedCounts[id] ?? matchingSavedCount?.[1];
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
    sales,
    commission: sales === "" ? "" : String(sales * 300),
    slideCounts: {
      monthly: cleanCounts("monthly", monthly),
      sixMonth: cleanCounts("sixMonth", sixMonth),
      weekly: cleanCounts("weekly", weekly)
    },
    products: fixedProducts
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
  const [imageIndex, setImageIndex] = useState(0);
  const memberKey = String(member?.id || member?.name || "").trim().toLowerCase();
  const isShalani = memberKey === "shalani" || memberKey === "shalni";
  const isChamodiHansika = memberKey === "chamodihansika";
  const imageSources = [
    ...(isChamodiHansika ? [
      `${ASSET}/members/Chamodi.webp`,
      `${ASSET}/members/Chamodi.webp?v=chamodi-hansika`
    ] : []),
    member?.image,
    ...(isShalani ? [
      `${ASSET}/members/Shalani.webp`,
      `${ASSET}/members/shalani.webp`,
      `${ASSET}/members/Shalni.webp`,
      `${ASSET}/members/shalni.webp`
    ] : []),
    ...(isChamodiHansika ? [
      `${ASSET}/members/Chamodi.webp`,
      `${ASSET}/members/chamodi.webp`,
      `${ASSET}/members/Chamodi.png`,
      `${ASSET}/members/chamodi.png`,
      `${ASSET}/members/Chamodi Hansika.png`,
      `${ASSET}/members/Chamodi Hansike.png`,
      `${ASSET}/members/chamodi hansika.png`,
      `${ASSET}/members/chamodi hansike.png`
    ] : [])
  ].filter((source, index, sources) => source && sources.indexOf(source) === index);

  useEffect(() => {
    setImageIndex(0);
  }, [member?.id, member?.image]);

  if (!member) return <div className="portrait portrait-empty">?</div>;
  if (!imageSources[imageIndex]) {
    return <div className="portrait portrait-empty">{member.name.slice(0, 1)}</div>;
  }

  return <img
    className="portrait"
    src={imageSources[imageIndex]}
    alt={member.name}
    onError={() => setImageIndex(current => current + 1)}
  />;
}

function StackedName({ name }) {
  const parts = String(name || "ADD PERFORMER").trim().split(/\s+/).filter(Boolean);
  const firstLine = parts[0] || "ADD";
  const secondLine = parts.slice(1).join(" ");

  return <span className={`stacked-name ${secondLine ? "has-second-line" : ""}`}>
    <span>{firstLine}</span>
    {secondLine && <span>{secondLine}</span>}
  </span>;
}

function RankCard({ member, count, rank, kind = "standard", onReveal }) {
  const place = places[rank - 1];
  const numericCount = count === "" || count === undefined || count === null ? null : Number(count);
  const isPlatinum = kind === "monthly" && Number(numericCount || 0) >= 325;
  const revealOrder = 6 - rank;

  const handleRevealStart = event => {
    if (event.target !== event.currentTarget) return;
    onReveal?.(kind, rank);
  };

  return <article
    className={`rank-card rank-${rank} ${place.color} ${kind} reveal card-reveal`}
    style={{ "--order": revealOrder }}
    onAnimationStart={handleRevealStart}
  >
    <div className="medal" aria-label={`Rank ${rank}`}><span>{rank}</span></div>
    <div className="portrait-ring">
      <Portrait member={member} />
    </div>
    {isPlatinum && <div className="platinum-badge"><span>PLATINUM</span><b>MEMBER</b></div>}
    <div className="ribbon">{place.label}</div>
    <div className="performer-details">
      <h2><span>{String(rank).padStart(2, "0")}.</span><em><StackedName name={member?.name}/></em></h2>
      <strong className="performer-sales-count">{numericCount === null ? "—" : numericCount.toLocaleString()}</strong>
    </div>
  </article>;
}

function FlightBoardCard({ member, count, rank }) {
  const numericCount = count === "" || count === undefined || count === null ? null : Number(count);
  const revealOrder = 6 - rank;
  const visibility = rank <= 3 ? "priority" : "standby";

  return <article
    className={`flight-board-card ${visibility} reveal flight-card-reveal`}
    style={{ "--order": revealOrder }}
  >
    <div className="flight-photo"><Portrait member={member}/></div>
    <div className="flight-pass-data">
      <h2><StackedName name={member?.name}/></h2>
      <strong>{numericCount === null ? "—" : numericCount.toLocaleString()}</strong>
    </div>
    <div className="flight-ticket-edge" aria-hidden><span>✈</span></div>
  </article>;
}

function FlightSpotlightCard({ member, count, rank, order }) {
  const numericCount = count === "" || count === undefined || count === null ? null : Number(count);

  return <article
    className={`flight-spotlight-card flight-spotlight-rank-${rank} no-place`}
    style={{ "--spotlight-order": order }}
  >
    <div className="flight-spotlight-photo"><Portrait member={member}/></div>
    <div className="flight-spotlight-copy">
      <small>6TH MONTH PERFORMER</small>
      <h2><StackedName name={member?.name}/></h2>
      <strong>{numericCount === null ? "—" : numericCount.toLocaleString()} SALES</strong>
    </div>
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
    <div className="flight-top-three-showcase" aria-label="Selected performer spotlight cards">
      {[3, 2, 1].map((rank, order) => {
        const performer = performers[rank - 1] || {};
        return <FlightSpotlightCard
          member={performer.member}
          count={performer.count}
          rank={rank}
          order={order}
          key={`spotlight-${rank}`}
        />;
      })}
    </div>
    <div className="flight-board-final reveal flight-final-reveal">
      <span>TOUR STATUS</span><b>PENDING BANGKOK TOUR • COMPETITION NOT FINISHED</b><i>✈</i>
    </div>
    <Brand small/>
  </section>;
}

function PerformersSlide({ state, list, type, onCardReveal }) {
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
      {performers.map(({ id, member, count }, i) => <RankCard member={member} count={count} rank={i + 1} key={`${id}-${i}`} kind={type} onReveal={onCardReveal} />)}
    </div>
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

function ProductCard({ product, rank, onReveal }) {
  const revealOrder = 3 - rank;
  const fallbackImage = starter.products.find(item => item.id === product.id)?.image
    || starter.products[rank - 1].image;
  const isCombo = product.id === "ol-mission-6-scholarship";
  const secondaryFallback = starter.products[2].secondaryImage;

  const handleRevealStart = event => {
    if (event.target !== event.currentTarget) return;
    onReveal?.(rank);
  };

  return <article
    className={`product-card product-rank-${rank} reveal product-reveal`}
    style={{ "--order": revealOrder }}
    onAnimationStart={handleRevealStart}
  >
    <div className="product-place"><b>{rank}</b><span>{["1ST", "2ND", "3RD"][rank - 1]} PLACE</span></div>
    <div className="product-name">{product.name}</div>
    {isCombo
      ? <div className="combo-product-media">
        <img
          className="combo-product combo-product-primary"
          src={product.image || fallbackImage}
          alt="O/L Mission 6"
          onError={event => {
            if (event.currentTarget.src.endsWith(fallbackImage)) return;
            event.currentTarget.src = fallbackImage;
          }}
        />
        <img
          className="combo-product combo-product-secondary"
          src={product.secondaryImage || secondaryFallback}
          alt="Scholarship"
          onError={event => {
            if (event.currentTarget.src.endsWith(secondaryFallback)) return;
            event.currentTarget.src = secondaryFallback;
          }}
        />
        <span className="combo-pack-badge">COMBO PACK</span>
      </div>
      : <img
        src={product.image || fallbackImage}
        alt={product.name}
        onError={event => {
          if (event.currentTarget.src.endsWith(fallbackImage)) return;
          event.currentTarget.src = fallbackImage;
        }}
      />}
    <strong>{product.count.toLocaleString()} SALES</strong>
  </article>;
}

function ProductsSlide({ state, onCardReveal }) {
  return <section className="slide products-slide">
    <SparkField count={28} color="blue" />
    <GoldTitle eyebrow="THE ULTIMATE">BATTLE OF THE PRODUCTS</GoldTitle>
    <div className="crossed-swords reveal title-reveal">⚔</div>
    <div className="product-stage">
      {state.products.map((product, i) => <ProductCard product={product} rank={i + 1} key={i} onReveal={onCardReveal} />)}
    </div>
  </section>;
}

function RollingCommissionNumber({
  value,
  replay,
  durationMs = COMMISSION_COUNTING_DURATION_MS
}) {
  const displayValue = String(value || "0");
  const digitCount = displayValue.replace(/\D/g, "").length || 1;
  const digitDurationMs = durationMs / digitCount;
  const [isRolling, setIsRolling] = useState(false);
  const [activatedDigitCount, setActivatedDigitCount] = useState(0);

  useEffect(() => {
    setIsRolling(false);
    setActivatedDigitCount(0);
    let firstFrame = 0;
    let secondFrame = 0;
    const digitTimers = [];

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsRolling(true);
        setActivatedDigitCount(1);

        for (let nextDigitCount = 2; nextDigitCount <= digitCount; nextDigitCount += 1) {
          const timer = window.setTimeout(() => {
            setActivatedDigitCount(nextDigitCount);
          }, (nextDigitCount - 1) * digitDurationMs);
          digitTimers.push(timer);
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      digitTimers.forEach(timer => window.clearTimeout(timer));
    };
  }, [displayValue, replay, digitCount, digitDurationMs]);

  let digitIndex = -1;
  return <div
    className={`rolling-number ${isRolling ? "is-rolling" : ""}`}
    style={{ "--commission-sheen-delay": `${Math.max(0, durationMs - 950)}ms` }}
    aria-label={displayValue}
  >
    <span className="sr-only">{displayValue}</span>
    {displayValue.split("").map((character, characterIndex) => {
      if (!/\d/.test(character)) return <span className="odometer-separator" key={`${character}-${characterIndex}`} aria-hidden="true">{character}</span>;
      digitIndex += 1;
      const target = Number(character);
      const reverseOrder = digitCount - 1 - digitIndex;
      const rollingSequence = target === 0
        ? zeroDigitSequence
        : digitSequence.slice(0, target + 1);
      const stopPosition = rollingSequence.length - 1;
      return <span
        className={`odometer-digit ${reverseOrder < activatedDigitCount ? "is-activated" : ""}`}
        key={`${characterIndex}-${character}`}
        style={{
          "--stop": stopPosition,
          "--roll-duration": `${digitDurationMs}ms`
        }}
        aria-hidden="true"
      >
        <span className="odometer-strip">{rollingSequence.map((digit, stripIndex) => <span key={stripIndex}>{digit}</span>)}</span>
      </span>;
    })}
    <span className="commission-sheen" aria-hidden="true"/>
  </div>;
}

function CommissionSlide({ state, replay, revealAmount, rollDurationMs, titleDurationMs }) {
  const currentCommission = Math.max(0, Number(state.sales || 0)) * 300;

  return <section className="slide commission-slide supplied-commission-slide animated-slide">
    <div className="commission-slide-content">
      <h1
        className="commission-title-pop"
        style={{ "--commission-title-duration": `${titleDurationMs}ms` }}
      >YOUR COMMISSION</h1>
      {revealAmount && <div className="commission-value-group is-revealed">
        <div className="supplied-commission-number">
          <RollingCommissionNumber value={currentCommission} replay={replay} durationMs={rollDurationMs}/>
        </div>
      </div>}
    </div>
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

function MissionSlide({ state, showResultCard }) {
  const zone = zoneFor(state.sales);
  const unlocked = zone.key !== "danger";
  const reward = {
    danger: { bars: 2, flying: 0, spill: 0 },
    silver: { bars: 8, flying: 0, spill: 0 },
    gold: { bars: 16, flying: 0, spill: 0 },
    mega: { bars: 32, flying: 14, spill: 14 }
  }[zone.key];
  const goldBars = Array.from({ length: reward.bars }, (_, index) => index);
  const flyingGoldBars = Array.from({ length: reward.flying }, (_, index) => index);
  const spilledGoldBars = Array.from({ length: reward.spill }, (_, index) => index);
  const lightRays = Array.from({ length: 14 }, (_, index) => index);

  return <section className={`slide mission-slide zone-${zone.key}`}>
    <SparkField count={34} color={zone.key} />
    <GoldTitle eyebrow="SALES MISSION">{unlocked ? "UNLOCKED MISSION" : "MISSION LOCKED"}</GoldTitle>
    <div className="mission-reward-layout">
      <div className={`mission-suitcase suitcase-${zone.key} reveal suitcase-reveal`}>
        <div className="suitcase-zone-glow" aria-hidden="true" />
        <div className="suitcase-floor-shadow" aria-hidden="true" />

        <div className="suitcase-light-rays" aria-hidden="true">
          {lightRays.map(index => <i
            key={index}
            style={{
              "--ray-angle": `${-67.5 + index * 10.4}deg`,
              "--ray-delay": `${(index % 5) * .08}s`
            }}
          />)}
        </div>

        <div className="suitcase-gold-burst" aria-hidden="true">
          {flyingGoldBars.map(index => <i
            className="flying-gold-bar"
            key={index}
            style={{
              "--gold-x": `${((index * 41) % 300) - 150}px`,
              "--gold-y": `${-(135 + ((index * 31) % 170))}px`,
              "--gold-r": `${-32 + ((index * 67) % 96)}deg`,
              "--gold-delay": `${(index % 7) * .11}s`
            }}
          ><b>GOLD</b></i>)}
        </div>

        <div className="suitcase-lid" aria-hidden="true">
          <div className="suitcase-lid-shell">
            <div className="suitcase-lid-lining">
              <span className="suitcase-lid-stitch" />
              <span className="suitcase-lid-emblem">{unlocked ? "$" : "!"}</span>
              <small>{unlocked ? "REWARD RESERVE" : "LOCKED RESERVE"}</small>
            </div>
            <i className="suitcase-lid-corner corner-one" />
            <i className="suitcase-lid-corner corner-two" />
            <i className="suitcase-lid-corner corner-three" />
            <i className="suitcase-lid-corner corner-four" />
          </div>
        </div>

        <i className="suitcase-support support-left" aria-hidden="true" />
        <i className="suitcase-support support-right" aria-hidden="true" />

        <div className="suitcase-base">
          <div className="suitcase-reward-tray">
            <span className="suitcase-tray-glow" />
            <div className="gold-bar-grid" aria-hidden="true">
              {goldBars.map(index => <i
                className="gold-bar"
                key={`bar-${index}`}
                style={{
                  "--bar-delay": `${(index % 16) * .045}s`,
                  "--bar-angle": `${-3 + ((index * 7) % 7)}deg`
                }}
              ><b>GOLD</b><span>999.9</span></i>)}
            </div>
          </div>
          <div className="suitcase-front-edge" aria-hidden="true">
            <span className="suitcase-front-grain" />
            <i className="suitcase-lock lock-left"><b /></i>
            <i className="suitcase-lock lock-right"><b /></i>
            <span className="suitcase-front-badge">{unlocked ? "$" : "!"}</span>
            <div className="suitcase-handle"><i /></div>
          </div>
        </div>

        <div className="suitcase-gold-spill" aria-hidden="true">
          {spilledGoldBars.map(index => <i
            className="spilled-gold-bar"
            key={index}
            style={{
              "--spill-x": `${5 + ((index * 43) % 90)}%`,
              "--spill-y": `${(index * 17) % 34}px`,
              "--spill-r": `${-24 + ((index * 31) % 49)}deg`,
              "--spill-delay": `${(index % 7) * .07}s`
            }}
          ><b>GOLD</b></i>)}
        </div>
      </div>

      <aside className={`mission-result-card mission-result-${zone.key} ${showResultCard ? "is-visible" : ""}`}>
        <span className="mission-result-kicker">{unlocked ? "ZONE REWARD" : "ZONE STATUS"}</span>
        <h2>{zone.name}</h2>
        <div className="mission-result-divider" />
        <div className="mission-result-metric">
          <span>TOTAL SALES</span>
          <strong>{Math.max(0, Number(state.sales || 0)).toLocaleString()}</strong>
        </div>
        <div className="mission-result-metric commission-metric">
          <span>COMMISSION</span>
          <strong>{zone.amount ? money(zone.amount) : "NO COMMISSION"}</strong>
        </div>
        <p>{zone.note}</p>
      </aside>
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

function Stage({
  index, state, replay, onPerformerCardReveal, onProductCardReveal,
  revealCommission, commissionRollDuration, commissionTitleDuration, showMissionResult
}) {
  return <div className={`presentation-stage stage-${index}`} key={`${index}-${replay}`}>
    {index === SLIDE.ACHIEVERS && <IntroSlide />}
    {index === SLIDE.WEEKLY && <PerformersSlide state={state} list={state.weekly} type="weekly" onCardReveal={onPerformerCardReveal} />}
    {index === SLIDE.PRODUCTS && <ProductsSlide state={state} onCardReveal={onProductCardReveal} />}
    {index === SLIDE.MONTHLY && <PerformersSlide state={state} list={state.monthly} type="monthly" onCardReveal={onPerformerCardReveal} />}
    {index === SLIDE.SIX_MONTH && <SixMonthFlightSlide state={state} list={state.sixMonth} />}
    {index === SLIDE.COMMISSION && <CommissionSlide
      state={state}
      replay={replay}
      revealAmount={revealCommission}
      rollDurationMs={commissionRollDuration}
      titleDurationMs={commissionTitleDuration}
    />}
    {index === SLIDE.MISSION && <MissionSlide state={state} showResultCard={showMissionResult} />}
    {index === SLIDE.CONGRATULATIONS && <FinaleSlide state={state} />}
  </div>;
}

function PerformerEditor({ state, setState, listKey, ranked = true }) {
  const selectedIds = state[listKey] || [];

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

  const updateRank = (rank, id) => setState(current => {
    const nextRanks = [...current[listKey]];
    const existingRank = nextRanks.findIndex((currentId, index) => currentId === id && index !== rank);

    if (existingRank >= 0) {
      [nextRanks[rank], nextRanks[existingRank]] = [nextRanks[existingRank], nextRanks[rank]];
    } else {
      nextRanks[rank] = id;
    }

    return {
      ...current,
      [listKey]: nextRanks
    };
  });

  return <>
    <div className="inspector-section">
      <div className="section-title"><span>Selected performers and slide counts</span><small>Each slide has different counts</small></div>
      {selectedIds.map((id, index) => {
        const selectedMember = state.members.find(member => member.id === id);
        const countValue = state.slideCounts?.[listKey]?.[id] ?? "";

        return <div className={`selected-performer-editor ${ranked ? "" : "no-place"}`} key={`${listKey}-${index}`}>
          {ranked && <b>{index + 1}</b>}
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
            aria-label={`${selectedMember?.name || `Performer ${index + 1}`} count for this slide`}
          />
        </div>;
      })}
      <p className="helper">Counts update immediately and belong only to this slide. Empty counts stay blank instead of showing a default zero.</p>
    </div>

    {ranked && <div className="inspector-section">
      <div className="section-title"><span>Shared performer library</span></div>
      {state.members.map(member => <div className="member-editor library-only" key={member.id}>
        <Portrait member={member}/>
        <div className="member-fields">
          <input value={member.name} onChange={event => patchMember(member.id, { name: event.target.value })} placeholder="Full performer name"/>
        </div>
      </div>)}
      <p className="helper">Edit performer names here. Performer images use their fixed asset paths. Selecting a performer already used in another rank automatically swaps the two ranks, so duplicates cannot occur.</p>
    </div>}
  </>;
}

function Inspector({ index, state, setState, onClose, onSave, saving }) {
  const update = patch => setState(s => ({ ...s, ...patch }));
  const listKey = index === SLIDE.MONTHLY
    ? "monthly"
    : index === SLIDE.SIX_MONTH
      ? "sixMonth"
      : "weekly";
  const placeLabels = ["1ST PLACE", "2ND PLACE", "3RD PLACE"];
  const weekOptions = WEEKS.includes(state.week) ? WEEKS : [state.week, ...WEEKS].filter(Boolean);

  const swapProductPlaces = (fromIndex, toIndex) => setState(current => {
    if (fromIndex === toIndex) return current;
    const nextProducts = [...current.products];
    [nextProducts[fromIndex], nextProducts[toIndex]] = [nextProducts[toIndex], nextProducts[fromIndex]];
    return { ...current, products: nextProducts };
  });

  const selectProductForPlace = (placeIndex, productId) => setState(current => {
    const productIndex = current.products.findIndex(product => product.id === productId);
    if (productIndex < 0 || productIndex === placeIndex) return current;
    const nextProducts = [...current.products];
    [nextProducts[placeIndex], nextProducts[productIndex]] = [nextProducts[productIndex], nextProducts[placeIndex]];
    return { ...current, products: nextProducts };
  });

  const updateProductSales = (productId, rawValue) => setState(current => ({
    ...current,
    products: current.products.map(product =>
      product.id === productId
        ? { ...product, count: rawValue === "" ? "" : Math.max(0, Number(rawValue)) }
        : product
    )
  }));

  const updateTotalSales = rawValue => setState(current => {
    if (rawValue === "") {
      return {
        ...current,
        sales: "",
        commission: ""
      };
    }

    const sales = Math.max(0, Number(rawValue));
    return {
      ...current,
      sales,
      commission: String(sales * 300)
    };
  });

  return <aside className="inspector">
    <header><div><small>SLIDE {index + 1} OF 8</small><h2>{slideNames[index]}</h2></div><button onClick={onClose}><X/></button></header>
    <div className="inspector-scroll">
      {(index === SLIDE.WEEKLY || index === SLIDE.MONTHLY || index === SLIDE.SIX_MONTH) && <>
        {index !== SLIDE.SIX_MONTH && <div className="inspector-section">
          {index === SLIDE.WEEKLY && <label className="field"><span>Week</span><select value={state.week} onChange={e => update({ week: e.target.value })}>{weekOptions.map(week => <option value={week} key={week}>{week}</option>)}</select></label>}
          {index === SLIDE.MONTHLY && <label className="field"><span>Month</span><select value={state.month} onChange={e => update({ month: e.target.value })}>{MONTHS.map(month => <option value={month} key={month}>{month}</option>)}</select></label>}
        </div>}
        <PerformerEditor state={state} setState={setState} listKey={listKey} ranked={index !== SLIDE.SIX_MONTH}/>
      </>}
      {index === SLIDE.PRODUCTS && <div className="inspector-section">
        <div className="section-title"><span>Product rankings</span><small>Select rank, product and sales</small></div>
        {state.products.map((product, i) => <div className="product-editor" key={product.id}>
          <select
            className="product-place-select"
            value={i}
            onChange={event => swapProductPlaces(i, Number(event.target.value))}
            aria-label={`${product.name} ranking place`}
          >
            {placeLabels.map((label, placeIndex) => <option value={placeIndex} key={label}>{label}</option>)}
          </select>
          <select
            className="product-choice-select"
            value={product.id}
            onChange={event => selectProductForPlace(i, event.target.value)}
            aria-label={`Product for ${placeLabels[i]}`}
          >
            {state.products.map(option => <option value={option.id} key={option.id}>{option.name}</option>)}
          </select>
          <input
            type="number"
            min="0"
            value={product.count}
            onChange={event => updateProductSales(product.id, event.target.value)}
            aria-label={`${product.name} sales`}
          />
        </div>)}
        <p className="helper">Each rank lets you select the product and enter its sales count. Selecting an already-used product swaps the two cards, so every product remains unique.</p>
      </div>}
      {index === SLIDE.COMMISSION && <div className="inspector-section">
        <label className="field"><span>Total sales</span><input className="big-input" type="number" min="0" value={state.sales} onChange={e => updateTotalSales(e.target.value)}/></label>
        <div className="calculation-card"><span>CURRENT COMMISSION</span><strong>{money(state.sales * 300)}</strong></div>
        <div className={`zone-preview ${zoneFor(state.sales).key}`}><span>Mission Unlock updates automatically</span><b>{zoneFor(state.sales).name}</b><strong>{zoneFor(state.sales).amount ? money(zoneFor(state.sales).amount) : "NO COMMISSION"}</strong></div>
        <p className="helper">Enter Total Sales here. Mission Unlock awards LKR 1,000,000 at 6,500 sales, LKR 2,000,000 at 7,500 sales, and LKR 3,000,000 at 10,000 sales.</p>
      </div>}
      {index === SLIDE.MISSION && <div className="inspector-section">
        <div className="locked-card"><h3>Controlled by Commission Update</h3><p>Edit Total Sales on Slide 6 — Commission Update. Mission Unlock changes automatically from the same sales value.</p></div>
        <div className={`zone-preview ${zoneFor(state.sales).key}`}><span>Current result</span><b>{zoneFor(state.sales).name}</b><strong>{zoneFor(state.sales).amount ? money(zoneFor(state.sales).amount) : "NO COMMISSION"}</strong></div>
      </div>}
      {index === SLIDE.CONGRATULATIONS && <div className="inspector-section">
        <label className="field"><span>Headline</span><input value={state.congratulationsTitle ?? ""} onChange={e => update({ congratulationsTitle: e.target.value })} placeholder="Congratulations!"/></label>
        <label className="field"><span>Message</span><textarea rows="5" value={state.congratulationsMessage ?? ""} onChange={e => update({ congratulationsMessage: e.target.value })} placeholder="Excellent work from the whole team."/></label>
      </div>}
      {index === SLIDE.ACHIEVERS && <div className="inspector-section">
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

function StartOverlay({ onStart, onEdit }) {
  return <div className="start-overlay">
    <Brand/>
    <span>INTERACTIVE AWARDS EXPERIENCE</span>
    <h1>ACHIEVERS SHOW</h1>
    <p>Choose how presentation audio should behave, then start the show.</p>
    <div className="start-actions">
      <button className="play-mode-button" onClick={() => onStart(SOUND_MODES.REPEAT)}><Volume2/>PLAY WITH SOUND</button>
      <button className="once-mode-button" onClick={() => onStart(SOUND_MODES.ONCE)}><Play fill="currentColor"/>PLAY SOUND ONE TIME</button>
      <button className="silent-mode-button" onClick={() => onStart(SOUND_MODES.OFF)}><VolumeX/>PLAY WITHOUT SOUND</button>
      <button className="edit-mode-button" onClick={onEdit}><Edit3/>EDITING MODE</button>
    </div>
  </div>;
}

function App() {
  const [state, setState] = useState(() => loadLocalPresentation() || starter);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("edit");
  const [inspector, setInspector] = useState(true);
  const [started, setStarted] = useState(false);
  const [replay, setReplay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [soundMode, setSoundMode] = useState(SOUND_MODES.OFF);
  const muted = soundMode === SOUND_MODES.OFF;
  const [validationWarning, setValidationWarning] = useState(null);
  const [missionSequenceComplete, setMissionSequenceComplete] = useState(false);
  const [missionResultVisible, setMissionResultVisible] = useState(false);
  const [commissionSequence, setCommissionSequence] = useState({
    revealed: false,
    finished: false,
    rollDurationMs: COMMISSION_COUNTING_DURATION_MS,
    titleDurationMs: COMMISSION_TITLE_FALLBACK_DURATION_MS
  });
  const [slideAudioSync, setSlideAudioSync] = useState({
    slideIndex: SLIDE.ACHIEVERS,
    status: "fallback"
  });
  const stageRef = useRef(null);
  const introAudioRef = useRef(null);
  const monthlyAudioRef = useRef(null);
  const weeklyAudioRef = useRef(null);
  const travelAudioRef = useRef(null);
  const travelCardAudioRef = useRef(null);
  const travelSpotlightAudioRef = useRef(null);
  const battleAudioRef = useRef(null);
  const commissionIntroAudioRef = useRef(null);
  const commissionAudioRef = useRef(null);
  const zoneAudioRefs = useRef({});
  const battleCardAudioRef = useRef(null);
  const monthlyCardAudioRef = useRef(null);
  const weeklyCardAudioRef = useRef(null);
  const missionCardAudioRef = useRef(null);
  const celebrateAudioRef = useRef(null);
  const cardSoundTimersRef = useRef([]);
  const cardSoundInstancesRef = useRef([]);
  const travelCardTimersRef = useRef([]);
  const travelCardInstancesRef = useRef([]);
  const slideAudioRunRef = useRef(0);
  const commissionRunRef = useRef(0);
  const commissionFallbackTimerRef = useRef(null);
  const commissionCashStopTimerRef = useRef(null);
  const missionRunRef = useRef(0);
  const missionCardTimerRef = useRef(null);
  const missionAnimationTimerRef = useRef(null);
  const missionAudioFinishedRef = useRef(false);
  const missionAnimationFinishedRef = useRef(false);
  const mutedRef = useRef(true);
  const soundModeRef = useRef(SOUND_MODES.OFF);
  const playedSoundSlidesRef = useRef(new Set());
  const activeSlideSoundEnabledRef = useRef(false);


  useEffect(() => {
    const introAudio = new Audio(INTRO_SOUND);
    const monthlyAudio = new Audio(MONTHLY_SOUND);
    const weeklyAudio = new Audio(WEEKLY_SOUND);
    const travelAudio = new Audio(TRAVEL_SOUND);
    const travelCardAudio = new Audio(TRAVEL_CARD_SOUND);
    const travelSpotlightAudio = new Audio(TRAVEL_SPOTLIGHT_SOUND);
    const battleAudio = new Audio(BATTLE_SOUND);
    const commissionIntroAudio = new Audio(COMMISSION_INTRO_SOUND);
    const commissionAudio = new Audio(COMMISSION_COUNT_SOUND);
    const zoneAudios = {
      danger: new Audio(DANGER_ZONE_SOUND),
      silver: new Audio(SILVER_ZONE_SOUND),
      gold: new Audio(GOLD_ZONE_SOUND),
      mega: new Audio(MEGA_ZONE_SOUND)
    };
    const battleCardAudio = new Audio(BATTLE_CARD_SOUND);
    const monthlyCardAudio = new Audio(MONTHLY_CARD_SOUND);
    const weeklyCardAudio = new Audio(WEEKLY_CARD_SOUND);
    const missionCardAudio = new Audio(MISSION_CARD_SOUND);
    const celebrateAudio = new Audio(CELEBRATE_SOUND);
    introAudio.preload = "auto";
    monthlyAudio.preload = "auto";
    weeklyAudio.preload = "auto";
    travelAudio.preload = "auto";
    travelCardAudio.preload = "auto";
    travelSpotlightAudio.preload = "auto";
    battleAudio.preload = "auto";
    commissionIntroAudio.preload = "auto";
    commissionAudio.preload = "auto";
    commissionIntroAudio.volume = 1;
    commissionAudio.volume = 1;
    Object.values(zoneAudios).forEach(audio => {
      audio.preload = "auto";
      audio.volume = 1;
    });
    battleCardAudio.preload = "auto";
    monthlyCardAudio.preload = "auto";
    weeklyCardAudio.preload = "auto";
    missionCardAudio.preload = "auto";
    celebrateAudio.preload = "auto";
    [
      introAudio, monthlyAudio, weeklyAudio, travelAudio, travelCardAudio, travelSpotlightAudio, battleAudio,
      commissionIntroAudio, commissionAudio, ...Object.values(zoneAudios),
      battleCardAudio, monthlyCardAudio, weeklyCardAudio, missionCardAudio, celebrateAudio
    ].forEach(audio => {
      audio.muted = mutedRef.current;
    });
    introAudioRef.current = introAudio;
    monthlyAudioRef.current = monthlyAudio;
    weeklyAudioRef.current = weeklyAudio;
    travelAudioRef.current = travelAudio;
    travelCardAudioRef.current = travelCardAudio;
    travelSpotlightAudioRef.current = travelSpotlightAudio;
    battleAudioRef.current = battleAudio;
    commissionIntroAudioRef.current = commissionIntroAudio;
    commissionAudioRef.current = commissionAudio;
    zoneAudioRefs.current = zoneAudios;
    battleCardAudioRef.current = battleCardAudio;
    monthlyCardAudioRef.current = monthlyCardAudio;
    weeklyCardAudioRef.current = weeklyCardAudio;
    missionCardAudioRef.current = missionCardAudio;
    celebrateAudioRef.current = celebrateAudio;

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
      Object.values(zoneAudios).forEach(audio => { audio.onended = null; });
      if (commissionFallbackTimerRef.current) window.clearTimeout(commissionFallbackTimerRef.current);
      if (commissionCashStopTimerRef.current) window.clearTimeout(commissionCashStopTimerRef.current);
      if (missionCardTimerRef.current) window.clearTimeout(missionCardTimerRef.current);
      if (missionAnimationTimerRef.current) window.clearTimeout(missionAnimationTimerRef.current);
      [introAudio, monthlyAudio, weeklyAudio, travelAudio, travelCardAudio, travelSpotlightAudio, battleAudio, commissionIntroAudio, commissionAudio, ...Object.values(zoneAudios), battleCardAudio, monthlyCardAudio, weeklyCardAudio, missionCardAudio, celebrateAudio].forEach(audio => {
        audio.onended = null;
        audio.pause();
        audio.currentTime = 0;
      });
      introAudioRef.current = null;
      monthlyAudioRef.current = null;
      weeklyAudioRef.current = null;
      travelAudioRef.current = null;
      travelCardAudioRef.current = null;
      travelSpotlightAudioRef.current = null;
      battleAudioRef.current = null;
      commissionIntroAudioRef.current = null;
      commissionAudioRef.current = null;
      zoneAudioRefs.current = {};
      battleCardAudioRef.current = null;
      monthlyCardAudioRef.current = null;
      weeklyCardAudioRef.current = null;
      missionCardAudioRef.current = null;
      celebrateAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    soundModeRef.current = soundMode;
    [
      introAudioRef.current,
      monthlyAudioRef.current,
      weeklyAudioRef.current,
      travelAudioRef.current,
      travelCardAudioRef.current,
      travelSpotlightAudioRef.current,
      battleAudioRef.current,
      commissionIntroAudioRef.current,
      commissionAudioRef.current,
      ...Object.values(zoneAudioRefs.current),
      battleCardAudioRef.current,
      monthlyCardAudioRef.current,
      weeklyCardAudioRef.current,
      missionCardAudioRef.current,
      celebrateAudioRef.current,
      ...cardSoundInstancesRef.current,
      ...travelCardInstancesRef.current
    ].forEach(audio => {
      if (audio) audio.muted = muted;
    });
  }, [muted, soundMode]);

  const clearCardSounds = () => {
    cardSoundTimersRef.current.forEach(timer => window.clearTimeout(timer));
    cardSoundTimersRef.current = [];
    cardSoundInstancesRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    cardSoundInstancesRef.current = [];
  };

  const playCardSound = source => {
    if (!source) return;

    const cardAudio = source.cloneNode();
    cardAudio.currentTime = 0;
    cardAudio.muted = mutedRef.current;
    cardSoundInstancesRef.current.push(cardAudio);
    cardAudio.play().catch(() => {});
    cardAudio.addEventListener("ended", () => {
      cardSoundInstancesRef.current = cardSoundInstancesRef.current.filter(item => item !== cardAudio);
    }, { once: true });
  };

  const scheduleCardSounds = (source, delays) => {
    clearCardSounds();
    if (!source) return;
    cardSoundTimersRef.current = delays.map(delay => window.setTimeout(() => playCardSound(source), delay));
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
    activeSlideSoundEnabledRef.current = false;
    slideAudioRunRef.current += 1;
    commissionRunRef.current += 1;
    missionRunRef.current += 1;
    missionAudioFinishedRef.current = false;
    missionAnimationFinishedRef.current = false;
    setMissionSequenceComplete(false);
    setMissionResultVisible(false);
    if (missionAnimationTimerRef.current) {
      window.clearTimeout(missionAnimationTimerRef.current);
      missionAnimationTimerRef.current = null;
    }
    if (commissionFallbackTimerRef.current) {
      window.clearTimeout(commissionFallbackTimerRef.current);
      commissionFallbackTimerRef.current = null;
    }
    if (commissionCashStopTimerRef.current) {
      window.clearTimeout(commissionCashStopTimerRef.current);
      commissionCashStopTimerRef.current = null;
    }
    if (missionCardTimerRef.current) {
      window.clearTimeout(missionCardTimerRef.current);
      missionCardTimerRef.current = null;
    }
    Object.values(zoneAudioRefs.current).forEach(audio => {
      if (audio) audio.onended = null;
    });
    [
      introAudioRef.current,
      monthlyAudioRef.current,
      weeklyAudioRef.current,
      travelAudioRef.current,
      travelSpotlightAudioRef.current,
      battleAudioRef.current,
      commissionIntroAudioRef.current,
      commissionAudioRef.current,
      celebrateAudioRef.current,
      ...Object.values(zoneAudioRefs.current)
    ].forEach(audio => {
      if (!audio) return;
      audio.onended = null;
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    });
  };

  const scheduleTravelCardSounds = () => {
    clearTravelCardSounds();
    travelCardTimersRef.current = SIX_MONTH_CARD_SOUND_DELAYS_MS.map(delay => window.setTimeout(() => {
      const source = travelCardAudioRef.current;
      if (!source) return;
      const cardAudio = source.cloneNode();
      cardAudio.currentTime = 0;
      cardAudio.muted = mutedRef.current;
      travelCardInstancesRef.current.push(cardAudio);
      cardAudio.play().catch(() => {});
      cardAudio.addEventListener("ended", () => {
        travelCardInstancesRef.current = travelCardInstancesRef.current.filter(item => item !== cardAudio);
      }, { once: true });
    }, delay));
  };

  const playSoundForSlide = (slideIndex, requestedSoundMode = soundModeRef.current) => {
    stopAllSounds();
    const slideAudioRunId = ++slideAudioRunRef.current;
    let audioAllowed = requestedSoundMode !== SOUND_MODES.OFF;
    if (requestedSoundMode === SOUND_MODES.ONCE) {
      if (playedSoundSlidesRef.current.has(slideIndex)) {
        audioAllowed = false;
      } else {
        playedSoundSlidesRef.current.add(slideIndex);
      }
    }
    activeSlideSoundEnabledRef.current = audioAllowed;
    setSlideAudioSync({ slideIndex, status: "fallback" });

    if (slideIndex === SLIDE.MISSION) {
      const runId = ++missionRunRef.current;
      const zoneAudio = zoneAudioRefs.current[zoneFor(state.sales).key];
      missionAudioFinishedRef.current = !audioAllowed || !zoneAudio;
      missionAnimationFinishedRef.current = false;
      setMissionSequenceComplete(false);
      setMissionResultVisible(false);
      let resultRevealed = false;

      const completeMissionWhenReady = () => {
        if (missionRunRef.current !== runId) return;
        if (missionAudioFinishedRef.current && missionAnimationFinishedRef.current) {
          setMissionSequenceComplete(true);
        }
      };

      const revealMissionResult = () => {
        if (missionRunRef.current !== runId) return;
        if (resultRevealed) return;
        resultRevealed = true;
        setMissionResultVisible(true);
        if (audioAllowed && missionCardAudioRef.current) {
          playCardSound(missionCardAudioRef.current);
        }
        completeMissionWhenReady();
      };

      missionAnimationTimerRef.current = window.setTimeout(() => {
        if (missionRunRef.current !== runId) return;
        missionAnimationTimerRef.current = null;
        missionAnimationFinishedRef.current = true;
        completeMissionWhenReady();
      }, MISSION_ANIMATION_DURATION_MS);

      missionCardTimerRef.current = window.setTimeout(() => {
        if (missionRunRef.current !== runId) return;
        missionCardTimerRef.current = null;
        revealMissionResult();
      }, MISSION_CARD_REVEAL_MS);

      if (audioAllowed && zoneAudio) {
        const finishMissionAudio = () => {
          if (missionRunRef.current !== runId) return;
          zoneAudio.onended = null;
          missionAudioFinishedRef.current = true;
          completeMissionWhenReady();
        };

        zoneAudio.currentTime = 0;
        zoneAudio.loop = false;
        zoneAudio.onended = finishMissionAudio;
        zoneAudio.play().catch(finishMissionAudio);
      } else {
        completeMissionWhenReady();
      }
      return;
    }

    if (slideIndex === SLIDE.COMMISSION) {
      const runId = ++commissionRunRef.current;
      const introAudio = commissionIntroAudioRef.current;
      const countAudio = commissionAudioRef.current;
      const titleDurationMs = introAudio && Number.isFinite(introAudio.duration) && introAudio.duration > 0
        ? Math.round(introAudio.duration * 1000)
        : COMMISSION_TITLE_FALLBACK_DURATION_MS;

      setCommissionSequence({
        revealed: false,
        finished: false,
        rollDurationMs: COMMISSION_COUNTING_DURATION_MS,
        titleDurationMs
      });

      const stopCommissionCash = () => {
        if (commissionRunRef.current !== runId) return;
        if (commissionCashStopTimerRef.current) {
          window.clearTimeout(commissionCashStopTimerRef.current);
          commissionCashStopTimerRef.current = null;
        }
        if (countAudio) {
          countAudio.onended = null;
          countAudio.pause();
          countAudio.currentTime = 0;
          countAudio.loop = false;
        }
      };

      const finishCommission = () => {
        if (commissionRunRef.current !== runId) return;
        if (commissionFallbackTimerRef.current) {
          window.clearTimeout(commissionFallbackTimerRef.current);
          commissionFallbackTimerRef.current = null;
        }
        stopCommissionCash();
        setCommissionSequence(current => ({ ...current, finished: true }));
      };

      let countStarted = false;
      const startCommissionCount = () => {
        if (commissionRunRef.current !== runId || countStarted) return;
        countStarted = true;
        if (commissionFallbackTimerRef.current) {
          window.clearTimeout(commissionFallbackTimerRef.current);
          commissionFallbackTimerRef.current = null;
        }
        if (introAudio) introAudio.onended = null;

        const hasAudioDuration = Boolean(
          countAudio && Number.isFinite(countAudio.duration) && countAudio.duration > 0
        );
        const audioDurationMs = hasAudioDuration
          ? Math.round(countAudio.duration * 1000)
          : COMMISSION_COUNTING_DURATION_MS;
        const sequenceDurationMs = COMMISSION_CASH_SEQUENCE_MS;
        const rollDurationMs = COMMISSION_COUNTING_DURATION_MS;
        setCommissionSequence(current => ({
          ...current,
          revealed: true,
          finished: false,
          rollDurationMs
        }));

        if (audioAllowed && countAudio) {
          countAudio.currentTime = 0;
          countAudio.loop = !hasAudioDuration || audioDurationMs < rollDurationMs;
          countAudio.onended = null;
          commissionCashStopTimerRef.current = window.setTimeout(
            stopCommissionCash,
            rollDurationMs
          );
          countAudio.play().catch(() => {});
        }
        commissionFallbackTimerRef.current = window.setTimeout(
          finishCommission,
          sequenceDurationMs
        );
      };

      if (audioAllowed && introAudio) {
        introAudio.currentTime = 0;
        introAudio.loop = false;
        introAudio.onended = startCommissionCount;
        introAudio.play().catch(startCommissionCount);
      } else {
        commissionFallbackTimerRef.current = window.setTimeout(
          startCommissionCount,
          COMMISSION_TITLE_FALLBACK_DURATION_MS
        );
      }
      return;
    }

    const audio = slideIndex === SLIDE.ACHIEVERS
      ? introAudioRef.current
      : slideIndex === SLIDE.WEEKLY
        ? weeklyAudioRef.current
        : slideIndex === SLIDE.PRODUCTS
          ? battleAudioRef.current
          : slideIndex === SLIDE.MONTHLY
            ? monthlyAudioRef.current
            : slideIndex === SLIDE.SIX_MONTH
              ? travelAudioRef.current
              : slideIndex === SLIDE.CONGRATULATIONS
              ? celebrateAudioRef.current
              : null;
    const synchronizedToBackground = [
      SLIDE.WEEKLY,
      SLIDE.PRODUCTS,
      SLIDE.MONTHLY,
      SLIDE.SIX_MONTH
    ].includes(slideIndex);

    if (synchronizedToBackground && audioAllowed && audio) {
      setSlideAudioSync({ slideIndex, status: "playing" });
      audio.onended = () => {
        if (slideAudioRunRef.current !== slideAudioRunId) return;
        audio.onended = null;
        setSlideAudioSync({ slideIndex, status: "finished" });
      };
    }

    if (audioAllowed && audio) {
      audio.currentTime = 0;
      audio.loop = false;
      audio.play().catch(() => {
        if (slideAudioRunRef.current !== slideAudioRunId) return;
        audio.onended = null;
        setSlideAudioSync({ slideIndex, status: "fallback" });
      });
    }
    if (audioAllowed && slideIndex === SLIDE.SIX_MONTH) {
      scheduleTravelCardSounds();
      scheduleCardSounds(travelSpotlightAudioRef.current, SIX_MONTH_SPOTLIGHT_SOUND_DELAYS_MS);
    }
  };

  const handlePerformerCardReveal = type => {
    if (!started || mode !== "present" || paused || !activeSlideSoundEnabledRef.current) return;
    playCardSound(type === "monthly" ? monthlyCardAudioRef.current : weeklyCardAudioRef.current);
  };

  const handleProductCardReveal = () => {
    if (!started || mode !== "present" || paused || !activeSlideSoundEnabledRef.current) return;
    playCardSound(battleCardAudioRef.current);
  };

  const cycleSoundMode = () => {
    const next = soundModeRef.current === SOUND_MODES.OFF
      ? SOUND_MODES.REPEAT
      : soundModeRef.current === SOUND_MODES.REPEAT
        ? SOUND_MODES.ONCE
        : SOUND_MODES.OFF;
    soundModeRef.current = next;
    mutedRef.current = next === SOUND_MODES.OFF;
    if (next === SOUND_MODES.ONCE) playedSoundSlidesRef.current.clear();
    setSoundMode(next);
    if (next === SOUND_MODES.OFF) stopAllSounds();
  };

  const togglePause = () => {
    setPaused(current => {
      const next = !current;
      if (next) {
        clearTravelCardSounds();
        clearCardSounds();
        [
          introAudioRef.current,
          monthlyAudioRef.current,
          weeklyAudioRef.current,
          travelAudioRef.current,
          travelSpotlightAudioRef.current,
          battleAudioRef.current,
          commissionIntroAudioRef.current,
          commissionAudioRef.current,
          celebrateAudioRef.current,
          ...Object.values(zoneAudioRefs.current)
        ].forEach(audio => audio?.pause());
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
    else stopAllSounds();
  };

  const select = next => {
    const safe = (next + slideNames.length) % slideNames.length;
    setPaused(false);
    setIndex(safe);
    setReplay(current => current + 1);

    if (started && mode === "present") playSoundForSlide(safe);
    else stopAllSounds();
  };

  const showValidationProblem = problem => {
    stopAllSounds();
    setStarted(true);
    setPaused(false);
    setMode("edit");
    setInspector(true);
    setIndex(problem.slideIndex);
    setReplay(current => current + 1);
    setValidationWarning(problem);
  };

  const start = (requestedSoundMode = soundModeRef.current) => {
    const problem = validatePresentation(state);
    if (problem) {
      showValidationProblem(problem);
      return;
    }

    setValidationWarning(null);
    playedSoundSlidesRef.current.clear();
    soundModeRef.current = requestedSoundMode;
    mutedRef.current = requestedSoundMode === SOUND_MODES.OFF;
    setSoundMode(requestedSoundMode);
    setStarted(true);
    setPaused(false);
    setMode("present");
    setInspector(false);
    setReplay(current => current + 1);

    playSoundForSlide(index, requestedSoundMode);
  };

  const openEditor = () => {
    stopAllSounds();
    setValidationWarning(null);
    setStarted(true);
    setPaused(false);
    setMode("edit");
    setInspector(true);
    setReplay(current => current + 1);
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
    const timer = window.setTimeout(() => {
      try {
        saveLocalPresentation(state);
      } catch (error) {
        console.error("Unable to auto-save the presentation locally", error);
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (!started || mode !== "present" || paused) return undefined;
    const synchronizedSlides = [
      SLIDE.WEEKLY,
      SLIDE.PRODUCTS,
      SLIDE.MONTHLY,
      SLIDE.SIX_MONTH
    ];

    let duration;
    if (index === SLIDE.COMMISSION) {
      if (!commissionSequence.finished) return undefined;
      duration = 0;
    } else if (index === SLIDE.MISSION) {
      if (!missionSequenceComplete) return undefined;
      duration = 0;
    } else if (synchronizedSlides.includes(index)) {
      if (slideAudioSync.slideIndex !== index) return undefined;
      if (slideAudioSync.status === "playing") return undefined;
      if (slideAudioSync.status === "finished") {
        duration = 0;
      } else {
        duration = index === SLIDE.PRODUCTS
          ? SLOW_BATTLE_SLIDE_DURATION_MS
          : index === SLIDE.WEEKLY
            ? WEEKLY_PERFORMER_SLIDE_DURATION_MS
            : index === SLIDE.SIX_MONTH
              ? SIX_MONTH_SLIDE_DURATION_MS
              : SLOW_PERFORMER_SLIDE_DURATION_MS;
      }
    } else {
      duration = DEFAULT_SLIDE_DURATION_MS;
    }

    const timer = window.setTimeout(() => {
      const next = (index + 1) % slideNames.length;
      setIndex(next);
      setReplay(current => current + 1);

      playSoundForSlide(next);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [
    started,
    mode,
    index,
    replay,
    paused,
    commissionSequence.finished,
    missionSequenceComplete,
    slideAudioSync
  ]);

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

  const soundModeText = soundMode === SOUND_MODES.OFF
    ? "Play without sound"
    : soundMode === SOUND_MODES.ONCE
      ? "Sound once per slide"
      : "Sound on every play";

  return <main className={`show-app mode-${mode} ${paused ? "show-paused" : ""} ${muted ? "sound-muted" : "sound-on"} sound-mode-${soundMode}`}>
    {!started && <StartOverlay onStart={start} onEdit={openEditor}/>}
    {mode === "edit" && validationWarning && <div className="presentation-warning" role="alert" aria-live="assertive">
      <span className="warning-symbol">!</span>
      <div>
        <b>{validationWarning.title}</b>
        <p>{validationWarning.message}</p>
      </div>
      <button onClick={() => setValidationWarning(null)} aria-label="Close warning"><X/></button>
    </div>}
    {mode === "edit" && <SlideRail index={index} onSelect={select}/>}
    <div className="workspace">
      {mode === "edit" && <header className="topbar">
        <div className="project-title"><Brand small/><div><b>Achievers Show</b></div></div>
        <div className="top-actions">
          <button className={`sound-toggle sound-mode-${soundMode} ${muted ? "is-muted" : "is-on"}`} onClick={cycleSoundMode} title="Change sound mode">
            {soundMode === SOUND_MODES.OFF ? <VolumeX size={16}/> : soundMode === SOUND_MODES.ONCE ? <Play size={16}/> : <Volume2 size={16}/>}
            {soundModeText}
          </button>
          <button className="pause-button" onClick={togglePause}>{paused ? <Play size={16}/> : <Pause size={16}/>}{paused ? "Play show" : "Pause show"}</button>
          <button onClick={() => playSlide()}><RotateCcw size={16}/>Replay animation</button>
          <button className="present-button" onClick={() => start(soundModeRef.current)}><MonitorPlay size={18}/>Present</button>
        </div>
      </header>}
      <div className="stage-shell" ref={stageRef}>
        <Stage
          index={index}
          state={state}
          replay={replay}
          onPerformerCardReveal={handlePerformerCardReveal}
          onProductCardReveal={handleProductCardReveal}
          revealCommission={commissionSequence.revealed}
          commissionRollDuration={commissionSequence.rollDurationMs}
          commissionTitleDuration={commissionSequence.titleDurationMs}
          showMissionResult={mode !== "present" || missionResultVisible}
        />
        <div className="present-controls">
          <button onClick={() => select(index - 1)} aria-label="Previous slide"><ChevronLeft/></button>
          <button
            className={`sound-control sound-mode-${soundMode} ${muted ? "is-muted" : "is-on"}`}
            onClick={cycleSoundMode}
            aria-label={soundModeText}
            title={`${soundModeText}. Click to change mode.`}
          >
            {soundMode === SOUND_MODES.OFF ? <VolumeX/> : soundMode === SOUND_MODES.ONCE ? <Play fill="currentColor"/> : <Volume2/>}
          </button>
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
