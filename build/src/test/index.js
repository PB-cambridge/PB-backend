"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paystack_1 = __importDefault(require("paystack"));
const env_1 = __importDefault(require("../../env"));
const paystack = (0, paystack_1.default)(env_1.default.PAYSTACK_SECRET_KEY);
// test1();
// test2();
// (async () => {
// 	const salt = bcrypt.genSaltSync(10);
// 	const hashedPassword = await bcrypt.hashSync("password", salt);
// 	console.log(hashedPassword);
// })();
/*
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const sampleRes = {
        status: true,
        message: "Verification successful",
        data: {
            id: 3227750873,
            domain: "test",
            status: "success",
            reference: "T795526163218997",
            receipt_number: null,
            amount: 1000000,
            message: null,
            gateway_response: "Successful",
            paid_at: "2023-10-27T06:39:29.000Z",
            created_at: "2023-10-27T06:39:04.000Z",
            channel: "card",
            currency: "NGN",
            ip_address: "197.210.227.0",
            metadata: { referrer: "http://localhost:3000/register" },
            log: {
                start_time: 1698388881,
                time_spent: 20,
                attempts: 1,
                errors: 0,
                success: true,
                mobile: false,
                input: [],
                history: [Array],
            },
            fees: 25000,
            fees_split: null,
            authorization: {
                authorization_code: "AUTH_otsgtxoi2v",
                bin: "408408",
                last4: "4081",
                exp_month: "12",
                exp_year: "2030",
                channel: "card",
                card_type: "visa ",
                bank: "TEST BANK",
                country_code: "NG",
                brand: "visa",
                reusable: true,
                signature: "SIG_g3RVHbJ9mj8YA5V8WxPb",
                account_name: null,
                receiver_bank_account_number: null,
                receiver_bank: null,
            },
            customer: {
                id: 145830561,
                first_name: "",
                last_name: "",
                email: "kinghci@fdm.com",
                customer_code: "CUS_5nk3dvyh9hlwt6t",
                phone: "",
                metadata: null,
                risk_action: "default",
                international_format_phone: null,
            },
            plan: null,
            split: {},
            order_id: null,
            paidAt: "2023-10-27T06:39:29.000Z",
            createdAt: "2023-10-27T06:39:04.000Z",
            requested_amount: 1000000,
            pos_transaction_data: null,
            source: null,
            fees_breakdown: null,
            transaction_date: "2023-10-27T06:39:04.000Z",
            plan_object: {},
            subaccount: {},
        },
    };
    // console.log(results);
    const reference = "T795526163218997";
    const response = yield paystack.transaction.verify(reference);
    console.log(response);
}))();
//# sourceMappingURL=index.js.map