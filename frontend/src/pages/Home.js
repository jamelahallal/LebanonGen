import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import sickleImage from "../images/sickle.webp";
import Footer from "../components/Footer";
import { FaDna, FaChartBar, FaShieldAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Inter', sans-serif; }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  @keyframes line-drop {
    0%   { transform:scaleY(0); transform-origin:top; opacity:1; }
    100% { transform:scaleY(1); transform-origin:top; opacity:0; }
  }
  .animate-pulse-dot  { animation: pulse-dot 2.2s infinite; }
  .animate-line-drop  { animation: line-drop 2s infinite; }
  .hero-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .hero-radial {
    background: radial-gradient(ellipse 65% 55% at 50% 42%, rgba(220,38,38,0.5) 0%, transparent 72%);
  }
  .feature-card-fancy::after {
    content:''; position:absolute; inset-x:0; top:0;
    height:2px; background:#b91c1c;
    transform:scaleX(0); transform-origin:left;
    transition:transform .35s ease;
  }
  .feature-card-fancy:hover::after { transform:scaleX(1); }
  .img-zoom img { transition: transform .55s ease; }
  .img-zoom:hover img { transform: scale(1.04); }
`;

function Home() {
  const { t } = useTranslation();

  return (
    <div className="font-body overflow-x-hidden">
      <style>{injectStyles}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-red-950 overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute inset-0 hero-radial" />
        <div
          className="absolute rounded-full border border-white/[0.07] pointer-events-none"
          style={{
            width: 440,
            height: 440,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="absolute rounded-full border border-white/[0.04] pointer-events-none"
          style={{
            width: 740,
            height: 740,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-3xl w-full">
          <div
            className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 text-red-200
                          text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            {t("home.hero.pill")}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            {t("home.hero.title1")}
            <br />
            {t("home.hero.title2")}{" "}
            <em className="not-italic text-red-200">
              {t("home.hero.title2_accent")}
            </em>
          </h1>

          <p className="text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-red-950 font-semibold
                         px-8 py-3.5 rounded-lg text-sm tracking-wide
                         hover:bg-red-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("home.hero.cta_start")} <span className="text-base">→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white/70 border border-white/20
                         px-7 py-3.5 rounded-lg text-sm font-medium
                         hover:border-white/40 hover:text-white transition-all duration-200"
            >
              {t("home.hero.cta_learn")}
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                        text-white/30 text-[10px] tracking-[0.14em] uppercase z-10"
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-line-drop" />
          {t("home.hero.scroll")}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
        {["item1", "item2", "item3", "item4"].map((key) => (
          <div
            key={key}
            className="flex items-center gap-2.5 text-xs text-gray-500 font-medium tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            {t(`home.trust.${key}`)}
          </div>
        ))}
      </div>

      {/* ── ABOUT / SCD ── */}
      <section className="grid md:grid-cols-2 mb-24 min-h-[580px] bg-white">
        <div className="relative overflow-hidden min-h-[340px] img-zoom">
          <img
            src={sickleImage}
            alt="Microscopic view of Sickle Cells"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent" />
          <div
            className="absolute bottom-6 left-6 bg-red-950/80 backdrop-blur-sm border border-white/10
                          text-white px-4 py-3 rounded-xl text-sm font-medium"
          >
            <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-0.5">
              {t("home.about_scd.badge_title")}
            </span>
            {t("home.about_scd.badge_sub")}
          </div>
        </div>

        <div className="flex flex-col justify-center px-10 py-16 lg:px-20">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4">
            {t("home.about_scd.label")}
          </span>
          <div className="w-10 h-0.5 bg-red-700 mb-6 rounded-full" />
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-6">
            {t("home.about_scd.title1")}
            <br />
            {t("home.about_scd.title2")}
          </h2>
          <p className="text-gray-500 font-light leading-[1.9] text-base mb-8">
            {t("home.about_scd.body1_start")}{" "}
            <strong className="text-gray-800 font-semibold">
              {t("home.about_scd.body1_bold1")}
            </strong>{" "}
            {t("home.about_scd.body1_mid")}{" "}
            <strong className="text-gray-800 font-semibold">
              {t("home.about_scd.body1_bold2")}
            </strong>
            {t("home.about_scd.body1_end")}
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 bg-red-900 text-white font-medium
                       px-7 py-3.5 rounded-lg text-sm w-fit
                       hover:bg-red-800 hover:gap-4 transition-all duration-200"
          >
            {t("home.about_scd.learn_more")}{" "}
            <span className="text-base">→</span>
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 bg-[#5C1016]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`text-center px-8 py-14 ${i < 3 ? "sm:border-r border-b sm:border-b-0 border-white/10" : ""}`}
          >
            <div className="font-display text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
              {t(`home.stats.s${i}_num`)}
              <span className="text-red-200">
                {t(`home.stats.s${i}_accent`)}
              </span>
            </div>
            <p className="text-white/55 text-sm font-light leading-relaxed max-w-[180px] mx-auto mb-5">
              {t(`home.stats.s${i}_desc`)}
            </p>
            <div className="w-8 h-px bg-white/25 mx-auto rounded-full" />
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4 block">
            {t("home.features.label")}
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-4">
            {t("home.features.title")}
          </h2>
          <p className="text-gray-500 font-light leading-relaxed">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { Icon: FaDna, key: "f1" },
            { Icon: FaChartBar, key: "f2" },
            { Icon: FaShieldAlt, key: "f3" },
          ].map(({ Icon, key }, i) => (
            <div
              key={i}
              className="feature-card-fancy relative bg-white border border-gray-100 rounded-2xl p-8
                            hover:-translate-y-1 hover:shadow-xl hover:border-transparent
                            transition-all duration-300 overflow-hidden flex flex-col gap-5"
            >
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-800">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {t(`home.features.${key}_title`)}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {t(`home.features.${key}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
