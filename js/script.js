
function GetMap()
{
    var myOptions = {
        credentials: 'ApPosPKV1rtvE9V9fpx_YULKyRhck7DFk2YZ2BT6XNNpeACIunUO7lN_m8L0Kp1e',
        center: new Microsoft.Maps.Location(48.8534, 2.3488),
        //mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 12
    }
    map = new Microsoft.Maps.Map('#myMap', myOptions);
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false
    });
    infobox.setMap(map);
}


$(document).ready(function() {
     tab = [];

    function parkingSpot(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r){
      this.geo = a;
      this.name = b;
      this.adress = c;
      this.telephone = d;
      this.timeTable = e;
      this.motorBikeAcces = f;
      this.bikeAcces = g;
      this.abo_car_month = h;
      this.abo_car_year = i;
      this.abo_moto_month = j;
      this.abo_moto_quart = k;
      this.abo_moto_year = l;
      this.abo_bike_month = m;
      this.tarif_car_30m = n;
      this.tarif_car_1h = o;
      this.tarif_moto_15m = p;
      this.tarif_moto_30m = q;
      this.tarif_moto_24h = r;
    }


    var request = $.ajax({
        url : 'https://opendata.paris.fr/api/records/1.0/search/?dataset=parcs-de-stationnement-concedes-de-la-ville-de-paris&rows=1000',
        method : 'GET',
        dataType : 'json',
    })

    request.fail(function(error){
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
    })

    request.done(function(response){
        for (var i = 0; i < response.records.length; i++){
         tab.push(new parkingSpot(
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

        for (var j = 0; j < tab.length; j++){
            center = new Microsoft.Maps.Location(tab[j].geo[0],tab[j].geo[1]);
            pin = new Microsoft.Maps.Pushpin(center,{
                //color: '#00cef7'
                icon : "images/pin.png",
                anchor: new Microsoft.Maps.Point(12, 12)
            });
            pin.metadata = {
              title: tab[j].name,
            };

            Microsoft.Maps.Events.addHandler(pin, 'mouseover', pushpinClicked);
            Microsoft.Maps.Events.addHandler(pin, 'click', display);
            map.entities.push(pin)
        };


        function pushpinClicked(e) {
           if (e.target.metadata) {
            //Set the infobox options with the metadata of the pushpin.
            infobox.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                visible: true,
                });
            }
        };

    })

    //console.log(pin)

    function display(e){
        var loc = e.target.getLocation();
        loc = Object.values(loc);
        loc.splice(2);


        for(k = 0; k < tab.length; k++){
            if(tab[k].geo[0] === loc[0] && tab[k].geo[1] === loc[1]){
                break;
            }
        }

        $('.park_name').text(tab[k].name);
        $('.park_address').text(tab[k].adress);
        $('.park_tel').text(tab[k].telephone);
        $('.park_timeTable').text(tab[k].timeTable);
        $('.park_moto_access').text(tab[k].motorBikeAcces);
        $('.park_bike_access').text(tab[k].bikeAcces);
        $('.park_car_M').text(tab[k].abo_car_month);
        $('.park_car_Y').text(tab[k].abo_car_year);
        $('.park_moto_M').text(tab[k].abo_moto_month);
        $('.park_moto_Q').text(tab[k].abo_moto_quart);
        $('.park_moto_Y').text(tab[k].abo_moto_year);
        $('.park_bike_M').text(tab[k].abo_bike_month);
        $('.park_car_30m').text(tab[k].tarif_car_30m);
        $('.park_car_1h').text(tab[k].tarif_car_1h);
        $('.park_moto_15m').text(tab[k].tarif_moto_15m);
        $('.park_moto_30m').text(tab[k].tarif_moto_30m);
        $('.park_moto_24h').text(tab[k].tarif_moto_24h);

        $('#abo').click(function(){
            abonnement()
        });
    }

    function abonnement(){
        $('#abo_select').change(function(){
            var selectedValue = $(this).val();

            switch (selectedValue) {
                case 'abo_m_v':
                    $(".prix_abo").html(tab[k].abo_car_month + " €");
                    break;
                case 'abo_y_v':
                    $(".prix_abo").html(tab[k].abo_car_year + " €");
                    break;
                case 'abo_m_m':
                    $(".prix_abo").html(tab[k].abo_moto_month + " €");
                    break;
                case 'abo_t_m':
                    $(".prix_abo").html(tab[k].abo_moto_quart + " €");
                    break;
                case 'abo_a_m':
                    $(".prix_abo").html(tab[k].abo_moto_year + " €");
                    break;
                case 'abo_m_velo':
                    $(".prix_abo").html(tab[k].abo_bike_month + " €");
                    break;
                default:
                $(".prix_abo").html("");
            };


            if ($('.prix_abo').html() == "ND €"){
                var attr_2 = $('.confirmer').attr('enabled');
                if(typeof attr_2 !== typeof undefined && attr_2 !== false){
                    $('.confirmer').removeAttr('enabled');
                    $('.confirmer').attr('disabled', '1');
                    $('.confirmer').css('opacity', '0.6');
                }
                else{
                    $('.confirmer').attr('disabled', '1');
                    $('.confirmer').css('opacity', '0.6');
                }
            }else {
                var attr = $('.confirmer').attr('disabled');
                if (typeof attr !== typeof undefined && attr !== false) {
                    $('.confirmer').removeAttr('disabled');
                    $('.confirmer').attr('enabled', '1');
                    $('.confirmer').css('opacity', '1');
                }
            }
        });

    }



});
