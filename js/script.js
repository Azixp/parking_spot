//opendata
let data = null
//index du parking
let actualIndex = null;

function getOpenData(){
    let xhrRequest = new XMLHttpRequest();
    let isDataReady = false;
    xhrRequest.open(
        'GET',
        'https://opendata.paris.fr/api/records/1.0/search/?dataset=stationnement-en-ouvrage&q=&rows=1000',
        true
    );
    xhrRequest.responseType = 'json';
    xhrRequest.send();
    return xhrRequest;
}

function updateParkingIndex(actualLocation){
    let i = 0;
    while (i < data.length) {
        if((actualLocation.latitude == data[i].fields['geo_point_2d'][0]) && actualLocation.longitude === data[i].fields['geo_point_2d'][1]){
            break;
        }
        i++;
    }
    actualIndex = i;
}

let infoboxTemplate = `<div class="customInfobox">
                            <a class="close-infoBox" href="#">X</a>
                            <h4>{title}</h4><hr>
                            {description}
                            <div>
                                <ul>
                                    <li><a href="#" class="btn btn-success btn-sm" id="sub">S'abonner</a></li>
                                    <li><a href="#" class="btn btn-success btn-sm" id="book">Réserver</a></li>
                                </ul>
                            </div>
                        </div>`;

let subFormTemplate = `<form action="" method="" id="subForm" data-aos="fade-right">
                        <table class="table table-striped table-bordered table-hover">
                            <tr>
                                <th> <label for="selection">Type/Abonnement:</label> </th>
                                <th>Prix:</th>
                                <th>Date:</th>
                                <th> <label for="confirmation">Confirmation</label> </th>
                            </tr>
                            <tr>
                                <td>
                                    <select name="type_sub">
                                        <option value="" selected>Choisir</option>
                                        <option value="ab_1m_e">Abonnement Mensuel VL</option>
                                        <option value="ab_1a_e">Abonnement Annuel VL</option>
                                        <option value="abpmr_1a_e">Abonnement PMR Annuel</option>
                                        <option value="abpmr_1t_e">Abonnement PMR Trimestriel</option>
                                        <option value="abve_1m_e">Abonnement Vehicule E Mensuel</option>
                                        <option value="abve_1t_e">Abonnement Vehicule E Trimestriel</option>
                                        <option value="abve_1a_e">Abonnement Vehicule E Annuel</option>
                                        <option value="abmoto_1me">Abonnement Mensuel Moto</option>
                                        <option value="abmoto_1te">Abonnement Trimestriel Moto</option>
                                        <option value="abmoto_1ae">Abonnement Annuel Moto</option>
                                        <option value="tvelo_1m_e">Abonnement Mensuel Vélo</option>
                                    </select>
                                </td>
                                <td class="price"></td>
                                <td> <input type="date" name="date" value=""> </td>
                                <td> <input type="button" class="btn btn-success btn-sm confirmation" name="subConfirmation" value="Confirmer réservation"> </td>
                            </tr>
                        </table>
                        </form>`;

let bookFormTemplate = `<form action="index.html" method="post" id="bookForm" data-aos="fade-right">
                            <table class="table table-striped table-bordered table-hover">
                                <tr>
                                    <th> <label for="selection">Type/Tarif:</label> </th>
                                    <th>Prix:</th>
                                    <th>Date:</th>
                                    <th> <label for="confirmation">Confirmation:</label> </th>
                                </tr>
                                <tr>
                                    <td>
                                        <select name="type_book">
                                            <option value="" selected>Choisir</option>
                                            <option value="tf_30mn_e">Tarif 30 minutes Voiture</option>
                                            <option value="tarif_1h">Tarif 1 heure</option>
                                            <option value="tarif_2h">Tarif 2 heures</option>
                                            <option value="tarif_3h">Tarif 3 heures</option>
                                            <option value="tarif_24h">Tarif 24 heures</option>
                                            <option value="tf_15mn_mo">Tarif 15 minutes Moto</option>
                                            <option value="tf_30mn_mo">Tarif 30 minutes Moto</option>
                                            <option value="tf_24h_mot">Tarif 24H Moto</option>
                                        </select>
                                    </td>
                                    <td class="price"></td>
                                    <td> <input type="date" name="date" value=""> </td>
                                    <td> <input type="button" class="btn btn-success btn-sm confirmation" name="bookConfirmation" value="Confirmer réservation"> </td>
                                </tr>
                            </table>
                        </form>`;
