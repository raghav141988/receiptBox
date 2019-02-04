import React,{Component} from "react";
import {View,ScrollView,StyleSheet,Text,Platform,TouchableOpacity} from 'react-native';

import {colors} from '../Utils/theme';
import  Badge from './Badge';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import CreateNewCategory from './CreateNewCategory';
class CategoryListing extends Component   {
    state={
    showAllCategories:false,
    isAddNew:false,
    
    }
    
    onShowFilters=()=>{
        this.setState({showAllCategories:true});
    }
    handleFilterSelection=(category)=>{
        this.setState({showAllCategories:false});
        this.props.onSelectCategory(category)
    }
    onRemoveFilter=(category)=>{
       this.props.onRemoveCategory(category);
    }
    addNewCategory=()=>{
        
        this.setState({isAddNew:true,
        showAllCategories:false
        });
       

    }
    onCancel=()=>{
        this.setState({
            showAllCategories:true,
            isAddNew:false}); 
    }

    onAddCategory=(input,color)=>{
        const category=
        {
         category: input.category,
         color:color,
         text:input.category.charAt(0).toUpperCase()
        }
        
        this.setState({isAddNew:false,
        showAllCategories:true,
        }); 

        this.props.onAddNewCategory(category);
    }
    createdFilterdCategories=()=>{
       return this.props.userFilteredCategories.map((category,index)=>{
            return (
               
            <Badge key={index}
            onPress={()=>this.onRemoveFilter(category)}
              title={category.category}  
              textColor="#fff"
              icon={true}
              backgroundColor={category.color}
              iconName="times-circle"
    
               />
                
               
               
                 );
       });
    }
   
    _getCreateNewCategory=()=>{
        console.log('adding new category');
        return (
            <CreateNewCategory
            onAddCategory={this.onAddCategory}
            onCancel={this.onCancel
            }
            />
        )
    }
    render(){
    let filteredCategories=null;
    let badges=null;
    let createNew=null;
    let addNewCategoryComponent=null;
  if(this.state.showAllCategories
    
  
    ){
      //SHOW ALL CATEGORIES
      createNew=  (<View style={{flexDirection:"row",flex:1,
alignItems:"center"
 }}>
 <Badge 
            onPress={()=>this.addNewCategory()}
            textColor="#fff"
            icon
            backgroundColor={colors.primary}
            title="Create New"
            iconName="plus"
               />
       <Badge 
            onPress={()=>this.setState({showAllCategories:false})}
            textColor="#000"
            icon={true}
            backgroundColor={colors.lightGray}
            title="Cancel"
            iconName="times-circle"
            iconColor="#000"
               />         
 
                       
    </View>);
      badges= this.props.categories.map((category,index)=>{
        return (<Badge key={index}
            textColor="#fff"
            onPress={()=>this.handleFilterSelection(category)}
           icon={false}
           backgroundColor={category.color}
             title={category.category}/>)
        
           });
           
  }
  else if(this.state.isAddNew){
      //CREATE ADD NEW CATEGORY
      addNewCategoryComponent=this._getCreateNewCategory();
  }
  else {
//SHOW FILTERED CATEGORIES
filteredCategories=this.props.userFilteredCategories.length>0?
(<View style={{flexDirection:"row",flex:1,
alignItems:"center"
 }}>
 {this.createdFilterdCategories() }
 <TouchableOpacity onPress={this.onShowFilters}>
                 <Icon style={{alignSelf:"center"}}   name={Platform.OS === 'android' ? 'plus' : 'plus'} style={styles.actionButtonIcon} />
                 </TouchableOpacity>
                       
    </View>
       
           ):
           
           (
           <View style={{flexDirection:"row",flex:1,
          alignItems:"center"
           }}>
           
           <Badge 
            onPress={()=>{}}
            backgroundColor={colors.lightGray}
            textColor="#000"
             title="All Categories"
            icon={false}
            />
             <TouchableOpacity onPress={this.onShowFilters}>
             <Icon style={{alignSelf:"center"}}   name={Platform.OS === 'android' ? 'filter' : 'filter'} style={styles.actionButtonIcon} />
             </TouchableOpacity>
             </View>
             );

  }
 


    return (
    <View style={{marginLeft:5, marginRight:5}}>
    <ScrollView contentContainerStyle={{paddingRight:5}} style={{height:40}} horizontal  showsHorizontalScrollIndicator={false}>
    {createNew}
    {badges}
   
    {filteredCategories}
   {addNewCategoryComponent}
    </ScrollView>
    </View>
);
}

    }

const styles = StyleSheet.create({
    checkBoxContainer:{
        borderWidth:0,
        backgroundColor:'#fff',
      
                  },

                  categoryStyle:{
                     // padding:5,
                     
                     // margin:5
                  },
                  badgeContainerStyle:{
                      flex:1,
                    
                  },

                  actionButtonIcon: {
                    fontSize: 20,
                    height: 22,
                    color: colors.primary,
                  },
});

export default CategoryListing;
