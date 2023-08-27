/**
 * 前端Websocket hooks函数，建立稳定长连接，含心跳检测
 * onmessage监听事件回调由外部组件提供，除开心跳检测通信之外
 * 将结果经过全局通信向指定组件发送
 */
import { onMounted, onBeforeUnmount } from "vue";
import { uuid } from "@pureadmin/utils";
import Cookies from "js-cookie";
import { emitter } from "@/utils/mitt";

// 默认30秒发一次心跳以保证稳定连接
export function useWebsocket(timeout = 30000) {
  const url = import.meta.env.VITE_WS_URL;
  // WebSocket实例 | 计时器 | 重连次数
  let ws: WebSocket = null;
  let clientTimeout: number = null;
  let websocket_connected_count = 0;

  // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
  function heartCheckReset() {
    window.clearTimeout(clientTimeout);
  }
  function heartCheckStart() {
    clientTimeout = window.setTimeout(() => {
      if (ws.readyState === 1) {
        console.log("websocket连接状态，发送心跳检测ping维持心跳连接...");
        ws.send("ping");
        //如果获取到消息，说明连接是正常的，重置心跳检测
        heartCheckReset();
        heartCheckStart();
      } else {
        console.log("websocket断开状态，尝试重连");
        createWebsocket();
      }
    }, timeout);
  }

  // WebSocket监听事件
  function wsOpen() {
    console.log("websocket已打开(" + new Date().toTimeString() + ")");
    //成功建立连接后，重置心跳检测
    heartCheckReset();
    heartCheckStart();
  }
  // 关闭回调
  function wsClose() {
    console.log("websocket已关闭(" + new Date().toTimeString() + ")");
  }
  // 连接发生错误的回调方法，连接错误时会继续尝试发起连接（尝试3次）
  function wsError() {
    console.log(
      "websocket发生了错误" +
        (websocket_connected_count > 0
          ? "，已重连" + websocket_connected_count + "次"
          : "")
    );
    if (++websocket_connected_count <= 3) {
      createWebsocket();
    }
  }
  // ws关闭回调
  function wsDestroy() {
    console.log(
      "监听到窗口关闭/组件卸载事件，主动关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常"
    );
    ws && ws.close();
    heartCheckReset();
  }
  // ws消息回调，心跳检测时不执行回调直接返回，返回JSON对象时注意JSON转化
  function wsMessage(ev: MessageEvent) {
    const result: string = ev.data;
    if (result === "pong") {
      console.log("websocket连接状态，接收心跳检测pong维持心跳连接...");
      return;
    }
    emitter.emit("websocketMessage", result);
  }

  function createWebsocket() {
    if (!("WebSocket" in window)) {
      console.warn("当前浏览器不支持Websocket!");
      return;
    }
    const id = "/" + uuid();
    ws = new window.WebSocket(url + id);
    ws.onopen = wsOpen;
    ws.onclose = wsClose;
    ws.onerror = wsError;
    window.onbeforeunload = wsDestroy;
    // 接入外部组件提供的onmessage监听回调
    ws.onmessage = wsMessage;
    Cookies.set("socketId", id);
  }

  onMounted(createWebsocket);

  onBeforeUnmount(wsDestroy);
}
