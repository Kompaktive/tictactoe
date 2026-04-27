import { useEffect, useState } from "react";
import type { Pairing, Role } from "~/types/game";
import { useUidCookies } from "./useUidCookies";
import useNicknameStore from "~/stores/useNicknameStore";
import { get, onValue } from "firebase/database";
import { roomRef } from "~/services/firebase/room.service";

export const useRole = (roomId: string) => {
  const { uid } = useUidCookies();
  const {
    nickname: storedNickname,
    setNickname: storeNickname,
    hasHydrated: hasHydratedNickname,
  } = useNicknameStore();

  const [role, setRole] = useState<Role>("spectator");
  const [pairing, setPairing] = useState<Pairing>();
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(true);

  useEffect(() => {
    if (!hasHydratedNickname) return;

    const unsubscribe = onValue(roomRef(roomId), async (snapshot) => {
      const room: Pairing = snapshot.val();

      setPairing(room);

      // check for matching uid to prevent filling the room with the same user
      if (room.host.uid === uid) {
        setRole("host");
        // sync nickname
        if (room.host.nickname !== storedNickname)
          storeNickname(room.host.nickname);
      } else if (!!room.guest) {
        if (room.guest.uid === uid) {
          setRole("guest");
          // sync nickname
          if (room.guest.nickname !== storedNickname)
            storeNickname(room.guest.nickname);
        } else setRole("spectator");
      }

      setIsLoadingRole(false);
    });

    return () => unsubscribe();
  }, [uid, hasHydratedNickname, roomId, storedNickname, storeNickname]);

  return { role, pairing, isLoadingRole };
};
