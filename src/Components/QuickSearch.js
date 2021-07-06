import React from 'react';
import "../Styles/QuickSearch.css"
import {withRouter} from 'react-router-dom'

class QuickSearch extends React.Component {
    handleClick = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
      
        if (locationId){
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`)

        }
        else{this.props.history.push(`/filter?mealtype=${mealtypeId}`)}
    }

    render(){
        
        const {mealtypeOptions} = this.props;

      

        return(
            <div>
                <div className = "centered">    
        
        <div className="container no-padding">
            <div className="quick_search">
                <div className="quicksearches"> Quick Searches</div>
                <div className="discover_restaurants"> Discover restaurants</div>
            </div>
            <div className="row" id="mainrow">

            {mealtypeOptions.map((item)=>{
                return <div className="col-sm-12 col-md-6 col-lg-4" id="box1" onClick = {() => this.handleClick(item.id)}>
                <div style={{display: "inline-block", width:"50%"}}>
                     <img src={item.image} height="140px" width="130px" /> 
                </div>
                <div style={{display: "inline-block",width:"40%", verticalAlign: "top"}}>
                    <div className="foodtitle"> {item.name}</div>
                    <div className="food_description"> {item.content}</div>
                </div>
            </div>
            })}

               
                
            </div>
        </div>
    </div>
            </div>
        )
    }
}

export default withRouter(QuickSearch);