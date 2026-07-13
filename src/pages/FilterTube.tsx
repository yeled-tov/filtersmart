import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Shield, Music, Lock, Download, Play, Sparkles, Users, ChevronDown,
  Radio, Video, Headphones, Settings2, Layers, Zap, Star, Check
} from "lucide-react";

// App screenshots (bundled in /public/filtertube – works on any host)
const SHOTS = {
  login:    "/filtertube/142557.jpg",
  password: "/filtertube/142641.jpg",
  levels:   "/filtertube/142652.jpg",
  music:    "/filtertube/142658.jpg",
  success:  "/filtertube/142705.jpg",
  feed:     "/filtertube/142716.jpg",
  player:   "/filtertube/142911.jpg",
  overlay:  "/filtertube/143005.jpg",
  quality:  "/filtertube/143022.jpg",
  shorts:   "/filtertube/143258.jpg",
};

const APK_URL = "https://github.com/yeled-tov/filtertube-android/releases/latest/download/FilterTube-debug.apk";

/* ---------- 3D Phone frame ---------- */
const PhoneFrame = ({
  src, alt, className = "", tilt = "left",
}: { src: string; alt: string; className?: string; tilt?: "left" | "right" | "flat" }) => {
  const rotation =
    tilt === "left" ? "rotateY(18deg) rotateX(6deg) rotateZ(-3deg)"
    : tilt === "right" ? "rotateY(-18deg) rotateX(6deg) rotateZ(3deg)"
    : "rotateY(0) rotateX(2deg)";
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
    >
      <div
        className="relative aspect-[9/19.5] w-full rounded-[2.6rem] bg-neutral-900 p-[6px] shadow-[0_60px_120px_-30px_rgba(220,38,38,0.35),0_30px_60px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
        style={{
          transform: rotation,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Metallic side gleam */}
        <div className="pointer-events-none absolute inset-0 rounded-[2.6rem] bg-gradient-to-br from-white/15 via-transparent to-white/5" />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-black">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {/* Screen glare */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 mix-blend-overlay" />
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
        {/* Buttons */}
        <div className="absolute -left-[3px] top-24 h-14 w-[3px] rounded-l bg-neutral-700" />
        <div className="absolute -left-[3px] top-44 h-20 w-[3px] rounded-l bg-neutral-700" />
        <div className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-neutral-700" />
      </div>
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-70"
           style={{ background: "radial-gradient(closest-side, rgba(239,68,68,0.35), transparent 70%)" }} />
    </div>
  );
};

/* ---------- Scroll-tilt phone ---------- */
const ScrollPhone = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [25, -25]), { stiffness: 60, damping: 20 });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), { stiffness: 60, damping: 20 });
  return (
    <motion.div ref={ref} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateY: rotate, y, transformStyle: "preserve-3d" }}>
        <PhoneFrame src={src} alt={alt} tilt="flat" className="max-w-[280px]" />
      </motion.div>
    </motion.div>
  );
};

