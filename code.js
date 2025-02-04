// ==UserScript==
// @name         Amazon ASIN Marka Çekici (Brand Extractor)
// @namespace    https://orderquery.net/
// @version      2.0
// @description  Amazon'dan ASIN marka bilgilerini çeker ve modern bir panelde gösterir. "Visit the" ifadesi temizlenmiştir.
// @author       Seyit Ahmet TANRIVER
// @match        *://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function () {
    "use strict";

    // Modern stil oluştur
    const style = `
        #asinCheckerPanel {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 400px;
            background: #ffffff;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        #asinCheckerPanel h2 {
            font-size: 18px;
            text-align: center;
            margin-bottom: 10px;
            color: #333;
        }
        #asinList, #resultList {
            width: 100%;
            height: 100px;
            border: 1px solid #ccc;
            padding: 8px;
            border-radius: 6px;
            font-size: 14px;
            resize: none;
        }
        #checkAsin {
            width: 100%;
            background: #35C10D;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 8px;
        }
        #checkAsin:hover {
            background: #2ea50a;
        }
        #progressContainer {
            display: none;
            margin-top: 10px;
            width: 100%;
            background: #eee;
            border-radius: 6px;
            overflow: hidden;
        }
        #progressBar {
            width: 0%;
            height: 12px;
            background: #35C10D;
            border-radius: 6px;
            transition: width 0.3s ease-in-out;
        }
        #timer {
            text-align: center;
            font-size: 14px;
            margin-top: 10px;
            font-weight: bold;
            color: #555;
        }
        #developer {
            text-align: center;
            font-size: 14px;
            margin-top: 10px;
        }
        #developer a {
            color: #007BFF;
            text-decoration: none;
        }
        #developer a:hover {
            text-decoration: underline;
        }
    `;

    $("head").append(`<style>${style}</style>`);

    // Panel HTML kodu
    let container = $(`
        <div id="asinCheckerPanel">
            <h2>Amazon ASIN Marka Çekici</h2>
            <textarea id="asinList" placeholder="ASIN'leri satır satır girin"></textarea>
            <button id="checkAsin">Kontrol Et</button>
            <div id="progressContainer">
                <div id="progressBar"></div>
            </div>
            <div id="timer">Geçen Süre: 0s</div>
            <textarea id="resultList" placeholder="Sonuçlar buraya gelecek" readonly></textarea>
            <div id="developer">
                Geliştirici: <a href="https://wa.me/31637952159" target="_blank">Seyit Ahmet TANRIVER</a>
            </div>
        </div>
    `);
    $("body").append(container);

    // Butona tıklanınca çalışacak kod
    $("#checkAsin").click(function () {
        let asins = $("#asinList").val().trim().split("\n").filter(a => a !== "");
        let resultText = "";
        let total = asins.length;
        let completed = 0;
        let startTime = Date.now();

        if (total === 0) {
            alert("Lütfen en az bir ASIN girin.");
            return;
        }

        $("#progressContainer").show();
        $("#progressBar").css("width", "0%");
        $("#timer").text("Geçen Süre: 0s");

        function updateProgress() {
            completed++;
            let percent = Math.round((completed / total) * 100);
            $("#progressBar").css("width", percent + "%");

            let elapsedTime = Math.round((Date.now() - startTime) / 1000);
            $("#timer").text("Geçen Süre: " + elapsedTime + "s");
        }

        function processBatch(index) {
            if (index >= asins.length) {
                $("#resultList").val(resultText.trim());
                return;
            }

            let batch = asins.slice(index, index + 2); // 2'şerli gruplama
            let requests = batch.map(asin => {
                let url = `https://www.amazon.com/dp/${asin}`;
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            let tempDiv = $("<div>").html(response.responseText);
                            let brandText = tempDiv.find("#bylineInfo").text().trim();

                            // "Visit the " ifadesini kaldır
                            if (brandText.startsWith("Visit the ")) {
                                brandText = brandText.replace("Visit the ", "");
                            }

                            resultText += `${asin} ${brandText || "Bilgi bulunamadı"}\n`;
                            updateProgress();
                            resolve();
                        },
                        onerror: function () {
                            resultText += `${asin} Hata oluştu\n`;
                            updateProgress();
                            resolve();
                        }
                    });
                });
            });

            Promise.all(requests).then(() => {
                processBatch(index + 2);
            });
        }

        processBatch(0);
    });
})();
