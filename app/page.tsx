"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, MessageCircle, Star, TrendingUp, Users } from "lucide-react";
import { APP_NAME, APP_SLOGAN } from "@/lib/config";
import { formatIDR } from "@/lib/utils";
import { useT } from "@/lib/useT";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const FAKE_BRANDS = [
  { name: "Kopi Nusantara", emoji: "☕" },
  { name: "Glow.id", emoji: "✨" },
  { name: "Tanah Tekstil", emoji: "🧵" },
  { name: "Cerdas.io", emoji: "🤖" },
  { name: "Keripik Mamah", emoji: "🥨" },
  { name: "Warung Digital", emoji: "🛍️" },
];

export default function LandingPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-bone">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-bone/90 backdrop-blur-sm border-b border-border px-5 py-3 flex items-center justify-between">
        <div>
          <span
            className="text-xl font-bold text-espresso leading-none"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {APP_NAME}
          </span>
          <p className="text-[10px] text-muted-foreground tracking-wide uppercase">{APP_SLOGAN}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="text-sm text-muted-foreground hover:text-espresso transition-colors"
          >
            {t.app.login}
          </Link>
          <Link
            href="/onboarding"
            className="bg-terracotta text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-terracotta-light transition-colors"
          >
            {t.app.signup}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-16 pb-12 max-w-lg mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-amber/20 text-amber-800 px-3 py-1 rounded-full mb-6">
              {t.landing.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-espresso leading-tight mb-4"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {t.landing.hero}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
            {t.landing.heroSub}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-terracotta text-white px-6 py-3.5 rounded-full font-semibold text-base hover:bg-terracotta-light transition-all hover:shadow-lg hover:shadow-terracotta/20 active:scale-95"
            >
              {t.landing.ctaCreator}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/onboarding?role=brand"
              className="inline-flex items-center justify-center gap-2 bg-espresso text-bone px-6 py-3.5 rounded-full font-semibold text-base hover:bg-espresso-light transition-all active:scale-95"
            >
              {t.landing.ctaBrand}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Live stats */}
      <section className="px-5 pb-12 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: t.landing.statsLabel1, value: "4,200+", icon: <Users className="w-4 h-4" /> },
            { label: t.landing.statsLabel2, value: "1,800+", icon: <TrendingUp className="w-4 h-4" /> },
            { label: t.landing.statsLabel3, value: formatIDR(2_800_000_000, true), icon: <Star className="w-4 h-4" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 text-center border border-border"
            >
              <div className="text-terracotta flex justify-center mb-2">{stat.icon}</div>
              <p className="text-xl font-bold text-espresso" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Brand strip */}
      <section className="px-5 pb-12">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-5">
          {t.landing.brandsTitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          {FAKE_BRANDS.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-2 bg-white border border-border px-3 py-2 rounded-xl text-sm text-espresso"
            >
              <span>{b.emoji}</span>
              <span className="font-medium">{b.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-14 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl font-bold text-espresso mb-10 leading-tight text-center"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {t.landing.howTitle}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {t.landing.howSteps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-bone-dark rounded-2xl flex items-center justify-center text-2xl">
                {item.emoji}
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-1">0{i + 1}</p>
                <h3 className="font-semibold text-espresso mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust pillars */}
      <section className="bg-bone-dark px-5 py-12">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-2xl font-bold text-espresso mb-8 text-center"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            {t.landing.whyTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {t.landing.whyItems.map((p, i) => {
              const icons = [
                <Shield key="shield" className="w-5 h-5 text-[#25D366]" />,
                <Zap key="zap" className="w-5 h-5 text-amber" />,
                <MessageCircle key="msg" className="w-5 h-5 text-[#25D366]" />,
              ];
              return (
                <div key={i} className="flex gap-4 bg-white rounded-2xl p-4 border border-border">
                  <div className="flex-shrink-0 w-10 h-10 bg-bone rounded-xl flex items-center justify-center">
                    {icons[i]}
                  </div>
                  <div>
                    <p className="font-semibold text-espresso text-sm mb-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-16 text-center max-w-md mx-auto">
        <h2
          className="text-3xl font-bold text-espresso mb-4"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {t.landing.ctaBottom}
        </h2>
        <p className="text-muted-foreground mb-8">{t.landing.ctaBottomSub}</p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-terracotta-light transition-all hover:shadow-xl hover:shadow-terracotta/20 active:scale-95"
        >
          {t.app.signup}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-8 text-center">
        <p
          className="text-lg font-bold text-espresso mb-0.5"
          style={{ fontFamily: "Fraunces, Georgia, serif" }}
        >
          {APP_NAME}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{APP_SLOGAN}</p>
        <p className="text-xs text-muted-foreground">{t.landing.footer}</p>
      </footer>
    </div>
  );
}