/* ---------- Feature card ---------- */
const FeatureCard = ({
  icon: Icon, title, desc, delay = 0,
}: { icon: any; title: string; desc: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-red-500/40 transition-all duration-500 hover:-translate-y-1"
  >
    <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
         style={{ background: "radial-gradient(400px circle at var(--x,50%) var(--y,50%), rgba(239,68,68,0.15), transparent 40%)" }} />
    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 ring-1 ring-red-500/30">
      <Icon className="h-5 w-5 text-red-400" />
    </div>
    <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
    <p className="text-sm leading-relaxed text-white/60">{desc}</p>
  </motion.div>
);

/* ---------- Main Page ---------- */
const FilterTube = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProg, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroProg, [0, 1], [1, 0]);

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FilterTube – יוטיוב מסונן כשר",
    operatingSystem: "Android",
    applicationCategory: "MultimediaApplication",
    inLanguage: "he",
    offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5", ratingCount: "47" },
    description:
      "FilterTube – אפליקציית יוטיוב מסונן וכשרה לחלוטין. סינון תוכן ברמה גבוהה, מצב אודיו בלבד, נגן ברקע, הורדות למצב לא מקוון, שירים ותכני קודש.",
    publisher: { "@type": "Organization", name: "FilterPhone" },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "מה זה FilterTube?", acceptedAnswer: { "@type": "Answer", text: "FilterTube היא אפליקציית יוטיוב מסוננת וכשרה עם שלוש רמות סינון, מצב אודיו, נגן ברקע והורדות." } },
      { "@type": "Question", name: "האם FilterTube חלופה ליוטיוב פרוץ?", acceptedAnswer: { "@type": "Answer", text: "כן. FilterTube מספקת את כל התכונות שאתם מחפשים ביוטיוב פרוץ – הורדות, נגן ברקע, ללא פרסומות – אך בסביבה מסוננת וכשרה." } },
      { "@type": "Question", name: "האם יש רמות סינון?", acceptedAnswer: { "@type": "Answer", text: "כן, שלוש רמות: מחמיר (אודיו בלבד), רגיל (וידאו מלא), וקל דתי (תכני קודש כאודיו)." } },
      { "@type": "Question", name: "האם יש נגן ברקע?", acceptedAnswer: { "@type": "Answer", text: "כן, נגן ברקע וחלון צף (Floating window) זמינים במנוי הפרימיום, כולל 60 יום ניסיון חינם." } },
    ],
  };

  return (
    <div className="relative overflow-hidden bg-black text-white" dir="rtl">
      <Helmet>
        <title>FilterTube – יוטיוב מסונן וכשר | האלטרנטיבה החוקית ליוטיוב פרוץ | FilterPhone</title>
        <meta name="description" content="FilterTube – יוטיוב מסונן וכשר בעברית. 3 רמות סינון, מצב אודיו, נגן ברקע, הורדות ואפס פרסומות. האלטרנטיבה הכשרה והחוקית ליוטיוב פרוץ. 60 יום ניסיון חינם." />
        <meta name="keywords" content="יוטיוב מסונן, יוטיוב כשר, יוטיוב פרוץ, FilterTube, יוטיוב ללא פרסומות, YouTube כשר, סינון יוטיוב, יוטיוב לילדים, יוטיוב לחרדים, יוטיוב דתי, הורדת סרטונים, נגן ברקע יוטיוב" />
        <link rel="canonical" href="https://www.filterphone.com/filtertube" />
        <meta property="og:title" content="FilterTube – יוטיוב מסונן וכשר | FilterPhone" />
        <meta property="og:description" content="האלטרנטיבה הכשרה ליוטיוב פרוץ – 3 רמות סינון, מצב אודיו, נגן ברקע, הורדות. 60 יום ניסיון חינם." />
        <meta property="og:url" content="https://www.filterphone.com/filtertube" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="he_IL" />
        <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative isolate min-h-[100vh] pt-24 pb-16">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_60%,#000_100%)]" />
          <div className="absolute inset-0 opacity-[0.06]"
               style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-300 backdrop-blur"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                חדש · 60 יום ניסיון חינם
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight"
              >
                <span className="block">יוטיוב שסוף־סוף</span>
                <span className="block bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
                  אפשר לסמוך עליו.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 max-w-xl text-lg md:text-xl text-white/70 leading-relaxed"
              >
                FilterTube – החלופה הכשרה, המסוננת והחוקית ליוטיוב פרוץ.
                שלוש רמות סינון, מצב אודיו, נגן ברקע, הורדות ואפס פרסומות – הכל בעברית.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href={APK_URL}
                  download
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(239,68,68,0.7)] transition hover:brightness-110 hover:shadow-[0_15px_50px_-10px_rgba(239,68,68,0.9)]"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  הורד APK · חינם
                </a>
                <a
                  href="https://wa.me/972527186881?text=שלום%20אשמח%20לפרטים%20על%20FilterTube"
                  target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-red-500/20"
                >
                  התחל 60 יום חינם
                  <Zap className="h-4 w-4 transition-transform group-hover:rotate-12" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-8 flex items-center gap-6 text-xs text-white/50"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                  <span>5.0 · 47 חוות דעת</span>
                </div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />500+ משתמשים</div>
                <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />100% כשר</div>
              </motion.div>
            </div>

            {/* 3 Floating phones */}
            <div className="relative h-[560px] md:h-[640px]">
              <motion.div
                initial={{ opacity: 0, x: 60, rotate: 8 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="absolute right-0 top-4 z-10 w-[62%]"
              >
                <PhoneFrame src={SHOTS.feed} alt="פיד וידאו מאושר ב-FilterTube" tilt="right" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -60, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
                className="absolute left-2 top-32 z-20 w-[58%]"
              >
                <PhoneFrame src={SHOTS.player} alt="נגן וידאו של FilterTube" tilt="left" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="absolute bottom-0 left-1/2 z-30 w-[46%] -translate-x-1/2"
              >
                <PhoneFrame src={SHOTS.shorts} alt="פיד שורטס ב-FilterTube" tilt="flat" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
          aria-hidden
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">כל מה שרציתם ביוטיוב פרוץ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              רק שהפעם, זה כשר.
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={Shield} title="3 רמות סינון" desc="מחמיר (אודיו בלבד), רגיל (וידאו מלא) וקל דתי – התאמה מדויקת לכל משפחה." />
            <FeatureCard icon={Radio} title="מצב אודיו" desc="נגן את הסרטון כפודקאסט – חסוך נתונים, שמור על הריכוז." delay={0.05} />
            <FeatureCard icon={Layers} title="חלון צף ורקע" desc="השאר את הווידאו פועל תוך כדי גלישה, כתיבה או נעילת מסך." delay={0.1} />
            <FeatureCard icon={Download} title="הורדות אופליין" desc="הורד סרטונים מראש – צפייה גם ללא אינטרנט, אידאלי לנסיעות." delay={0.15} />
            <FeatureCard icon={Lock} title="קוד הורים 4 ספרות" desc="הגנה על ההגדרות ורמת הסינון – רק המבוגר האחראי יכול לשנות." delay={0.2} />
            <FeatureCard icon={Music} title="מוזיקה כשרה" desc="בחר את האמנים שלך – אברהם פריד, 8thDay, שוואקי ועוד – פיד אישי." delay={0.25} />
            <FeatureCard icon={Settings2} title="איכות ומהירות" desc="שליטה מלאה: 144p עד 1080p, מהירות ניגון, וטעינה חכמה חוסכת סוללה." delay={0.3} />
            <FeatureCard icon={Sparkles} title="בית אישי חכם" desc="פיד מותאם למגדר, לגיל, לאמנים ולערוצים שאתם עוקבים אחריהם." delay={0.35} />
          </div>
        </div>
      </section>

      {/* ================= SHOWCASE (scroll phones) ================= */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),transparent_60%)]" />
        <div className="container-custom">

          {/* Row 1 */}
          <div className="grid items-center gap-14 lg:grid-cols-2 mb-32">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">התאמה אישית</p>
              <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight">
                הרשמה בשלוש דקות.<br/>מותאם בול אליך.
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                בחר מגדר, קבע קוד הורים, ובחר את רמת הסינון המתאימה למשפחה שלך.
                האפליקציה תדע איזה תוכן להראות – ובעיקר – איזה להסתיר.
              </p>
              <ul className="space-y-3">
                {["התאמה לפי מגדר וגיל", "קוד הורים לנעילת הגדרות", "3 רמות סינון בלחיצה אחת", "60 יום פרימיום חינם"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white/80">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-500/40">
                      <Check className="h-3 w-3 text-red-400" />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center gap-4">
              <ScrollPhone src={SHOTS.login} alt="מסך התחברות FilterTube" />
              <div className="hidden md:block pt-12">
                <ScrollPhone src={SHOTS.levels} alt="בחירת רמת סינון" />
              </div>
            </div>
          </div>

          {/* Row 2 (reversed) */}
          <div className="grid items-center gap-14 lg:grid-cols-2 mb-32">
            <div className="lg:order-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">חוויית ניגון</p>
              <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight">
                נגן חזק כמו יוטיוב פרימיום.<br/>רק בלי הזבל.
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                שליטה מלאה: מהירות, איכות, אודיו בלבד, רקע, חלון צף. כל מה שהייתם צריכים אפליקציה חיצונית בשביל – עכשיו במקום אחד, כשר.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: Play, t: "ללא פרסומות" },
                  { i: Headphones, t: "נגן ברקע" },
                  { i: Video, t: "עד איכות 1080p" },
                  { i: Download, t: "הורדות אופליין" },
                ].map(({ i: Icon, t }) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
                    <Icon className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-white/85">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1 flex justify-center gap-4">
              <ScrollPhone src={SHOTS.overlay} alt="שכבת ניגון של FilterTube" />
              <div className="hidden md:block pt-12">
                <ScrollPhone src={SHOTS.quality} alt="הגדרות איכות ומהירות" />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">תוכן וגילוי</p>
              <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight">
                פיד ושורטס מסוננים.<br/>גילוי בלי הפתעות.
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                כל סרטון עובר סינון AI + סינון אנושי לפני שהוא מופיע בפיד שלך.
                אין תגובות פרובוקטיביות, אין המלצות אלגוריתם רעילות – רק תוכן שאתם רוצים לראות.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <ScrollPhone src={SHOTS.shorts} alt="שורטס כשרים" />
              <div className="hidden md:block pt-12">
                <ScrollPhone src={SHOTS.music} alt="בחירת אמנים למוזיקה" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMPARISON ================= */}
      <section className="relative py-24">
        <div className="container-custom max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-4 text-center text-4xl md:text-5xl font-black"
          >
            FilterTube <span className="text-white/40">vs</span> יוטיוב פרוץ
          </motion.h2>
          <p className="mb-12 text-center text-white/60">כל הפיצ'רים – אפס הסיכון המשפטי והרוחני.</p>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            {[
              ["ללא פרסומות", true, true],
              ["נגן ברקע", true, true],
              ["הורדות אופליין", true, true],
              ["חלון צף", true, true],
              ["חוקי ובטוח (ללא APK פרוץ)", true, false],
              ["סינון תוכן ברמת AI", true, false],
              ["3 רמות סינון להורים", true, false],
              ["תמיכה בעברית מלאה", true, false],
              ["ללא ריגול / פרסומות מוסתרות", true, false],
              ["מוזיקה יהודית מובנית", true, false],
            ].map(([label, mine, theirs], i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_auto] items-center gap-6 px-6 py-4 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                <span className="text-sm md:text-base text-white/85">{label as string}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/40">
                  {mine ? <Check className="h-4 w-4 text-red-400" /> : <span className="text-white/30">–</span>}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  {theirs ? <Check className="h-4 w-4 text-white/40" /> : <span className="text-white/30">✕</span>}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-t border-white/10 bg-black/40 px-6 py-3 text-xs font-bold uppercase tracking-wider">
              <span />
              <span className="text-red-400">FilterTube</span>
              <span className="text-white/40">YouTube פרוץ</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="relative py-24">
        <div className="container-custom max-w-3xl">
          <h2 className="mb-12 text-center text-4xl md:text-5xl font-black">שאלות נפוצות</h2>
          <div className="space-y-3">
            {[
              { q: "מה זה FilterTube ואיך זה שונה מיוטיוב רגיל?", a: "FilterTube היא אפליקציית וידאו כשרה שמבוססת על תוכן יוטיוב אבל עם סינון AI קפדני, שלוש רמות סינון להורים ותכונות פרימיום כמו נגן ברקע והורדות – בלי פרסומות ובלי סיכון תוכן לא ראוי." },
              { q: "האם זו חלופה חוקית ליוטיוב פרוץ?", a: "בהחלט. FilterTube נותנת את כל התכונות של יוטיוב פרימיום ואפליקציות פרוצות (הורדות, רקע, ללא פרסומות) – אבל בסביבה חוקית, בטוחה וכשרה." },
              { q: "יש רמות סינון שונות?", a: "כן. מחמיר – אודיו בלבד, ללא וידאו. רגיל – וידאו מסונן. קל דתי – רוב התוכן וידאו, אך תכני קודש עוברים לאודיו כדי לשמור על כבוד." },
              { q: "האם הפרימיום באמת חינם ל-60 יום?", a: "כן, 60 ימי ניסיון מלאים – כולל הורדות, נגן ברקע, חלון צף וכל שאר התכונות. לא נדרש אמצעי תשלום להתחלה." },
              { q: "האם ילדים יכולים להשתמש?", a: "כן. יש קוד הורים בן 4 ספרות שנועל את ההגדרות, כך שרק ההורה יכול לשנות רמת סינון או להסיר אמנים." },
              { q: "האם FilterTube זמין לאייפון?", a: "בשלב זה האפליקציה זמינה לאנדרואיד. גרסת iOS בפיתוח – השאירו פרטים ונעדכן אתכם." },
            ].map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-right font-bold text-white/90 hover:text-white transition">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-red-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-white/65 leading-relaxed">{item.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/50 via-black to-black p-10 md:p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.25),transparent_60%)]" />
            <h2 className="relative text-4xl md:text-6xl font-black tracking-tight">
              יוטיוב אחר.<br/>
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">רגוע יותר.</span>
            </h2>
            <p className="relative mt-5 text-lg text-white/70 max-w-xl mx-auto">
              60 יום פרימיום חינם. ללא כרטיס אשראי. ללא סיכון.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={APK_URL}
                download
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(239,68,68,0.8)] transition hover:brightness-110"
              >
                <Download className="h-4 w-4" />
                הורד APK עכשיו
              </a>
              <a
                href="https://wa.me/972527186881?text=שלום%20אשמח%20לפרטים%20על%20FilterTube"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                דבר איתנו
                <Zap className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FilterTube;
