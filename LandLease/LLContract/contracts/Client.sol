pragma solidity >=0.6.6 <0.7.0;
pragma experimental ABIEncoderV2;
import './Plot.sol';

contract Client{
    
    address public addPlotContract;
    Plot public hPlotContract;
    
    address blackListedLesee;
    enum PlotLeaseStatus{ LEASED, UNLEASED }
    
    struct StructPlotLeseeTx{
        uint32 uPlotNo;
        PlotLeaseStatus ePlotLeaseStatus;
    }
    mapping(address=>StructPlotLeseeTx[]) mapLeaseeInfo;
    
    enum EnumPlotUnitOwnedSold{ OWNED, SOLD }
    
    
    struct StructPlotUnitTx{
        uint32 uPlotNo;
        uint32 uUPlotNo;
        EnumPlotUnitOwnedSold eUPStatus;
    }
    
    mapping(address=>StructPlotUnitTx[]) mapInvistorInfo;
    
    constructor (address _addPlotContract) public {
        addPlotContract = _addPlotContract;
        hPlotContract = Plot(addPlotContract);
    }
    
    event ListPlotInfo( address _hPlotContract, address _LandOwner, uint32 _att_uPlotCount);
    function debugGetPlotAdd() public  returns(bool){
        hPlotContract.GetPlotByID(1);
        emit ListPlotInfo(addPlotContract, hPlotContract.att_aOwner(), hPlotContract.att_uPlotCount() );
        return true;
    }
    function GetAccBalance(address _accBalance) public view returns(uint){
        return (_accBalance.balance);
    }

    //Functions to  Buying the plot unit
    function BuyPlotUnits(uint32 _PlotNo, uint32 _PUnitNo) public payable returns(bool){
        
        address temp_aPresentOwner;
        uint256 temp_uPUnitValue;
        
        (temp_aPresentOwner, temp_uPUnitValue) = hPlotContract.ChkConditionToBuy ( _PlotNo,  _PUnitNo, msg.value , msg.sender);
        bool temp_bSentSuccess = payable(temp_aPresentOwner).send(temp_uPUnitValue);//*1000000000000000000);
        require(temp_bSentSuccess, "Failed to send Ether for Buying");
        
        bool temp_bTxOwnerSuccess = hPlotContract.TransferOwnership( _PlotNo, _PUnitNo, msg.sender);
        require(temp_bTxOwnerSuccess, "Failed to send Transfer the ownership");
        for (uint32 count = 0 ; count < mapInvistorInfo[msg.sender].length;++count ){
            if( mapInvistorInfo[msg.sender][count].uPlotNo == _PlotNo){
                if(mapInvistorInfo[msg.sender][count].uUPlotNo == _PUnitNo){
                    mapInvistorInfo[msg.sender][count].eUPStatus = EnumPlotUnitOwnedSold.SOLD;
                }
            }
        }
       
        
        //Update the Investor record
        mapInvistorInfo[msg.sender].push(StructPlotUnitTx(_PlotNo,_PUnitNo, EnumPlotUnitOwnedSold.OWNED) );
        
        return true;
        
    }
    

    function SellPlotUnit (uint32 _PlotNo, uint32 _PUnitNo) public returns(bool){
        bool temp_bValidOwner = hPlotContract.ChkConditionToSell(_PUnitNo, _PUnitNo, msg.sender);
        require(temp_bValidOwner, "You do not own the Unit to Sell");
        hPlotContract.SetPlotUnitReadyForSaleStatus(_PlotNo, _PUnitNo, true);
        return true;
    }

    event debugGetPlotUnitsOwnedByMe(uint32 _PlotNo, uint32 _UPlotNo, EnumPlotUnitOwnedSold _UPStatus);
    event debugPropertyOwned(uint temp_CountOfTx);
    StructPlotUnitTx att_stPlotUnitTx;
    function GetPlotUnitsOwnedByMe() public returns(bool){
        uint temp_CountOfTx = mapInvistorInfo[msg.sender].length;
        emit debugPropertyOwned(temp_CountOfTx);
        require(temp_CountOfTx >0, "No property OWNED");
        for (uint count=0; count < temp_CountOfTx; ++count){
            att_stPlotUnitTx = mapInvistorInfo[msg.sender][count];
            emit debugGetPlotUnitsOwnedByMe ( att_stPlotUnitTx.uPlotNo, att_stPlotUnitTx.uUPlotNo, att_stPlotUnitTx.eUPStatus);
        }
        return true;
    }
    
    //Functions to leasee the plot
    function GetPlotRentValue(uint32 _plotNo) public view returns(uint256 _uRentValue){
        uint256 temp_uRentValue = hPlotContract.GetPlotRentValue(_plotNo);
        return(temp_uRentValue);
    }
    
    function LeaseePlot(uint32 _plotNo, uint32 _leaseeDuration) public returns(bool){
        bool temp_bLeaseeSuccess = hPlotContract.LeaseePlot(_plotNo,_leaseeDuration, msg.sender);
        require(temp_bLeaseeSuccess, "The plot is Leaseed successfully");
        mapLeaseeInfo[msg.sender].push(StructPlotLeseeTx(_plotNo, PlotLeaseStatus.LEASED));
        return true;
    }
    
    function PayRent(uint32 _plotNo) public payable returns(bool){
        address temp_aUnitOwernAddress;
        
        uint32 temp_uNoOfUnitOwners = hPlotContract.GetPlotUnitCount(_plotNo);
        uint256 temp_uPlotValue = hPlotContract.GetPlotRentValue(_plotNo);
        uint256 temp_uUnitRentValue = temp_uPlotValue/temp_uNoOfUnitOwners;
        
        for(uint32 count=1; count <= temp_uNoOfUnitOwners; ++count){
            temp_aUnitOwernAddress = hPlotContract.GetPlotUnitOwner(_plotNo, count);
            bool temp_bRentPaidSuccessful = payable(temp_aUnitOwernAddress).send(temp_uUnitRentValue);
            require(temp_bRentPaidSuccessful, "Rent Not paid successfully");
        }
        
    }

    function UnLeasePlot( uint32 _plotNo) public returns(bool) {
        bool temp_bUnleaseeSuccess = hPlotContract.UnLeasePlot(_plotNo, msg.sender);
        require(temp_bUnleaseeSuccess, "Plot is not UNLEASED");
        mapLeaseeInfo[msg.sender].push(StructPlotLeseeTx(_plotNo, PlotLeaseStatus.UNLEASED));
        return true;
    }
    
    event dubugGetPlotUnitsLeasedByMe(uint32 _PlotNoLeassed,  PlotLeaseStatus _PlotLeassStatus);
    StructPlotLeseeTx att_stPlotLeassTx;
    function GetPlotUnitsLeasedByMe() public returns(bool){
        uint temp_CountOfTx = mapLeaseeInfo[msg.sender].length;
        require(temp_CountOfTx >0, "No property LEASED");
        for (uint count=0; count < temp_CountOfTx; ++count){
            att_stPlotLeassTx = mapLeaseeInfo[msg.sender][count];
            emit dubugGetPlotUnitsLeasedByMe (att_stPlotLeassTx.uPlotNo, att_stPlotLeassTx.ePlotLeaseStatus);
        } 
    }

}