sap.ui.require("sap/ui/model/json/JSONModel");

sap.ui.controller("ztr.prev.quin.cp.ztr_prevquin_cp.ext.controller.ListReportExt", {

	onInit: function () {

		debugger;
		var oDate = new Date();
		var oEjercicio = oDate.getFullYear();
		var oMonth = oDate.getMonth() + 1;
		var oDay = oDate.getDate();
		if (oDay < 16) {
			this.byId("idQuincena").setSelectedKey("1");
		} else {
			this.byId("idQuincena").setSelectedKey("2");
		}
		this.byId("idMonth").setSelectedKey(oMonth);
		this.byId("idEjercicio").setSelectedKey(oEjercicio);

		this.byId("idReal").setSelectedKey(1);
		this.byId("idPrev").setSelectedKey(1);
		this.byId("idVarQuin").setSelectedKey(1);
		this.byId("idAlcance").setSelectedKey(2);
		this.byId("idDiferencia").setSelectedKey(1);
		this.byId("idDisponibleReal").setSelectedKey(1);
		this.byId("idDisponiblePrev").setSelectedKey(1);

		//Dejamos una marca para gestionar la primera configuración
		this.first = 'X';

	},

	onBeforeRebindTableExtension: function (oEvent) {

		//Coger controles
		var oSmartTable = oEvent.getSource();
		// var oTable = oSmartTable.getTable();
		// //var oTpc = new sap.ui.table.TablePointerExtension(oTable);
		// var oColumns = oTable.getColumns();
		// //for (var i = 0; i < oColumns.length; i++) {
		// //	oTpc.doAutoResizeColumn(i);
		// //}
		// //oTable.getColumns()[1].setStyleClass("admin");
		// //oTable.getColumns()[1].setAutoResizable(true);
		// //oTable.getColumns()[1].setWidth("120px");

		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var path = oSmartFilterBar.getParameterBindingPath();

		var oEjercicio = this.byId("idEjercicio").getSelectedKey();

		//Construir ruta
		this._getQuincena();
		var path = "/ZC_TR_PREV_QUINCENALES_CP(" + "p_quincena_real=%27" + this.oQuincenaReal + "%27,p_quincena_prev=%27" + this.oQuincenaPrev +
			"%27,p_unmesmenos=%27" + this.SegundaQuincenaUnMesMenos +
			"%27,p_dosmesesmenos=%27" + this.SegundaQuincenaDosMesesMenos +
			"%27,p_ejercicio=%27" + oEjercicio +
			"%27)/Results";
		oSmartTable.setTableBindingPath(path);

		var oUiState = oSmartTable.getUiState();
		var oPresentationVariant = oUiState.getPresentationVariant();
		var i;

		this._regeneratePresentationVariant(oPresentationVariant.Visualizations[0].Content);
		this._deleteCatalogFieldsOtherYears(oPresentationVariant.Total, oEjercicio);

		for (i = 0; i < oPresentationVariant.Visualizations[0].Content.length; i++) {

			if (oPresentationVariant.Visualizations[0].Content[i] !== undefined) {
				if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(1, 0) === 'A') {

					// Real
					if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 11) === 'ARealAmount') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16) !== this.oQuincenaReal) {
							if ((this.byId("idAlcance").getSelectedKey() === "2") &&
								(this._isAlcance(oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16), this.oQuincenaReal))) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete oPresentationVariant.Visualizations[0].Content[i];
								}

							}
						}

						//Prevision	
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 11) === 'APrevAmount') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16) !== this.oQuincenaReal) {
							if ((this.byId("idAlcance").getSelectedKey() === "2") &&
								(this._isAlcance(oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16), this.oQuincenaReal))) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete oPresentationVariant.Visualizations[0].Content[i];
								}
							}
						}

						//Diferencia
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 11) === 'ADiferencia') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16) !== this.oQuincenaReal) {
							if ((this.byId("idAlcance").getSelectedKey() === "2") &&
								(this._isAlcance(oPresentationVariant.Visualizations[0].Content[i].Value.substring(11, 16), this.oQuincenaReal))) {} else {
								if (this.byId("idAlcance").getSelectedKey() !== "3") {
									delete oPresentationVariant.Visualizations[0].Content[i];
								}
							}
						}

						//Variación Quincenal
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 14) === 'AVarQuinAmount') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(14, 19) !== this.oQuincenaReal) {
							delete oPresentationVariant.Visualizations[0].Content[i];
						}

						//Disponible vs Real
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 15) === 'ADisponibleReal') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(15, 20) !== this.oQuincenaReal) {
							delete oPresentationVariant.Visualizations[0].Content[i];
						}

					//Disponible vs Prevision
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 15) === 'ADisponiblePrev') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(15, 20) !== this.oQuincenaReal) {
							delete oPresentationVariant.Visualizations[0].Content[i];
						}
						
					//Diferencia del Mes Pasado contra el anterior
					} else if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(0, 24) === 'ADifMesPasadoConAnterior') {
						if (oPresentationVariant.Visualizations[0].Content[i].Value.substring(24, 29) !== this.oQuincenaReal) {
							delete oPresentationVariant.Visualizations[0].Content[i];
						}						

					} else if (this.first === 'X') {
						if ((oPresentationVariant.Visualizations[0].Content[i].Value === 'Division') ||
							(oPresentationVariant.Visualizations[0].Content[i].Value === 'DivisionName')) {
							delete oPresentationVariant.Visualizations[0].Content[i];
						}
					}
				}
			}
		}
		this.first = "";
		oUiState.setPresentationVariant(oPresentationVariant);
		oPresentationVariant = oUiState.getPresentationVariant();
		oSmartTable
			.setUiState(oUiState);

	},

	_deleteCatalogFieldsOtherYears: function (oCatalogo, oEjercicio) {
		//for (var i = 0; i < oCatalogo.length; i++) {
		//	if ( oCatalogo.search(oEjercicio.substr(2,2)) < 0 ) {
		//		delete oCatalogo[i];
		//	}
		//}
	},

	_getQuincena: function () {

		debugger;
		var oMonthReal = this.byId("idMonth").getSelectedKey();
		var oMonthPrev;
		var oYearReal = this.byId("idEjercicio").getSelectedKey();
		oYearReal = oYearReal.substring(4, 2);
		var oYearPrev;
		var oIndiceQuincenaReal = this.byId("idQuincena").getSelectedKey();
		var oIndiceQuincenaPrev;

		if (oIndiceQuincenaReal === '1') {
			oIndiceQuincenaPrev = 2;
			if (oMonthReal === '1') {
				oMonthPrev = 12;
				oYearPrev = oYearReal - 1;
			} else {
				oMonthPrev = oMonthReal - 1;
				oYearPrev = oYearReal;
			}
		} else {
			oIndiceQuincenaPrev = 1;
			oMonthPrev = oMonthReal;
			oYearPrev = oYearReal;
		}

		if (oMonthReal < 10) {
			oMonthReal = "0" + oMonthReal;
		}
		if (oMonthPrev < 10) {
			oMonthPrev = "0" + oMonthPrev;
		}

		this.oYearReal = oYearReal;
		this.oYearPrev = oYearPrev;
		this.oQuincenaReal = oYearReal + oMonthReal + oIndiceQuincenaReal;
		this.oQuincenaPrev = oYearPrev + oMonthPrev + oIndiceQuincenaPrev;

		//Calcular quincena siguiente.
		this.oQuincenaPrev = this.oQuincenaReal;
		this.oYearPrev = this.oYearReal;
		if (this.oQuincenaReal.substring(4, 5) === "1") {
			//Uno mas 041->042
			this.oQuincenaReal = this.oQuincenaReal.substring(0, 4).concat(2);
		} else {
			//Uno mas 032->041
			this.oQuincenaReal = parseInt(this.oQuincenaReal.substring(0, 4)) + 1;
			if (this.oQuincenaReal < 10) {
				this.oQuincenaReal = 0 + String(this.oQuincenaReal) + "1";
			} else {
				this.oQuincenaReal = String(this.oQuincenaReal) + "1";
			}
		}

		debugger;
		//Segunda quincena de un mes menos
		this.SegundaQuincenaUnMesMenos = this._getSegundaQuincenaUnMesMenos(this.oQuincenaReal);
		this.SegundaQuincenaDosMesesMenos = this._getSegundaQuincenaUnMesMenos(this.SegundaQuincenaUnMesMenos);

	},

	_getSegundaQuincenaUnMesMenos: function (oQuincena) {
		var sSegundaQuincenaMesPasado;
		var sMes = parseInt(oQuincena.substring(2, 4)) - 1;
		if (sMes === 0) {
			sSegundaQuincenaMesPasado = parseInt(oQuincena.substring(0, 2)) - 1 + "122";
		} else if (sMes < 10) {
			sSegundaQuincenaMesPasado = this.oQuincenaReal.substring(0, 2) + "0" + sMes + "2";
		} else {
			sSegundaQuincenaMesPasado = this.oQuincenaReal.substring(0, 2) + sMes + "2";
		}
		return sSegundaQuincenaMesPasado;
	},

	_addProperty: function (oContent, oCheck, oPropertyName, oPropertyLabel) {
		if (oCheck === true) {
			var oProperty = {};
			oProperty.Value = oPropertyName;
			oProperty.Label = oPropertyLabel;
			oContent.push(oProperty);
			return oContent;
		}
	},

	_regeneratePresentationVariant: function (oContent) {

		var i;
		for (i = 0; i < oContent.length; i++) {
			if (oContent[i].Value.substring(1, 0) === 'A') {
				delete oContent[i];
			}
		}

		var oReal = this.byId("idReal").getSelectedKey() === "1";
		var oPrev = this.byId("idPrev").getSelectedKey() === "1";
		var oVarQuin = this.byId("idVarQuin").getSelectedKey() === "1";
		var oDiferencia = this.byId("idDiferencia").getSelectedKey() === "1";
		var oDisponibleReal = this.byId("idDisponibleReal").getSelectedKey() === "1";
		var oDisponiblePrev = this.byId("idDisponiblePrev").getSelectedKey() === "1";
		
		this._addProperty(oContent, oReal, "ARealAmount20011", "Enero 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20011", "Enero 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20011", "Enero 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20011", "Enero 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20011", "Enero 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20011", "Enero 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20011", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20012", "Enero 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20012", "Enero 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20012", "Enero 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20012", "Enero 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20012", "Enero 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20012", "Enero 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20012", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20021", "Febrero 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20021", "Febrero 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20021", "Febrero 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20021", "Febrero 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20021", "Febrero 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20021", "Febrero 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20021", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20022", "Febrero 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20022", "Febrero 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20022", "Febrero 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20022", "Febrero 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20022", "Febrero 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20022", "Febrero 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20022", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20031", "Marzo 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20031", "Marzo 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20031", "Marzo 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20031", "Marzo 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20031", "Marzo 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20031", "Marzo 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20031", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20032", "Marzo 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20032", "Marzo 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20032", "Marzo 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20032", "Marzo 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20032", "Marzo 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20032", "Marzo 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20032", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20041", "Abril 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20041", "Abril 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20041", "Abril 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20041", "Abril 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20041", "Abril 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20041", "Abril 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20041", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20042", "Abril 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20042", "Abril 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20042", "Abril 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20042", "Abril 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20042", "Abril 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20042", "Abril 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20042", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20051", "Mayo 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20051", "Mayo 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20051", "Mayo 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20051", "Mayo 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20051", "Mayo 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20051", "Mayo 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20051", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20052", "Mayo 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20052", "Mayo 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20052", "Mayo 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20052", "Mayo 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20052", "Mayo 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20052", "Mayo 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20052", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20061", "Junio 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20061", "Junio 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20061", "Junio 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20061", "Junio 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20061", "Junio 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20061", "Junio 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20061", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20062", "Junio 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20062", "Junio 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20062", "Junio 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20062", "Junio 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20062", "Junio 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20062", "Junio 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20062", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20071", "Julio 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20071", "Julio 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20071", "Julio 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20071", "Julio 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20071", "Julio 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20071", "Julio 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20071", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20072", "Julio 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20072", "Julio 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20072", "Julio 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20072", "Julio 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20072", "Julio 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20072", "Julio 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20072", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20081", "Agosto 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20081", "Agosto 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20081", "Agosto 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20081", "Agosto 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20081", "Agosto 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20081", "Agosto 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20081", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20082", "Agosto 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20082", "Agosto 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20082", "Agosto 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20082", "Agosto 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20082", "Agosto 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20082", "Agosto 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20082", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20091", "Septiembre 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20091", "Septiembre 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20091", "Septiembre 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20091", "Septiembre 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20091", "Septiembre 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20091", "Septiembre 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20091", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20092", "Septiembre 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20092", "Septiembre 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20092", "Septiembre 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20092", "Septiembre 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20092", "Septiembre 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20092", "Septiembre 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20092", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20101", "Octubre 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20101", "Octubre 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20101", "Octubre 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20101", "Octubre 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20101", "Octubre 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20101", "Octubre 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20101", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20102", "Octubre 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20102", "Octubre 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20102", "Octubre 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20102", "Octubre 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20102", "Octubre 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20102", "Octubre 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20102", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20111", "Noviembre 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20111", "Noviembre 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20111", "Noviembre 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20111", "Noviembre 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20111", "Noviembre 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20111", "Noviembre 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20111", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20112", "Noviembre 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20112", "Noviembre 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20112", "Noviembre 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20112", "Noviembre 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20112", "Noviembre 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20112", "Noviembre 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20112", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20121", "Diciembre 1ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20121", "Diciembre 1ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20121", "Diciembre 1ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20121", "Diciembre 1ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20121", "Diciembre 1ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20121", "Diciembre 1ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20121", "Diferencia mes pasado con anterior");
		this._addProperty(oContent, oReal, "ARealAmount20122", "Diciembre 2ª: Real");
		this._addProperty(oContent, oPrev, "APrevAmount20122", "Diciembre 2ª: Previsión");
		this._addProperty(oContent, oDiferencia, "ADiferencia20122", "Diciembre 2ª: Diferencia");
		this._addProperty(oContent, oVarQuin, "AVarQuinAmount20122", "Diciembre 2ª: Variación Quincenal");
		this._addProperty(oContent, oDisponibleReal, "ADisponibleReal20122", "Diciembre 2ª: Disponible vs Real");
		this._addProperty(oContent, oDisponiblePrev, "ADisponiblePrev20122", "Diciembre 2ª: Disponible vs Previsión");
		this._addProperty(oContent, oDisponiblePrev, "ADifMesPasadoConAnterior20122", "Diferencia mes pasado con anterior");

		return oContent;
	},

	_isAlcance: function (oCandidato, oQuincena) {

		var oCalculo;

        //Uno mas
		if (oCandidato.substring(4, 5) === "1") {
			//Uno mas 041->042
			oCalculo = oCandidato.substring(0, 4).concat(2);
		} else {
			//Uno mas 032->041
			oCalculo = parseInt(oCandidato.substring(0, 4)) + 1;
			if (oCalculo < 10) {
				oCalculo = 0 + String(oCalculo) + "1";
			} else {
				oCalculo = String(oCalculo) + "1";
			}

		}
		if (oCalculo === oQuincena) {
			return true;
		}


		//Dos Mas
		if (oCalculo.substring(4, 5) === "1") {
			//Uno mas 041->042
			oCalculo = oCalculo.substring(0, 4).concat(2);
		} else {
			//Uno mas 032->041
			oCalculo = parseInt(oCalculo.substring(0, 4)) + 1;
			if (oCalculo < 10) {
				oCalculo = 0 + String(oCalculo) + "1";
			} else {
				oCalculo = String(oCalculo) + "1";
			}

		}
		if (oCalculo === oQuincena) {
			return true;
		}
		
		//Tres meses mas
		if (oCalculo.substring(4, 5) === "1") {
			//Uno mas 041->042
			oCalculo = oCalculo.substring(0, 4).concat(2);
		} else {
			//Uno mas 032->041
			oCalculo = parseInt(oCalculo.substring(0, 4)) + 1;
			if (oCalculo < 10) {
				oCalculo = 0 + String(oCalculo) + "1";
			} else {
				oCalculo = String(oCalculo) + "1";
			}

		}
		if (oCalculo === oQuincena) {
			return true;
		}
		
		
		
		// if (oCandidato.substring(4, 5) === "2") {
		// 	//Uno menos 042->041
		// 	oCalculo = oCandidato.substring(0, 4).concat(1);
		// } else {
		// 	//Uno menos 041->032
		// 	if (oCandidato !== "011") {
		// 		oCalculo = parseInt(oCandidato.substring(0, 4)) - 1;
		// 		if (oCalculo < 10) {
		// 			oCalculo = 0 + String(oCalculo) + "2";
		// 		} else {
		// 			oCalculo = String(oCalculo) + "2";
		// 		}
		// 	}
		// }
		// if (oCalculo === oQuincena) {
		// 	return true;
		// }

	},
	onClickActionZC_TR_PREV_QUINCENALES_CPResults1: function (oEvent) {

		var oNavigationController = this.extensionAPI.getNavigationController();
		var oBindingContext = oEvent.getSource().getBindingContext();

		//var oSelectedCompanyCode = oBindingContext.getObject();
		//var sCompanyCode = oSelectedCompanyCode.CompanyCode;

		//var sPath = oEvent.getSource().getParent().getParent().getTable().getSelectedContexts()[0].sPath;
		var sPath = oEvent.getSource().getParent().getParent().getTable().getBinding().getSelectedContexts()[0].sPath;

		var sChurro = sPath.lastIndexOf("~");
		var sCompanyCode = sPath.substring(sChurro + 1, sChurro + 5);

		var sOutbound = "PrevisionesCashPooling";
		var mParameters = {
			CompanyCode: sCompanyCode
		};
		if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
			oNavigationController.navigateExternal(sOutbound, mParameters);
			return true;
		}
		return false;

	},
	/*
	 * Content of the custom field shall be stored in the app state, so that it can be restored later again e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */
	getCustomAppStateDataExtension: function (oCustomAppData) {
		debugger;
		/*
		var oCustomField1 = this.oView.byId("SampleFilterFieldID");
		if (oCustomField1) {
			oCustomAppData.SampleFilterFieldID = oCustomField1.getValue();
		}
		return oCustomAppData;
		*/
	},
	/*
	 * In order to restore content of the custom field in the filterbar e.g. after a back navigation.
	 * @param oCustomData  : referance to the custome data.
	 */
	restoreCustomAppStateDataExtension: function (oCustomAppData) {
		debugger;
		/*
		if (oCustomAppData.SampleFilterFieldID !== undefined) {
			if ( this.oView.byId("SampleFilterFieldID") ) {
				this.oView.byId("SampleFilterFieldID").setSelectedKey(oCustomAppData.SampleFilterFieldID);
			}
		}
		*/
	}
});