$(document).ready(function() {

    
	//Início Estilos

	var styleFunction = function(){ //estilo do KML RAD POLÍGONOS
        return [new ol.style.Style({
        fill: new ol.style.Fill({
                color: 'rgba(225, 130, 41, 0.6)'
            }),
        stroke: new ol.style.Stroke({
                color: 'rgba(225, 92, 41, 0.8)',
                width: 1
        	})
    	})];     
    };

    var styleCache = {};
    var pontoradStyle = function(feature,resolution){ //estilo do PONTO KML RAD (CLUSTERS)
        var size = feature.get('features').length;
        var text = (size == 1 && resolution < 60 ) ? feature.get('features')[0].get('name') : size.toString();
        var style = styleCache[size];
        return [new ol.style.Style({           
        	image: new ol.style.Circle({
        		radius: 10,
        		fill: new ol.style.Fill({
        			color: 'rgb(225, 130, 41)'
        		}),
        		stroke: new ol.style.Stroke({
        			color: 'rgb(225, 92, 41)',
        			width: 1
        		})
        	}),
        	text: new ol.style.Text({
                scale: 1.2,
        		text: text,
        		fill: new ol.style.Fill({
        			color: '#fff'
        		}),
                stroke: new ol.style.Stroke({
                    color: '#000'
                })
        	}) 	
    	})];
    };
    var styleCar = {};
    var carStyle = function(feature, resolution){ //estilo do KML CAR (CLUSTERS)
    	var size = feature.get('features').length;
        var text = (size == 1 && resolution < 60) ? feature.get('features')[0].get('name') : size.toString();
        var style = carStyle[size];
        return [new ol.style.Style({           
        	image: new ol.style.Circle({
        		radius: 10,
        		fill: new ol.style.Fill({
        			color: 'rgb(180, 10, 10)'
        		}),
        		stroke: new ol.style.Stroke({
        			color: 'rgb(180, 10, 10)',
        			width: 1
        		})
        	}),
        	text: new ol.style.Text({
                scale: 1.2,
                text: text,
                fill: new ol.style.Fill({
                    color: '#fff'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000'
                })
            })  
    	})];
    };
    /*
    var carStyle = function(feature){ //estilo do KML CAR
    	return [new ol.style.Style({           
        	image: new ol.style.Circle({
        		radius: 5,
        		fill: new ol.style.Fill({
        			color: 'rgba(180, 10, 10, 0.6)'
        		}),
        		stroke: new ol.style.Stroke({
        			color: 'rgba(180, 10, 10, 0.8)',
        			width: 1
        		})
        	})
    	})];
    };*/

    var limStyleFunction = function(feature) { //função para o estilo do Limite do Projeto
    return [new ol.style.Style({            
        stroke: new ol.style.Stroke({
                color: 'rgba(160,140,0,1)',
                width: 3
        	})
    	})];
    };

    var drenagemStyle = function(feature) { //função para o estilo da drenagem
          return [new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: 'rgba(0,127,255,0.8)',
                width: 1
              })
            }),
        stroke: new ol.style.Stroke({
                color: 'rgba(0,127,255,0.8)',
                width: 1
        	})
    	})];
    };

    var estradasStyle = function(feature, resolution) { //função para o estilo das estradas
        var text = resolution < 20 ? feature.get('name') : '';
        return [new ol.style.Style({           
        	stroke: new ol.style.Stroke({
                color: '#A62A2A',
                width: 2.5,
        	}),
        	text: new ol.style.Text({
        		scale: 1.5,
        		text: text,
        		fill: new ol.style.Fill({
        			color: '#fff'
        		}),
        		stroke: new ol.style.Stroke({
                    color: '#000',
                    width: 1.7
                })
        	})
    	})];
    };

    var viveiroStyle = function(feature) { //função para o Ícone do viveiro
        return [new ol.style.Style({           
        	image: new ol.style.Icon({
                size: [125, 125],
                src: "img/viv_ico2.png"
        	})
    	})];
    };

    var UCsStyle = function(){ //estilo das unidades de conservação
        return [new ol.style.Style({
	        fill: new ol.style.Fill({
	                color: 'rgba(0, 238, 118, 0.3)'
	            }),
	        stroke: new ol.style.Stroke({
	                color: 'rgb(0, 238, 118)',
	                width: 1
	        	})
	    	})];     
    };

    //Fim Estilos

    

    //projeção

	var projection = ol.proj.get('EPSG:3857'); //Projeção Openlayers-3

	//view

	view = new ol.View({
		center: [-6942316.656972848, -1050856.264864603],
		zoom: 9,
		maxZoom: 18,
		minZoom: 2
	});

	//mapas

	var mapquestLayer = new ol.layer.Tile({
		source: new ol.source.OSM ({
			layer: 'osm'
		}),
		visible: false,
		name: 'mapquest'
	});

	var bingmapsLayer = new ol.layer.Tile({
		source: new ol.source.BingMaps ({
			key: 'Aqh3opxIgZXX9tgD-qzCGUijcoJU_6cZfUrKzB6sWLUhddRjsXTIuRwzz7E7DDYe',
      		imagerySet: 'Aerial'
		}),
		visible: true,
		name: 'bingmaps'
	});

	//camadas vetores

	var lotesLayer = new ol.layer.Vector({ //camada dos poligonos do RAD (Áreas Recuperadas)
			source: new ol.source.Vector({
				url: 'data/kml/rad_pol_semeando_2010_2015.kml',
				format: new ol.format.KML({
				extractStyles: false
				})
			}),
			style: styleFunction,
			name: 'lotesLayer',
			visible:false

	});

	var sedeRadLayer = new ol.source.Vector({
				url: 'data/kml/rad_pts_semeando_2010_2015.kml',
				format: new ol.format.KML({
				extractStyles: false
				//extractAttributes: true,
				})
			});
	

	var limlayer = new ol.layer.Vector({ //Cada do Limite do Projeto
		source: new ol.source.Vector({
			url: 'data/geojson/limite_semeando.geojson',
			format: new ol.format.GeoJSON(),
			extractStyles: false
		}),
		style: limStyleFunction,
		name: 'limlayer',
		visible: true
	});

	var aterlayer = new ol.layer.Vector({ //Camada das áreas de ATER
		source: new ol.source.Vector({
			url: 'data/geojson/rad_pol_semeando_2010_2015.geojson',
			format: new ol.format.GeoJSON()
		}),
		style: styleFunction,
		name: 'aterlayer',
		visible: false
	});

	var drenagemLayer = new ol.layer.Vector({ //Camada dos Corpos d'água
			source: new ol.source.Vector({
				url: 'data/geojson/drenagem_semeando.geojson',
				format: new ol.format.GeoJSON({
				//extractStyles: false
				})
			}),
			style: drenagemStyle,
			name: 'drenagemLayer',
			visible:false

	});
	
	var flonaLayer = new ol.layer.Vector({ //Área da flona (unidades de conservação)
		source: new ol.source.Vector({
			url: 'data/kml/flona_jamari.kml',
			format: new ol.format.KML({
				extractStyles: false
			})
		}),
		style: UCsStyle,
		name: 'flonaLayer',
		visible: false
	});

	var carFLayer = new ol.source.Vector({
			url: 'data/kml/car_2.kml',
			format: new ol.format.KML({
				extractStyles: false
			})
		});
