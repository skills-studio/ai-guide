import React from "react";
import { createRoot } from "react-dom/client";
import ProductSite, { type ProductEntry } from "../../components/ProductSite";
import "../../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

const filename = window.location.pathname.split("/").pop()?.toLowerCase() ?? "";
const entry: ProductEntry = filename === "basic-guide.html"
  ? "starter"
  : filename === "landing_page.html"
    ? "landing"
    : "pro";

createRoot(root).render(
  <React.StrictMode>
    <ProductSite entry={entry} />
  </React.StrictMode>,
);
