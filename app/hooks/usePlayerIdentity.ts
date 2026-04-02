import { useEffect, useState } from "react";
import useNicknameStore from "~/stores/useNicknameStore";
import usePlayerUidStore from "~/stores/usePlayerUidStore";

const usePlayerIdentity = () => {
  const { uid, setUid } = usePlayerUidStore();
  const { nickname, setNickname } = useNicknameStore();

  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    if (!uid) {
      const generatedHostUid: string = crypto.randomUUID();
      setUid(generatedHostUid);
    }

    if (!nickname) {
      // TODO: implement random nickname generation
      const generatedNickname: string = "Generated Nickname";
      setNickname(generatedNickname);
    }

    setIsHydrated(true);
  }, [uid, nickname, setUid, setNickname]);

  return { nickname, uid, isHydrated };
};

export default usePlayerIdentity;