function createTable(){
    let htmlElement = `<section class="tab_section hide">
                        <table class="table table-condensed table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>ADRESSE</th>
                                <th>TEL</th>
                                <th>HORAIRES</th>
                                <th>ACCES MOTO</th>
                                <th>ACCES VELO</th>
                                <th>ABO MENS VOITURE</th>
                                <th>ABO ANU VOITURE</th>
                                <th>ABO MENS MOTO</th>
                                <th>ABO TRIM MOTO</th>
                                <th>ABO ANU MOTO</th>
                                <th>ABO MENS VELO</th>
                                <th>30 MINUTES VOITURE</th>
                                <th>1 HEURE VOITURE</th>
                                <th>15 MINUTES MOTO</th>
                                <th>30 MINUTES MOTO</th>
                                <th>24 HEURES MOTO</th>
                            </tr>
                        </thead>
                        <tbody>`;
                        for (let i = 0; i < data.length; i++) {
                            htmlElement += `<tr>
                                                <td>${data[i].fields['adresse']}</td>
                                                <td>${data[i].fields['arrdt']}</td>
                                                <td>${data[i].fields['tel']}</td>
                                                <td>${data[i].fields['horaire_na']}</td>
                                                <td>${data[i].fields['type_usagers']}</td>
                                                <td>${data[i].fields['nb_places']}</td>
                                                <td>${data[i].fields['nb_pmr']}</td>
                                                <td>${data[i].fields['nb_voitures_electriques']}</td>
                                                <td>${data[i].fields['tarif_1h']}</td>
                                                <td>${data[i].fields['tarif_2h']}</td>
                                                <td>${data[i].fields['tarif_3h']}</td>
                                                <td>${data[i].fields['tarif_24h']}</td>
                                                <td>${data[i].fields['ab_1m_e']}</td>
                                                <td>${data[i].fields['ab_1a_e']}</td>
                                                <td>${data[i].fields['abmoto_1me']}</td>
                                                <td>${data[i].fields['abmoto_1te']}</td>
                                                <td>${data[i].fields['abmoto_1ae']}</td>
                                                <td>${data[i].fields['tvelo_1m_e']}</td>
                                                <td>${data[i].fields['tf_15mn_mo']}</td>
                                                <td>${data[i].fields['tf_30mn_mo']}</td>
                                                <td>${data[i].fields['tf_24h_mot']}</td>
                                            </tr>`;   
                        }
        htmlElement += `</tbody>
                        </table>
                        </section>
                        `;
    return htmlElement;                                   
}

