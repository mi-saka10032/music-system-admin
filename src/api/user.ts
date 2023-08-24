import { http } from "@/utils/http";
import { LoginDTO } from "@/music-api/dto/LoginDTO";
import { LoginVO, Captcha } from "@/music-api/vo/LoginVO";

export type LoginParam = Pick<LoginDTO, keyof LoginDTO>;

export type LoginResult = Pick<LoginVO, keyof LoginVO>;

/** 登录 */
export const getLogin = (data: LoginParam) => {
  return http.request<LoginResult>("post", "/login", { data });
};

/** 验证码 */
export const getCaptcha = () => {
  return http.get<Captcha>("/captchaGet");
};
