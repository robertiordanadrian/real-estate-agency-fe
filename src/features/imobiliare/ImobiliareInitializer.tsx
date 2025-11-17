import { useEffect } from "react";
import { useImobiliareLogin, useImobiliareSlots } from "@/features/imobiliare/imobiliareQueries";

/**
 * 🔹 ImobiliareInitializer
 * Rulează automat login-ul la Imobiliare.ro și încarcă sloturile promoționale
 * la pornirea aplicației. Este global și se montează o singură dată.
 */
export const ImobiliareInitializer = () => {
  const loginMutation = useImobiliareLogin();
  const { refetch: refetchSlots } = useImobiliareSlots();

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🔄 Autologin la Imobiliare.ro...");
        await loginMutation.mutateAsync();
        console.log("✅ Login reușit, încarc slots...");
        await refetchSlots();
      } catch (err) {
        console.error("❌ Eroare la autologin Imobiliare:", err);
      }
    };
    init();
  }, []);

  return null;
};
