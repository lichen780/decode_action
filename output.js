//Sat Aug 17 2024 10:28:34 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const _0x2e48f4 = require("./function/dylanv"),
  _0x16ca3a = require("./function/dylans");
async function getuserinfo_6dy() {
  let _0x42f975 = {
    "url": "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
    "headers": {
      "Accept": "application/json, text/plain",
      "accept-encoding": "gzip, deflate, br",
      "content-type": "application/json;charset=UTF-8",
      "Cookie": cookie,
      "User-Agent": $.UA
    }
  };
  return new Promise(_0x366252 => {
    $.get(_0x42f975, async (_0xda6e19, _0x864ac4, _0x2e7d27) => {
      try {
        if (_0xda6e19) {
          console.log("" + JSON.stringify(_0xda6e19));
          console.log("getuserinfo_6dy请求失败，请检查网路重试");
        } else {
          if (_0x2e7d27) {
            _0x2e7d27 = JSON.parse(_0x2e7d27);
            if (_0x2e7d27.retcode === "1001") {
              $.isLogin = false;
              return;
            }
            if (_0x2e7d27.retcode === "0" && _0x2e7d27.data) {
              $.levelName = _0x2e7d27.data?.["userInfo"]?.["baseInfo"]?.["levelName"];
              $.isPlusVip = _0x2e7d27.data?.["userInfo"]?.["isPlusVip"] == 1;
              $.nickName = $.UserName;
              $.isRealNameAuth = _0x2e7d27.data?.["userInfo"]?.["isRealNameAuth"] || "";
              $.beanCount = _0x2e7d27.data?.["assetInfo"]?.["beanNum"] || 0;
            }
          } else $.log("京东服务器返回空数据");
        }
      } catch (_0x59b8d0) {
        $.logErr(_0x59b8d0, _0x864ac4);
      } finally {
        _0x366252();
      }
    });
  });
}
async function _0x4abefe() {
  let _0x52ba66 = {
    "url": "http://api.m.jd.com/client.action",
    "body": "functionId=pg_channel_page_data&appid=vipChannelHome&uuid=&t=" + Date.now() + "&loginType=2&loginWQBiz=huiyuan&body=%7B%22v%22%3A%2215.6%22%2C%22paramData%22%3A%7B%22token%22%3A%22a243ca12-6642-4754-bc5e-0ff012681710%22%2C%22lid%22%3A%22Gv8zAj0mnx9iiLgIWfwBEA%3D%3D%22%2C%22priceChannel%22%3A5%2C%22device%22%3A2%7D%2C%22argMap%22%3A%7B%22channel%22%3A%22miniProgram%22%2C%22upstreamChannel%22%3A%22xcx%22%2C%22taskEncId%22%3A%22%22%7D%7D",
    "headers": {
      "Cookie": cookie,
      "User-Agent": $.UA,
      "Origin": "https://huiyuan.m.jd.com",
      "Referer": "https://huiyuan.m.jd.com/"
    }
  };
  return new Promise(_0x439bd0 => {
    $.post(_0x52ba66, async (_0x14b1d5, _0x121b8b, _0xfca4f) => {
      try {
        _0x14b1d5 ? (console.log("" + JSON.stringify(_0x14b1d5)), console.log("getuserinfo_6dy请求失败，请检查网路重试")) : ($.JingXiang = _0xfca4f.match(/"score":(\d+)/) ? _0xfca4f.match(/"score":(\d+)/)[1] : 0, $.beanCount = _0xfca4f.match(/"currentBeanNum":(\d+)/) ? _0xfca4f.match(/"currentBeanNum":(\d+)/)[1] : 0, $.nickName = _0xfca4f.match(/"showName":"(.*?)"/) ? _0xfca4f.match(/"showName":"(.*?)"/)[1] : $.UserName);
      } catch (_0x161645) {
        $.logErr(_0x161645, _0x121b8b);
      } finally {
        _0x439bd0();
      }
    });
  });
}
async function queryScores() {
  let _0x23a607 = {
    "appId": "b63ff",
    "functionId": "windControl_queryScore_v1",
    "body": {},
    "appid": "plus_business",
    "user": $.UserName,
    "code": 0,
    "ua": $.UA
  };
  body = await _0x16ca3a.getbody(_0x23a607);
  let _0x1c120b = {
    "url": "https://api.m.jd.com/api?" + body + "&loginType=2&loginWQBiz=",
    "headers": {
      "Cookie": cookie,
      "User-Agent": $.UA,
      "Referer": "https://plus.m.jd.com/rights/windControl"
    }
  };
  return new Promise(_0x893d23 => {
    $.post(_0x1c120b, async (_0x59697b, _0x27beeb, _0x197f84) => {
      try {
        const _0x3062cf = JSON.parse(_0x197f84);
        _0x3062cf.code == 1000 && ($.PlustotalScore = _0x3062cf.rs.userSynthesizeScore.totalScore);
      } catch (_0x374719) {
        $.logErr(_0x374719, _0x27beeb);
      } finally {
        _0x893d23();
      }
    });
  });
}
async function fruitinfo() {
  return new Promise(_0x577a3d => {
    const _0x123d29 = {
      "url": "https://api.m.jd.com?functionId=gotNewUserTaskForFarm",
      "body": "body=" + encodeURIComponent(JSON.stringify({
        "version": 24,
        "channel": 1,
        "babelChannel": "121",
        "lat": "0",
        "lng": "0"
      })) + "&appid=wh5",
      "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://carry.m.jd.com/",
        "referer": "https://carry.m.jd.com/",
        "User-Agent": $.UA,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "timeout": 10000
    };
    $.post(_0x123d29, (_0x54b2a0, _0x52fe81, _0x53c570) => {
      try {
        if (_0x54b2a0) !llgeterror && (console.log("\n东东农场: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(_0x54b2a0))), llgeterror = true;else {
          llgeterror = false;
          if (safeGet(_0x53c570)) {
            $.farmInfo = JSON.parse(_0x53c570);
            if ($.farmInfo.farmUserPro) {
              $.JdFarmProdName = $.farmInfo.farmUserPro.name;
              $.JdtreeEnergy = $.farmInfo.farmUserPro.treeEnergy;
              $.JdtreeTotalEnergy = $.farmInfo.farmUserPro.treeTotalEnergy;
              $.treeState = $.farmInfo.farmUserPro.treeState;
            }
          }
        }
      } catch (_0x1017ca) {
        $.logErr(_0x1017ca, _0x52fe81);
      } finally {
        _0x577a3d();
      }
    });
  });
}
async function fruitnew(_0x394da0 = 500) {
  let _0x26629f = {
      "version": 1
    },
    _0x199ba2 = {
      "appId": "c57f6",
      "fn": "farm_home",
      "body": _0x26629f,
      "apid": "signed_wh5",
      "ver": $.UA.split(";")[2],
      "cl": "ios",
      "user": $.UserName,
      "code": 1,
      "ua": $.UA
    };
  _0x26629f = await _0x2e48f4.getbody(_0x199ba2);
  let _0x571dcc = {
    "url": JD_API_HOST + "?" + _0x26629f,
    "headers": {
      "Host": "api.m.jd.com",
      "Accept": "*/*",
      "Origin": "https://h5.m.jd.com",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": $.UA,
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "Referer": "https://h5.m.jd.com/",
      "Cookie": cookie
    },
    "timeout": 30000
  };
  return new Promise(_0x3a6734 => {
    setTimeout(() => {
      $.get(_0x571dcc, (_0x178502, _0x23ab9d, _0x498ffa) => {
        try {
          _0x178502 ? (console.log("新农场查询失败"), $.logErr(_0x178502)) : (_0x498ffa = JSON.parse(_0x498ffa), $.fruitnewinfo = _0x498ffa.data?.["result"] || "");
        } catch (_0x4dcea3) {
          $.logErr(_0x4dcea3, _0x23ab9d);
        } finally {
          _0x3a6734(_0x498ffa);
        }
      });
    }, _0x394da0);
  });
}
async function checkplus() {
  let _0x10cc4f = {
      "contentType": "1_2_3_4_5_6_8_9_11_12",
      "qids": "1_6_7_9",
      "checkLevel": 1
    },
    _0x5de7ee = {
      "appId": "b63ff",
      "functionId": "user_getUserInfo_v2",
      "body": _0x10cc4f,
      "appid": "plus_business",
      "user": $.UserName,
      "code": 1,
      "ua": $.UA
    };
  _0x10cc4f = await _0x16ca3a.getbody(_0x5de7ee);
  let _0x42eb51 = {
    "url": "https://api.m.jd.com/api?functionId=user_getUserInfo_v2",
    "body": _0x10cc4f,
    "headers": {
      "User-Agent": $.UA,
      "Cookie": cookie,
      "Origin": "https://plus.m.jd.com",
      "Referer": "https://plus.m.jd.com/"
    }
  };
  return new Promise(async _0x4187b6 => {
    $.post(_0x42eb51, async (_0x3b1b0c, _0xb31c02, _0x32028a) => {
      try {
        if (_0x3b1b0c) console.log("" + JSON.stringify(_0x3b1b0c)), console.log(" API请求失败，请检查网路重试");else {
          _0x32028a = JSON.parse(_0x32028a);
          if (_0x32028a.code == 1711000) $.isPlusVip = _0x32028a.rs.plusUserBaseInfo.endDays ? true : false;else {}
        }
      } catch (_0x1d25e2) {
        $.logErr(_0x1d25e2, _0xb31c02);
      } finally {
        _0x4187b6();
      }
    });
  });
}