function getDescriptionTemplate(parkInfo){
    let template = `<dl>
                        <dt>ADRESSE</dt>
                            <dd>${parkInfo['adresse']}</dd>
                        <dt>ARRONDISSEMENT</dt>
                            <dd>${parkInfo['arrdt']}</dd>
                        <dt>TEL</dt>
                            <dd>${parkInfo['tel']}</dd>
                        <dt>HORAIRES OUVERTURE NON ABONNES</dt>
                            <dd>${parkInfo['horaire_na']}</dd>
                        <dt>USAGERS AUTORISES</dt>
                            <dd>${parkInfo['type_usagers']}</dd>
                        <dt>NMBRE DE PLACES</dt>
                            <dd>${parkInfo['nb_places']}</dd>
                        <dt>NBRE DE PALCES PMR</dt>
                            <dd>${parkInfo['nb_pmr']}</dd>
                        <dt>NBRE DE PLACES VOIT ELECT</dt>
                            <dd>${parkInfo['nb_voitures_electriques']}</dd>
                        <dt>TARIF 1H</dt>
                            <dd>${parkInfo['tarif_1h']}</dd>
                        <dt>TARIF 2H</dt>
                            <dd>${parkInfo['tarif_2h']}</dd>
                        <dt>TARIF 3H</dt>
                            <dd>${parkInfo['tarif_3h']}</dd>
                        <dt>TARIF 24H</dt>
                            <dd>${parkInfo['tarif_24h']}</dd>  
                        <dt>ABONNEMENT MENSUEL VL</dt>
                            <dd>${parkInfo['ab_1m_e']}</dd>
                        <dt>ABONNEMENT ANNUEL VL</dt>
                            <dd>${parkInfo['ab_1a_e']}</dd>
                        <dt>ABONNEMENT PMR ANNUEL</dt>
                            <dd>${parkInfo['abpmr_1a_e']}</dd>
                        <dt>ABONNEMENT PMR TRIMESTRIEL</dt>
                            <dd>${parkInfo['abpmr_1t_e']}</dd>
                        <dt>ABONNEMENT VEHICULE E MENSUEL</dt>
                            <dd>${parkInfo['abve_1m_e']}</dd>
                        <dt>ABONNEMENT VEHICULE E ANNUEL</dt>
                            <dd>${parkInfo['abve_1a_e']}</dd>
                        <dt>ABONNEMENT MOTO MENSUEL</dt>
                            <dd>${parkInfo['abmoto_1me']}</dd>
                        <dt>ABONNEMENT MOTO TRIMESTRIEL</dt>
                            <dd>${parkInfo['abmoto_1te']}</dd>
                        <dt>ABONNEMENT MOTO ANNUEL</dt>
                            <dd>${parkInfo['abmoto_1ae']}</dd>
                        <dt>ABONNEMENT VELO MENSUEL</dt>
                            <dd>${parkInfo['tvelo_1m_e']}</dd>
                        <dt>TARIF MOTO 15 MINUTES</dt>
                            <dd>${parkInfo['tf_15mn_mo']}</dd>
                        <dt>TARIF MOTO 30 MINUTES</dt>
                            <dd>${parkInfo['tf_30mn_mo']}</dd>
                        <dt>TARIF MOTO 24 HEURES</dt>
                            <dd>${parkInfo['tf_24h_mot']}</dd>
                    </dl>`;
    return template; 
}

function GetMap(){
    var map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(48.8534, 2.3488),
        zoom: 12
    });
   
    //Create an infobox at the center of the map without showing it.
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false,
    });

    //Assign the infobox to a map instance.
    infobox.setMap(map);

    let request = getOpenData();
    
    request.onreadystatechange = function(){
        if (this.readyState === 4){
            if(this.status === 200){
                //Je récupère la data des parkings
                data = this.response.records;
                for (let i = 0; i < data.length; i++) {
                    let parkingLocations = new Microsoft.Maps.Location(data[i].fields['geo_point_2d'][0], data[i].fields['geo_point_2d'][1]);
                    let pin = new Microsoft.Maps.Pushpin(parkingLocations, {
                        icon : "images/greenpin.svg",
                        anchor: new Microsoft.Maps.Point(12, 5)
                    })
                    pin.metadata = {
                        title: data[i].fields['nom_parc'],
                        description : getDescriptionTemplate(data[i].fields)
                    }
                    //Add a click event handler to the pushpin.
                    Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);

                    //Add pushpin to the map.
                    map.entities.push(pin);
                }       
            } else {
                console.log("Un problème est survenu au cours de la requête.");
            }
        }
    }
}

