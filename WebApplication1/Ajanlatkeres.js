//HA SIKERUL A KULDES
function SikeresKuldesKezeles(){
    //az urlapform nevu azonositot elrejtjuk
    let urlapForm=document.getElementById("urlapForm");
    urlapForm.style.display = 'none';
    //Az urlapElkuldve nevu azonositot megjelenitjuk
    let urlapElkuldve=document.getElementById("urlapElkuldve");
    urlapElkuldve.style.display = 'block';
}
//HA SIKERTELEN A KULDES
function SikertelenKuldesKezeles(){
    //az urlapform nevu azonositot elrejtjuk
    let urlapForm=document.getElementById("urlapForm");
    urlapForm.style.display = 'none';
    //Az urlapElkuldve nevu azonositot megjelenitjuk
    let urlapKuldesSikertelen=document.getElementById("urlapKuldesSikertelen");
    urlapKuldesSikertelen.style.display = 'block';
}
//gomra valo kattintasnal
function ajanlatkeres() {
    //megkeresi a html elementet id alapjan
    let nev = document.getElementById("nev").value;
    let telefonszam = document.getElementById("telefonszam").value;
    let email = document.getElementById("e-mail").value;
    //a nev mezo ures, vagy rossz ertek van benne
    let nevUres=nev == null || nev.trim() === '';
    //a telefonszam mezo ures, vagy rossz ertek van benne
    let telefonszamUres=telefonszam == null || telefonszam.trim() === '';
    //az e-mail mezo ures, vagy rossz ertek van benne
    let emailUres=email == null || email.trim() === '';
    let egyKotelezoMezoUres=nevUres || telefonszamUres || emailUres;
    //ha valamelyik kotelezo mezo ures
    if(egyKotelezoMezoUres){
        //a nev id-val rendelkezo mezo kerete piros szinu lesz
        let nevElement = document.getElementById("nev");
        ErvenyessegAllitas(nevElement,false)
        //a telefonszam id-val rendelkezo mezo kerete piros szinu lesz
        let telefonszamElement = document.getElementById("telefonszam");
        ErvenyessegAllitas(telefonszamElement,false)
        //az e-mail id-val rendelkezo mezo kerete piros szinu lesz
        let emailElement = document.getElementById("e-mail");
        ErvenyessegAllitas(emailElement,false)
        //ne legyen elkuldve a szervernek ha rosszak az ertekek
        return;
    }

    let helyszin = document.getElementById("helyszin").value;
    let esemenyjelleg = document.getElementById("esemenyjelleg").value;
    let resztvevo = document.getElementById("resztvevoszam").value;
    let kezdet = document.getElementById("kezdet").value;
    let veg = document.getElementById("veg").value;
    let uzenet = document.getElementById("uzenet").value;

  
    let adatok = {
        Nev: nev,
        Telefonszam: telefonszam,
        Email: email,
        helyszin: helyszin,
        Esemenyjellege: esemenyjelleg,
        Resztvevokszama: resztvevo,
        Esemenykezdete: kezdet,
        Esemenyvege: veg,
        Uzenet: uzenet
    };
    $.ajax({
        type: 'post',
        url: 'http://localhost:7159/Arajanlat',
        data: JSON.stringify(adatok),
        contentType: "application/json; charset=utf-8",
        //https://stackoverflow.com/questions/51933513/jquery-usage-of-done-then-and-when-for-making-ajax-requests-in-a-giv
    })
    .done(SikeresKuldesKezeles)
    .fail(SikertelenKuldesKezeles);
    
}
//vagy zoldre, ervenyesre vagy pirosra, ervenytelenre allitja az osztalyokt
function ErvenyessegAllitas(element,ervenyes) {
    let osztalyok=element.classList;
    if (ervenyes) {
        osztalyok.remove( "ervenytelen-input");
        osztalyok.add("ervenyes-input");
    } else {
        osztalyok.remove( "ervenyes-input");
        osztalyok.add("ervenytelen-input");
    }
}

