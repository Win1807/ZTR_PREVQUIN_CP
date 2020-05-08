sap.ui.require("sap/ui/model/json/JSONModel");
sap.ui.controller("ztr.prev.quin.cp.ztr_prevquin_cp.ext.controller.ListReportExt", {
	onInit: function () {
		debugger;
		var e = new Date;
		var i = e.getFullYear();
		var r = e.getMonth() + 1;
		var t = e.getDate();
		if (t < 16) {
			this.byId("idQuincena").setSelectedKey("1")
		} else {
			this.byId("idQuincena").setSelectedKey("2")
		}
		this.byId("idMonth").setSelectedKey(r);
		this.byId("idEjercicio").setSelectedKey(i);
		this.byId("idReal").setSelectedKey(1);
		this.byId("idPrev").setSelectedKey(1);
		this.byId("idVarQuin").setSelectedKey(1);
		this.byId("idAlcance").setSelectedKey(2);
		this.byId("idDiferencia").setSelectedKey(1);
		this.byId("idDisponibleReal").setSelectedKey(1);
		this.byId("idDisponiblePrev").setSelectedKey(1);
		this.first = "X"
	},
	onBeforeRebindTableExtension: function (e) {
		var i = e.getSource();
		var r = this.byId(i.getSmartFilterId());
		var t = r.getParameterBindingPath();
		var n = this.byId("idEjercicio").getSelectedKey();
		this._getQuincena();
		var t = "/ZC_TR_PREV_QUINCENALES_CP(" + "p_quincena_real=%27" + this.oQuincenaReal + "%27,p_quincena_prev=%27" + this.oQuincenaPrev +
			"%27,p_unmesmenos=%27" + this.SegundaQuincenaUnMesMenos + "%27,p_dosmesesmenos=%27" + this.SegundaQuincenaDosMesesMenos +
			"%27,p_ejercicio=%27" + n + "%27)/Results";
		i.setTableBindingPath(t);
		var a = i.getUiState();
		var s = a.getPresentationVariant();
		var o;
		this._regeneratePresentationVariant(s.Visualizations[0].Content);
		this._deleteCatalogFieldsOtherYears(s.Total, n);
		for (o = 0; o < s.Visualizations[0].Content.length; o++) {
			if (s.Visualizations[0].Content[o] !== undefined) {
				if (s.Visualizations[0].Content[o].Value.substring(1, 0) === "A") {
					if (s.Visualizations[0].Content[o].Value.substring(0, 11) === "ARealAmount") {
						if (s.Visualizations[0].Content[o].Value.substring(11, 16) !== this.oQuincenaReal) {
							if (this.byId("idAlcance").getSelectedKey() === "2" && this._isAlcance(s.Visualizations[0].Content[o].Value.substring(11, 16),
									this.oQuincenaReal)) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete s.Visualizations[0].Content[o]
								}
							}
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 11) === "APrevAmount") {
						if (s.Visualizations[0].Content[o].Value.substring(11, 16) !== this.oQuincenaReal) {
							if (this.byId("idAlcance").getSelectedKey() === "2" && this._isAlcance(s.Visualizations[0].Content[o].Value.substring(11, 16),
									this.oQuincenaReal)) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete s.Visualizations[0].Content[o]
								}
							}
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 11) === "ADiferencia") {
						if (s.Visualizations[0].Content[o].Value.substring(11, 16) !== this.oQuincenaReal) {
							if (this.byId("idAlcance").getSelectedKey() === "2" && this._isAlcance(s.Visualizations[0].Content[o].Value.substring(11, 16),
									this.oQuincenaReal)) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete s.Visualizations[0].Content[o]
								}
							}
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 14) === "AVarQuinAmount") {
						if (s.Visualizations[0].Content[o].Value.substring(14, 19) !== this.oQuincenaReal) {
							delete s.Visualizations[0].Content[o]
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 15) === "ADisponibleReal") {
						if (s.Visualizations[0].Content[o].Value.substring(15, 20) !== this.oQuincenaReal) {
							delete s.Visualizations[0].Content[o]
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 15) === "ADisponiblePrev") {
						if (s.Visualizations[0].Content[o].Value.substring(15, 20) !== this.oQuincenaReal) {
							delete s.Visualizations[0].Content[o]
						}
					} else if (s.Visualizations[0].Content[o].Value.substring(0, 24) === "ADifMesPasadoConAnterior") {
						if (s.Visualizations[0].Content[o].Value.substring(24, 29) !== this.oQuincenaReal) {
							delete s.Visualizations[0].Content[o]
						}
					} else if (this.first === "X") {
						if (s.Visualizations[0].Content[o].Value === "Division" || s.Visualizations[0].Content[o].Value === "DivisionName") {
							delete s.Visualizations[0].Content[o]
						}
					}
				}
			}
		}
		this.first = "";
		a.setPresentationVariant(s);
		s = a.getPresentationVariant();
		i.setUiState(a)
	},
	_deleteCatalogFieldsOtherYears: function (e, i) {},
	_getQuincena: function () {
		debugger;
		var e = this.byId("idMonth").getSelectedKey();
		var i;
		var r = this.byId("idEjercicio").getSelectedKey();
		r = r.substring(4, 2);
		var t;
		var n = this.byId("idQuincena").getSelectedKey();
		var a;
		if (n === "1") {
			a = 2;
			if (e === "1") {
				i = 12;
				t = r - 1
			} else {
				i = e - 1;
				t = r
			}
		} else {
			a = 1;
			i = e;
			t = r
		}
		if (e < 10) {
			e = "0" + e
		}
		if (i < 10) {
			i = "0" + i
		}
		this.oYearReal = r;
		this.oYearPrev = t;
		this.oQuincenaReal = r + e + n;
		this.oQuincenaPrev = t + i + a;
		this.oQuincenaPrev = this.oQuincenaReal;
		this.oYearPrev = this.oYearReal;
		if (this.oQuincenaReal.substring(4, 5) === "1") {
			this.oQuincenaReal = this.oQuincenaReal.substring(0, 4).concat(2)
		} else {
			this.oQuincenaReal = parseInt(this.oQuincenaReal.substring(0, 4)) + 1;
			if (this.oQuincenaReal < 10) {
				this.oQuincenaReal = 0 + String(this.oQuincenaReal) + "1"
			} else {
				this.oQuincenaReal = String(this.oQuincenaReal) + "1"
			}
		}
		debugger;
		this.SegundaQuincenaUnMesMenos = this._getSegundaQuincenaUnMesMenos(this.oQuincenaReal);
		this.SegundaQuincenaDosMesesMenos = this._getSegundaQuincenaUnMesMenos(this.SegundaQuincenaUnMesMenos)
	},
	_getSegundaQuincenaUnMesMenos: function (e) {
		var i;
		var r = parseInt(e.substring(2, 4)) - 1;
		if (r === 0) {
			i = parseInt(e.substring(0, 2)) - 1 + "122"
		} else if (r < 10) {
			i = this.oQuincenaReal.substring(0, 2) + "0" + r + "2"
		} else {
			i = this.oQuincenaReal.substring(0, 2) + r + "2"
		}
		return i
	},
	_addProperty: function (e, i, r, t) {
		if (i === true) {
			var n = {};
			n.Value = r;
			n.Label = t;
			e.push(n);
			return e
		}
	},
	_regeneratePresentationVariant: function (e) {
		var i;
		for (i = 0; i < e.length; i++) {
			if (e[i].Value.substring(1, 0) === "A") {
				delete e[i]
			}
		}
		var r = this.byId("idReal").getSelectedKey() === "1";
		var t = this.byId("idPrev").getSelectedKey() === "1";
		var n = this.byId("idVarQuin").getSelectedKey() === "1";
		var a = this.byId("idDiferencia").getSelectedKey() === "1";
		var s = this.byId("idDisponibleReal").getSelectedKey() === "1";
		var o = this.byId("idDisponiblePrev").getSelectedKey() === "1";
		this._addProperty(e, r, "ARealAmount20011", "Enero 1ª: Real");
		this._addProperty(e, t, "APrevAmount20011", "Enero 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20011", "Enero 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20011", "Enero 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20011", "Enero 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20011", "Enero 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20011", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20012", "Enero 2ª: Real");
		this._addProperty(e, t, "APrevAmount20012", "Enero 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20012", "Enero 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20012", "Enero 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20012", "Enero 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20012", "Enero 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20012", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20021", "Febrero 1ª: Real");
		this._addProperty(e, t, "APrevAmount20021", "Febrero 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20021", "Febrero 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20021", "Febrero 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20021", "Febrero 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20021", "Febrero 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20021", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20022", "Febrero 2ª: Real");
		this._addProperty(e, t, "APrevAmount20022", "Febrero 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20022", "Febrero 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20022", "Febrero 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20022", "Febrero 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20022", "Febrero 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20022", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20031", "Marzo 1ª: Real");
		this._addProperty(e, t, "APrevAmount20031", "Marzo 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20031", "Marzo 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20031", "Marzo 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20031", "Marzo 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20031", "Marzo 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20031", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20032", "Marzo 2ª: Real");
		this._addProperty(e, t, "APrevAmount20032", "Marzo 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20032", "Marzo 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20032", "Marzo 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20032", "Marzo 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20032", "Marzo 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20032", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20041", "Abril 1ª: Real");
		this._addProperty(e, t, "APrevAmount20041", "Abril 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20041", "Abril 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20041", "Abril 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20041", "Abril 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20041", "Abril 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20041", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20042", "Abril 2ª: Real");
		this._addProperty(e, t, "APrevAmount20042", "Abril 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20042", "Abril 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20042", "Abril 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20042", "Abril 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20042", "Abril 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20042", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20051", "Mayo 1ª: Real");
		this._addProperty(e, t, "APrevAmount20051", "Mayo 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20051", "Mayo 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20051", "Mayo 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20051", "Mayo 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20051", "Mayo 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20051", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20052", "Mayo 2ª: Real");
		this._addProperty(e, t, "APrevAmount20052", "Mayo 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20052", "Mayo 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20052", "Mayo 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20052", "Mayo 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20052", "Mayo 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20052", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20061", "Junio 1ª: Real");
		this._addProperty(e, t, "APrevAmount20061", "Junio 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20061", "Junio 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20061", "Junio 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20061", "Junio 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20061", "Junio 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20061", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20062", "Junio 2ª: Real");
		this._addProperty(e, t, "APrevAmount20062", "Junio 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20062", "Junio 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20062", "Junio 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20062", "Junio 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20062", "Junio 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20062", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20071", "Julio 1ª: Real");
		this._addProperty(e, t, "APrevAmount20071", "Julio 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20071", "Julio 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20071", "Julio 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20071", "Julio 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20071", "Julio 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20071", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20072", "Julio 2ª: Real");
		this._addProperty(e, t, "APrevAmount20072", "Julio 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20072", "Julio 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20072", "Julio 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20072", "Julio 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20072", "Julio 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20072", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20081", "Agosto 1ª: Real");
		this._addProperty(e, t, "APrevAmount20081", "Agosto 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20081", "Agosto 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20081", "Agosto 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20081", "Agosto 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20081", "Agosto 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20081", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20082", "Agosto 2ª: Real");
		this._addProperty(e, t, "APrevAmount20082", "Agosto 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20082", "Agosto 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20082", "Agosto 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20082", "Agosto 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20082", "Agosto 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20082", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20091", "Septiembre 1ª: Real");
		this._addProperty(e, t, "APrevAmount20091", "Septiembre 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20091", "Septiembre 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20091", "Septiembre 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20091", "Septiembre 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20091", "Septiembre 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20091", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20092", "Septiembre 2ª: Real");
		this._addProperty(e, t, "APrevAmount20092", "Septiembre 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20092", "Septiembre 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20092", "Septiembre 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20092", "Septiembre 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20092", "Septiembre 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20092", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20101", "Octubre 1ª: Real");
		this._addProperty(e, t, "APrevAmount20101", "Octubre 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20101", "Octubre 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20101", "Octubre 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20101", "Octubre 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20101", "Octubre 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20101", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20102", "Octubre 2ª: Real");
		this._addProperty(e, t, "APrevAmount20102", "Octubre 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20102", "Octubre 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20102", "Octubre 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20102", "Octubre 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20102", "Octubre 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20102", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20111", "Noviembre 1ª: Real");
		this._addProperty(e, t, "APrevAmount20111", "Noviembre 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20111", "Noviembre 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20111", "Noviembre 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20111", "Noviembre 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20111", "Noviembre 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20111", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20112", "Noviembre 2ª: Real");
		this._addProperty(e, t, "APrevAmount20112", "Noviembre 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20112", "Noviembre 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20112", "Noviembre 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20112", "Noviembre 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20112", "Noviembre 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20112", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20121", "Diciembre 1ª: Real");
		this._addProperty(e, t, "APrevAmount20121", "Diciembre 1ª: Previsión");
		this._addProperty(e, a, "ADiferencia20121", "Diciembre 1ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20121", "Diciembre 1ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20121", "Diciembre 1ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20121", "Diciembre 1ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20121", "Diferencia mes pasado con anterior");
		this._addProperty(e, r, "ARealAmount20122", "Diciembre 2ª: Real");
		this._addProperty(e, t, "APrevAmount20122", "Diciembre 2ª: Previsión");
		this._addProperty(e, a, "ADiferencia20122", "Diciembre 2ª: Diferencia");
		this._addProperty(e, n, "AVarQuinAmount20122", "Diciembre 2ª: Variación Quincenal");
		this._addProperty(e, s, "ADisponibleReal20122", "Diciembre 2ª: Disponible vs Real");
		this._addProperty(e, o, "ADisponiblePrev20122", "Diciembre 2ª: Disponible vs Previsión");
		this._addProperty(e, o, "ADifMesPasadoConAnterior20122", "Diferencia mes pasado con anterior");
		return e
	},
	_isAlcance: function (e, i) {
		var r;
		if (e.substring(4, 5) === "1") {
			r = e.substring(0, 4).concat(2)
		} else {
			r = parseInt(e.substring(0, 4)) + 1;
			if (r < 10) {
				r = 0 + String(r) + "1"
			} else {
				r = String(r) + "1"
			}
		}
		if (r === i) {
			return true
		}
		if (r.substring(4, 5) === "1") {
			r = r.substring(0, 4).concat(2)
		} else {
			r = parseInt(r.substring(0, 4)) + 1;
			if (r < 10) {
				r = 0 + String(r) + "1"
			} else {
				r = String(r) + "1"
			}
		}
		if (r === i) {
			return true
		}
		if (r.substring(4, 5) === "1") {
			r = r.substring(0, 4).concat(2)
		} else {
			r = parseInt(r.substring(0, 4)) + 1;
			if (r < 10) {
				r = 0 + String(r) + "1"
			} else {
				r = String(r) + "1"
			}
		}
		if (r === i) {
			return true
		}
	},
	onClickActionZC_TR_PREV_QUINCENALES_CPResults1: function (e) {
		var i = this.extensionAPI.getNavigationController();
		var r = e.getSource().getBindingContext();
		var t = e.getSource().getParent().getParent().getTable().getBinding().getSelectedContexts()[0].sPath;
		var n = t.lastIndexOf("~");
		var a = t.substring(n + 1, n + 5);
		var s = "PrevisionesCashPooling";
		var o = {
			CompanyCode: a
		};
		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			i.navigateExternal(s, o);
			return true
		}
		return false
	},
	getCustomAppStateDataExtension: function (e) {
		debugger
	},
	restoreCustomAppStateDataExtension: function (e) {
		debugger
	}
});