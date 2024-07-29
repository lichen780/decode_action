//Mon Jul 29 2024 13:54:31 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("京东资产变动");
const jdCookie = require("./jdCookie"),
  notify = require("./utils/Rebels_sendJDNotify"),
  wpnotify = require("./sendNotify"),
  common = require("./utils/Rebels_jdCommon"),
  {
    H5st
  } = require("./utils/Rebels_H"),
  cryptoJS = require("crypto-js");
let taskThreads = process.env.jd_bean_change__threads || "1";
const runInterval = process.env.jd_bean_change_interval || "1500",
  isNotify = (process.env.jd_bean_change_notify || process.env.jd_bean_change_Notify) === "true",
  prizeNotify = process.env.jd_bean_change_prizeNotify === "true",
  mainnotify = process.env.jd_bean_change_mainnotify === "true",
  WP_APP_TOKEN_ONE = process.env.WP_APP_TOKEN_ONE || "",
  pinFilter = (process.env.jd_bean_change_pinFilter || "").split("@"),
  ForFarm = !(process.env.jd_bean_change_farm === "false"),
  XinForFarm = !(process.env.jd_bean_change_xinfarm === "false"),
  wanyiwan = !(process.env.jd_bean_change_wyw === "false"),
  hbChannel = !(process.env.jd_bean_change_hbChannel === "false"),
  ecard = !(process.env.jd_bean_change_ecard === "false"),
  plantBean = !(process.env.jd_bean_change_plantBean === "false"),
  market = !(process.env.jd_bean_change_market === "false"),
  marketCard = !(process.env.jd_bean_change_marketcard === "false"),
  phonebill = !(process.env.jd_bean_change_phonebill === "false"),
  Comment = !(process.env.jd_bean_change_comment === "false"),
  myhongbao = !(process.env.jd_bean_change_hongbao === "false"),
  jingBean = !(process.env.jd_bean_change_jingbean === "false"),
  coupon = !(process.env.jd_bean_change_coupon === "false"),
  wallet = !(process.env.jd_bean_change_wallet === "false"),
  intPerSent = process.env.jd_bean_change_intpersent || "5",
  maxThreads = 1,
  today = new Date($.time("yyyy-MM-dd 00:00:00")).getTime(),
  yesterday = today - 86400000,
  tomorrow = today + 86400000,
  dayAfterTomorrow = today + 172800000,
  KEY_TOTAL = 0,
  KEY_TOMORROW = 1,
  KEY_DAY_AFTER_TOMORROW = 2;
