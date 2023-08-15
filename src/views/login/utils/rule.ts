import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { REGEXP_PWD } from "@/music-api/rule/LoginRule";

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  username: [
    {
      required: true,
      message: "用户名长度在5-20位之间",
      min: 5,
      max: 20,
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
