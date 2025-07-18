const adhan = require("adhan");
const momentHijri = require("moment-hijri");
const { exec } = require("child_process");

function formatTimeRemaining(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}`;
}

function formatPrayerTime12(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "ص" : "م";
    const hour12 = ((hours + 11) % 12) + 1;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

const coordinates = new adhan.Coordinates(31.0, 31.6);
const params = adhan.CalculationMethod.Egyptian();
params.madhab = adhan.Madhab.Shafi;

const now = new Date();
const prayerTimes = new adhan.PrayerTimes(coordinates, now, params);

const arabicNames = {
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
};

const prayerOrder = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

let nextPrayer = null;
for (const name of prayerOrder) {
    const time = prayerTimes[name];
    if (time > now) {
        nextPrayer = name;
        break;
    }
}
if (!nextPrayer) {
    nextPrayer = "fajr";
    prayerTimes.fajr.setDate(prayerTimes.fajr.getDate() + 1);
}

const nextTime = prayerTimes[nextPrayer];
const timeRemaining = nextTime - now;

// الحصول على التاريخ الهجري اليوم
const hijriDate = momentHijri().format("iD iMMMM iYYYY");

const tooltip = `التاريخ الهجري: ${hijriDate}
فجر: ${formatPrayerTime12(prayerTimes.fajr)}
ظهر: ${formatPrayerTime12(prayerTimes.dhuhr)}
عصر: ${formatPrayerTime12(prayerTimes.asr)}
مغرب: ${formatPrayerTime12(prayerTimes.maghrib)}
عشاء: ${formatPrayerTime12(prayerTimes.isha)}`;

console.log(
    JSON.stringify({
        text: `${arabicNames[nextPrayer]} : ${formatTimeRemaining(
            timeRemaining
        )}`,
        tooltip: tooltip,
    })
);
