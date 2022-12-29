import {changeObject} from "./scripts";

const arIcon = new URL("../imgs/ar-icon.png", import.meta.url);
const shareIcon = new URL("../imgs/share.png", import.meta.url);
const copyIcon = new URL("../imgs/copy.png", import.meta.url);
const cssURL = new URL("../style.css", import.meta.url);

const QRCode = require("qrcode");
const imgURL = new URL("../imgs/Chair.webp", import.meta.url);

const chairURL = new URL("../models/Chair.glb", import.meta.url);
const planterURL = new URL("../models/GeoPlanter.glb", import.meta.url);
const MixerURL = new URL("../models/Mixer.glb", import.meta.url);
const toyTrainURL = new URL("../models/ToyTrain.glb", import.meta.url);
const canoeURL = new URL("../models/Canoe.glb", import.meta.url);

const imgChairURL = new URL("../imgs/Chair.webp", import.meta.url);
const imgMixerURL = new URL("../imgs/Mixer.webp", import.meta.url);
const imgGeoPlanterURL = new URL("../imgs/GeoPlanter.webp", import.meta.url);
const imgToyTrainURL= new URL("../imgs/ToyTrain.webp", import.meta.url);
const imgCanoeURL= new URL("../imgs/Canoe.webp", import.meta.url);
const qrPageURL= new URL("../qrpage.html", import.meta.url);
const modelURLs = [chairURL, planterURL, MixerURL, toyTrainURL, canoeURL]
const imgModelURLs = [imgChairURL, imgGeoPlanterURL, imgMixerURL, imgToyTrainURL, imgCanoeURL]
class HTMLElements {

    buttons_div;
    usdzURL;
     create (canvas, usdzURL) {
        this.loadCSS();
        this.usdzURL = usdzURL;
         canvas.className = "web-you-canvas";
        this.createButtonsDiv(canvas)
        this.createARButton(canvas, usdzURL);
        this.createShareButton(canvas);
        this.createShareDiv(canvas);
        this.createObjCarusel(canvas,modelURLs,imgModelURLs)
    }

    getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return "android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "ios";
        }
        return "pc";
    }

    createButtonsDiv (canvas){
        this.buttons_div = document.createElement("div")
        this.buttons_div.id = "web-you-buttons-div"
        canvas.appendChild(this.buttons_div);
    }

    createObjCarusel(canvas, models){

         const imgs = this.httpGet("http://225266.fornex.cloud:8000/files");
         console.log(imgs);
         let slider = document.createElement("div");
        slider.id = "slider";
        let slides = document.createElement("div");
        slides.id = "slides";
        slider.appendChild(slides);
         canvas.appendChild(slider);

         for (let i =0; i<imgs.length;i++){
             const fileName = imgs[i].split(".")[0]
             let objdiv = document.createElement("button");
             objdiv.style = "background-image: url('http://225266.fornex.cloud:8000/previews/"+ imgs[i] +"');"
             objdiv.id = i;
             objdiv.onclick= function (){ changeObject(this, "http://225266.fornex.cloud:8000/models/"+fileName+".glb")};
             if (i===0){
                 objdiv.className = "slide";
             }else{
                 objdiv.className = "slide";
             }
             slides.appendChild(objdiv);
         }

}
     httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText);
    }

    createARButton(canvas, usdzURL) {
        const platform = this.getMobileOperatingSystem();
        if (platform === "ios") {
            this.createARButtonIOS(canvas, usdzURL);
        } else if (platform === "android") {
            this.createARButtonAndroid(canvas);
        } else if (platform === "pc") {
            this.createARButtonWindows(canvas);
        }
    }

    createARButtonIOS(canvas, usdzURL) {
        let link = document.createElement("a");
        link.className = "web-you-button";
        link.id = "arButton";
        link.href = usdzURL;
        link.download = "scene.usdz";
        link.rel = 'ar';
        let img = document.createElement('img');
        img.src = arIcon.href;
        link.appendChild(img);
        this.buttons_div.appendChild(link);

    }

    createARButtonAndroid(canvas) {
        this.createARButtonWindows(canvas)
    }

    createARButtonWindows(canvas) {
        this.createQRCodeDiv(canvas);
        let link = document.createElement("a");
        link.id = "arButton";
        link.className = "web-you-button";
        link.onclick = this.changeQRDivVisibility;
        let img = document.createElement('img');
        img.src = arIcon.href;

        link.appendChild(img);
        this.buttons_div.appendChild(link);
    }



    changeQRDivVisibility() {
        console.log("click");
        let divQR = document.getElementById("divQR");
        if (divQR.style.display === "block") {
            divQR.style.display = "none";
        } else {
            divQR.style.display = "block";
        }
    }

    createQRCodeDiv(canvas) {
        let divQR = document.createElement("div");
        divQR.id = "divQR";

        let img = document.createElement('img');
        let divText = document.createElement("div");
        let textNode = document.createTextNode("Scan this to see model in AR.");

        const QRCode = require('qrcode')
        var opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 2,
            margin: 0,
            color: {
                dark: "#000000",
                light: "#FFFFFF"
            }
        }
        console.log(qrPageURL.href+"?usdz="+this.usdzURL);
        QRCode.toDataURL("http://225266.fornex.cloud:1234/", opts, function (err, url) {
            img.src = url;
        })

        divText.appendChild(textNode);
        divQR.appendChild(divText);
        divQR.appendChild(img);
        canvas.appendChild(divQR);
    }

    createShareButton(canvas) {
        let button = document.createElement("a");
        button.id = "shareButton";
        button.className = "web-you-button";
        button.onclick = this.changeShareDivVisibility;

        let img = document.createElement('img');
        img.src = shareIcon.href;

        button.appendChild(img);
        this.buttons_div.appendChild(button)
    }

    createShareDiv(canvas){
        let div = document.createElement("div");
        div.id = "shareDiv";

        let textDiv = document.createElement("h1");
        let codeDive = document.createElement("div");
        let textNode = document.createTextNode("Paste the following code on any site.");
        textDiv.appendChild(textNode);
        let embedCodeText = "<div id=\"web-you-3d-container\" data-uuid=\"759dd2b0-f073-013a-2a70-4e5fca380ce0\"></div><script src=\""+""+"\" type=\"module\"></script>";
        let embedCode = document.createTextNode(embedCodeText);
        codeDive.appendChild(embedCode);

        div.appendChild(textDiv);
        div.appendChild(codeDive);
        canvas.appendChild(div);
    }

    changeShareDivVisibility() {
        console.log("click");
        let divQR = document.getElementById("shareDiv");
        if (divQR.style.display === "block") {
            divQR.style.display = "none";
        } else {
            divQR.style.display = "block";
        }

    }

    loadCSS() {
        var cssId = 'web-you-3d-container-css';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssURL;
            link.media = 'all';
            head.appendChild(link);
        }
    }

}

export {HTMLElements};