function pushpinClicked(e){
    //Make sure the infobox has metadata to display.
    //console.log(e.target.metadata)
    if (e.target.metadata) {
        //Set the infobox options with the metadata of the pushpin.
        infobox.setOptions({
            location: e.target.getLocation(),
            visible: true,
            htmlContent: infoboxTemplate.replace('{title}', e.target.metadata.title).replace('{description}', e.target.metadata.description),
        });
    }
    closeInfoBoxHandler();
    subFormHandler();
    bookFormHandler();
    updateParkingIndex(e.target.getLocation())
}

function closeInfoBoxHandler(){
    document.querySelector('.customInfobox .close-infoBox').addEventListener('click', function(e){
        e.preventDefault();
        document.querySelector('.customInfobox').remove();
    })
}

function subFormHandler(){
    document.querySelector('#sub').addEventListener('click', function(e){
        e.preventDefault();
        if(document.querySelector('#subForm') === null){
            if(document.querySelector('#bookForm')){
                document.querySelector('#bookForm').remove();
                document.querySelector('.subFormContainer').innerHTML = subFormTemplate;
            } else {
                document.querySelector('.subFormContainer').innerHTML = subFormTemplate;
            }
            //J'envoie le tableau d'abonnement à la fonction injectData()
            injectData(document.querySelector('#subForm'));
        }
    });
}

function bookFormHandler(){
    document.querySelector('#book').addEventListener('click', function(e){
        e.preventDefault()
        //Si le tableau de reservation n'existe pas. je vérifie si le tableau d'abo existe
        //Si tableau abo existe, je l'enleve et j'injecte le tableau de reservation.
        //Sinon j'injecte directement le tableau de reservation.
        if(document.querySelector('#bookForm') === null){
            if(document.querySelector('#subForm')){
                document.querySelector('#subForm').remove();
                document.querySelector('.bookFormContainer').innerHTML = bookFormTemplate;
            } else {
                document.querySelector('.bookFormContainer').innerHTML = bookFormTemplate;
            }
            //J'envoie le tableau de reservation à la fonction injectData()
            injectData(document.querySelector('#bookForm'));
        }
    })
}

function switchPageHandler(){
    document.querySelector('header nav ul').addEventListener('click', function(event){
       if(event.target.tagName === 'A'){
           if(event.target.innerHTML === 'TABLEAU'){
               document.querySelector('.map_section').classList.add('hide');
               document.querySelector('.tab_section').classList.remove('hide');
           } else if (event.target.innerHTML === 'CARTE'){
               document.querySelector('.map_section').classList.remove('hide');
               document.querySelector('.tab_section').classList.add('hide'); 
           }
       }
    })
}

//j'utilise l'index du parking (actualIndex) pour injecter la bonne data. 
function injectData(htmlElement){
    htmlElement.querySelector('select').addEventListener('change',function(){
        //this.data = <select>.
        //actualIndex => On a besoin de l'index du parking actuel pour injecter la bonne data
        let subInfo = data[actualIndex].fields[this.value];

        if(subInfo == null){
            htmlElement.querySelector('.price').innerHTML = 'Non disponible';
            //Je désactive le bouton si pas de valeur ou valeur undefined
            htmlElement.querySelector('input[type="button"]').setAttribute('disabled', '1');
        } else if(subInfo === 'ND'){
            htmlElement.querySelector('.price').innerHTML = 'Non disponible';
            htmlElement.querySelector('input[type="button"]').setAttribute('disabled', '1');
        } else {
            htmlElement.querySelector('.price').innerHTML = subInfo + ' €';
            htmlElement.querySelector('input[type="button"]').removeAttribute('disabled');
        }
    })
}

function generateTable(){
    setTimeout(function(){ 
        if(data){
            let table = createTable();
            document.querySelector('.custom_container .tabContainer').innerHTML += table
        }
    }, 3000);
}

window.addEventListener('load', function(){
    generateTable();
    switchPageHandler()
})