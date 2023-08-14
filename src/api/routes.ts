type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return Promise.resolve<Result>({
    success: true,
    data: [
      {
        path: "/permission",
        meta: {
          title: "权限管理",
          icon: "lollipop",
          rank: 10
        },
        children: [
          {
            path: "/permission/page/index",
            name: "PermissionPage",
            meta: {
              title: "页面权限",
              roles: ["admin"]
            }
          },
          {
            path: "/permission/button/index",
            name: "PermissionButton",
            meta: {
              title: "按钮权限",
              roles: ["admin"],
              auths: ["btn_add", "btn_edit", "btn_delete"]
            }
          }
        ]
      }
    ]
  });
};