let cookiesArr = Object.keys(jdCookie).map(_0x8b13d1 => jdCookie[_0x8b13d1]).filter(_0x3fd4f3 => _0x3fd4f3);
!cookiesArr[0] && ($.msg($.name, "【提示】请先获取Cookie"), process.exit(1));
!(async () => {
  notify.config({
    title: $.name
  });
  await Main();
})().catch(_0x20e1b5 => $.logErr(_0x20e1b5)).finally(() => $.done());
async function Main() {
  try {
    try {
      const _0x1d3806 = parseInt(taskThreads);
      _0x1d3806 > 0 && _0x1d3806 !== 1 && (taskThreads = _0x1d3806);
    } catch {
      taskThreads = 1;
    }
    taskThreads = Math.min(taskThreads, maxThreads);
    $.waitTime = null;
    if (runInterval) {
      try {
        const _0x3536e3 = parseInt(runInterval);
        _0x3536e3 >= 0 && ($.waitTime = _0x3536e3);
      } catch {
        console.log("⚠ 自定义运行间隔时长设置错误");
      }
    }
    console.log("==========" + $.name + "变量开启状态==========");
    console.log("间隔时长: [" + $.waitTime / 1000 + "秒]运行间隔时长");
    console.log("东东农场: [" + (ForFarm ? "开启" : "关闭") + "],新东东农场: [" + (XinForFarm ? "开启" : "关闭") + "]");
    console.log("话费积分: [" + (phonebill ? "开启" : "关闭") + "],超市卡余额: [" + (marketCard ? "开启" : "关闭") + "]");
    console.log("评论查询: [" + (Comment ? "开启" : "关闭") + "],礼品卡余额: [" + (ecard ? "开启" : "关闭") + "]");
    console.log("红包查询: [" + (myhongbao ? "开启" : "关闭") + "],玩一玩奖票: [" + (wanyiwan ? "开启" : "关闭") + "]");
    console.log("过期京豆: [" + (jingBean ? "开启" : "关闭") + "],优惠券查询: [" + (coupon ? "开启" : "关闭") + "]");
    console.log("钱包余额: [" + (wallet ? "开启" : "关闭") + "],小程序省钱币: [" + (hbChannel ? "开启" : "关闭") + "]");
    console.log("汪贝余额: [" + (market ? "开启" : "关闭") + "],种豆得豆: [" + (plantBean ? "开启" : "关闭") + "]");
    console.log("代理开关: [" + common.getProxyStatus() + "]");
    console.log("通知推送: [" + (isNotify ? "开启" : "关闭") + "]" + (isNotify ? ", 分段数量: [" + intPerSent + "]," : ""));
    console.log("单独推送: [" + (prizeNotify ? "开启" : "关闭") + "],一对一推送: [" + (WP_APP_TOKEN_ONE ? "开启" : "关闭") + "]");
    console.log("成熟和快过期通知: [" + (mainnotify ? "开启" : "关闭") + "]");
    console.log("账号过滤: [" + pinFilter.join(", ") + "]");
    console.log("==========" + $.name + "变量状态结束==========");
    console.log("");
    await common.concTask(taskThreads, cookiesArr, taskFnc);
    $.runEnd = false;
  } catch (_0xd59a21) {
    console.log("❌ 脚本运行遇到了错误\n" + _0xd59a21);
  }
}
async function taskFnc(_0x47fd14, _0x5d5d55) {
  if ($.runEnd) {
    return {
      runEnd: true
    };
  }
  const _0x230255 = decodeURIComponent(common.getCookieValue(_0x47fd14, "pt_pin")),
    _0x35c312 = "【账号" + _0x5d5d55 + "】" + _0x230255 + "：",
    _0x1b702f = notify.create(_0x5d5d55, _0x230255);
  if (pinFilter.length > 0 && (pinFilter.includes(_0x230255) || pinFilter.includes(encodeURIComponent(_0x230255)))) {
    _0x1b702f.fix("已设置跳过运行当前账号");
    console.log(_0x1b702f.getInlineContent());
    return;
  }
  const _0x36a21b = await common.getLoginStatus(_0x47fd14);
  if (!_0x36a21b && typeof _0x36a21b === "boolean") {
    console.log(_0x35c312 + "账号无效");
    _0x1b702f.fix("账号无效");
    return;
  }
  const _0x254457 = common.genUA(_0x230255);
  let _0x5a64be = [],
    _0x3bd101 = [],
    _0x372de0 = {
      total: [0, 0, 0],
      common: [0, 0, 0],
      jdapp: [0, 0, 0],
      lite: [0, 0, 0],
      minip: [0, 0, 0]
    },
    _0x8bad30 = 0,
    _0x4ebfb1 = {
      today_in: 0,
      today_out: 0,
      yesterday_in: 0,
      yesterday_out: 0,
      detail: {}
    };
  await _0x28012d();
  await $.wait(parseInt($.waitTime * 1 + 200, 10));
  await _0x1a9e17();
  await $.wait(parseInt($.waitTime * 1 + 200, 10));
  ForFarm && (await _0x3ba648(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  XinForFarm && (await _0x1c54cd(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  plantBean && (await _0x393ad9(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  coupon && (await _0x33c456(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  wallet && (await _0x25d7e1(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  ecard && (await _0x2f4f40(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  marketCard && (await _0x4eae23(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  hbChannel && (await _0x5caac9(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  wanyiwan && (await _0x1083ff(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  phonebill && (await _0xb38f73(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  market && (await _0x402370(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  Comment && (await _0x408b6f(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  myhongbao && (await _0x5bae70(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  jingBean && (await _0x38a14b(), await $.wait(parseInt($.waitTime * 1 + 200, 10)));
  if (_0x5a64be && _0x5a64be.length > 0) {
    console.log("" + _0x35c312);
    console.log("" + _0x5a64be.join("\n"));
    const _0x31489c = "\n----------------------------------------\n",
      _0x5399b6 = "\n下方详情\n";
    _0x1b702f.insert("" + _0x5399b6 + _0x5a64be.join("\n") + _0x31489c);
    console.log("----------------------------------------");
  }
  prizeNotify && _0x5a64be && _0x5a64be.length > 0 && (await notify.sendNotify($.name + "通知", "【京东账号" + _0x5d5d55 + "】" + _0x230255 + "\n" + _0x5a64be.join("\n")));
  mainnotify && _0x3bd101 && _0x3bd101.length > 0 && (await notify.sendNotify("白嫖or快过期通知", "【京东账号" + _0x5d5d55 + "】" + _0x230255 + "\n" + _0x3bd101.join("\n")));
  if (WP_APP_TOKEN_ONE && _0x5a64be && _0x5a64be.length > 0) {
    try {
      await wpnotify.sendNotifybyWxPucher("资产变动通知", "" + _0x5a64be.join("\n"), "" + _0x230255);
    } catch (_0xa93dd2) {
      _0xa93dd2 instanceof TypeError ? console.error("请使用本库配套的sendNotify.js文件进行一对一推送设置") : console.error("请使用本库配套的sendNotify.js文件进行一对一推送设置");
    }
  }
  intPerSent > 0 && (_0x5d5d55 % intPerSent == 0 || _0x5d5d55 === cookiesArr.length) && isNotify && notify.getMessage() && (await notify.push(), notify.disposeAllMessage());
  if ($.runEnd) {
    return {
      runEnd: true
    };
  }
  await $.wait(parseInt($.waitTime * 1 + 200, 10));
  async function _0xdd7b07(_0x1fadd7) {
    _0x5a64be.push(_0x1fadd7);
  }
  async function _0x28012d() {
    const _0x2a3076 = {
        url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
        method: "GET",
        headers: {
          Accept: "application/json, text/plain",
          "accept-encoding": "gzip, deflate, br",
          "content-type": "application/json;charset=UTF-8",
          Cookie: _0x47fd14,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.42"
        },
        timeout: 30000
      },
      _0x195c6f = 3;
    let _0x4d73bb = 0;
    while (_0x4d73bb < _0x195c6f) {
      _0x4d73bb > 0 && (await $.wait(1000));
      const _0x4da919 = await common.request(_0x2a3076);
      if (_0x4da919.data) {
        let _0x29d709 = _0x4da919.data;
        if (_0x29d709.retcode === "0") {
          if (_0x29d709.data) {
            if (_0x29d709.data && _0x29d709.data.userInfo && _0x29d709.data.userInfo.baseInfo) {
              let _0x3f201f = _0x29d709.data.userInfo.baseInfo;
              _0xdd7b07("【账号名称】" + _0x3f201f.nickname);
              _0x29d709.data.userInfo.isPlusVip == 1 ? _0xdd7b07("【账号信息】PLUS会员，" + _0x3f201f.levelName + "，" + _0x3f201f.userLevel + "分") : _0xdd7b07("【账号信息】普通会员，" + _0x3f201f.levelName + "，" + _0x3f201f.userLevel + "分");
              _0xdd7b07("【当前京豆】" + _0x29d709.data.assetInfo.beanNum + "京豆");
            }
            if (_0x29d709.data && _0x29d709.data.assetInfo && _0x29d709.data.assetInfo.baitiaoInfo) {
              let _0x3a506e = _0x29d709.data.assetInfo.baitiaoInfo;
              if (_0x3a506e.baiTiaoStatus === "0") {
                let _0xc0d8f4 = parseFloat(_0x3a506e.availableLimit) || 0,
                  _0x18a17c = parseFloat(_0x3a506e.unpaidForAll) || 0,
                  _0x50621f = _0xc0d8f4 + _0x18a17c;
                _0xdd7b07("【白条余额】" + _0xc0d8f4.toFixed(2) + "元,【待还】" + _0x18a17c.toFixed(2) + "元,【总额度】" + _0x50621f.toFixed(2) + "元");
              }
            }
          }
        }
      }
      break;
    }
  }
  async function _0x1a9e17(_0xe68180 = 1) {
    params = {
      page: _0xe68180
    };
    const _0x3fed54 = {
        url: "https://bean.m.jd.com/beanDetail/detail.json",
        method: "GET",
        headers: {
          Accept: "application/json, text/plain",
          "accept-encoding": "gzip, deflate, br",
          "content-type": "application/json;charset=UTF-8",
          Cookie: _0x47fd14,
          "User-Agent": _0x254457
        },
        params: params,
        timeout: 30000
      },
      _0xb7ca0f = 3;
    let _0x33823e = 0;
    while (_0x33823e < _0xb7ca0f) {
      _0x33823e > 0 && (await $.wait(1000));
      const _0x3c363a = await common.request(_0x3fed54);
      if (_0x3c363a.data) {
        let _0x360b3f = _0x3c363a.data;
        if (_0x360b3f.code === "0" && _0x360b3f.success) {
          let _0x17c731 = _0x360b3f?.["jingDetailList"] || [],
            _0x920f42 = _0x17c731?.["length"] ? true : false;
          for (let _0x4bf3a0 of _0x17c731) {
            let _0x5c95ce = Number(_0x4bf3a0.amount),
              _0x50cee7 = new Date(_0x4bf3a0.date).getTime();
            if (_0x50cee7 < yesterday) {
              _0x920f42 = false;
            } else {
              if (_0x50cee7 < today) {
                _0x5c95ce >= 0 ? _0x4ebfb1.yesterday_in += _0x5c95ce : _0x4ebfb1.yesterday_out += _0x5c95ce;
              } else {
                if (_0x5c95ce >= 0) {
                  let _0x9c2d34 = _0x4bf3a0.eventMassage,
                    _0x3522d7 = _0x9c2d34?.["match"](/\[(.*)\]/);
                  _0x3522d7 && (_0x9c2d34 = _0x3522d7[1]);
                  if (_0x9c2d34?.["includes"]("退还京豆")) {
                    continue;
                  }
                  _0x4ebfb1.today_in += _0x5c95ce;
                  if (!_0x4ebfb1.detail[_0x9c2d34]) {
                    _0x4ebfb1.detail[_0x9c2d34] = 0;
                  }
                  _0x4ebfb1.detail[_0x9c2d34] += _0x5c95ce;
                } else {
                  _0x4ebfb1.today_out += _0x5c95ce;
                }
              }
            }
          }
          _0x920f42 ? await _0x1a9e17(_0xe68180 + 1) : (_0xdd7b07("【今日京豆】收入" + _0x4ebfb1.today_in + "京豆,支出" + _0x4ebfb1.today_out + "京豆"), _0xdd7b07("【昨日京豆】收入" + _0x4ebfb1.yesterday_in + "京豆,支出" + _0x4ebfb1.yesterday_out + "京豆"));
        }
      }
      break;
    }
  }
  async function _0x25d7e1() {
    params = {
      functionId: "walletBalance",
      body: JSON.stringify({
        walletFlag: 1,
        tenantCode: "jgm",
        bizModelCode: "6",
        bizModeClientType: "M",
        externalLoginType: "1"
      }),
      t: Date.now(),
      appid: "jd-cphdeveloper-m",
      client: "m",
      g_ty: "h5",
      g_tk: "",
      appCode: "ms0ca95114",
      loginType: "2",
      sceneval: "2"
    };
    const _0xe216b1 = {
        url: "https://api.m.jd.com/api",
        method: "GET",
        headers: {
          origin: "https://wqs.jd.com",
          referer: "https://wqs.jd.com/my/walletnum.html?sceneval=2&jxsid=17176804547450573894&appCode=ms0ca95114",
          "User-Agent": "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1",
          Cookie: _0x47fd14
        },
        params: params,
        timeout: 30000,
        httpsTlsOptions: common.useAppTls()
      },
      _0x490b43 = 3;
    let _0x3d84fe = 0;
    while (_0x3d84fe < _0x490b43) {
      _0x3d84fe > 0 && (await $.wait(1000));
      const _0x2db4b4 = await common.request(_0xe216b1);
      if (_0x2db4b4.data) {
        let _0x5bac9e = _0x2db4b4.data;
        _0x5bac9e.code === "0" && _0x5bac9e.result && _0xdd7b07("【京东钱包】" + _0x5bac9e.result.walletBalance + "元");
      }
      break;
    }
  }
  async function _0xb38f73() {
    body = await _0x265669();
    params = {
      appid: "h5-sep",
      functionId: "DATAWALLET_USER_SIGN_INFO",
      body: JSON.stringify(body),
      client: "m",
      clientVersion: "6.0.0"
    };
    const _0x16a790 = {
        url: "https://api.m.jd.com/api?functionId=DATAWALLET_USER_SIGN_INFO",
        method: "POST",
        headers: {
          Accept: "*/*",
          Cookie: _0x47fd14,
          Referer: "https://mypoint.jd.com/predeem/?sid=&un_area=4_50952_60426_0",
          Origin: "https://mypoint.jd.com",
          "User-Agent": _0x254457
        },
        params: params,
        timeout: 30000
      },
      _0x1dee7f = 3;
    let _0x274c9c = 0;
    while (_0x274c9c < _0x1dee7f) {
      _0x274c9c > 0 && (await $.wait(1000));
      const _0x583a86 = await common.request(_0x16a790);
      if (_0x583a86.data) {
        let _0x1888d4 = _0x583a86.data;
        if (_0x1888d4.code === 200) {
          if (_0x1888d4.data) {
            let _0x11ff22 = _0x1888d4.data.totalNum || 0,
              _0x4d5dad = "【话费积分】" + _0x11ff22;
            _0x11ff22 > 11.7 && (_0x4d5dad += "(可以兑换话费了)", _0x3bd101.push("【话费积分】" + _0x11ff22 + "(可以兑换话费了,app首页-充值中心)"));
            _0xdd7b07(_0x4d5dad);
          }
        }
      }
      break;
    }
  }
  async function _0x2f4f40() {
    let _0x4a98e0 = {
      appId: "42e80",
      functionId: "queryGiftCardCountStatusCom",
      appid: "mygiftcard",
      clientVersion: common.getLatestAppVersion(),
      client: "h5",
      body: {
        queryList: "a"
      },
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x23b3a1 = await H5st.getH5st(_0x4a98e0);
    let _0x49479b = _0x23b3a1.paramsData;
    const _0x402eaf = {
        url: "https://api.m.jd.com/api?functionId=queryGiftCardCountStatusCom",
        method: "POST",
        headers: {
          "User-Agent": _0x254457,
          origin: "https://mygiftcard.jd.com",
          referer: "https://mygiftcard.jd.com/giftcardForM.html?source=JDAP",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Cookie: _0x47fd14
        },
        body: _0x49479b,
        timeout: 30000
      },
      _0x2ed395 = 3;
    let _0x67c477 = 0;
    while (_0x67c477 < _0x2ed395) {
      _0x67c477 > 0 && (await $.wait(1000));
      const _0x30900d = await common.request(_0x402eaf);
      if (_0x30900d.data) {
        let _0x50276b = _0x30900d.data;
        _0x50276b.code === "success" && _0x50276b.data && _0xdd7b07("【礼品卡总额】" + _0x50276b.data.a + "元");
      }
      break;
    }
  }
  async function _0x5caac9() {
    let _0x2e4a1d = {
      appId: "60d61",
      functionId: "miniTask_hbChannelPage",
      appid: "hot_channel",
      clientVersion: "9.13.40",
      client: "apple",
      body: {},
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x3d542d = await H5st.getH5st(_0x2e4a1d);
    let _0x76b543 = _0x3d542d.paramsData;
    const _0x16da75 = {
        url: "https://api.m.jd.com/client.action",
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          Host: "api.m.jd.com",
          Connection: "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: _0x47fd14 + "wxapp_scene=1019; Domain=jd.com;",
          Referer: "https://servicewechat.com/wx91d27dbf599dff74/683/page-frame.html",
          "User-Agent": _0x254457
        },
        body: _0x76b543,
        timeout: 30000
      },
      _0xb17f56 = 3;
    let _0x2e4a87 = 0;
    while (_0x2e4a87 < _0xb17f56) {
      _0x2e4a87 > 0 && (await $.wait(1000));
      const _0x731ea5 = await common.request(_0x16da75);
      if (_0x731ea5.data) {
        let _0x4011b7 = _0x731ea5.data;
        if (_0x4011b7.code === 0 && _0x4011b7.subCode === 0) {
          if (_0x4011b7.data) {
            const _0x57d0a6 = _0x4011b7.data?.["point"] || 0,
              _0x2a145f = _0x57d0a6 ? _0x57d0a6 / 1000 : 0;
            _0xdd7b07("【小程序省钱币】" + _0x57d0a6 + "省钱币(约等于" + _0x2a145f.toFixed(2) + "元)");
          }
        }
      }
      break;
    }
  }
  async function _0x33c456() {
    let _0x148795 = {
      appId: "7478f",
      functionId: "queryJdCouponListAppletForJd",
      appid: "jd-cphdeveloper-m",
      body: {
        bizModelCode: "6",
        externalLoginType: 8,
        bizModeClientType: "M",
        appId: "m91d27dbf599dff74",
        token: "3852b12f8c4d869b7ed3e2b3c68c9436",
        tenantCode: "jgm",
        sourceType: "h5_inter_myjd_couponlist",
        state: 1,
        wxadd: 1,
        filterswitch: 1
      },
      version: "4.7",
      ua: "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1"
    };
    const _0x41c7ed = await H5st.getH5st(_0x148795);
    let _0x569139 = Object.assign({}, _0x41c7ed.paramsData);
    const _0x56464b = {
      _: Date.now(),
      sceneval: 2,
      g_login_type: 1,
      callback: "jsonpCBKD",
      g_tk: 2107090200,
      g_ty: "ls",
      appCode: "ms0ca95114"
    };
    _0x569139 && Object.assign(_0x569139, _0x56464b);
    const _0x3a4c57 = {
        url: "https://api.m.jd.com/api",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          Connection: "keep-alive",
          Cookie: _0x47fd14,
          Origin: "https://wqs.jd.com",
          Referer: "https://wqs.jd.com/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent": "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1"
        },
        params: _0x569139,
        timeout: 30000,
        httpsTlsOptions: common.useAppTls()
      },
      _0x2d29d2 = 3;
    let _0x11d249 = 0;
    while (_0x11d249 < _0x2d29d2) {
      _0x11d249 > 0 && (await $.wait(1000));
      const _0x4035dc = await common.request(_0x3a4c57);
      if (_0x4035dc.data) {
        let _0x154e6d = _0x4035dc.data;
        if (_0x154e6d.code === "0") {
          if (_0x154e6d.coupon) {
            let _0x14d975 = _0x154e6d.coupon.useable || [],
              _0x4ebc7f = parseInt(_0x154e6d.coupon.useable_count || 0);
            _0xdd7b07("【优惠券】" + _0x4ebc7f + "张");
            const _0x4217d6 = "东东@农场".split("@");
            let _0x4944ea = null,
              _0x36c225 = null,
              _0x28c0ec = 0;
            if (_0x14d975.length > 0) {
              _0x14d975.forEach(_0x326eef => {
                if (_0x326eef.hasOwnProperty("couponTitle") && _0x326eef.couponTitle !== undefined) {
                  if (_0x4217d6.some(_0x3be7f8 => _0x326eef.couponTitle.includes(_0x3be7f8))) {
                    const _0x212d93 = new Date(Number(_0x326eef.endTime));
                    (!_0x4944ea || _0x212d93 < _0x4944ea) && (_0x4944ea = _0x212d93, _0x36c225 = _0x326eef);
                    _0x28c0ec++;
                  }
                }
              });
              if (_0x28c0ec >= 1) {
                const _0x3e34ae = _0x4944ea.toLocaleString();
                _0xdd7b07("【新农场实物券】" + _0x28c0ec + "张(过期时间[" + _0x3e34ae + "])");
                _0x3bd101.push("【新农场实物券】" + _0x28c0ec + "张(过期时间[" + _0x3e34ae + "])");
              }
            }
          }
        }
      }
      break;
    }
  }
  async function _0x402370() {
    let _0x32f5fb = {
      appId: "aace2",
      functionId: "atop_channel_my_score",
      appid: "jd-super-market",
      client: "m",
      body: {
        bizCode: "cn_retail_jdsupermarket",
        scenario: "sign",
        babelChannel: "ttt1",
        isJdApp: "1",
        isWx: "0"
      },
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x3061ee = await H5st.getH5st(_0x32f5fb);
    let _0x35587e = _0x3061ee.paramsData;
    const _0x14cade = {
        url: "https://api.m.jd.com/",
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: _0x47fd14,
          "X-Requested-With": "XMLHttpRequest",
          Referer: "https://pro.m.jd.com/mall/active/3nh7HzSjYemGqAHSbktTrf8rrH8M/index.html",
          "X-Referer-Page": "https://pro.m.jd.com/mall/active/3nh7HzSjYemGqAHSbktTrf8rrH8M/index.html",
          Origin: "https://pro.m.jd.com",
          "x-rp-client": "h5_1.0.0",
          "User-Agent": _0x254457
        },
        body: _0x35587e,
        timeout: 30000
      },
      _0x501590 = 3;
    let _0x5a46c8 = 0;
    while (_0x5a46c8 < _0x501590) {
      _0x5a46c8 > 0 && (await $.wait(1000));
      const _0x15f6c6 = await common.request(_0x14cade);
      if (_0x15f6c6.data) {
        let _0x4373e1 = _0x15f6c6.data;
        if (_0x4373e1.code === "0" && _0x4373e1.success) {
          if (_0x4373e1.data && _0x4373e1.data.floorData && _0x4373e1.data.floorData.items) {
            let _0x46e32f = "【汪贝余额】" + _0x4373e1.data.floorData.items[0].restScore + "汪贝";
            _0x4373e1.data.floorData.items[0] && _0x4373e1.data.floorData.items[0].nexp && _0x4373e1.data.floorData.items[0].nexp > 0 && (_0x46e32f += "(7日内过期" + _0x4373e1.data.floorData.items[0].nexp + ")", _0x3bd101.push("【汪贝余额】" + _0x4373e1.data.floorData.items[0].restScore + "汪贝(7日内过期" + _0x4373e1.data.floorData.items[0].nexp + ")"));
            _0xdd7b07(_0x46e32f);
          }
        }
      }
      break;
    }
  }
  async function _0x1c54cd() {
    let _0x454d89 = {
      appId: "c57f6",
      functionId: "farm_home",
      appid: "signed_wh5",
      clientVersion: common.getLatestAppVersion(),
      client: "apple",
      body: {
        version: 3
      },
      version: "4.2",
      ua: _0x254457,
      t: true
    };
    const _0x87e81b = await H5st.getH5st(_0x454d89);
    let _0x35477a = _0x87e81b.paramsData;
    const _0x55d8e2 = {
        url: "https://api.m.jd.com/client.action",
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          Connection: "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: _0x47fd14,
          Host: "api.m.jd.com",
          Referer: "https://h5.m.jd.com/",
          "X-Referer-Page": "https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html",
          Origin: "https://h5.m.jd.com",
          "x-rp-client": "h5_1.0.0",
          "User-Agent": _0x254457
        },
        body: _0x35477a,
        timeout: 30000
      },
      _0x4db70a = 3;
    let _0x449723 = 0;
    while (_0x449723 < _0x4db70a) {
      _0x449723 > 0 && (await $.wait(1000));
      const _0x583a7c = await common.request(_0x55d8e2);
      if (_0x583a7c.data) {
        let _0x30b2dc = _0x583a7c.data;
        if (_0x30b2dc.code === 0 && _0x30b2dc.data) {
          if (_0x30b2dc.data.bizCode === 0) {
            const _0x52126f = _0x30b2dc.data?.result?.["treeCurrentState"] || 0;
            if (_0x52126f === 0) {
              const _0x3f23d5 = _0x30b2dc.data?.["result"]?.["treeFullStage"],
                _0x368d4f = _0x30b2dc.data?.["result"]?.["bottleWater"],
                _0x379cbe = _0x30b2dc.data?.["result"]?.["waterTips"] || "",
                _0x1c32de = _0x30b2dc.data?.["result"]?.["treeLevel"] || 0,
                _0x566d89 = _0x30b2dc.data?.["result"]?.["skuName"];
              switch (_0x3f23d5) {
                case 0:
                  _0xdd7b07("【新东东农场】未种植作物");
                  break;
                case 1:
                case 2:
                case 3:
                case 4:
                  let _0x1cde5b = "",
                    _0x9c2c12 = _0x379cbe.match(/\d+(\.\d+)?%/);
                  _0x9c2c12 && (_0x1cde5b = _0x9c2c12[0]);
                  let _0x466478 = "【新东东农场】[等级" + _0x1c32de + "][水滴" + _0x368d4f + "]";
                  if (_0x9c2c12) {
                    _0x1cde5b = parseFloat(_0x9c2c12[0].replace("%", "")) / 100;
                    let _0x3c8325 = 1 - _0x1cde5b;
                    _0x1cde5b = (_0x3c8325 * 100).toFixed(2) + "%";
                    _0x466478 += ",进度[" + _0x1cde5b + "]";
                  }
                  _0xdd7b07(_0x466478);
                  break;
                case 5:
                  _0xdd7b07("【新东东农场】" + _0x566d89 + "成熟了");
                  break;
              }
            } else {
              _0xdd7b07("【新东东农场】超过14天未浇水，果树已经枯萎了");
            }
          } else {
            _0xdd7b07("【新东东农场】活动火爆");
          }
        } else {
          _0xdd7b07("【新东东农场】活动火爆");
        }
      }
      break;
    }
  }
  async function _0x3ba648() {
    let _0x5ed45f = {
      appId: "8a2af",
      functionId: "initForFarm",
      appid: "signed_wh5",
      clientVersion: common.getLatestAppVersion(),
      client: "apple",
      body: {
        version: 3
      },
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x23e0dd = await H5st.getH5st(_0x5ed45f);
    let _0x1153a4 = _0x23e0dd.paramsData;
    const _0x319e2d = {
        url: "https://api.m.jd.com/client.action",
        method: "POST",
        headers: {
          Host: "api.m.jd.com",
          Accept: "*/*",
          Origin: "https://carry.m.jd.com",
          "Accept-Encoding": "gzip,deflate,br",
          "User-Agent": _0x254457,
          "Accept-Language": "zh-CN,zh-Hans;q=0.9",
          Referer: "https://carry.m.jd.com/",
          "x-requested-with": "com.jingdong.app.mall",
          Cookie: _0x47fd14
        },
        body: _0x1153a4,
        timeout: 30000
      },
      _0x4956a3 = 3;
    let _0x53e989 = 0;
    while (_0x53e989 < _0x4956a3) {
      _0x53e989 > 0 && (await $.wait(1000));
      const _0x79ff72 = await common.request(_0x319e2d);
      if (_0x79ff72.data) {
        let _0xa3dc1b = _0x79ff72.data;
        if (_0xa3dc1b.code === "0") {
          if (_0xa3dc1b.farmUserPro) {
            const _0x3b9317 = _0xa3dc1b.farmUserPro.treeState || 0;
            switch (_0x3b9317) {
              case 0:
                _0xdd7b07("【东东农场】未种植作物");
                break;
              case 1:
                _0xdd7b07("【东东农场】[等级" + _0xa3dc1b.farmUserPro.prizeLevel + "][水滴" + _0xa3dc1b.farmUserPro.totalEnergy + "],进度[" + (_0xa3dc1b.farmUserPro?.treeEnergy / _0xa3dc1b.farmUserPro?.treeTotalEnergy * 100).toFixed(2) + "%],已浇水" + _0xa3dc1b.farmUserPro?.["treeEnergy"] / 10 + "次,还需" + (_0xa3dc1b.farmUserPro?.["treeTotalEnergy"] - _0xa3dc1b.farmUserPro?.["treeEnergy"]) / 10 + "次");
                break;
              case 2:
              case 3:
                _0xdd7b07("【东东农场】[" + _0xa3dc1b.farmUserPro.name + "]成熟了");
                _0x3bd101.push("【东东农场】[" + _0xa3dc1b.farmUserPro.name + "]成熟了，快去兑换奖品吧~");
                break;
            }
          } else {
            _0xdd7b07("【东东农场】活动火爆");
          }
        } else {
          _0xdd7b07("【东东农场】活动火爆");
        }
      }
      break;
    }
  }
  async function _0x393ad9() {
    let _0x1c3bb4 = {
      appId: "d246a",
      functionId: "plantBeanIndex",
      appid: "signed_wh5",
      clientVersion: common.getLatestAppVersion(),
      client: "apple",
      body: {
        monitor_source: "plant_m_plant_index",
        monitor_refer: "",
        version: "9.2.4.3"
      },
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x2054da = await H5st.getH5st(_0x1c3bb4);
    params = Object.assign({}, _0x2054da.paramsData, {
      osVersion: common.getLatestIOSVersion(),
      uuid: "8fb67fe0ef2e13e4fb6f7420acd15ef066583a87",
      openudid: "8fb67fe0ef2e13e4fb6f7420acd15ef066583a87",
      d_brand: "iPhone",
      d_model: "iPhone11,8",
      uemps: "0-2-999",
      ext: {
        prstate: "0"
      },
      jsonp: "jsonp_" + Date.now() + "_84280"
    });
    const _0x221ec9 = {
        url: "https://api.m.jd.com/client.action",
        method: "GET",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip,deflate,br",
          "User-Agent": _0x254457,
          "Accept-Language": "zh-CN,zh-Hans;q=0.9",
          Referer: "https://plantearth.m.jd.com/plantBean/index?source=lingjingdouqiandaorili&sid=4638f2f389065566747fbdb06702d79w&un_area=4_133_58530_0",
          Cookie: _0x47fd14
        },
        params: params,
        timeout: 30000
      },
      _0xa61754 = 3;
    let _0x4b282d = 0;
    while (_0x4b282d < _0xa61754) {
      _0x4b282d > 0 && (await $.wait(1000));
      const _0x2d1e19 = await common.request(_0x221ec9);
      if (_0x2d1e19.data) {
        let _0x28d112 = _0x2d1e19.data;
        if (_0x28d112.code === "0") {
          const _0x1022f0 = _0x28d112.data?.["roundList"] || [];
          let _0x3c369d = "";
          _0x1022f0.forEach(_0x46efc0 => {
            const {
              growth: _0x203a53,
              dateDesc: _0x385eec
            } = _0x46efc0;
            if (_0x385eec.includes("本期")) {
              const _0x4d579e = _0x385eec.replace("本期", "");
              _0x3c369d += "本期成长值: " + _0x203a53 + "(" + _0x4d579e.trim() + "); ";
            }
          });
          _0x3c369d && _0xdd7b07("【种豆得豆】" + _0x3c369d.slice(0, -2));
        } else {
          _0xdd7b07("【种豆得豆】活动火爆");
        }
      }
      break;
    }
  }
  async function _0x1083ff() {
    let _0x51d3b9 = {
      appId: "c81ad",
      functionId: "wanyiwan_home",
      appid: "signed_wh5",
      clientVersion: common.getLatestAppVersion(),
      client: "apple",
      body: {
        outsite: 0,
        firstCall: 0,
        version: 1,
        lbsSwitch: false
      },
      version: "4.7",
      ua: _0x254457,
      t: true,
      bu1: "lite_0.1.5",
      tokenCache: false
    };
    const _0x485217 = await H5st.getH5st(_0x51d3b9);
    let _0x36d54d = _0x485217.paramsData;
    const _0x6b1727 = {
        url: "https://api.m.jd.com/client.action",
        method: "POST",
        headers: {
          origin: "https://prodev.m.jd.com",
          Referer: "https://pro.m.jd.com/mall/active/3fcyrvLZALNPWCEDRvaZJVrzek8v/index.html",
          "User-Agent": _0x254457,
          Cookie: _0x47fd14,
          "content-type": "application/x-www-form-urlencoded",
          accept: "application/json, text/plain, */*",
          "x-rp-client": "h5_1.0.0"
        },
        body: _0x36d54d,
        timeout: 30000
      },
      _0x1a6333 = 3;
    let _0x538c34 = 0;
    while (_0x538c34 < _0x1a6333) {
      _0x538c34 > 0 && (await $.wait(1000));
      const _0x1a336a = await common.request(_0x6b1727);
      if (_0x1a336a.data) {
        let _0x17b2a4 = _0x1a336a.data;
        if (_0x17b2a4.code === 0 && _0x17b2a4.data) {
          if (_0x17b2a4.data.bizCode === 0) {
            const _0x493e33 = _0x17b2a4.data.result?.score || 0;
            _0xdd7b07("【玩一玩奖票】" + _0x493e33 + "奖票");
          } else {
            _0xdd7b07("【玩一玩奖票】活动火爆");
          }
        }
      }
      break;
    }
  }
  async function _0x4eae23() {
    let _0x3457d4 = {
      appId: "35fa0",
      functionId: "atop_channel_marketCard_cardInfo",
      appid: "jd-super-market",
      clientVersion: common.getLatestAppVersion(),
      client: "m",
      body: {
        babelChannel: "ttt9",
        isJdApp: "1",
        isWx: "0"
      },
      version: "4.7",
      ua: _0x254457,
      t: true
    };
    const _0x1ba491 = await H5st.getH5st(_0x3457d4);
    let _0x39b176 = _0x1ba491.paramsData;
    const _0x506d81 = {
        url: "https://api.m.jd.com/atop_channel_marketCard_cardInfo",
        method: "POST",
        headers: {
          "User-Agent": _0x254457,
          origin: "https://pro.m.jd.com",
          referer: "https://pro.m.jd.com/mall/active/3KehY4eAj3D1iLzFB7p5pb68qXkT/index.html",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Cookie: _0x47fd14,
          "x-rp-client": "h5_1.0.0"
        },
        body: _0x39b176,
        timeout: 30000
      },
      _0x92d0e2 = 3;
    let _0x2924c3 = 0;
    while (_0x2924c3 < _0x92d0e2) {
      _0x2924c3 > 0 && (await $.wait(1000));
      const _0x2a336f = await common.request(_0x506d81);
      if (_0x2a336f.data) {
        let _0x371908 = _0x2a336f.data;
        if (_0x371908.code === "0" && _0x371908.success) {
          if (_0x371908.data) {
            let _0x2276be = _0x371908?.["data"]?.["floorData"]?.items || [];
            for (let _0xbf7cf3 of _0x2276be) {
              if (_0xbf7cf3?.["marketCardVO"]) {
                let {
                    expirationGiftAmountDes = "",
                    balance: _0xc5e53c
                  } = _0xbf7cf3.marketCardVO,
                  _0x29495e = "【超市卡总额】" + _0xc5e53c + "元";
                expirationGiftAmountDes && (_0x29495e += "(" + expirationGiftAmountDes + ")", _0x3bd101.push("【超市卡总额】" + _0xc5e53c + "元(" + expirationGiftAmountDes + ")"));
                _0xdd7b07(_0x29495e);
              }
            }
          }
        }
      }
      break;
    }
  }
  async function _0x408b6f() {
    signParams = {
      pageIndex: 1,
      pageSize: "10",
      planType: "1",
      status: 1
    };
    params = {
      functionId: "getCommentWareList"
    };
    const _0x4713aa = {
        url: "https://api.m.jd.com/client.action",
        method: "POST",
        headers: {
          Host: "api.m.jd.com",
          accept: "*/*",
          "user-agent": "okhttp/3.12.16;jdmall;android;version/12.2.2;build/168923;",
          "accept-language": "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
          Cookie: _0x47fd14
        },
        params: params,
        data: common.queryStringToObject(await common.getSign("getCommentWareList", signParams)),
        timeout: 30000
      },
      _0x30fd16 = 3;
    let _0x133f59 = 0;
    while (_0x133f59 < _0x30fd16) {
      _0x133f59 > 0 && (await $.wait(1000));
      const _0x33d8ec = await common.request(_0x4713aa);
      if (_0x33d8ec.data) {
        let _0x5e8c34 = _0x33d8ec.data;
        if (_0x5e8c34.code === "0") {
          let _0x517bf4 = _0x5e8c34.commentWareListInfo,
            _0x2d67e5 = _0x517bf4.wait4CommentCount || 0,
            _0x314ad7 = _0x517bf4.commentFinishedCount || 0;
          _0xdd7b07("【订单评价】已评价[" + _0x314ad7 + "]，未评价[" + _0x2d67e5 + "]");
        }
      }
      break;
    }
  }
  async function _0x38a14b() {
    signParams = {
      pageSize: "20",
      page: "1"
    };
    const _0x486fb2 = {
        url: "https://api.m.jd.com/client.action?functionId=jingBeanDetail",
        method: "POST",
        headers: {
          "User-Agent": _0x254457,
          Host: "api.m.jd.com",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: _0x47fd14
        },
        body: common.queryStringToObject(await common.getSign("jingBeanDetail", signParams)),
        timeout: 30000
      },
      _0x41615b = 3;
    let _0x2a9046 = 0;
    while (_0x2a9046 < _0x41615b) {
      _0x2a9046 > 0 && (await $.wait(1000));
      const _0xda5283 = await common.request(_0x486fb2);
      if (_0xda5283.data) {
        let _0x2dc6ae = _0xda5283.data;
        if (_0x2dc6ae.code === 0) {
          if (_0x2dc6ae.others && _0x2dc6ae.others.jingBeanExpiringInfo) {
            if (_0x2dc6ae.others.jingBeanExpiringInfo && Array.isArray(_0x2dc6ae.others.jingBeanExpiringInfo.detailList) && _0x2dc6ae.others.jingBeanExpiringInfo.detailList.length > 0) {
              let _0xef50cc = _0x2dc6ae.others.jingBeanExpiringInfo.detailList.reduce((_0x2e35ba, _0x28df9c) => _0x2e35ba + parseInt(_0x28df9c.amount), 0);
              _0xdd7b07("【过期京豆】(7日内过期" + _0xef50cc + "京豆):");
              _0x3bd101.push("【过期京豆】(7日内过期" + _0xef50cc + "京豆)");
              _0x2dc6ae.others.jingBeanExpiringInfo.detailList.forEach(_0x731f69 => {
                _0xdd7b07(" " + _0x731f69.eventMassage + "[" + _0x731f69.amount + "京豆]");
              });
            }
          }
        }
      }
      break;
    }
  }
  async function _0x5bae70() {
    signParams = {
      fp: "-1",
      appToken: "apphongbao_token",
      childActivityUrl: "-1",
      country: "cn",
      openId: "-1",
      childActivityId: "-1",
      applicantErp: "-1",
      platformId: "appHongBao",
      isRvc: "-1",
      orgType: "2",
      activityType: "1",
      shshshfpb: "-1",
      platformToken: "apphongbao_token",
      organization: "JD",
      pageClickKey: "-1",
      platform: "1",
      eid: "-1",
      appId: "appHongBao",
      childActiveName: "-1",
      shshshfp: "-1",
      jda: "-1",
      extend: "-1",
      shshshfpa: "-1",
      activityArea: "-1",
      childActivityTime: "-1"
    };
    const _0x147919 = {
        url: "https://api.m.jd.com/client.action?functionId=myhongbao_getUsableHongBaoList",
        method: "POST",
        headers: {
          "User-Agent": _0x254457,
          Host: "api.m.jd.com",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: _0x47fd14
        },
        body: common.queryStringToObject(await common.getSign("myhongbao_getUsableHongBaoList", signParams)),
        timeout: 30000
      },
      _0x4cf89a = 3;
    let _0x56eac5 = 0;
    while (_0x56eac5 < _0x4cf89a) {
      _0x56eac5 > 0 && (await $.wait(1000));
      const _0x274421 = await common.request(_0x147919);
      if (_0x274421.data) {
        let _0x256863 = _0x274421.data;
        if (_0x256863.resultCode === 200 && _0x256863.success) {
          _0x8bad30 = _0x256863?.count || 0;
          for (let _0x175068 of _0x256863?.["hongBaoList"] || []) {
            let _0x2f2df0 = parseInt(_0x175068.balance * 100),
              _0x236bf7 = "";
            if (_0x175068?.["orgLimitStr"]?.["includes"]("京东商城")) {
              _0x236bf7 = "jdapp";
            } else {
              if (_0x175068?.orgLimitStr?.includes("京东购物小程序")) {
                _0x236bf7 = "minip";
              } else {
                _0x175068?.orgLimitStr?.["includes"]("特价") && (_0x236bf7 = "lite");
              }
            }
            let _0x30ff6b = KEY_TOTAL;
            if (_0x175068.endTime < tomorrow) {
              _0x30ff6b = KEY_TOMORROW;
            } else {
              _0x175068.endTime < dayAfterTomorrow && (_0x30ff6b = KEY_DAY_AFTER_TOMORROW);
            }
            _0x372de0.total[KEY_TOTAL] += _0x2f2df0;
            _0x236bf7 ? _0x372de0[_0x236bf7][KEY_TOTAL] += _0x2f2df0 : _0x372de0.common[KEY_TOTAL] += _0x2f2df0;
            _0x30ff6b > KEY_TOTAL && (_0x372de0.total[_0x30ff6b] += _0x2f2df0, _0x236bf7 ? _0x372de0[_0x236bf7][_0x30ff6b] += _0x2f2df0 : _0x372de0.common[_0x30ff6b] += _0x2f2df0);
          }
          for (let _0x3b3a23 in _0x372de0) {
            for (let _0x8c2524 = 0; _0x8c2524 < _0x372de0[_0x3b3a23].length; _0x8c2524++) {
              _0x372de0[_0x3b3a23][_0x8c2524] = Number(_0x372de0[_0x3b3a23][_0x8c2524] / 100).toFixed(2);
            }
          }
          await _0x1546fe();
        }
      }
      break;
    }
  }
  async function _0x1546fe() {
    _0xdd7b07("【总红包数量】[" + _0x372de0.total[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.total[KEY_TOMORROW] + "],【明晚过期】[" + _0x372de0.total[KEY_DAY_AFTER_TOMORROW] + "]");
    _0x3bd101.push("【总红包数量】[" + _0x372de0.total[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.total[KEY_TOMORROW] + "]");
    _0x372de0.common[0] && _0xdd7b07("【通用总红包】[" + _0x372de0.common[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.common[KEY_TOMORROW] + "],【明晚过期】[" + _0x372de0.common[KEY_DAY_AFTER_TOMORROW] + "]");
    _0x372de0.jdapp[0] && _0xdd7b07("【商城总红包】[" + _0x372de0.jdapp[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.jdapp[KEY_TOMORROW] + "],【明晚过期】[" + _0x372de0.jdapp[KEY_DAY_AFTER_TOMORROW] + "]");
    _0x372de0.lite[0] && _0xdd7b07("【特价版红包】[" + _0x372de0.lite[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.lite[KEY_TOMORROW] + "],【明晚过期】[" + _0x372de0.lite[KEY_DAY_AFTER_TOMORROW] + "]");
    _0x372de0.minip[0] && _0xdd7b07("【小程序红包】[" + _0x372de0.minip[KEY_TOTAL] + "],【今晚过期】[" + _0x372de0.minip[KEY_TOMORROW] + "],【明晚过期】[" + _0x372de0.minip[KEY_DAY_AFTER_TOMORROW] + "]");
  }
  async function _0x265669(_0x447bbb) {
    time = new Date().getTime();
    let _0x379e79 = _0x447bbb || "";
    const _0x48cdd7 = time + "e9c398ffcb2d4824b4d0a703e38yffdd";
    _0x379e79 = cryptoJS.MD5(_0x379e79 + _0x48cdd7).toString();
    return {
      t: time,
      encStr: _0x379e79
    };
  }
}
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      "POST" === e && (s = this.post);
      return new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s);
        });
      });
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t;
      this.http = new s(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `🔔${this.name}, 开始!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) {
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      }
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20;
        r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: r
            },
            headers: {
              "X-Key": o,
              Accept: "*/*"
            }
          };
        this.post(n, (t, e, i) => s(i));
      }).catch(t => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) {
          return {};
        }
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) {
        return s;
      }
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r) {
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
        }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t);
          s = this.setval(JSON.stringify(e), i);
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t);
          s = this.setval(JSON.stringify(o), i);
        }
      } else {
        s = this.setval(t, e);
      }
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status);
        e(t, s, i);
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null);
            e.cookieJar = this.ckjar;
          }
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body);
      }));
    }
    post(t, e = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status);
          e(t, s, i);
        });
      } else {
        if (this.isQuanX()) {
          t.method = "POST";
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: !1
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: r,
              body: o
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: r,
              body: o
            }, o);
          }, t => e(t));
        } else {
          if (this.isNode()) {
            this.initGotEnv(t);
            const {
              url: s,
              ...i
            } = t;
            this.got.post(s, i).then(t => {
              const {
                statusCode: s,
                statusCode: i,
                headers: r,
                body: o
              } = t;
              e(null, {
                status: s,
                statusCode: i,
                headers: r,
                body: o
              }, o);
            }, t => {
              const {
                message: s,
                response: i
              } = t;
              e(s, i, i && i.body);
            });
          }
        }
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t;
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) {
          return t;
        }
        if ("string" == typeof t) {
          return this.isLoon() ? t : this.isQuanX() ? {
            "open-url": t
          } : this.isSurge() ? {
            url: t
          } : void 0;
        }
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e);
        s && t.push(s);
        i && t.push(i);
        console.log(t.join("\n"));
        this.logs = this.logs.concat(t);
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]);
      console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`);
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  }(t, e);
}