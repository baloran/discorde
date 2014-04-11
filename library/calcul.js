discorde.calcul = {
	facteur: 0.02,
	x:-550,

	//	n=nombre de zones;
	//	i = Math.floor(Math.random()*n)+1;
	//	zones[i].nombre_infecte = 1;

	//si dans la zone le nombre d'infecte >=1 alors on fait le calcul


	//si on lance une campagne de vaccin pb 1/20 de trouver le vaccin
	//si le PIB supérieur à 30000 alors la pb de trouver un vaccin est de 1/10
	//si vaccin trouver la fonction n'as pas lieu
	//si le PIB de la zone supérieur à 20000 et vaccin trouvé dans 3 pays 
	//alors possibilité de lancer une campagne de remède
	//si on lance une campagne de remède pb 1/100 de trouver le remède
	//si PIB supérieur à 45000 alors pb de trouver le remède est de 1/20
	//si remède trouvé, alors zone décomptaminée

	tests: function(campagne_vaccin,campagne_remede,pib,vaccin) {
		if (campagne_vaccin == true) {
			if( pib > 30000) {
				n = Math.floor(Math.random()*10)+1;
			}
			else {
				n = Math.floor(Math.random()*20)+1;
			}
			if (n == 1) {
				vaccin=true;
			}
		}

		if (campagne_remede == true) {

			if (pib >= 45000) {
				n=Math.floor(Math.random()*20)+1;
				if (n== 1) remede = true;
			}

			else {
				n=Math.floor(Math.random()*100)+1;
				if (n== 1) remede = true;
			}

			if (remede == true) {
				facteur = -1;
			}
		}
	},

	variationPIB: function(airport,port,pib) {
		if (airport == false) {
			pib =- 100;
		}

		if (port == false) {
			pib =- 200;
		}
	},

	variationIDH: function(airport,port,idh) {
		if (airport == false) {
			idh =- 0.05;
		}

		if (port == false) {
			idh =- 0.1;
		}
	},

	variationFrontiere: function(ouverture_frontiere,idh,facteur) {
		if (ouverture_frontiere == false) {
			idh =- 0.2
			facteur =- 0.5;
		}
	},

	testIDH: function(idh, facteur) {
		if (idh <= 1 || idh > 0.8 || facteur > 0.3) {
			facteur =- 0.3;
		}

		else if (idh <= 0.8 || idh > 0.6 || facteur > 0.2) {
			facteur =- 0.2;
		}

		else if (idh <= 0.6 || idh > 0.5 || facteur > 0.1) {
			facteur =- 0.1;
		}

		else if (idh <= 0.5 || idh > 0.4 || facteur < 2) {
			facteur =+ 0.1;
		}

		else if (idh <= 0.4 || idh > 0.2 || facteur < 1.9) {
			facteur =+ 0.2;
		}

		else if (idh <= 0.2 || idh > 0 || facteur < 1.8) {
			facteur =+ 0.3;
		}
	},

	testPIB: function(pib,facteur) {
		if  (pib < 50000 || facteur > 0.3 ) {
			facteur =- 0.3;
		}

		else if  (pib <= 50000 || pib > 30000 || facteur > 0.2) {
			facteur =- 0.2;
		}

		else if  (pib <= 30000 || pib > 10000 || facteur > 0.1) {
			facteur =- 0.1;
		}

		else if  (pib <= 10000 || pib > 7000 || facteur < 2) {
			facteur =+ 0.1;
		}

		else if  (pib <= 7000 || pib > 3000 || facteur < 1.9) {
			facteur =+ 0.2;
		}

		else if  (pib <= 3000 || pib > 0 || facteur < 1.8) {
			facteur =+ 0.2;
		}
	},

	/**
	*	@params pib le pib du pays
	*	@params idh l'idh du pays
	*	@params facteur ??
	*	@params densite densité du pays
	*/
	savantCalcul: function(pib,idh,ouverture_frontiere,airport,port,pop,densite,nbr_infect) {
		if (nbr_infect >= 1) {
			this.variationPIB(airport,port,pib);
			this.variationIDH(airport,port,idh);
			this.variationFrontiere(ouverture_frontiere,idh,this.facteur);
			this.testIDH(idh,this.facteur);
			this.testPIB(pib,this.facteur); 
			// nombre_infectes = this.facteur * densite * 100000 * (Math.log(jour/2));
			//	x = -30 au départ
			// xaugmente de Un chaque jour
			//plus facteur tend vers 0 plus le nombre de zombie diminue moins vite.
			// plus facteur tend vers l'infini plus le nombre de zombie augmente rapiement
			//il faut maintenir facteur entre 0 et 200
			var nbre_infectes;
			nbre_infectes = pop/(1+Math.exp(-this.facteur*this.x));
		}else{
			nbre_infectes = 0;
		}
		return nbre_infectes;

	}
};

