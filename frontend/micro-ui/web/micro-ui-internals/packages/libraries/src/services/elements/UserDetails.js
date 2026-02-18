import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const fetchUserDetails = async (kc) => {
  if (!kc?.token) {
    throw new Error("Keycloak token not available");
  }

  const requestData = {
    tenantId: Digit.ULBService.getCurrentTenantId(),
    uuid: kc?.uuid,
    userName: kc?.userName,
    userInfo: {
      email: kc?.email || "",
      name: kc?.userName || "",
      tenantId: Digit.ULBService.getCurrentTenantId()|| "",
    },
  };

  console.log(requestData, "eee");

  return Request({
    url: Urls.UserDetails,
    method: "POST",
    auth: true,
    userService: true,
    params: {
      access_token: kc.token, // ✅ KC token only in params
    },
    data: requestData, // ✅ actual payload
  });
};
