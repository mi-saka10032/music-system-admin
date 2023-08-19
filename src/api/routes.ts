type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return Promise.resolve<Result>({
    success: true,
    data: [
      // {
      //   path: "/permission",
      //   meta: {
      //     title: "权限管理",
      //     icon: "lollipop",
      //     rank: 10
      //   },
      //   children: [
      //     {
      //       path: "/permission/page/index",
      //       name: "PermissionPage",
      //       meta: {
      //         title: "页面权限",
      //         roles: ["admin"]
      //       }
      //     },
      //     {
      //       path: "/permission/button/index",
      //       name: "PermissionButton",
      //       meta: {
      //         title: "按钮权限",
      //         roles: ["admin"],
      //         auths: ["btn_add", "btn_edit", "btn_delete"]
      //       }
      //     }
      //   ]
      // },
      {
        path: "/singer",
        meta: {
          title: "歌手管理",
          icon: "lollipop",
          rank: 11
        },
        children: [
          {
            path: "/singer/index",
            name: "Singer",
            meta: {
              title: "歌手管理",
              roles: ["admin"]
            }
          }
        ]
      },
      {
        path: "/album",
        meta: {
          title: "专辑管理",
          icon: "lollipop",
          rank: 12
        },
        children: [
          {
            path: "/album/index",
            name: "Album",
            meta: {
              title: "专辑管理",
              roles: ["admin"]
            }
          }
        ]
      },
      {
        path: "/song",
        meta: {
          title: "歌曲管理",
          icon: "lollipop",
          rank: 13
        },
        children: [
          {
            path: "/song/index",
            name: "Song",
            meta: {
              title: "歌曲管理",
              roles: ["admin"]
            }
          }
        ]
      }
    ]
  });
};
