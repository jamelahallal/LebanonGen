import React from "react";
import "../styles/about.css";
import family from "../images/family.png";
import Footer from "../components/Footer";
import team1 from "../images/ali.png";
import team2 from "../images/Leila.png";
import team3 from "../images/samer.png";
import { useTranslation } from "react-i18next";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');
  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'Inter', sans-serif; }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.65); }
  }
  .animate-pulse-dot { animation: pulse-dot 2.2s infinite; }
  .hero-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 52px 52px;
  }
  .hero-radial {
    background: radial-gradient(ellipse 65% 55% at 50% 42%, rgba(220,38,38,0.5) 0%, transparent 72%);
  }
  .team-card-fancy .team-img img { transition: transform .55s ease; }
  .team-card-fancy:hover .team-img img { transform: scale(1.06); }
  .img-zoom img { transition: transform .55s ease; }
  .img-zoom:hover img { transform: scale(1.04); }
`;

function About() {
  const { t } = useTranslation();

  const teamMembers = [
    {
      img: team1,
      nameKey: "about.team.m1_name",
      roleKey: "about.team.m1_role",
    },
    {
      img: team2,
      nameKey: "about.team.m2_name",
      roleKey: "about.team.m2_role",
    },
    {
      img: team3,
      nameKey: "about.team.m3_name",
      roleKey: "about.team.m3_role",
    },
  ];

  const values = [
    {
      icon: "🔬",
      titleKey: "about.values.v1_title",
      descKey: "about.values.v1_desc",
    },
    {
      icon: "🤝",
      titleKey: "about.values.v2_title",
      descKey: "about.values.v2_desc",
    },
    {
      icon: "🛡️",
      titleKey: "about.values.v3_title",
      descKey: "about.values.v3_desc",
    },
  ];

  return (
    <div className="font-body overflow-x-hidden">
      <style>{injectStyles}</style>

      {/* ── HERO ── */}
      <section className="relative bg-red-950 overflow-hidden flex items-center justify-center min-h-[60vh] text-center">
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute inset-0 hero-radial" />
        <div
          className="absolute rounded-full border border-white/[0.07] pointer-events-none"
          style={{
            width: 380,
            height: 380,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="absolute rounded-full border border-white/[0.04] pointer-events-none"
          style={{
            width: 660,
            height: 660,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        <div className="relative z-10 px-6 py-20 max-w-2xl">
          <div
            className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20
                          text-red-200 text-[10px] font-semibold tracking-[0.18em] uppercase
                          px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse-dot" />
            {t("about.hero.pill")}
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl md:text-[4.5rem] font-bold text-white
                         leading-[1.08] tracking-tight mb-6"
          >
            {t("about.hero.title1")}
            <br />
            {t("about.hero.title2")}{" "}
            <em className="not-italic text-red-200">
              {t("about.hero.title2_accent")}
            </em>
          </h1>

          <p className="text-white/55 text-base sm:text-lg font-light leading-relaxed max-w-lg mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ── BREADCRUMB ── */}
      <div
        className="bg-white border-b border-gray-100 px-6 sm:px-14 py-3 flex items-center gap-2
                      text-xs text-gray-400 font-medium tracking-wide"
      >
        {t("about.breadcrumb.home")} <span className="text-gray-300">›</span>{" "}
        <span className="text-red-700">{t("about.breadcrumb.current")}</span>
      </div>

      {/* ── PURPOSE ── */}
      <section className="grid md:grid-cols-2 min-h-[560px] bg-white">
        <div className="relative overflow-hidden min-h-[320px] img-zoom">
          <img
            src={family}
            alt="Genetic Research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
          <div
            className="absolute bottom-6 left-6 bg-red-950/80 backdrop-blur-sm border border-white/10
                          text-white px-4 py-3 rounded-xl text-sm font-medium"
          >
            <span className="block text-[10px] text-white/50 uppercase tracking-widest mb-0.5">
              {t("about.purpose.badge_title")}
            </span>
            {t("about.purpose.badge_sub")}
          </div>
        </div>

        <div className="flex flex-col justify-center px-10 py-16 lg:px-20">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4">
            {t("about.purpose.label")}
          </span>
          <div className="w-10 h-0.5 bg-red-700 mb-6 rounded-full" />
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-6">
            {t("about.purpose.title1")}
            <br />
            {t("about.purpose.title2")}
          </h2>
          <p className="text-gray-500 font-light leading-[1.9] text-base mb-5">
            {t("about.purpose.body1")}
          </p>
          <p className="text-gray-500 font-light leading-[1.9] text-base">
            {t("about.purpose.body2")}
          </p>
        </div>
      </section>

      {/* ── VALUES STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#A61E22]">
        {values.map(({ icon, titleKey, descKey }, i) => (
          <div
            key={titleKey}
            className={`text-center px-8 py-12 ${i < 2 ? "sm:border-r border-b sm:border-b-0 border-white/10" : ""}`}
          >
            <div className="text-3xl mb-4">{icon}</div>
            <div className="font-display text-xl font-bold text-white mb-2">
              {t(titleKey)}
            </div>
            <p className="text-white/55 text-sm font-light leading-relaxed max-w-[200px] mx-auto">
              {t(descKey)}
            </p>
          </div>
        ))}
      </div>

      {/* ── TEAM ── */}
      <section className="bg-stone-50 py-24 px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-700 mb-4 block">
            {t("about.team.label")}
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-red-950 leading-tight mb-3">
            {t("about.team.title")}
          </h2>
          <p className="text-gray-500 font-light text-base max-w-md mx-auto">
            {t("about.team.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-4xl mx-auto">
          {teamMembers.map(({ img, nameKey, roleKey }) => (
            <div
              key={nameKey}
              className="team-card-fancy bg-white border border-gray-100 rounded-2xl overflow-hidden
                            hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="team-img relative h-56 overflow-hidden">
                <img
                  src={img}
                  alt={t(nameKey)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" />
              </div>
              <div className="border-t-2 border-red-800 px-6 py-5 text-center">
                <div className="font-semibold text-gray-900 text-base mb-1">
                  {t(nameKey)}
                </div>
                <div className="text-red-700 text-xs font-semibold tracking-widest uppercase">
                  {t(roleKey)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
