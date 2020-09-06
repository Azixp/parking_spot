
//Fonction Bing Maps permettant d'afficher la map.
function GetMap()
{
    var myOptions = {
        credentials: 'ApPosPKV1rtvE9V9fpx_YULKyRhck7DFk2YZ2BT6XNNpeACIunUO7lN_m8L0Kp1e',
        center: new Microsoft.Maps.Location(48.8534, 2.3488),
        zoom: 12
    }
    map = new Microsoft.Maps.Map('#myMap', myOptions);
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false
    });
    infobox.setMap(map);
}



$(document).ready(function() {

    //Liste vide dans laquelle sera stockée des objets.
     parkingList = [];

    //Constructeur d'objet : Chaque instance d'objet correspondra à un parking.
    function parkingSpot(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r){
      this.geo = a;
      this.name = b;
      this.address = c;
      this.contact = d;
      this.timeTable = e;
      this.motorBikeAcces = f;
      this.bikeAcces = g;
      this.sub_car_month = h;
      this.sub_car_year = i;
      this.sub_moto_month = j;
      this.sub_moto_quart = k;
      this.sub_moto_year = l;
      this.sub_bike_month = m;
      this.rate_car_30m = n;
      this.rate_car_1h = o;
      this.rate_moto_15m = p;
      this.rate_moto_30m = q;
      this.rate_moto_24h = r;
    }

    //Requète Ajax pour récupérer les données de l'Open Data de Paris.
    var request = $.ajax({
        url : 'https://opendata.paris.fr/api/records/1.0/search/?dataset=parcs-de-stationnement-concedes-de-la-ville-de-paris&rows=1000',
        method : 'GET',
        dataType : 'json',
    })
    //Affichage d'une erreur dans le cas où la requete échoue.
    request.fail(function(error){
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
    })


    //Si requete = succes, cette fonction sera exécutée.
    request.done(function(response){
        //Itération dans le fichier json.
        //Une instance d'objet sera créé pour stocker les données récupérées.
        //Chaque instance d'objet sera elle même stockée dans la liste parkingList[].
        //Cela permet d'avoir une liste de 150 objet dans laquelle chaque index correpondra à un parking.
        for (var i = 0; i < response.records.length; i++){
         parkingList.push(new parkingSpot(
         response.records[i].fields["geo_point_2d"],
         response.records[i].fields["nom_parc"],
         response.records[i].fields["adress_ssc"],
         response.records[i].fields["tel"],
         response.records[i].fields["horaire_na"],
         response.records[i].fields["acces_moto"],
         response.records[i].fields["acces_velo"],
         response.records[i].fields["ab_1m_e"],
         response.records[i].fields["ab_1a_e"],
         response.records[i].fields["abmoto_1me"],
         response.records[i].fields["abmoto_1te"],
         response.records[i].fields["abmoto_1ae"],
         response.records[i].fields["tvelo_1m_e"],
         response.records[i].fields["tf_30mn_e"],
         response.records[i].fields["tf_1h_e"],
         response.records[i].fields["tf_15mn_mo"],
         response.records[i].fields["tf_30mn_mo"],
         response.records[i].fields["tf_24h_mot"]
         ));
        }
        //Pour chaque itération dans parkingList[]:
        //on crée un markeur auquel on assigne une géolocalisation et deux gestionnaires d'événements.
        for (var j = 0; j < parkingList.length; j++){
            center = new Microsoft.Maps.Location(parkingList[j].geo[0],parkingList[j].geo[1]);
            pin = new Microsoft.Maps.Pushpin(center,{

                icon : "images/greenpin.svg",
                anchor: new Microsoft.Maps.Point(12, 5)
            });
            pin.metadata = {
              title: parkingList[j].name,
            };
            //Pour chaque markeur parcouru, la fonction pushpinClicked() sera appelé.
            Microsoft.Maps.Events.addHandler(pin, 'mouseover', pushpinClicked);
            //Pour chaque markeur cliqué, la fonction displayInformations() sera appelé.
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInformations);
            map.entities.push(pin)
        };
        //pushpinClicked() affiche une infobulle affiche une infobulle au passage de la souris sur un markeur.
        function pushpinClicked(e) {
           if (e.target.metadata) {

            infobox.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                visible: true,
                });
            }
        };

    })


    //displayInformations() permet d'afficher les informations d'un parking donné dans un tableau html.
    function displayInformations(e){
        //On récupère l'évenement dans un objet. Remarque : L'évenement est un objet.
        //On récupère la latitude et la longitude du markeur cliqué grâce à la méthode de l'api bing maps, getLocation()
        var loc = e.target.getLocation();
        loc = Object.values(loc); //On convertit l'objet loc en un tableau.
        loc.splice(2);  //On enlève les deux dernières valeur du tableau correspondant à "altitude" et "altitudeReference".

        //On recherche la géolocalisation "loc" dans la liste d'objet parkingList[].
        //Une fois trouvée, on sort de la boucle en gardant la valeur de l'index "k".
        //La valeur de l'index "k" correpond au parking qui comporte la même géolocalisation que "loc".
        for(k = 0; k < parkingList.length; k++){
            if(parkingList[k].geo[0] === loc[0] && parkingList[k].geo[1] === loc[1]){
                break;
            }
        }

        //Affichage des informations du parling dans le tableau html
        var x = 0;
        $.each(parkingList[k], function(key, value){
            if(key == 'geo'){
                return
            }
            if(value == undefined){
                $('.display_info').eq(x++).html("Indisponible");
            }else{
                $('.display_info').eq(x++).html(value);
            }
        });

        //Gestionnaire d'évenement :
        //Si le bouton "s'abonner" est cliqué, un tableau s'affiche et la fonction subscriptionTable() est appelée.
        $('#subscribe').click(function(event){
            $('.table2').css('display', 'inline-table');
            subscriptionTable()
            // Animation scroll.
            event.preventDefault();
            var hash = this.hash;
            $('body,html').animate({scrollTop: $(hash).offset().top} , 900 , function(){window.location.hash = hash;})
        });

        //Gestionnaire d'évenement :
        //Si le bouton "réserver à l'unité" est cliqué, un tableau s'affiche et la fonction bookingTable() est appelée.
        $('#booking').click(function(){
            $('.table3').css('display', 'inline-table');
            bookingTable()
            //Animation scroll
            event.preventDefault();
            var hash = this.hash;
            $('body,html').animate({scrollTop: $(hash).offset().top} , 900 , function(){window.location.hash = hash;})
        });
    }


    //subscriptionTable() gère le comportement du tableau d'abonnement.
    function subscriptionTable(){
        //Gestionnaire d'évenement "change" + conditon "switch" pour gérer
        //l'affichage du prix d'abonnement en fonction d'une option selectionnée par l'utilisateur.
        $('#subscription_select').change(function(){
            var selectedValueAbo = $(this).val();

            switch (selectedValueAbo) {
                case 'abo_m_v':
                    $(".sub_price").html(parkingList[k].sub_car_month + " €");
                    break;
                case 'abo_y_v':
                    $(".sub_price").html(parkingList[k].sub_car_year + " €");
                    break;
                case 'abo_m_m':
                    $(".sub_price").html(parkingList[k].sub_moto_month + " €");
                    break;
                case 'abo_t_m':
                    $(".sub_price").html(parkingList[k].sub_moto_quart + " €");
                    break;
                case 'abo_a_m':
                    $(".sub_price").html(parkingList[k].sub_moto_year + " €");
                    break;
                case 'abo_m_velo':
                    $(".sub_price").html(parkingList[k].sub_bike_month + " €");
                    break;
                default:
                $(".sub_price").html("");
            }

            //Structure conditionnelle pour gérer les éventuels bug d'affichage et l'activsation/désactivation du bouton "confirmer réservation".
            //Le bouton sera désactivé si le prix est égal à "ND €", "undefined €" ou "".
            if ($('.sub_price').html() == "ND €" || $('.sub_price').html() == "undefined €" || $('.sub_price').html() == ""){
                $('.sub_confirmation').attr('disabled', '1');
                if($('.sub_price').html() == "ND €"){
                    $('.sub_price').html("ND");
                }else if ($('.sub_price').html() == "undefined €") {
                    $('.sub_price').html("Indisponible");
                }

            }else {
                var attr = $('.sub_confirmation').attr('disabled');
                if (typeof attr !== typeof undefined && attr !== false) {
                $('.sub_confirmation').removeAttr('disabled');
                }
            }
        })
    }



    //bookingTable() gère le comportement du tableau dédié à la réservation à l'unité.
    //Code plus ou moins similaire à la fonction subscriptionTable().
    function bookingTable(){
        $('#tarif_select').change(function(){
            var selectedValueUnit = $(this).val();

            switch (selectedValueUnit) {
                case 'rate30m_c':
                    $(".unit_price").html(parkingList[k].rate_car_30m + " €");
                    break;
                case 'rate1h_c':
                    $(".unit_price").html(parkingList[k].rate_car_1h + " €");
                    break;
                case 'rate15m_m':
                    $(".unit_price").html(parkingList[k].rate_moto_15m + " €");
                    break;
                case 'rate30m_m':
                    $(".unit_price").html(parkingList[k].rate_moto_30m + " €");
                    break;
                case 'rate24h_m':
                    $(".unit_price").html(parkingList[k].rate_moto_24h + " €");
                    break;
                default:
                $(".unit_price").html("");
            };

            if ($('.unit_price').html() == "ND €" || $('.unit_price').html() == "undefined €" || $('.unit_price').html() == ""){
                $('.confirmeBooking').attr('disabled', '1');
                if($('.unit_price').html() == "ND €"){
                    $('.unit_price').html("ND");
                }else if ($('.unit_price').html() == "undefined €") {
                    $('.unit_price').html("Indisponible");
                }
            }else {
                var attr = $('.confirmeBooking').attr('disabled');
                if (typeof attr !== typeof undefined && attr !== false) {
                $('.confirmeBooking').removeAttr('disabled');
                }
            }
        })
    }

});
