export const marketConfig = {
  edition: "BG v1.0 / 2026",
  prices: {
    starter: "€19.99",
    pro: "€39.99",
    upgrade: "€20.00",
  },
  checkout: {
    starter: "https://buy.stripe.com/4gM7sNdh8fWt9rS8DFaVa03",
    pro: "https://buy.stripe.com/aFacN7gtkeSpbA08DFaVa04",
    upgrade: "https://buy.stripe.com/14A3cx1yq11zbA09HJaVa05",
  },
  githubPages: {
    landing: "landing_page.html",
    starter: "basic-guide.html",
    pro: "index.html",
  },
  seller: {
    legalName: "",
    registrationId: "",
    address: "",
    email: "",
    vatStatus: "",
  },
} as const;

export type CheckoutKind = keyof typeof marketConfig.checkout;
