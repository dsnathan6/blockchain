
const PlotContract = artifacts.require('Plot');
const ClientContract = artifacts.require('Client');


contract('Suite-3 : Client Contract function chk', async (accounts)=>{
    var hPlot;

    beforeEach(
        async()=>{
        
            hPlot = await PlotContract.deployed();
            assert.isNotNull(hPlot.addres);
            hClient = await ClientContract.deployed();
            assert.isNotNull(hClient.addres);

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
            //console.msg ("OWNER OF THE CONTRACT:", owner)
        }

     )
     
     it('GetPlotRentValue: Get the Rent value of the plot', 
     async()=>{
        var result = await hPlot.GetPlotRentValue(2);
        assert.equal(result, 18, "Wrong Rent Value");
        }
     )
  
     it('BuyPlotUnits from client: Buy the plotunit', 
     async ()=>{
        var result;
        var temp_buyerAcc = 6;
        result = await hPlot.GetPlotUnitOwner(1,3);
        assert.equal(accounts[0], result);
        //console.log ("ADD-0 ", accounts[0]);
        //console.log("ADD-1", accounts[temp_buyerAcc]);
      
        //console.log("Balance of Account-0 before selling", await web3.eth.getBalance(accounts[0]));
        //console.log("Balance of Account-1 before selling", await web3.eth.getBalance(accounts[temp_buyerAcc]));
        //let temp_txval = web3.utils.fromWei(1, 'ether')
        result = await hClient.BuyPlotUnits(1, 3, {value: 100, from:accounts[temp_buyerAcc]});//10000000000000000000
        result = await hPlot.GetPlotUnitOwner(1, 3);
        //console.log("DSN: Owner Account of Plot 1 unit 3 is:", result);
        assert.equal(accounts[temp_buyerAcc], result);

        //console.log("Balance of Account-0 after selling", await web3.eth.getBalance(accounts[0]));
        //console.log("Balance of Account-1 after selling", await web3.eth.getBalance(accounts[temp_buyerAcc]));
        }
     )
   
     it('SellPlotUnit from client: Sell the plotunit', 
     async ()=>{
        var result;
        await hPlot.SetPlotUnitReadyForSaleStatus(3, 3, false);
        await hPlot.GetUnitPlotByID(3,3);
        let temp_plotunit = await hPlot.getPastEvents('debugListPlotsUnit',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        result = temp_plotunit[temp_plotunit.length-1].returnValues;
        assert.isFalse(result.bReadyForSale);
        
        let temp_PlotUnitOwnerBeforeSelling = await hPlot.GetPlotUnitOwner(3, 3);
        await hClient.SellPlotUnit(3, 3);
    
        await hPlot.GetUnitPlotByID(3,3);
        temp_plotunit = await hPlot.getPastEvents('debugListPlotsUnit',
                { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
            )
        result = temp_plotunit[temp_plotunit.length-1].returnValues;
        assert.isTrue(result.bReadyForSale);
        let temp_PlotUnitOwnerAfterSelling = await hPlot.GetPlotUnitOwner(3, 3);
        assert.equal(temp_PlotUnitOwnerAfterSelling, temp_PlotUnitOwnerBeforeSelling);
        
        }
     )

     it('List Owned Plot Info by Me',
      async()=>{
         let temp_BuyerAdd = 9;
         
         await hClient.BuyPlotUnits(1, 2, {value: 100, from:accounts[temp_BuyerAdd]});
         await hClient.BuyPlotUnits(3, 2, {value: 100, from:accounts[temp_BuyerAdd]});
         await hClient.BuyPlotUnits(1, 3, {value: 100, from:accounts[temp_BuyerAdd]});
         await hClient.BuyPlotUnits(3, 3, {value: 100, from:accounts[temp_BuyerAdd]});
         await hClient.SellPlotUnit(3, 2);
         await hClient.SellPlotUnit(1, 2);
         await hClient.BuyPlotUnits(1, 5, {value: 100, from:accounts[temp_BuyerAdd]});
         await hClient.BuyPlotUnits(1, 6, {value: 100, from:accounts[temp_BuyerAdd]});
         

         await hClient.GetPlotUnitsOwnedByMe({from:accounts[temp_BuyerAdd]});
         let temp_LeassedPlot = await hClient.getPastEvents('debugGetPlotUnitsOwnedByMe',
         { filter: { account: accounts[temp_BuyerAdd] }, fromBlock: 0, toBlock: 'latest' })

         for (let count = 0; count < temp_LeassedPlot.length; ++count) {
            let result = temp_LeassedPlot[count].returnValues
            switch(count){
               case 0:
                  assert.equal(result._PlotNo, 1);
                  assert.equal(result._UPlotNo, 2)
                  assert.equal(result._UPStatus, 0)
                  break;
               case 1:
                  assert.equal(result._PlotNo, 3);
                  assert.equal(result._UPlotNo, 2)
                  assert.equal(result._UPStatus, 0)
                  break
               case 2:
                  assert.equal(result._PlotNo, 1);
                  assert.equal(result._UPlotNo, 3)
                  assert.equal(result._UPStatus, 0)
                  break
               case 3:
                  assert.equal(result._PlotNo, 3);
                  assert.equal(result._UPlotNo, 3)
                  assert.equal(result._UPStatus, 0)
                  break
               case 4:
                  assert.equal(result._PlotNo, 1);
                  assert.equal(result._UPlotNo, 5)
                  assert.equal(result._UPStatus, 0)
                  break
               case 5:
                  assert.equal(result._PlotNo, 1);
                  assert.equal(result._UPlotNo, 6)
                  assert.equal(result._UPStatus, 0)
                  break
               default:
                  break
            }
 
         }

      })

     it('LeasePlot: Lease Plots',
     async()=>{
        
        var result;
        let temp_address = 0; //not defined
        await hPlot.GetPlotByID(1);
        var temp_plot = await hPlot.getPastEvents('debugListPlots',
        { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
        )
        result = temp_plot[temp_plot.length-1].returnValues;
        assert.equal(result._aLeaseeAddr, temp_address);

        await hClient.LeaseePlot(1,12,{from:accounts[3]} );
        
        await hPlot.GetPlotByID(1);
        temp_plot = await hPlot.getPastEvents('debugListPlots',
        { filter: { account: accounts[0] }, fromBlock: 0, toBlock: 'latest' }
        )
        result = temp_plot[temp_plot.length-1].returnValues;
        assert.equal(result._aLeaseeAddr, accounts[3]);
     })
     

     it('Pay Rent : Pay Rent',
     async()=>{
        result = await hClient.BuyPlotUnits(1, 1, {value: 10, from:accounts[5]});
        result = await hClient.BuyPlotUnits(1, 2, {value: 10, from:accounts[5]});
        result = await hClient.BuyPlotUnits(1, 3, {value: 10, from:accounts[9]});
        result = await hClient.BuyPlotUnits(1, 4, {value: 10, from:accounts[9]});
        result = await hClient.BuyPlotUnits(1, 5, {value: 10, from:accounts[8]});
        result = await hClient.BuyPlotUnits(1, 6, {value: 10, from:accounts[8]});
        
        
        console.log("Balance of Account-9 before Leasing", await web3.eth.getBalance(accounts[9]));
        console.log("Balance of Account-8 before Leasing", await web3.eth.getBalance(accounts[8]));
        console.log("Balance of Account-5 before Leasing", await web3.eth.getBalance(accounts[5]));
        console.log("Balance of Account-4 After Leasing ", await web3.eth.getBalance(accounts[4]));
        
        await hClient.LeaseePlot(1,12,{from:accounts[4]} );
        hClient.PayRent(1, {value: 100*1000000000000, from: accounts[4]});
         
        console.log("Balance of Account-4 After Leasing ", await web3.eth.getBalance(accounts[4]));
        console.log("Balance of Account-8 After Leasing", await web3.eth.getBalance(accounts[8]));
        console.log("Balance of Account-5 After Leasing", await web3.eth.getBalance(accounts[5]));
        console.log("Balance of Account-9 After Leasing ", await web3.eth.getBalance(accounts[9]));
      
     })
     
   
     it('Un LeasePlot: Un Lease Plots',
     async()=>{
      //Leasee a plot with an acccount mentioned in temp_LeasseeAdd
      var temp_LeaseeAdd = 4;
      await hClient.LeaseePlot(1, 12,{from:accounts[temp_LeaseeAdd]} );

      //Check if the leaseeing has happend
      await hPlot.GetPlotByID(1);
      temp_plot = await hPlot.getPastEvents('debugListPlots',
        { filter: { account: accounts[temp_LeaseeAdd] }, fromBlock: 0, toBlock: 'latest' }
        )
      result = temp_plot[temp_plot.length-1].returnValues;
      assert.equal(result._aLeaseeAddr, accounts[temp_LeaseeAdd]);

      //Unleasee the plot
      await hClient.UnLeasePlot(1,{from:accounts[temp_LeaseeAdd]} );
      
      //Try to UnLeasee the alreay unleasee plot, which should throw an error message
      try {
         await hClient.UnLeasePlot(1,{from:accounts[temp_LeaseeAdd]} );
       } catch(err) {
         assert.equal(err.reason, "You do not have the permission to UnLeasePlot");
       }
      
      //Chekc the Leasee Address to be 0
      await hPlot.GetPlotByID(1);
      let temp_plot1 = await hPlot.getPastEvents('debugListPlots',
       { filter: { account: accounts[temp_LeaseeAdd] }, fromBlock: 0, toBlock: 'latest' }
       )
      result = temp_plot1[temp_plot1.length-1].returnValues;
      assert.equal(result._aLeaseeAddr, 0);

     })

     it('List Leassed Info by Me: Leasee Info',
     async()=>{
      let temp_LeaseeAdd = 4;
      await hClient.LeaseePlot(1, 12, {from:accounts[temp_LeaseeAdd]});
      await hClient.LeaseePlot(3, 12, {from:accounts[temp_LeaseeAdd]});
      await hClient.UnLeasePlot(3, {from:accounts[temp_LeaseeAdd]});
      await hClient.UnLeasePlot(1, {from:accounts[temp_LeaseeAdd]});
      await hClient.LeaseePlot(1, 12, {from:accounts[temp_LeaseeAdd]});
      await hClient.LeaseePlot(3, 12, {from:accounts[temp_LeaseeAdd]});
      await hClient.UnLeasePlot(3, {from:accounts[temp_LeaseeAdd]});
      await hClient.UnLeasePlot(1, {from:accounts[temp_LeaseeAdd]});

      
      await hClient.GetPlotUnitsLeasedByMe({from:accounts[temp_LeaseeAdd]});
      let temp_LeassedPlot = await hClient.getPastEvents('dubugGetPlotUnitsLeasedByMe',
       { filter: { account: accounts[temp_LeaseeAdd] }, fromBlock: 0, toBlock: 'latest' }
       )

      for (let count = 3; count < temp_LeassedPlot.length; ++count) {
         let result = temp_LeassedPlot[count].returnValues;
         switch(count) {
            case 3:
              assert.equal(result._PlotNoLeassed,1);
              assert.equal(result._PlotLeassStatus,0)
              break;
            case 4:
              assert.equal(result._PlotNoLeassed,3);
              assert.equal(result._PlotLeassStatus,0)
              break;
            case 5:
               assert.equal(result._PlotNoLeassed,3);
               assert.equal(result._PlotLeassStatus,1)
              break;
            case 6:
               assert.equal(result._PlotNoLeassed,1);
               assert.equal(result._PlotLeassStatus,1)
              break;
            case 7:
               assert.equal(result._PlotNoLeassed,1);
               assert.equal(result._PlotLeassStatus,0)
               break;
            case 8:
               assert.equal(result._PlotNoLeassed,3);
               assert.equal(result._PlotLeassStatus,0)
               break;
            case 9:
                assert.equal(result._PlotNoLeassed,3);
                assert.equal(result._PlotLeassStatus,1)
               break;
            case 10:
                assert.equal(result._PlotNoLeassed,1);
                assert.equal(result._PlotLeassStatus,1)
               break;
            default:
              // code block
          }
      
      }
      
     })

     

})
