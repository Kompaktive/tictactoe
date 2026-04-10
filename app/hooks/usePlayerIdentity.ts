import { useEffect, useState } from "react";
import useNicknameStore from "~/stores/useNicknameStore";
import usePlayerUidStore from "~/stores/usePlayerUidStore";

const usePlayerIdentity = () => {
  const { uid, setUid } = usePlayerUidStore();
  const { nickname, setNickname } = useNicknameStore();

  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    const hasHydratedUid = usePlayerUidStore.persist.hasHydrated();
    const hasHydratedNickname = useNicknameStore.persist.hasHydrated();

    if (hasHydratedUid && hasHydratedNickname) setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!uid) {
      const generatedHostUid: string = crypto.randomUUID();
      setUid(generatedHostUid);
    }

    if (!nickname) {
      // TODO: implement random nickname generation
      const generatedNickname: string = "Generated Nickname";
      setNickname(generatedNickname);
    }
  }, [uid, nickname, setUid, setNickname, isHydrated]);

  return { nickname, uid, isHydrated };
};

export default usePlayerIdentity;
