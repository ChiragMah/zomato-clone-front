import React from 'react';
import '../Styles/Wallpaper.css';
import axios from 'axios';
import {withRouter} from 'react-router-dom'


class Wallpaper extends React.Component {

constructor(){
super();

this.state = {
    restaurantList: [],
    suggestions: [],
    searchText: undefined
}
}


handleLocationChange = (event) => {

const locationId = event.target.value;
sessionStorage.setItem('locationId', locationId);



axios({
method: 'GET',
url: `http://localhost:2022/restaurantsbylocation/${locationId}`,
headers: {'Content-type': 'application/json'}
})
.then(response => this.setState({restaurantList: response.data.restaurant_list}))
.catch()
}

handleSearch = (event) => {
    const {restaurantList} = this.state;
const searchText = event.target.value;

let filteredRestaurants;

if (searchText == ""){
    filteredRestaurants = [];
}
else {
    filteredRestaurants = restaurantList.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
}


this.setState({suggestions: filteredRestaurants, searchText: searchText})

}

handleItemClick = (item) => {
this.props.history.push(`/details?restaurant=${item._id}`)
}

renderSuggestions = () => {
    let {suggestions, searchText} = this.state;
    if (suggestions.length === 0 && searchText){
        return (
            <ul className = "foodList">
            <li className="detailList">{`Try a different name for the restaurant`}</li>
        </ul>
        )
    }
    return (
        <ul className = "foodList">
            {suggestions.map((item, index) => <li className ="detailList"key = {index} onClick = {() => this.handleItemClick(item) }><div style={{display: "inline-block"}}><img className ="img_thumb"src = {item.thumb[0]}/>{` ${item.name} ,`} <span className ="cityDetails"> {`${item.city_name}`} </span> </div> <hr id="hLine"/></li>)}
        </ul>
    )
}


    render(){
        const {ddLocations} = this.props;
        const {suggestions, searchText} = this.state
        

        return(
            <div>
                   <img className="homepageimage" src="./Assets/Homepage background.jpg"/>
            <div className="centrelogo"><b>e!</b></div>
            <div className="find-best-restaurants">Find the best restaurants, cafés, and bars</div>
            <div>
             <div className="searchlocation">
                <select className="typelocation" onChange = {this.handleLocationChange}>
                    <option value ="0" disabled selected> Please select a location </option>
                    {ddLocations.map((item) => {
                        return <option className ="city-options" value = {item.location_id}> {item.name} </option>
                    })}
                </select>
                
                 <span  className="glyphicon glyphicon-search" id="searchicon"></span>
                 <input id ="query"className="search-for-restaurants" type="search" placeholder="Search for restaurants" 
                 onChange = {this.handleSearch}/>
                    {this.renderSuggestions()} 
                  

            </div>
                
            </div>
            </div>

         
        )
    }
}

export default withRouter(Wallpaper);