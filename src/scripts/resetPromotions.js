import { resetExpiredPromotions } from "../lib/resetExpiredPromotions.js";

async function main() {
  try {
    await resetExpiredPromotions();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao resetar promoções:", error);
    process.exit(1);
  }
}

main();
