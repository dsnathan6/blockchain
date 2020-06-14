pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;


contract Plot{
    address public att_aOwner;
    uint32 public att_uPlotCount;
    address att_aNullAdd;
    
    struct StructPUnit{
        address aInvestorAddr;
        address aNewBuyerAddr;
        uint32 uPlotNo;
        uint32 uPUnitNo;
        uint32 uPUnitID;
        bool bReadyForSale;
    }

    struct StructPlot {
        uint32 uPlotNo;
        uint32 uPUnitCount;
        uint256 uPUnitValue;
        address aLeaseeAddr;
        uint32 uLeaseeDuration;
        mapping(uint32=>StructPUnit) map_stPUnit;
    }
    StructPlot[] public att_arr_stPlot;

    constructor() public{
        att_aOwner = msg.sender;
        att_aNullAdd = address(0x0);
    }
    
    
    
    StructPlot att_stPlot;
    StructPUnit  att_stPUnit;
    //Generic function to get Land details

    function ResetPlots() public returns (bool){
        for (uint count = att_arr_stPlot.length ; count > 0 ; -- count){
            att_arr_stPlot.pop();
        }
        return true;
    }

    function GetPlotCount() public returns(uint _plotCount){
        return att_arr_stPlot.length;
    }
    
    event debugListPlots( uint32 _uPlotNo, uint32 _uPUnitCount, uint256 _uPUnitValue, address _aLeaseeAddr, uint32 _uLeaseeDuration);
    event debugListPlotsUnit( address _aInvestorAddr, address aNewBuyerAddr, uint32 uPlotNo, uint32 uPUnitNo, uint32 uPUnitID, bool bReadyForSale);
    
    function GetPlotsAll() public returns(bool){
        for (uint32 pcount=1; pcount < att_arr_stPlot.length; ++pcount){
            emit debugListPlots(att_arr_stPlot[pcount].uPlotNo, att_arr_stPlot[pcount].uPUnitCount, 
                    att_arr_stPlot[pcount].uPUnitValue, att_arr_stPlot[pcount].aLeaseeAddr, att_arr_stPlot[pcount].uLeaseeDuration);
    
            for (uint32 pucount=1; pucount <= att_arr_stPlot[pcount].uPUnitCount;++pucount ){
                att_stPUnit = att_arr_stPlot[pcount].map_stPUnit[pucount];
                emit debugListPlotsUnit(att_stPUnit.aInvestorAddr, att_stPUnit.aNewBuyerAddr, att_stPUnit.uPlotNo,
                        att_stPUnit.uPUnitNo, att_stPUnit.uPUnitID, att_stPUnit.bReadyForSale);
            }
            
        }
        return true;
    }
    
    function GetPlotByID(uint32 _uPlotNo) public returns(bool ){
        emit debugListPlots(att_arr_stPlot[_uPlotNo].uPlotNo, att_arr_stPlot[_uPlotNo].uPUnitCount, 
                att_arr_stPlot[_uPlotNo].uPUnitValue, att_arr_stPlot[_uPlotNo].aLeaseeAddr, att_arr_stPlot[_uPlotNo].uLeaseeDuration);
        for (uint32 pucount=1; pucount <= att_arr_stPlot[_uPlotNo].uPUnitCount;++pucount ){
                att_stPUnit = att_arr_stPlot[_uPlotNo].map_stPUnit[pucount];
                emit debugListPlotsUnit(att_stPUnit.aInvestorAddr, att_stPUnit.aNewBuyerAddr, att_stPUnit.uPlotNo,
                        att_stPUnit.uPUnitNo, att_stPUnit.uPUnitID, att_stPUnit.bReadyForSale);
            }
        return true;
    }
    
    function GetUnitPlotByID(uint32 _uPlotNo, uint32 _uPlotUnitNo) public returns(bool ){
        att_stPUnit = att_arr_stPlot[_uPlotNo].map_stPUnit[_uPlotUnitNo];
        emit debugListPlotsUnit(att_stPUnit.aInvestorAddr, att_stPUnit.aNewBuyerAddr, att_stPUnit.uPlotNo,
                        att_stPUnit.uPUnitNo, att_stPUnit.uPUnitID, att_stPUnit.bReadyForSale);
        return true;
    }
    event debugGetPlotLeasee(address _LeaseeAddress);
    function GetPlotLeasee(uint32 _uPlotNo) public returns(address _leaseeAddress){
        emit debugGetPlotLeasee(att_arr_stPlot[_uPlotNo].aLeaseeAddr);
        return att_arr_stPlot[_uPlotNo].aLeaseeAddr;
    }
    //Land owner functionality
    modifier OnlyLandOwner(){
        require (msg.sender == att_aOwner, "Permission Denied: You are not the owner");
        _;
    }
    
    function InitPlots(uint32 _plotCount) external OnlyLandOwner returns(bool){
        att_uPlotCount = _plotCount;
        ResetPlots();
        att_stPlot.uPlotNo = 0;
        att_stPlot.uPUnitCount = 0;
        att_stPlot.uPUnitValue = 0;
        
        att_arr_stPlot.push(att_stPlot );

        for (uint32 count=1; count <= att_uPlotCount; ++count){
            att_stPlot.uPlotNo = count;
            att_stPlot.uPUnitCount = 0;
            att_stPlot.uPUnitValue = 0;
            att_stPlot.aLeaseeAddr = att_aNullAdd;
            att_stPlot.map_stPUnit[count] = StructPUnit(msg.sender, msg.sender, 0,0,0,false);
            att_arr_stPlot.push(att_stPlot);
            }
    
        return true;
    }
   
    function InitPlotUnit(uint32 _plotID, uint32 _noOfUnits, bool _readyForSale) external OnlyLandOwner returns(bool){
        uint32 temp_uPlotUnitID;
        
                    
        for (uint32 count=1; count <= _noOfUnits; ++count){
            temp_uPlotUnitID = _plotID*100 + count;
            
            att_stPUnit.aInvestorAddr = msg.sender;
            att_stPUnit.aNewBuyerAddr = att_aNullAdd;
            att_stPUnit.uPlotNo = _plotID;
            att_stPUnit.uPUnitNo = count;
            att_stPUnit.uPUnitID = temp_uPlotUnitID;
            att_stPUnit.bReadyForSale= _readyForSale;
            
            att_arr_stPlot[_plotID].map_stPUnit[count]= att_stPUnit;
            att_arr_stPlot[_plotID].uPUnitCount = _noOfUnits;
        }
        return true;
    }

    function SetPUnitValue(uint32 _plotID, uint32 _unitValue) external OnlyLandOwner returns(bool){
        att_arr_stPlot[_plotID].uPUnitValue = _unitValue;
        return true;
    }

    function SetPlotReadyForSaleStatus(uint32 _plotID, bool _bReadyForSale) external returns(bool){
        uint temp_uPUnitCount;
        temp_uPUnitCount = att_arr_stPlot[_plotID].uPUnitCount;
        for ( uint32 count; count <= temp_uPUnitCount; ++count){
            att_arr_stPlot[_plotID].map_stPUnit[count].bReadyForSale = _bReadyForSale;
        }
        return true;
    }
    
    function SetPlotUnitReadyForSaleStatus(uint32 _plotID,uint32 _pUnitID ,bool _bReadyForSale)public returns(bool){
        att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].bReadyForSale = _bReadyForSale;
        return true;
    }

    // Investors required functionality
    function ChkConditionToBuy (uint32 _plotID, uint32 _pUnitID, uint256 _TxValue, address _buyerAddress ) 
                                            public returns(address _presentOwner, uint256 _pUnitValue){
        require(att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].bReadyForSale == true, "PUnit not ready for Sale"); //condition to Sell
        require(_TxValue >= att_arr_stPlot[_plotID].uPUnitValue, "Ether less to Buy Plot Punit"); //condition to buy
        require(att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aInvestorAddr != _buyerAddress, " Owern and buyer is same" );
        //new buyer adress
        att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aNewBuyerAddr = _buyerAddress;
        //Transfer the ownership of the Plot uPUnit
        return (att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aInvestorAddr, att_arr_stPlot[_plotID].uPUnitValue);
    }
    
    function TransferOwnership (uint32 _plotID, uint32 _pUnitID, address _newOwner) public returns(bool){
        require(att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aNewBuyerAddr == _newOwner, "Transfer owern fail, new owner not new buyer");
        
        //Transfer the ownership of the Plot uPUnit
        att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aInvestorAddr = _newOwner;
        att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].aNewBuyerAddr = att_aNullAdd;
        att_arr_stPlot[_plotID].map_stPUnit[_pUnitID].bReadyForSale = false;
        return true;
    }
    
    function ChkConditionToSell(uint32 _PlotNo, uint32 _PUnitNo, address _sellerAddress) public view returns(bool){
        require(att_arr_stPlot[_PlotNo].map_stPUnit[_PUnitNo].aInvestorAddr == _sellerAddress, "You can not owner and hence can not sell");
        return true;
    }
    
    // General  required functionality
    function GetPlotUnitValue(uint32 _plotNo) public view returns(uint256 _PlotUnitValue){
        return(att_arr_stPlot[_plotNo].uPUnitValue);
    }

    function GetPlotRentValue(uint32 _plotNo) public view returns (uint256 _plotRentValue){
        uint256 temp_uPlotRentValue = (att_arr_stPlot[_plotNo].uPUnitValue *  att_arr_stPlot[_plotNo].uPUnitCount);
        return(temp_uPlotRentValue/10);
    }
    
    function GetPlotUnitCount(uint32 _plotNo) public view returns(uint32 _UnitOwnersCount){
        return att_arr_stPlot[_plotNo].uPUnitCount;
    }
    
    function GetPlotUnitOwner(uint32 _plotNo, uint32 _plotUnitNo) public view returns(address _PlotUnitOwnerAddress){
        return att_arr_stPlot[_plotNo].map_stPUnit[_plotUnitNo].aInvestorAddr;
    }
    
    // Leasee required functionality
    function ChkConditionToLeasee(uint32 _plotNo) public view returns( bool _OkToLease){
        //Check if the plot is ready for leasing
        //require(att_arr_stPlot[_plotNo].aLeaseeAddr == att_aNullAdd, "The Plot is not for Leasee");
       
        return (true);
    }
    
    function LeaseePlot(uint32 _plotNo,uint32 _leaseeDuration, address _LeaseeAddress) public returns(bool){
        bool temp_bOkToLeasee = ChkConditionToLeasee(_plotNo);
        require(temp_bOkToLeasee, "The plot is not ready for Leasee");
        att_arr_stPlot[_plotNo].aLeaseeAddr = _LeaseeAddress;
        att_arr_stPlot[_plotNo].uLeaseeDuration = _leaseeDuration;
        return true;
    }
    
    function ChkConditionToUnLeasee(uint32 _plotNo, address _leaseeAdd) public view returns(bool){
        require( att_arr_stPlot[_plotNo].aLeaseeAddr == _leaseeAdd, "You do not have the permission to UnLeasePlot");
        return true;
    }
    
    function UnLeasePlot(uint32 _plotNo, address _leaseeAdd) public returns(bool){
        bool temp_OkToUnleasee = ChkConditionToUnLeasee(_plotNo,_leaseeAdd);
        require (temp_OkToUnleasee, " You are not the leasee to unlease this plot");
        att_arr_stPlot[_plotNo].aLeaseeAddr = att_aNullAdd;
        return true;
    }
}