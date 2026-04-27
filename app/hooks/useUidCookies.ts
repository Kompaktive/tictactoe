import { useCookies } from "react-cookie";

export const useUidCookies = () => {
  const [cookies, setCookie] = useCookies(["uid"]);

  const uid = cookies.uid;

  const setUid = async (token: string) => setCookie("uid", token);

  return { uid, setUid };
};
