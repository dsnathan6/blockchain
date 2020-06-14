
const PlotContract = artifacts.require('Plot');


contract('Suite-1 : Initialise the Plot', async (accounts)=>{
    var hPlot;
    it ('Deploy the Plot Contract', 
    async()=>{
        hPlot = await PlotContract.deployed();
        console.log("Address of the PLOT contract", hPlot.address);
        assert(hPlot.addres != 0);
    }
    )

    it ('InitPlots: Init Plot with 6 plots', 
    async()=>{
        let result = await hPlot.InitPlots(6);
        assert(result != 0);
    }
    )

    it ('InitPlotUnit:  Init Plots with 9 Units Each', 
    async()=>{
        let result = await hPlot.InitPlotUnit(1, 9, true);
        assert(result != 0);
        result = await hPlot.InitPlotUnit(2, 9, false);
        assert(result != 0);
        result = await hPlot.InitPlotUnit(3, 9, true);
        assert(result != 0);
        result = await hPlot.InitPlotUnit(4, 9, false);
        assert(result != 0);
        result = await hPlot.InitPlotUnit(5, 9, true);
        assert(result != 0);
        result = await hPlot.InitPlotUnit(6, 9, false);
        assert(result != 0);
        
    }
    )

    it ('SetPUnitValue: Init Plots with Value /Units', 
    async()=>{
        let result = await hPlot.SetPUnitValue(1, 10);
        assert(result != 0);
        result = await hPlot.SetPUnitValue(2, 20);
        assert(result != 0);
        result = await hPlot.SetPUnitValue(3, 30);
        assert(result != 0);
        result = await hPlot.SetPUnitValue(4, 40);
        assert(result != 0);
        result = await hPlot.SetPUnitValue(5, 50);
        assert(result != 0);
        result = await hPlot.SetPUnitValue(6, 60);
        assert(result != 0);
    }
    )

})

contract('Suite-2 : Get/ Change Plot Data', async (accounts)=>{
    var hPlot;
    var owner;
    beforeEach(
        async()=>{
            hPlot = await PlotContract.deployed();
            assert(hPlot.addres != 0);
            let result = await hPlot.InitPlots(6);
            assert(result != 0);

            result = await hPlot.InitPlotUnit(1, 9, true);
            assert(result != 0);
            result = await hPlot.InitPlotUnit(2, 9, false);
            assert(result != 0);
            result = await hPlot.InitPlotUnit(3, 9, true);
            result = await hPlot.SetPUnitValue(1, 10);
            assert(result != 0);
            result = await hPlot.SetPUnitValue(2, 20);
            assert(result != 0);
            result = await hPlot.SetPUnitValue(3, 30);
            owner = await hPlot.att_aOwner();
        }
     )
     it('DebugSetup:Init', async()=>{
        await hPlot.GetPlotsAll();
        let temp_AllPlot = await hPlot.getPastEvents('debugListPlots',
        { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' })
        let result = temp_AllPlot;
        console.log("ALL PLOT INFO", result)
        /*
        temp_AllPlot = await hPlot.getPastEvents('debugListPlotsUnit',
        { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' })
        result = temp_AllPlot;
        console.log("ALL PLOT UNIT INFO", result)
        */
        
     })
    
     it('GetPlotRentValue: Get the Rent value of the plot', 
     async()=>{
        var result = await hPlot.GetPlotRentValue(2);
        assert.equal(result, 18, "Wrong Rent Value");
        }
     )
     
     it('GetPlotUnitCount: Get the plot unit count', 
     async()=>{
        var result = await hPlot.GetPlotUnitCount (1);
        assert.equal(result,9, "Incorrect Value : Plot unit count");
        }
     )
     
     it('GetPlotUnitOwner: Get the Plot unit owner', 
     async()=>{
        let result = await hPlot.GetPlotUnitOwner(2, 1);
        assert.equal(result,owner, "Incorect Owner");
        }
     )

    it ('SetPlotReadyForSaleStatus: Init Plots with Value /Units', 
    async()=>{
        let result = await hPlot.SetPlotReadyForSaleStatus(1, false);
        result = await hPlot.GetPlotByID(1);
        let temp_plot = await hPlot.getPastEvents('debugListPlots',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        //console.log("My Plot :", temp_plot);
        result = temp_plot[temp_plot.length-1].returnValues;
        assert.equal(result._uPlotNo, 1);

        let temp_plotunit = await hPlot.getPastEvents('debugListPlotsUnit',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        //console.log("My Plot unit :", temp_plotunit);
        result = temp_plotunit[temp_plotunit.length-1].returnValues;
        assert.isFalse(result.bReadyForSale);

        }
    )

    it ('GetPlotByID: Init Plots with Value /Units', 
    async()=>{
        
        await hPlot.GetUnitPlotByID(1,3);
        let temp_plotunit = await hPlot.getPastEvents('debugListPlotsUnit',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        let result = temp_plotunit[temp_plotunit.length-1].returnValues;
        assert.equal(result._aInvestorAddr, accounts[0]);
        assert.equal(result.uPUnitID, 103);
        assert.isTrue(result.bReadyForSale);

        await hPlot.SetPlotReadyForSaleStatus(1, false);
        await hPlot.GetUnitPlotByID(1,3);
        temp_plotunit = await hPlot.getPastEvents('debugListPlotsUnit',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        result = temp_plotunit[temp_plotunit.length-1].returnValues;
        assert.equal(result._aInvestorAddr, accounts[0]);
        assert.equal(result.uPUnitID, 103);
        assert.isFalse(result.bReadyForSale);

    }
    )

   
})
