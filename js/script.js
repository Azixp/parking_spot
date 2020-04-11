
// Bing Maps
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
     parkingList = [];

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

        for (var j = 0; j < parkingList.length; j++){
            center = new Microsoft.Maps.Location(parkingList[j].geo[0],parkingList[j].geo[1]);
            pin = new Microsoft.Maps.Pushpin(center,{

                icon : "images/pin.png",
                anchor: new Microsoft.Maps.Point(12, 12)
            });
            pin.metadata = {
              title: parkingList[j].name,
            };

            Microsoft.Maps.Events.addHandler(pin, 'mouseover', pushpinClicked);
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInformations);
            map.entities.push(pin)
        };

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



    function displayInformations(e){
        var loc = e.target.getLocation();
        loc = Object.values(loc);
        loc.splice(2);

        for(k = 0; k < parkingList.length; k++){
            if(parkingList[k].geo[0] === loc[0] && parkingList[k].geo[1] === loc[1]){
                break;
            }
        }

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

        $('#subscribe').click(function(event){
            $('.table2').css('display', 'inline-table');
            subscriptionTable()
            event.preventDefault();
            var hash = this.hash;
            $('body,html').animate({scrollTop: $(hash).offset().top} , 900 , function(){window.location.hash = hash;})
        });

        $('#booking').click(function(){
            $('.table3').css('display', 'inline-table');
            bookingTable()
            event.preventDefault();
            var hash = this.hash;
            $('body,html').animate({scrollTop: $(hash).offset().top} , 900 , function(){window.location.hash = hash;})
        });
    }



    function subscriptionTable(){
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
