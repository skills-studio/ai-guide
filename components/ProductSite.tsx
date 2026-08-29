"use client";

import { useState } from "react";
import GuideApp, { type AccessTier, type View } from "./GuideApp";
import LandingPage from "./LandingPage";

export type ProductEntry = "landing" | "starter" | "pro";

export default function ProductSite({ entry = "landing" }: { entry?: ProductEntry } = {}) {
  const accessTier: AccessTier = entry === "pro" ? "pro" : entry === "starter" ? "starter" : "preview";
  const [screen, setScreen] = useState<"landing" | "guide">(entry === "landing" ? "landing" : "guide");
  const [guideView, setGuideView] = useState<View>("dashboard");

  const openGuide = (view: View = "dashboard") => {
    setGuideView(view);
    setScreen("guide");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const openLanding = () => {
    setScreen("landing");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  return screen === "guide"
    ? <GuideApp initialView={guideView} accessTier={accessTier} onExit={openLanding} />
    : <LandingPage onOpenGuide={openGuide} />;
}
