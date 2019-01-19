import React, { Component } from 'react'
import {connect} from 'react-redux';
import {StyleSheet,View,Platform,Alert} from 'react-native';
import {fetchMyReceiptDetails,deleteReceipts,shareReceipt} from '../store/actions/receipts';
import RenderPDF from '../components/RenderPDF';
import RenderHTML from '../components/RenderHTML';
import {Navigation} from 'react-native-navigation';
import { modalOpen,resetUIState} from '../store/actions/ui';
import {showAddReceipt} from '../components/addReceipt';


 class ReceiptDetail extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
       
      }
    navigationButtonPressed({ buttonId }) {
      
      if(buttonId==='edit'){
       this.editReceipt();
      }else if(buttonId==='delete'){
        this.deleteReceipt();
      }
      else if(buttonId==='share'){
        this.shareReceipt();
      }
    }
    /* Edits the given receipt */
    editReceipt=()=>{
     //PUSH NEW ADDRECEIPT SCREEN
     this.props.openModal();
     const receipt={
        ...this.props.receiptDetail.receipt,
        uri:this.props.receiptDetail.uri
     }
    
     showAddReceipt(receipt,true);
    }
    /* Method to share the receipt */
    shareReceipt=()=>{
      this.props.shareReceipt(this.props.receipt);
    }
    /* Deletes the given receipt */
    deleteReceipt=()=>{
     const deletableReceipts=[];
     deletableReceipts.push({...this.props.receipt}) ;
     this.props.deleteReceipts(deletableReceipts,this.props.isReceiptFolder);
    }
    componentDidDisappear() {
        console.log('compoment did disappear');
       
         //RESET ALL UI STATES
    }
    
    componentDidMount() {
        console.log('compoment did mount');
       this.props.resetUIState();
       if(this.props.receipt!==null){
         
         this.props.fetchReceiptDetail(this.props.receipt,this.props.isReceiptFolder);
       } 
    }
    
    componentDidAppear() {
        console.log('compoment did appear');
     }
    
     
    updateNavBar=(receipt)=>{
        if(receipt!==null){
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
             
              title: {
                text: receipt.title
              }
            },
          
          });
        }
     }
     
  render() {
    
      if(this.props.isReceiptDeleted){
          this.props.resetUIState();
        Navigation.pop(this.props.componentId);
     
      }
    this.updateNavBar(this.props.receiptDetail.receipt);
   const content=this.props.receiptDetail.receipt!==null?( this.props.receiptDetail.receipt.contentType.toString().toUpperCase().includes('PDF')?<RenderPDF source={this.props.receiptDetail.uri}/>:<RenderHTML source={this.props.receiptDetail.uri}/>):null
    return (
     <View style={styles.container}>
       {content}  
     </View>
    )
  }
}
const mapStateToProps = state => {
    return {
        receiptDetail: state.receipts.receiptDetail,
        isReceiptDeleted:state.ui.isReceiptDeleted
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        resetUIState:()=>dispatch(resetUIState()),
        fetchReceiptDetail: (receipt,isReceiptFolder) => dispatch(fetchMyReceiptDetails(receipt,isReceiptFolder)),
       shareReceipt:(receipt)=>dispatch(shareReceipt(receipt)),
     
        deleteReceipts:(receipts,isReceiptFolder)=>dispatch(deleteReceipts(receipts,isReceiptFolder)),
        openModal:()=>  dispatch(modalOpen())
    };
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptDetail);