/*
	var carSLayer = new ol.source.Vector({
			url: 'data/kml/car_S_maia2.kml',
			format: new ol.format.KML({
				extractStyles: false
			})
		});*/

	var estradasLayer = new ol.layer.Vector({ //Estradas e Rodovias
		source: new ol.source.Vector({
			url: 'data/kml/estradas.kml',
			format: new ol.format.KML({
				extractStyles: false
			})
		}),
		style: estradasStyle,
		name: 'estradasLayer',
		visible: false
	});

	var viveiroLayer = new ol.layer.Vector({ //Camada do Viveiro Municipal
		source: new ol.source.Vector({
			url: 'data/kml/viveiro_itapua.kml',
			format: new ol.format.KML({
				extractStyles: false
			})
		}),
		style: viveiroStyle,
		name: 'viveiroLayer',
		visible: false
	});

	//cluster marker
	//rad
    var clusterSource = new ol.source.Cluster({
        distance: 40,
        source: sedeRadLayer
      });
    
    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: pontoradStyle,
        name: 'clusters',
        visible: false
      });
    //car
    var clusterCarSource = new ol.source.Cluster({
        distance: 40,
        source: carFLayer
      });
    
    var clustersCar = new ol.layer.Vector({
        source: clusterCarSource,
        style: carStyle,
		name: 'carLayer',
		visible: false
      });
	//declaração do mapa

	var map = new ol.Map({
		target: 'mapa',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine({className: 'ol-scale-line', target: document.getElementById('scale-line')}),
			new ol.control.Zoom({
				zoomInTipLabel : 'Mais zoom',
				zoomOutTipLabel : 'Menos zoom'
			}),
			new ol.control.Attribution({
				tipLabel : 'Atribuições'
			})
			//new ol.control.ZoomSlider()
		]),
		renderer: 'canvas',
		layers: [
			mapquestLayer, bingmapsLayer, limlayer , flonaLayer, drenagemLayer, estradasLayer, lotesLayer, clusters , viveiroLayer, clustersCar
		],

		view: view
	});
	
	// INICIO Check box camadas

	$('input[type=checkbox]').on('change', function() {
  		var layer = {
	 		arearad: [clusters, lotesLayer],
	 		areacar: clustersCar,
	 		//areaater: aterlayer,
	 		drenagem: drenagemLayer,
	 		limsemeando: limlayer,
	 		estradas: estradasLayer,
	 		viveiro: viveiroLayer,
	 		ucs: flonaLayer	
  		}[$(this).attr('id')];
  		if (Array.isArray(layer)) {  //foreach
  			layer.forEach(function(layer) {
  				layer.setVisible(!layer.getVisible());
  			});
  			//layer[0].setVisible(!layer[0].getVisible());
  			//layer[1].setVisible(!layer[1].getVisible());
  		}
  		else
  	    	layer.setVisible(!layer.getVisible());
	});

	$('input[type=radio]').on('change', function(){
		var layer_map = $(this).val();
		map.getLayers().getArray().forEach(function(e) {
			var name = e.get('name');
			if (name != 'lotesLayer' && name != 'drenagemLayer' && name != 'zseeLayer' 
			&& name != 'aterlayer' && name != 'limlayer' && name != 'sedeRadLayer' 
			&& name != 'carLayer' && name != 'estradasLayer' && name != 'clusters'
			&& name != 'viveiroLayer' && name != 'resexLayer' && name != 'flonaLayer') //para não sumir na troca de radio
			    e.setVisible(name == layer_map);
		});
	});

	//FIM Check box camadas

	//geolocalizar

	var geolocation = new ol.Geolocation({
		projection: view.getProjection(),
		tracking: true
	});

	$('#geolocation').click(function(){
		var position = geolocation.getPosition();

		var point = new ol.layer.Vector({
			source: new ol.source.Vector({
				features:[
					new ol.Feature({
						geometry: new ol.geom.Point(position)
					})
				]
			})
		});

		map.addLayer(point);

		view.setCenter(position);
		view.setResolution(2.388);
		return false;
	}).mouseover(function(){ //JQuery para colorir ao passar mouse em cima do botão
		var borda = $(this).css("border");
		$(this).css("border","#0061f2 2px solid");
		$(this).bind("mouseout", function(){
			$(this).css("border", borda);
		})
	});

    /*Início mostrar características ao passar o ponteiro do mouse*/

    var info = $('#info'); //jquery
    info.tooltip({
        animation: false,
        trigger: 'manual'
    });

    var displayFeatureInfo = function(pixel) {
        info.css({
          left: pixel[0] + 'px',
          top: (pixel[1] - 15) + 'px'
    });
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
    });
	    if (feature.get('name') || feature.get('features')) {
	        info.tooltip('hide')
	              .attr('data-original-title', (feature.get('features')) ? feature.get('features')[0].get('name') : feature.get('name'))
	              .tooltip('fixTitle')
	              .tooltip('show');
	        } else {
	          info.tooltip('hide');
	        }
    };

    map.on('pointermove', function(evt) {
        if (evt.dragging || !map.hasFeatureAtPixel(evt.pixel)) {
          info.tooltip('hide');
          return;
        }
        displayFeatureInfo(map.getEventPixel(evt.originalEvent));
    });

    /*map.on('click', function(evt) {
        displayFeatureInfo(evt.pixel);
    });*/
    /*FIM mostrar características ao passar o ponteiro do mouse*/
    /*Início Tornar o KML selecionável*/
    /*O KML deve ser selecionável para que seja informado o conteúdo de cada polígono ou ponto*/

    var selectlotes = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.4)'
              }),
              stroke: new ol.style.Stroke({
                color: 'rgba(255, 225, 0, 0.6)',
                width: 2
              })
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 0, 0.4)'
              }),
            stroke: new ol.style.Stroke({
            	color: 'rgba(255, 255, 0, 0.6)',
                width: 2
            })
          });

    var selectInteraction = new ol.interaction.Select({
        layers: function(layer) {
    		return layer.get('selectable') == true;
        },
        style: [selectlotes],

      });
    map.getInteractions().extend([selectInteraction]);
    lotesLayer.set('selectable', true);
    //clusters.set('selectable', true);
    clusterCarSource.set('selectable', true);

    /*Fim Tornar o KML selecionável*/
    /*Início Popup ao clicar no KML*/

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var coord = document.getElementById('popup-coord')
    var closer = document.getElementById('popup-closer');

    var overlay = new ol.Overlay(({ // @type {olx.OverlayOptions}
    	element: container,
    	autoPan: true,
    	autoPanAnimation: {
    		duration: 250
    	}
    }));
    map.addOverlay(overlay);

    closer.onclick = function() {
    	overlay.setPosition(undefined);
    	closer.blur();
    	return false;
    };

	map.on('singleclick', function(evt) {
			var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
				return feature;
			});
			if (feature && feature.get("description")) { //quando era só feat.get, dava erro no click fora de features
				var coordinate = evt.coordinate;
    			var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
    				coordinate, 'EPSG:3857', 'EPSG:4326')
    			);
    			content.innerHTML = '<p>'+feature.getProperties()['description']+'</p>'; //pega a description do KML    			
    			coord.innerHTML = '<p><strong>'+hdms+'</strong></p>';
    			overlay.setPosition(coordinate);
                $("#owl-demo").owlCarousel({
                    jsonPath : "img/viveiro.json"
                });
    		}
    		//cluster tem description, name e features
    		else if (!feature || (!feature.get('description') && !feature.get('features') )) { // ao clicar onde nao é feature, a popup é escondida
    			overlay.setPosition();
    		}
    		else if (feature && (feature.get('features').length == 1) ) {
    			var coordinate = evt.coordinate;
    			var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
    				coordinate, 'EPSG:3857', 'EPSG:4326')
    			);
    			content.innerHTML = '<p>'+feature.get('features')[0].get("description")+'</p>'; //pega a description do KML    			
    			coord.innerHTML = '<p><strong>'+hdms+'</strong></p>';
    			overlay.setPosition(coordinate);
    		}
    		
	});
    /*Fim Popup ao clicar no KML*/
    
});
