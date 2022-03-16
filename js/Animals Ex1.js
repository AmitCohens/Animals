let dataAnimal;
let ALERT_TITLE;
let ALERT_BUTTON_TEXT = "Close";
function animalsFunc() {
    let urlAnimals="https://zoo-animal-api.herokuapp.com/animals/rand/";
    urlAnimals+=this.value;
    $.ajax({
        url: urlAnimals,type: "GET",dataType:"json",
        success: function(data){
            dataAnimal=data;
            printAnimals(data);
        },
        error : function (){
            printAnimals(404);
        }
    });
}
function  loadPage(){
    $("#date").load("sources/get_current_date.php");
    let num4=$('#num4');
    let num8=$('#num8');
    let num10=$('#num10');
    num4.click(animalsFunc);
    num8.click(animalsFunc);
    num10.click(animalsFunc);
}
function printAnimals(){
    if(dataAnimal===404) {
        let b=$('body');
        b.html("");
        let E404="HTTP/1.0 404 Not Found\n Content-Type: text/html\n";
        E404+="Content-Length: 112\nConnection: close\n\n";
        E404+="<HTML><HEAD><TITLE>404 Not Found</TITLE></HEAD>\n";
        E404+="<BODY><H4>404 Not Found</H4>\n";
        E404+="File not found.\n";
        E404+="</BODY></HTML>";
        b.append(E404);
    }
    else {
        let x=$("#list")
        x.html("");
        for(let i=0;i<dataAnimal.length;i++) {
            let src ="<div class='";
            src+="pic' onclick='clickMe("+dataAnimal[i]["id"]+")'>";
            src+="<img src='";
            src += "" + dataAnimal[i]["image_link"];
            src += "'><br>" + dataAnimal[i]["name"];
            src+="</div>";
            x.append(src);
        }
    }
}
function clickMe(data){
    let x;
    for(let i=0;i<dataAnimal.length;i++)
        if(dataAnimal[i]["id"]===data)
            x=dataAnimal[i];
    ALERT_TITLE=x["name"];
    let allDetails="<div id='allDetails'>"
    let details="<div id='details'>"
    details+="1) Family: "+x["animal_type"];
    details+=".<br>2) Food: "+x["diet"];
    details+=".<br>3) Life Expectancy: "+x["lifespan"];
    let minLen=0.3048*x["length_min"],maxLen=0.3048*x["length_max"];
    let minWeight=0.45359237*x["weight_min"],maxWeight=0.45359237*x["weight_max"];
    details+=".<br>4) Max length: "+parseFloat(""+maxLen).toFixed(4)+" m.<br>5) Min length: "+parseFloat(""+minLen).toFixed(4)+" m.";
    details+="<br>6) Max weight: "+parseFloat(""+maxWeight).toFixed(4)+" Kg.<br>7) Min weight: "+parseFloat(""+minWeight).toFixed(4)+" Kg.";

    let WV=weekly_views(x["name"]);
    if(WV!==undefined){
        details+="<br>8) weekly views: ";
        details+=WV;
        details+=".";

    }
    details+="</div>";
    allDetails+=details;
    allDetails+='<img class="mini_img" src='+x["image_link"]+'>';
    allDetails+="</div>";
    alert(allDetails);
}
if(document.getElementById) {
    alert = function(txt) {
        createCustomAlert(txt);
    }
}
function createCustomAlert(txt) {
    d = document;
    if(d.getElementById("modalContainer")) return;
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";
    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";
    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(ALERT_TITLE));
    msg = alertObj.appendChild(d.createElement("p"));
    msg.innerHTML = txt;
    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }
}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}
function ful(){
    alert('Alert this pages');
}
function weekly_views(name){
     let urlViews= "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/";
    urlViews+=name;
    urlViews+="/daily/";
    let d = new Date;
    d=new Date(d.getFullYear(), d.getMonth(), d.getDate()-7);
    urlViews+=d.getFullYear();
    if((d.getMonth()+1).toString().length<2)
        urlViews+="0";
    urlViews+=d.getMonth()+1;
    if(d.getDate().toString().length<2)
        urlViews+="0";
    urlViews+=d.getDate();
    urlViews+="/";
    d=new Date();
    urlViews+=d.getFullYear();
    if((d.getMonth()+1).toString().length<2)
        urlViews+="0";
    urlViews+=d.getMonth()+1;
    if(d.getDate().toString().length<2)
        urlViews+="0";
    urlViews+=d.getDate();
    let urlString;
    $.ajax({
        url: urlViews,
        type: "GET",
        dataType:"json",
        async :false,
        success: function(data){
                urlString = data["items"].reduce((urlString,i)=>urlString+i["views"],0);
        },
        error : function(){

        }
    });
    console.log(urlString);
    return urlString;
}