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
exports.generateAcknowledgementSlip = exports.isValidBase64 = exports.findIndexContainingString = exports.regNo = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("../../env"));
cloudinary_1.v2.config({
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
const uploadImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Upload the image
        const result = yield cloudinary_1.v2.uploader.upload(image, {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            resource_type: "auto",
            invalidate: true,
        });
        // console.log(result);
        return result;
    }
    catch (error) {
        // console.log(error)
        return { error };
    }
});
exports.uploadImage = uploadImage;
const regNo = (username) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const randomCode = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");
    return `${username
        .slice(0, 3)
        .toLocaleUpperCase()}${randomCode}${month}${year}`;
};
exports.regNo = regNo;
function findIndexContainingString(arr, searchString) {
    return arr.findIndex(function (item) {
        return item.includes(searchString);
    });
}
exports.findIndexContainingString = findIndexContainingString;
function isValidBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}
exports.isValidBase64 = isValidBase64;
const generateAcknowledgementSlip = (details) => `<!DOCTYPE html>
	<html lang="en">
	  <head>
	    <meta charset="UTF-8" />
	    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	    <title>Testimonial</title>

	    <style>
	      @import url("https://fonts.googleapis.com/css2?family=Inter&family=Oswald&family=Righteous&display=swap");

	      :root {
	        --primary-color: #25a2ffff;
	        --inter-font: "Inter", sans-serif;
	        --righteous-font: "Righteous", sans-serif;
	        --oswald-font: "Oswald", sans-serif;
	        --bg-image: linear-gradient(
	          95deg,
	          hsl(154deg 18% 92%) 0%,
	          hsl(180deg 25% 90%) 27%,
	          hsl(196deg 35% 88%) 48%,
	          hsl(217deg 43% 85%) 62%,
	          hsl(240deg 53% 83%) 100%
	        );
	        --table-row-bg: linear-gradient(
	          95deg,
	          hsl(266deg 18% 92%) 0%,
	          hsl(258deg 25% 90%) 27%,
	          hsl(254deg 35% 88%) 48%,
	          hsl(246deg 43% 85%) 62%,
	          hsl(240deg 53% 83%) 100%
	        );
	      }
	      * {
	        margin: 0;
	        padding: 0;
	        box-sizing: border-box;
	      }
	      main {
	        padding: 0 1rem;
	        font-family: "Inter", sans-serif;
	      }
	      header {
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        gap: 1rem;
	        padding: 0.5rem 0;
	        font-family: "Righteous", sans-serif;
	      }
	      header h2 span {
	        color: var(--primary-color);
	      }
	      .acknowledge-header {
	        text-align: center;
	        color: var(--primary-color);
	        font-family: var(--oswald-font);
	        margin-left: auto;
	      }
	      .profile-img-section {
	        display: flex;
	        align-items: center;
	        justify-content: space-between;
	        gap: 2rem;
	        margin-top: 1rem;
	      }
	      .profile-photo {
	        border-radius: 6px;
	      }
	      .reference-no-container {
	        background-image: var(--bg-image);
	        color: black;
	        display: flex;
	        flex-direction: column;
	        align-items: center;
	        padding: 0.5rem 0.8rem;
	        border-radius: 8px;
	        font-family: var(--oswald-font);
	      }
	      .reference-no-container p {
	        font-size: x-large;
	      }
	      .personal-details {
	        margin-top: 2rem;
	      }

	      table {
	        border-collapse: collapse;
	        width: 100%;
	      }

	      caption {
	        width: 100%;
	        color: black;
	        background-image: var(--bg-image);
	        font-size: large;
	        font-family: var(--righteous-font);
	      }
	      table tr {
	        background-image: linear-gradient(
	          95deg,
	          hsl(266deg 18% 92%) 0%,
	          hsl(258deg 25% 90%) 27%,
	          hsl(254deg 35% 88%) 48%,
	          hsl(246deg 43% 85%) 62%,
	          hsl(240deg 53% 83%) 100%
	        );
	        padding: 0.5rem 1rem;
	      }
	      table tr td {
	        padding: 0.3rem 0.5rem;
	        font-size: small;
	      }

	      .other-info h4 {
	        background-image: var(--bg-image);
	        margin-top: 1rem;
	        text-align: center;
	        font-family: var(--righteous-font);
	      }
	      .other-info ul {
	        display: flex;
	        flex-direction: column;
	        gap: 8px;
	        padding: 0.5rem 2rem;
	        background-image: var(--table-row-bg);
	        font-size: small;
	        list-style-type: square;
	      }
	    </style>
	  </head>

	  <body>
	    <main style="max-width:1000px ;padding:20px;margin:auto; background-color:#eef">
	      <header>
	        <h2>Acnowledgement Slip</h2>
	      </header>

	      <section>
	        <div class="profile-img-section">
	          <img src="${details.passport}" class="profile-photo" alt="" height="80" width="80" />
	          <div class="reference-no-container">
	            <h5>Payment Reference Number</h5>
	            <p>${details.reference}</p>
	          </div>
	        </div>
	      </section>
	      <section class="personal-details">
	        <table>
	          <caption>
	            Personal Details
	          </caption>
	          <tr>
	            <td>Name</td>
	            <td>${details.firstName + " " + details.lastName}</td>
	          </tr>
	          <tr>
	            <td>Email</td>
	            <td>${details.email}</td>
	          </tr>
	          <tr>
	            <td>Reg No</td>
	            <td>${details.regNo}</td>
	          </tr>
	          <tr>
	            <td>School</td>
	            <td>${details.school.name}</td>
	          </tr>
	          <tr>
	            <td>Level</td>
	            <td>${details.level}</td>
	          </tr>
	          <tr>
	            <td>Class</td>
	            <td>${details.scienceOrArt}</td>
	          </tr>
	        </table>
	      </section>

	      <section class="personal-details">
	        <table>
	          <caption>
	            Competition Information
	          </caption>
	          <tr>
	            <td>Date</td>
	            <td>${new Date(details.competition.startDate).toDateString()}</td>
	          </tr>
	          <tr>
	            <td>Amount</td>
	            <td><span>&#8358;</span>${details.paidAmount}</td>
	          </tr>
	        </table>
	      </section>
	      <section class="other-info">
	        <h4>Other Informations</h4>
	        <ul>
	          <li>Come with writing materials to the exam</li>
	          <li>Do not enter the exam hall with any gadget</li>
	          <li>Bring a copy of the acknownledgemwnt slip</li>
	          <li>Come early to the venue</li>
	        </ul>
	      </section>
	    </main>
	  </body>
	</html>
	  `;
exports.generateAcknowledgementSlip = generateAcknowledgementSlip;
//# sourceMappingURL=helpers.controller.js.map