const PlotContract = artifacts.require('Plot');

contract('Suite-DEBUG: Get/ Change Plot Data', async (accounts)=>{
    var hPlot = await PlotContract.deployed();

     it('Debug: CreateArray', async()=>{
        console.log("In the create arry fun")
        await hPlot.InitPlots(10);
        await hPlot.InitPlotUnit(1, 9, true);
        await hPlot.InitPlotUnit(2, 9, true);
        await hPlot.InitPlotUnit(3, 9, true);
        await hPlot.SetPUnitValue(1, 10);
        await hPlot.SetPUnitValue(2, 10);
        await hPlot.SetPUnitValue(3, 10);

        await hPlot.GetPlotsAll();
        let temp_AllPlot = await hPlot.getPastEvents('debugListPlots',
        { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' })
        let result = temp_AllPlot;
        console.log("ALL PLOT INFO", result)
        
     })

     it('DeletePlot', async()=>{
        let result = await hPlot.ResetPlots()
        console.log("Deleted the array")
        
     })

     it('GetPlotSize', async()=>{
        let result = await hPlot.GetPlotCount()
        console.log( " Lenght of the array:", result)
        
     })
    })
