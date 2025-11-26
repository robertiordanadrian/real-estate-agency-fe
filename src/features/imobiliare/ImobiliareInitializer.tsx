import { useEffect } from "react";

import {
  useImobiliareLogin,
  useImobiliareSlots,
  useImobiliareLocations,
  useImobiliareBucharestIlfov,
} from "@/features/imobiliare/imobiliareQueries";

export const ImobiliareInitializer = () => {
  const loginMutation = useImobiliareLogin();
  const { refetch: refetchSlots } = useImobiliareSlots();
  const { refetch: refetchLocations } = useImobiliareLocations();
  const { refetch: refetchBuchIlfov } = useImobiliareBucharestIlfov();

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🔄 Autologin la Imobiliare.ro...");
        await loginMutation.mutateAsync();

        console.log("📦 Încarc slots...");
        await refetchSlots();

        console.log("🗺️ Încarc locațiile...");
        await refetchLocations();

        console.log("🏙️ Încarc nomenclator București + Ilfov...");
        await refetchBuchIlfov();

        console.log("✅ Imobiliare.ro init COMPLET");
      } catch (err) {
        console.error("❌ Eroare la autologin Imobiliare:", err);
      }
    };

    init();
  }, []);

  return null;
};