//Megnezi hogy a nevvalidacioban csak az abc betui lehetnek
function nevValidacio() {
    let element = document.getElementById("nev");
    let ertek = element.value;
    //A test() egyezest keres a regularis kifejezes es a megadott karakterlanc kozott
    let ervenyes = /^([\p{L}\s])+$/u.test(ertek);
    ErvenyessegAllitas(element,ervenyes);
}
//Megnezi hogy a telefonszamValidacio csak szamok + lehetnek
function telefonszamValidacio() {
    let element = document.getElementById("telefonszam");
    let ertek = element.value;
    let ervenyes = /^([\d+\s])+$/u.test(ertek);
    ErvenyessegAllitas(element,ervenyes);
}
//Megnezi hogy a emailValidacioba @
function emailValidacio() {
    let element = document.getElementById("e-mail");
    let ertek = element.value;
    let ervenyes = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ertek);
    ErvenyessegAllitas(element,ervenyes);
}
//Eloszor validalja az erteket a mai naphoz kepest, aztan pedig a masik datumhoz kepest
function esemenykezdetValidacio() {
    esemenykezdetMaiValidacio();
    esemenyKezdetEsVegValidacio();
}
//Azt nezi meg hogy az esemeny kezdet legalabb ket hettel kesobb legyen, mint a mai nap
function esemenykezdetErvenyes(){
    let element=document.getElementById("kezdet");
    let ertek = new Date(element.value);
    let kethettelKesobb=new Date();
    kethettelKesobb.setDate(kethettelKesobb.getDate() + 14);
    kethettelKesobb.setHours(0,0,0,0);
    ertek.setHours(0,0,0,0);
    let ervenyes = ertek>kethettelKesobb;
    return {
        ervenyes,
        element
    }
}
//Az elozo fuggvenyt felhasznalja, es beallitja az ervenyesseget
function esemenykezdetMaiValidacio() {
    let {element,ervenyes}=esemenykezdetErvenyes();
    ErvenyessegAllitas(element,ervenyes);
}
//Eloszor validalja az erteket a mai naphoz kepest, aztan pedig a masik datumhoz kepest
function esemenyvegeValidacio() {
    esemenyvegeMaiValidacio();
    esemenyKezdetEsVegValidacio();
}
//Azt nezi meg hogy az esemeny veg legalabb ket hettel kesobb legyen, mint a mai nap
function esemenyvegErvenyes(){
    let element=document.getElementById("veg");
    let ertek = new Date(element.value);
    let kethettelKesobb=new Date();
    kethettelKesobb.setDate(kethettelKesobb.getDate() + 14);
    kethettelKesobb.setHours(0,0,0,0);
    ertek.setHours(0,0,0,0);
    let ervenyes = ertek>kethettelKesobb;
    return{
        ervenyes,
        element
    }
}
//Az elozo fuggvenyt felhasznalja, es beallitja az ervenyesseget
function esemenyvegeMaiValidacio() {
    let{element,ervenyes}=esemenyvegErvenyes();
    ErvenyessegAllitas(element,ervenyes);
}
//Osszehasonlitja a ket datumot, hogy a veg ugyanazon a napon , vagy kesobbi napon legyen, mint a kezdet.
function esemenyKezdetEsVegValidacio(){
    let{ervenyes: vegErvenyes}=esemenyvegErvenyes();
    let{ervenyes: kezdetErvenyes}=esemenykezdetErvenyes();
    let kezdetVagyVegErvenytelen=!kezdetErvenyes || !vegErvenyes;
    if(kezdetVagyVegErvenytelen){
        return;
    }
    let kezdetelement=document.getElementById("kezdet");
    let vegelement=document.getElementById("veg");
    let kezdetertek=new Date(kezdetelement.value);
    let vegertek=new Date(vegelement.value);
    kezdetertek.setHours(0,0,0,0);
    vegertek.setHours(0,0,0,0);
    let ervenyes=vegertek>=kezdetertek;
    ErvenyessegAllitas(kezdetelement,ervenyes);
    ErvenyessegAllitas(vegelement,ervenyes);
}