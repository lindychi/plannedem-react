export const getTimeString = (time) => {
    if (time === undefined) {
        return "";
    }

    let secTime = time / 1000;
    let strArray = [];
    if (secTime / (60 * 60 * 24) > 1 && strArray.length < 2) {
        strArray.push(parseInt(secTime / (60 * 60 * 24)) + "일");
        secTime = secTime % (60 * 60 * 24);
    }
    if (secTime / 3600 > 1 && strArray.length < 2) {
        strArray.push(parseInt(secTime / (60 * 60)) + "시간");
        secTime = secTime % (60 * 60);
    }
    if (secTime / 60 > 1 && strArray.length < 2) {
        strArray.push(parseInt(secTime / 60) + "분");
        secTime = secTime % 60;
    }
    if (secTime > 0 && strArray.length < 2) {
        strArray.push(parseInt(secTime) + "초");
    }

    return strArray.join(" ");
};
