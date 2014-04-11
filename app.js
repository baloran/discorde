// Plugin gloable
discorde.app = {

	zombieDarkStyles: [{
		stylers: [
			{ visibility: "simplified" },
			{ invert_lightness: true },
			{ saturation: -100 },
			{ lightness: 10 },
			{ gamma: 1.13 }
		]},{
		featureType: "landscape.man_made",
			stylers:discorde.color.danger1
		},{
		featureType: "poi.business",
			stylers:discorde.color.danger1
		},{
		featureType: "poi.school",
			stylers:discorde.color.danger1
		},{
		featureType: "poi.sports_complex",
			stylers:discorde.color.danger1
		},{   
		featureType: "poi.government",
			// stylers:discorde.color.danger3
		},{
		featureType: "poi.medical",
			stylers:discorde.color.danger4
		},{
		featureType: "transit",
			stylers:discorde.color.danger1
		},{
		featureType: "road",
			stylers:discorde.color.danger1
		},{
		featureType: "road",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		},{
		featureType: "administrative.locality",
			stylers: [
				{ visibility: "off" }
			]
		},{
		featureType: "poi.park",
			stylers: [
				{ lightness: -40 }
			]
		}
	],

	darkStyles: [{
		stylers: [
			{ visibility: "simplified" },
			{ invert_lightness: true },
			{ saturation: -100 },
			{ lightness: 10 },
			{ gamma: 1.13 }
			]},{
			featureType: "road",
			elementType: "labels",
			stylers: [
			{ visibility: "off" }
			]
			},{
			featureType: "administrative.locality",
			stylers: [
			{ visibility: "off" }
			]
			}	,	{
			featureType: "poi.park",
			stylers: [
			{ lightness: -40 }
		]
	}],

	// Option map
	mapOptions: {
        center: new google.maps.LatLng(36.24427318493909, 6.8994140625),
        zoom: 3,
        maxZoom: 6,
        minZoom: 3,
        disableDefaultUI: true,
    },
    day:1,

    init: function(){
    	console.log("Made with ♥ in Paris by Baloran - http://baloran.fr")
    	that = this
    	this.maps();
    	that.getPopulation();
    	that.getZombie();
    	that.getHuman();
    	that.action();
    	$('#startparty').submit(function(e){
    		e.preventDefault();
    		var pseudo = $("#pseudo").val();
    		sessionStorage.setItem("pseudo",pseudo);
    		$("#player").fadeOut()
    		that.start()
    	})
    	frames = [];
    },

    start: function(){
    	setInterval(function(){
    		that.colorCountry(that.map);
    		that.getPopulation();
    		that.getZombie();
    		that.getHuman();
    		that.calcul();
    		that.watch();
    		that.spread();
    	},10000);
    },

    // Function permettant la création de map
	maps: function(){
		that = this;
		var darkMapType = new google.maps.StyledMapType(this.darkStyles,{name: "No Danger Zones"});
		var zombieMapType = new google.maps.StyledMapType(this.zombieDarkStyles,{name: "Danger Zones"});
		var printMapType = new google.maps.StyledMapType(this.printStyles,{name: "Print Friendly"});
		
        // Stylisation map Google
        this.map = new google.maps.Map(document.getElementById("map-canvas"),that.mapOptions);
        this.map.mapTypes.set('dark', darkMapType);
		this.map.setMapTypeId('dark');
		this.map.mapTypes.set('zombie_danger', zombieMapType);
		this.map.setMapTypeId('zombie_danger');
		this.map.mapTypes.set('print', printMapType);
		// var timer = setInterval(function(){
		// 	that.colorCountry(map);
		// },1500)
		for(var i = 0; i < discorde.transport.length; i++ ){
			that.addMarker(this.map,discorde.transport[i].lng,discorde.transport[i].lat,discorde.transport[i].type,discorde.transport[i].name);
		}
		var lineCoordinates = [
    		new google.maps.LatLng(49.009722, 2.547778),
    		new google.maps.LatLng(40.639722,-73.778889)
		];
		var lineSymbol = {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 3
		};
		var line = new google.maps.Polyline({
	    	path: lineCoordinates,
	    	strokeOpacity: 1,
	    	skrokeSize:0.5,
	    	icons: [{
	      		icon: lineSymbol,
	      		offset: '100%',
	      		opacity:1,
	    	}],
	    		map: that.map
  		});
		that.animTransport(line)
	},


	/**
	*	@params 
	*		map = la map, 
	*		longitude, latitude,
	*		type = le type de marker que c'est:
	*			aéroport = airport
	*			port = port
	*			avion(for anim) = plane
	*			bateau(for anim) = boat
	*			
	*/
	addMarker: function(map,longitude,latitude,type,name){

		// Ajout du marker
        var myLatlng = this.LatLng(longitude, latitude);
        var marker = new google.maps.Marker({
        	position: myLatlng,
        	map: map,
        	icon:'img/' +  type + '.png',
        	title:name
        });
        return marker;
	},

	/**
	*	Color country
	*
	*/
	animTransport: function(line){
		that = this;

		var count = 0;
		window.setInterval(function() {
		count = (count + 1) % 200;

		var icons = line.get('icons');
		icons[0].offset = (count / 2) + '%';
		line.set('icons', icons);
		}, 20);

	},

	/**
	*	Replace the function new google.maps.LatLng()
	*	first parameter latitude
	*	second parameter longitude
	*/
	LatLng: function(lat,lng){
		return new google.maps.LatLng(lat,lng);
	},

	/**
	*	Permet de lister les pays	
	*	
	*
	*/
	getPopulation: function(){
		that = this;
		var pop = discorde.zone;
		var content = "";
		for(var i = 0; i < pop.length;i++){
			var slug = pop[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase()
			content += "<p data-country="+slug+">"+pop[i].pays+"</p>" + "<span class='survival'>" + pop[i].population + " hab </span><br/><span class='infected'>" + pop[i].infected + " infectés </span><br/> <br/>"
		};
		var cnt = $("#country");
		cnt.empty().append(content);
		cnt.find("p").click(function (e) {
			e.preventDefault();
			that.country = $(this).data('country');
		});
	},

	// Color country with in params the map
	colorCountry: function(){
		that = this;
		var pop = discorde.zone;
		for(var i = 0; i < pop.length; i++){
			var percent = (pop[i].infected*100) / pop[i].population;
			// Si un nombre d'infecter
			if(percent > 50){
				// console.log(pop[i].pays) // Sa marche ici
				// Si iso a plus de 1 pays
				if (pop[i].ISO.length > 1) {
					// Ici bug quand depasse 5
					for(var j = 0; j< pop[i].ISO.length; j++){
						// console.log(pop[i].ISO[j])
						var mult = new google.maps.FusionTablesLayer({
							suppressInfoWindows: true,
							query:{
								select:'name',
								from: '1uL8KJV0bMb7A8-SkrIe0ko2DMtSypHX52DatEE4',
								where: "ISO_2DIGIT MATCHES '" + pop[i].ISO[j] + "'"
							},
						});
						that.setToMap(mult);
					}
				}else{
					var layer = new google.maps.FusionTablesLayer({
						suppressInfoWindows: true,
						query:{
							select:'name',
							from: '1uL8KJV0bMb7A8-SkrIe0ko2DMtSypHX52DatEE4',
							where: "ISO_2DIGIT MATCHES '" + pop[i].ISO + "'"
						},
					});
					that.setToMap(layer);
				}
				
			}
		}
	},

	setToMap: function(layer){
		layer.setMap(this.map);
	},

	calcul: function(){
		that = this;
		var pop = discorde.zone;
		for(var i= 0; i < pop.length; i++){
			var pib = pop[i].pib;
			var idh = pop[i].idh;
			var frontiere = pop[i].frontiere;
			var airport = pop[i].airport;
			var port = pop[i].port;
			var population = pop[i].population;
			var densite = pop[i].densite.replace(",",".");
			// console.log(pop[i].densite.replace(",","."));
			var facteur = 1.3;
			var nbr_infecter = pop[i].infected;
			// pib,idh,ouverture_frontiere,airport,port,pop,densite,nbr_infect 
			var data = Math.ceil(discorde.calcul.savantCalcul(pib,idh,frontiere,airport,port,population,densite,nbr_infecter));
			pop[i].infected = data;
			// pop[i].population = pop[i].population - data;
			discorde.calcul.x +=1;
		}
		// var data = discorde.calcul.savantCalcul(39772,parseInt("0,893"),false,false,false,1.2,parseInt("225,473775"));
		// console.log(Math.floor(data));
	},

	watch: function(){
		if (this.day > 1) {
			var p = " days"
		}else{
			var p = " day"	
		}
		$("#timer").empty().append(this.day  + p);
		this.day += 1;
	},

	getZombie: function(){
		var zone = discorde.zone;
		var infected = 0;
		for(var i =0; i < zone.length;i++){
			infected = infected + zone[i].infected;
		}
		$('#zombie').empty().append(infected);
	},

	getHuman: function(){
		var zone = discorde.zone;
		var human = 0;
		for(var i =0; i < zone.length;i++){
			human = human + zone[i].population;
		}
		$('#humain').empty().append(human);
	},

	getCountry: function(){
		that = this;
		var pop = discorde.zone;
		var content = "";
		for(var i = 0; i < pop.length;i++){
			var slug = pop[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase()
			content += "<p data-country="+slug+">"+pop[i].pays+"</p>";
		};
		var list = $("#list");
		list.empty().append(content).fadeIn();
		list.find("p").click(function (e) {
			e.preventDefault();
			that.country = $(this).data('country')
			list.fadeOut();
		});

	},

	spread: function(){
		var pop = discorde.zone;
		for(var i =0;i < pop.length;i++){
			var percent = (pop[i].infected*100) / pop[i].population;
			if (percent > 55 && pop[i].frontiere == true) {
				for(var j =0;j < pop[i].voisin.length;j++){
					for(var k =0;k < pop.length;k++){
						if ($.inArray(pop[i].voisin[j],pop[k].voisin) && pop[k].infected == 0) {
							pop[k].infected += 1;
						}
					}
				}
			}
		}
	},

	action: function(){
		that =this;
		$('#menu').find('li').click(function (e) {
			e.preventDefault();
			var cls = $(this).attr('class');
			if(!that.country){
				alert("Séléctioner un pays")
			}else{
				switch(cls)
				{
					case 'bouton1':
						that.Recherche()
					break;
					case 'bouton2':
						that.Vaccin();
					break;
					case 'bouton3':
						that.closePort();
					break;
					case 'bouton4':
						that.closeAirport()
					break;
					case 'bouton5':
						that.closeCountry()
					break;
					case 'bouton6':
						that.Purge()
					break;
				}
			}
		});
	},

	closeCountry: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].frontiere = false;
			}
		}
	},

	closeAirport: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].airport = false;
			}
		}
	},

	closePort: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].port = false;
			}
		}
	},

	Vaccin: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].vaccin = true;
			}
		}
	},

	Purge: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].population = 0;
				zone[i].infected = 0;
			}
		}
	},

	Recherche: function(){
		that = this;
		var zone = discorde.zone;
		for(var i =0; i < zone.length; i++){
			var slug = zone[i].pays.replace(/ /g,"-").replace(/'/g,'-').toLowerCase();
			if (slug == that.country) {
				zone[i].remede = true;
			}
		}
	}
}
