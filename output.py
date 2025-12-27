#2025-12-27 15:45:44
import requests
import json
import traceback
import os
import time
import random
class Console:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"

    @staticmethod
    def _print(prefix: str, text: str, color: str):
        try:
            print(f"{color}{prefix}{Console.RESET} {text}")
        except Exception:
            print(f"{prefix} {text}")

    @staticmethod
    def title(text: str):
        try:
            print(f"{Console.BLUE}{Console.BOLD}== {text} =={Console.RESET}")
        except Exception:
            print(f"== {text} ==")

    @staticmethod
    def info(text: str):
        Console._print("[信息]", text, Console.CYAN)

    @staticmethod
    def success(text: str):
        Console._print("[成功]", text, Console.GREEN)

    @staticmethod
    def warn(text: str):
        Console._print("[提示]", text, Console.YELLOW)

    @staticmethod
    def error(text: str):
        Console._print("[错误]", text, Console.RED)

    @staticmethod
    def debug(text: str):
        Console._print("[DEBUG]", text, Console.MAGENTA)
class Main:
    def __init__(self, cookie: str = None, user_agent: str = None):
        # user_agent 优先级：参数 > 环境变量 > 默认
        self.user_agent = (
            user_agent
            or os.environ.get("user_agent")
            or "Mozilla/5.0 (Linux; Android 9; Redmi Note 5 Build/PKQ1.180904.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.89 Mobile Safari/537.36 T7/11.20 SP-engine/2.16.0 baiduboxapp/11.20.0.14 (Baidu; P1 9)"
        )

        # cookie 优先级：参数 > 环境变量 ksck(首项#前) > 空并提示
        if cookie is not None:
            self.cookie = cookie.strip()
        else:
            ksck_env = os.environ.get("ksck")
            if ksck_env:
                first_entry = ksck_env.split("&")[0]
                cookie_part = first_entry.split("#")[0]
                self.cookie = cookie_part.strip()
            else:
                Console.warn("未设置 cookie")
                self.cookie = ""
                os._exit(1)
        self.debug = False

    def _debug(self, title: str, payload=None):
        if not getattr(self, 'debug', False):
            return
        Console.debug(title)
        if payload is not None:
            try:
                Console.debug(json.dumps(payload, ensure_ascii=False))
            except Exception:
                Console.debug(str(payload))
    def get_user_info(self):
        """获取用户信息"""
        url="https://nebula.kuaishou.com/rest/n/nebula/activity/earn/overview/basicInfo"
        headers = {
            "User-Agent": self.user_agent,
            "Connection": "keep-alive",
            "cookie": self.cookie,
        }
        self._debug("请求开始: GET /rest/n/nebula/activity/earn/overview/basicInfo", {"url": url})
        response = requests.get(url=url, headers=headers, timeout=6)
        try:
            resp = json.loads(response.text)
            if response.status_code == 200 and resp.get('result') == 1:
                Console.title("用户信息")
                Console.info(f"昵称：{resp['data']['userData']['nickname']}")
                Console.info(f"金币数量：{resp['data']['totalCoin']}")
                Console.info(f"总收益：{resp['data']['allCash']}")
                Console.info(f"今日收益：{resp['data']['totalCash']}")
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
        return None
    def withdraw(self):
        """提现额度查询"""
        url="https://nebula.kuaishou.com/rest/n/nebula/account/withdraw"
        headers = {
            "User-Agent": self.user_agent,
            "Connection": "keep-alive",
            "cookie": self.cookie,
        }
        self._debug("请求开始: GET /rest/n/nebula/account/withdraw", {"url": url})
        response = requests.get(url=url, headers=headers, timeout=6)
        try:
            resp = json.loads(response.text)
            if response.status_code == 200 and resp.get('result') == 1:
                Console.title("提现额度")
                Console.info(f"金币数量：{resp['data']['coinAmount']}")
                Console.info(f"余额金额：{resp['data']['enWithdrawAmount']}")
                self._debug("请求成功: withdraw", {"status": response.status_code, "host": resp.get("host-name"), "linkType": resp.get("data", {}).get("linkType")})
                return resp
            else:
                # print(response.text)
                self._debug("请求失败: withdraw", {"status": response.status_code, "body": response.text[:800]})
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
        return None
    def coinToCash(self, coin_amount: int, token: str = ""):
        """金币兑换现金（每100金币为一单位，向下取整）。
        coin_amount 单位：金币（10000金币=1元）。token 若留空则不传递。
        """
        url="https://nebula.kuaishou.com/rest/n/nebula/exchange/coinToCash/submit"
        headers = {
            "User-Agent": self.user_agent,
            "Connection": "keep-alive",
            "cookie": self.cookie,
        }
        # 只能按100的整数倍兑换；不足100则不兑换
        if coin_amount < 100:
            Console.warn(f"金币不足：{coin_amount}，低于100，无法兑换")
            return False
        exchangeable = (coin_amount // 100) * 100
        if exchangeable < 100:
            Console.warn(f"可兑换金币不足：{exchangeable}")
            return False
        remainder = coin_amount - exchangeable
        expected_cash_yuan = exchangeable / 10000.0
        Console.info(f"准备兑换：金币 {exchangeable}，剩余 {remainder}，预计到账 {expected_cash_yuan:.4f} 元")

        data = {"coinAmount": exchangeable,"token":"rE2zK-Cmc82uOzxMJW7LI2-wTGcKMqqAHE0PhfN0U4bJY4cAM5Inxw"}
        self._debug("请求开始: POST /rest/n/nebula/exchange/coinToCash/submit", {"url": url, "data": data})
        response = requests.post(url=url, headers=headers, json=data, timeout=6)
        try:
            resp = json.loads(response.text)
            if response.status_code == 200 and resp.get('result') == 1:
                Console.success("兑换成功")
                return True
            else:
                Console.error(f"兑换失败：{resp.get('error_msg')}")
                self._debug("请求失败: coinToCash", {"status": response.status_code, "body": response.text[:800]})
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
        return False


    def withdraw_info(self):
        """绑定信息查询，返回 provider 列表"""
        url = "https://www.kuaishoupay.com/pay/account/h5/withdraw/withdraw_info"
        headers = {
            "cookie": self.cookie,
            "User-Agent": self.user_agent
        }
        data={
                "account_group_key": "NEBULA_CASH_ACCOUNT",
                "providers": "",
                "bind_page_type": "3",
                "source": "COMMON_WITHDRAW_PAGE",
                "amount": "300"
            }
        self._debug("请求开始: GET /pay/account/h5/withdraw/withdraw_info", {"url": url})
        response = requests.post(url=url, headers=headers,data=data, timeout=6)
        try:
            resp = json.loads(response.text)
            # print(resp)
            if response.status_code == 200 and resp.get('code') == "SUCCESS":
                self._debug("请求成功: withdraw_info", {"status": response.status_code, "providers": len(resp.get("withdraw_provider_infos", []))})
                try:
                    providers = resp.get("withdraw_provider_infos", [])
                    for p in providers:
                        if not p.get("has_bind", False):
                            continue
                        nickname = p.get("nickname") or p.get("origin_nick_name") or p.get("masked_real_name") or p.get("login_name") or ""
                        if nickname:
                            Console.info(f"绑定昵称：{nickname}")
                except Exception:
                    pass
                return resp
            else:
                Console.warn(resp.get("msg", response.text))
                self._debug("请求失败: withdraw_info", {"status": response.status_code, "code": resp.get('code'), "msg": resp.get('msg'), "body": response.text[:800]})
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
        return None

    def withdraw_apply(self, fen: str, biz_content, provider: str = "WECHAT", bank_id: str = "", bank_token: str = "", ticket: str = ""):
        """提现申请，根据选择的档位提交。
        fen 单位：分；biz_content：从 withdrawList.bizContent 解析而来；
        provider 取值：WECHAT/ALIPAY/UNION_PAY_BANK。
        """
        url = "https://www.kuaishoupay.com/pay/account/h5/withdraw/apply"
        headers = {
            "cookie": self.cookie,
            "User-Agent": self.user_agent,
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        # biz_content 需要以 JSON 字符串上送
        if isinstance(biz_content, dict):
            biz_content_str = json.dumps(biz_content, ensure_ascii=False, separators=(",", ":"))
        else:
            biz_content_str = str(biz_content)

        data = {
            "account_group_key": "NEBULA_CASH_ACCOUNT",
            "mobile_code": "",
            "fen": fen,
            "provider": provider,
            "total_fen": fen,
            "commission_fen": "0",
            "third_account": provider,
            "attach": "",
            "biz_content": biz_content_str,
            "session_id": "",
            "bank_id": bank_id,
            "pop_window_types": "",
            "bank_token": bank_token,
            "skip_show_third_bind_info": "false",
            "agree_sign_policy": "false",
            "ticket": ticket
        }
        dbg_data = {"url": url, "provider": provider, "fen": fen}
        if provider == "UNION_PAY_BANK":
            dbg_data.update({"bank_id": bank_id, "bank_token_masked": bool(bank_token)})
        self._debug("请求开始: POST /pay/account/h5/withdraw/apply", dbg_data)
        response = requests.post(url=url, headers=headers, data=data, timeout=6)
        try:
            resp = json.loads(response.text)
            if response.status_code == 200 and resp.get('code') == "SUCCESS":
                Console.success(resp.get("msg", "提现成功"))
                self._debug("请求成功: withdraw_apply", {"status": response.status_code, "msg": resp.get("msg")})
                return True
            else:
                Console.error(f"提现失败：{resp.get('msg', response.text)}")
                self._debug("请求失败: withdraw_apply", {"status": response.status_code, "code": resp.get('code'), "msg": resp.get('msg'), "body": response.text[:800]})
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
        return False

    def auto_withdraw_max(self):
        """根据余额选择最大可提现档位并申请提现"""
        resp = self.withdraw()
        if not resp:
            return
        try:
            data = resp.get("data", {})
            en_withdraw_amount = float(str(data.get("enWithdrawAmount", "0") or "0"))
            en_withdraw_list = [float(x) for x in data.get("enWithdrawList", [])]
            # 选择不超过余额的最大档位
            candidates = [x for x in en_withdraw_list if x <= en_withdraw_amount]
            if not candidates:
                Console.warn("余额不足，暂无可提现档位")
                return
            target_amount = max(candidates)
            # 在 withdrawList 中找到对应档位，取出 bizContent
            withdraw_list = data.get("withdrawList", [])
            target_item = None
            for item in withdraw_list:
                try:
                    if float(str(item.get("amount", "0"))) == target_amount and not item.get("disabled", False):
                        target_item = item
                        break
                except Exception:
                    continue
            if not target_item:
                Console.warn("未找到匹配的提现档位")
                return
            biz_content_raw = target_item.get("bizContent")
            try:
                biz_content = json.loads(biz_content_raw) if isinstance(biz_content_raw, str) else (biz_content_raw or {})
            except Exception:
                print("bizContent 解析失败")
                return
            fen = str(int(round(target_amount * 100)))
            Console.info(f"准备提现：{target_amount} 元（{fen} 分）")
            self.withdraw_apply(fen=fen, biz_content=biz_content)
        except Exception as e:
            Console.error(str(e))

    def auto_withdraw_with_provider_priority(self):
        """根据绑定信息，按 微信->支付宝->银行卡 尝试提现（失败则依次降级，未绑定跳过）"""
        # 先选最大可提现档位
        resp = self.withdraw()
        if not resp:
            return
        data = resp.get("data", {})
        try:
            en_withdraw_amount = float(str(data.get("enWithdrawAmount", "0") or "0"))
            en_withdraw_list = [float(x) for x in data.get("enWithdrawList", [])]
            candidates = [x for x in en_withdraw_list if x <= en_withdraw_amount]
            if not candidates:
                Console.warn("余额不足，暂无可提现档位")
                return
            target_amount = max(candidates)
            # 提现前先尝试将金币兑换为现金（10000金币=1元），失败则继续提现
            coin_amount = int(data.get("coinAmount", 0) or 0)
            if coin_amount > 0:
                Console.info(f"尝试将金币兑换为现金：金币 {coin_amount}")
                if self.coinToCash(coin_amount=coin_amount):
                    # 兑换成功后刷新余额与档位
                    refreshed = self.withdraw()
                    if refreshed and refreshed.get("data"):
                        data = refreshed["data"]
                        en_withdraw_amount = float(str(data.get("enWithdrawAmount", "0") or "0"))
                        en_withdraw_list = [float(x) for x in data.get("enWithdrawList", [])]
                        candidates = [x for x in en_withdraw_list if x <= en_withdraw_amount]
                        if candidates:
                            target_amount = max(candidates)
            withdraw_list = data.get("withdrawList", [])
            target_item = None
            for item in withdraw_list:
                try:
                    if float(str(item.get("amount", "0"))) == target_amount and not item.get("disabled", False):
                        target_item = item
                        break
                except Exception:
                    continue
            if not target_item:
                Console.warn("未找到匹配的提现档位")
                return
            biz_content_raw = target_item.get("bizContent")
            # 不解析为 dict，按原样作为 JSON 字符串提交；若是对象则序列化
            biz_content = biz_content_raw if isinstance(biz_content_raw, str) else (biz_content_raw or {})
            fen = str(int(round(target_amount * 100)))
            Console.title("提现尝试")
            Console.info(f"最大可提现档位：{target_amount} 元（{fen} 分）")
        except Exception as e:
            Console.error(str(e))
            if self.debug:
                traceback.print_exc()
            return

        # 查询绑定信息
        info = self.withdraw_info()
        if not info:
            Console.error("绑定信息查询失败")
            return
        providers = info.get("withdraw_provider_infos", [])
        ticket = info.get("ticket", "")

        # 构建优先级顺序
        priority = ["WECHAT", "ALIPAY", "UNION_PAY_BANK"]
        # 在返回的 provider 列表中取出详细配置
        provider_map = {p.get("provider"): p for p in providers}

        for provider in priority:
            cfg = provider_map.get(provider)
            if not cfg:
                Console.warn(f"跳过：未返回渠道 {provider}")
                continue
            if not cfg.get("has_bind", False) and provider != "UNION_PAY_BANK":
                Console.warn(f"跳过：{provider} 未绑定")
                continue
            # 银行卡特殊：未绑定也可能允许通过 bank_guide_infos 引导；这里仅在 has_bind 为真时尝试
            if provider == "UNION_PAY_BANK" and not cfg.get("has_bind", False):
                Console.warn("跳过：银行卡未绑定")
                continue

            bank_id = cfg.get("bank_bind_infos", [{}])[0].get("bank_id", "") if provider == "UNION_PAY_BANK" else ""
            bank_token = cfg.get("bank_bind_infos", [{}])[0].get("bank_token", "") if provider == "UNION_PAY_BANK" else ""
            Console.info(f"尝试通过 {provider} 提现 {fen} 分 …")
            ok = self.withdraw_apply(fen=fen, biz_content=biz_content, provider=provider, bank_id=bank_id, bank_token=bank_token, ticket=ticket)
            if ok:
                Console.success(f"{provider} 提现成功")
                return
            else:
                Console.warn(f"{provider} 提现失败，尝试下一个渠道…")

        Console.error("所有可用渠道均提现失败或未绑定")


if __name__ == '__main__':
    # 启动横幅
    Console.title("本脚本永久免费")
    Console.info("哔哩哔哩：浅若红尘")
    Console.info("主页：https://b23.tv/jfaJ7b6")
    Console.info("使用的python依赖有：requests")
    Console.info("Cookie变量名称：ksck,建议用户填写user_agent变量名称，过多用户使用同一UA有可能会被封IP")
    Console.info("本脚本仅供交流学习，请勿用于商业用途。")

    ksck_env = os.environ.get("ksck", "") or ""
    ua_env = os.environ.get("user_agent")
    accounts = [x.strip() for x in ksck_env.split("&") if x.strip()] if ksck_env else []
    if accounts:
        for idx, entry in enumerate(accounts, start=1):
            cookie_part = entry.split("#")[0].strip()
            Console.title(f"账号 {idx}")
            main = Main(cookie=cookie_part, user_agent=ua_env)
            main.get_user_info()
            main.auto_withdraw_with_provider_priority()
            if idx < len(accounts):
                wait_s = random.randint(6, 10)
                Console.info(f"等待 {wait_s} 秒后处理下一个账号…")
                time.sleep(wait_s)
    else:
        main = Main(user_agent=ua_env)
        main.get_user_info()
        main.auto_withdraw_with_provider_priority()