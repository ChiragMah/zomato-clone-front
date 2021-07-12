
import React from 'react';
import "../Styles/Filter.css";
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component{

    constructor(){
        super();

        this.state = {
            restaurant: [],
            location: undefined,
            mealtype: undefined,
            cuisine: [],
            lCost: undefined,
            hCost: undefined,
            sort: undefined,
            page: undefined,
            locations: []
        }
    };

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const location = qs.location;
        const mealtype = qs.mealtype;
        

        const inputObj = {
            mealtypeId: mealtype,
            locationId: location,

        };

        axios({
            method: 'POST',
            url: 'https://pure-retreat-44124.herokuapp.com/filter',
            headers: {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response => this.setState({restaurant: response.data.Restaurants, location: location, mealtype: mealtype}))
        .catch();

        axios({
            method: 'GET',
            url: 'https://pure-retreat-44124.herokuapp.com/locations',
            headers: {'Content-Type': 'application/json'}
    
           }).
           then(response => this.setState({locations: response.data.area}))
           .catch()
    };


    apiCall = (inputObj) => {
        axios({
            method: 'POST',
            url: 'https://pure-retreat-44124.herokuapp.com/filter',
            headers: {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response => this.setState({restaurant: response.data.Restaurants, sort: inputObj.sort, 
            hCost: inputObj.hCost, lCost: inputObj.lCost, cuisine: inputObj.cuisine, page: inputObj.page}))
        .catch();
    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`)
    }



        handleSortChange = (sort) => {
            const {location, mealtype, lCost, hCost, cuisine, page, } = this.state;

            const inputObj = {
                sort: sort,
                mealtypeId: mealtype,
                locationId: location,
                lCost: lCost,
                hCost: hCost,
                page: page,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
           
    };
    axios({
        method: 'POST',
        url: 'https://pure-retreat-44124.herokuapp.com/filter',
        headers: {'Content-Type' : 'application/json'},
        data : inputObj
    })
    .then(response => this.setState({restaurant: response.data.Restaurants, sort: sort}))
    .catch();

  
 }


    handleCostChange = (lCost, hCost) => {
        const {location, mealtype, sort, page, cuisine} = this.state;

        const inputObj = {
            sort: sort,
            mealtypeId: mealtype,
            locationId: location,
            lCost: lCost,
            hCost: hCost,
            page: page,
            cuisine: cuisine.length == 0 ? undefined : cuisine
       
};

axios({
    method: 'POST',
    url: 'https://pure-retreat-44124.herokuapp.com/filter',
    headers: {'Content-Type' : 'application/json'},
    data : inputObj
})
.then(response => this.setState({restaurant: response.data.Restaurants, lCost: lCost, hCost: hCost}))
.catch();
}
    


    handleCuisineChange = (cuisineId) => {
        const {location, mealtype, sort, lCost, hCost, page, cuisine} = this.state;

        const temp_cuisine = cuisine.slice()


if (temp_cuisine.indexOf(cuisineId) == -1 ){
    temp_cuisine.push(cuisineId);
}

else {
    const index = temp_cuisine.indexOf(cuisineId);
    temp_cuisine.splice(index, 1);
}


        const inputObj = {
            sort: sort,
            mealtypeId: mealtype,
            locationId: location,
            lCost: lCost,
            hCost: hCost,
            cuisine: temp_cuisine.length == 0 ? undefined : temp_cuisine,
            page: page
        }

      
        axios({
            method: 'POST',
            url: 'https://pure-retreat-44124.herokuapp.com/filter',
            headers: {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response => this.setState({restaurant: response.data.Restaurants, cuisine: cuisine}))
        .catch();
    }



    handlePageChange = (page) => {
        const {location, mealtype, sort, lCost, hCost, cuisine} = this.state;

        const inputObj = {
            sort: sort,
            mealtypeId: mealtype,
            locationId: location,
            lCost: lCost,
            hCost: hCost,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            page: page
        }

        axios({
            method: 'POST',
            url: 'https://pure-retreat-44124.herokuapp.com/filter',
            headers: {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response => this.setState({restaurant: response.data.Restaurants, page: page}))
        .catch();
    }

    handleLocationChange = (event) => {
        const location = event.target.value;
        const {mealtype, sort, lCost, hCost, cuisine, page} = this.state;

           const inputObj = {
            sort: sort,
            mealtypeId: mealtype,
            locationId: location,
            lCost: lCost,
            hCost: hCost,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            page: page
          
        };

        axios({
            method: 'POST',
            url: 'https://pure-retreat-44124.herokuapp.com/filter',
            headers: {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response => this.setState({restaurant: response.data.Restaurants, location: location}))
        .catch();
    };
    



  
 

render(){
    const {restaurant, locations} = this.state;
    
    

    return(
        <div>

        <div class = "container"> 
            <div className = "row">
            <div id = "breakfast_places"> {`Restaurants`}</div>

        
                    <div className = "col-sm-4 col-md-4 col-lg-4" id ="filter">
                        
                        
                            <div className="filters">Filters/Sort</div>
                            <span id ="iconToggle" className="glyphicon glyphicon-chevron-down toggle-span"  data-bs-toggle="collapse"
                            data-bs-target = "#demo"></span>
                            <div id ="demo" className="collapse show">

                                <h3 className="selectlocation"> Select location</h3>
                                <select id="location_search_page_box" onChange = {this.handleLocationChange}>
                                    <option value="0" className="searchlocation1" disabled selected >Select location</option>
                                    {locations.map((item) => {
                        return <option value = {item.location_id}> {item.name} </option>
                    })}
                                
                                </select>
                               
                                <h3 className="cuisine"> Cuisine</h3>
                                <div className="north">
                                    <input type="checkbox" className="checkboxdesign" onChange = {() => this.handleCuisineChange(1)}/>
                                    <span className="foodtype"> North Indian </span>     
                                </div>
                                <div className="south">
                                    <input type="checkbox" className="checkboxdesign" onChange = {() => this.handleCuisineChange(2)}/>
                                    <span className="foodtype"> South Indian </span>     
                                </div>
                                <div className="chine">
                                    <input type="checkbox" className="checkboxdesign" onChange = {() => this.handleCuisineChange(3)}/>
                                    <span className="foodtype"> Chinese </span>     
                                </div>
                                <div className="faste">
                                    <input type="checkbox" className="checkboxdesign" onChange = {() => this.handleCuisineChange(4)}/>
                                    <span className="foodtype"> Fast Food </span>     
                                </div>
                                <div className ="treet">
                                    <input type="checkbox" className="checkboxdesign" onChange = {() => this.handleCuisineChange(5)}/>
                                    <span className="foodtype"> Street Food </span>     
                                </div>


                                <h3 className = "costfortwo">Cost For Two</h3>
                                <div>
                                    <input name="pricewise" type="radio" className="button" onChange = {() => this.handleCostChange(1,500)}/> 
                                    <span className="money"> Less than ₹ 500 </span>
                                </div>
                                <div>
                                    <input name="pricewise" type="radio" className="button" onChange = {() => this.handleCostChange(500,1000)}/> 
                                    <span className="money"> ₹ 500 to ₹ 1000 </span>
                                </div> 
                                <div>
                                    <input name="pricewise" type="radio" className="button" onChange = {() => this.handleCostChange(1000,1500)}/> 
                                    <span className="money"> ₹ 1000 to ₹ 1500 </span>
                                </div> 
                                <div>
                                    <input name="pricewise" type="radio" className="button" onChange = {() => this.handleCostChange(1500,2000)}/> 
                                    <span className="money"> ₹ 1500 to ₹ 2000 </span>
                                </div> 
                                <div>
                                    <input name="pricewise"   type="radio" className="button" onChange = {() => this.handleCostChange(2000,10000)}/> 
                                    <span className="money"> ₹ 2000+</span>


                                </div>
                                <div id ="sortmain">
                                <h2 className ="sort">Sort</h2>
                                    <input className="button" type="radio" name="pricefilter" onChange = {() => this.handleSortChange(1)}/>
                                    <span className="pricelowtohigh"> Price low to high</span>
                                    <br/>
                                    <input className="button" type="radio" name="pricefilter" onChange = {() => this.handleSortChange(-1)}/>
                                    <span className="pricehightolow"> Price high to low</span>
                                </div>       
                            </div>
                             
                    </div> 



                    <div className = "col-sm-8 col-md-8 col-lg-8" id ="description"> 
                    
                  {restaurant && restaurant.length > 0 ? restaurant.map((item) => {
                      return <div className = "box1" onClick = {() => this.handleNavigate(item._id)}>
                            
                      <div className="foodimagediv" style={{display:"inline-block", width:"30%"}}>
                          <img className="foodimage" src="./Assets/shutterstock_1154073754@3x.png"/> 
                      </div>
                      <div className="nameaddress" style={{display:"inline-block", width:"60%", verticalAlign: "top"}}>
                          <div className="restaurantname">{item.name}</div>
                          <div className="mainlocation"> {item.city_name}</div>
                          <div className="mainaddress">{item.address}</div>
                      </div>
                      <hr className="line"/>
                      <div className="foodandprice">
                          <div className="foodandcost1" style={{display:"inline-block", width:"30%"}}>
                              <div className="cuisines_costfortwo"> CUISINES: </div>
                              <div className="cuisines_costfortwo"> COST FOR TWO: </div>
                          </div>
                          <div className="foodandcost2" style={{display:"inline-block", width:"60%"}}>
                              <div className="type_price"> {item.cuisines.map((i) => `${i.name}. `)}</div>
                              <div className="type_price"> {item.cost}</div>
                          </div>
                          
                  </div>
              </div>
                  }) : <div className ="no-records">Sorry. No results found</div>}


                    <div id ="pagination">
                       <nav aria-label="Page navigation example">
                           <ul className="pagination ">
                           <li className="page-item">
                               <a className="page-link" href="#" aria-label="Previous">
                               <span aria-hidden="true">&laquo;</span>
                               <span className="sr-only">Previous</span>
                               </a>
                           </li>
                           <li className="page-item" onClick = {() => this.handlePageChange(1)}><a className="page-link" href="#">1</a></li>
                           <li className="page-item" onClick = {() => this.handlePageChange(2)}><a className="page-link" href="#">2</a></li>
                           <li className="page-item" onClick = {() => this.handlePageChange(3)}><a className="page-link" href="#">3</a></li>
                           <li className="page-item" onClick = {() => this.handlePageChange(4)}><a className="page-link" href="#">4</a></li>
                           <li className="page-item">
                               <a className="page-link" href="#" aria-label="Next">
                               <span aria-hidden="true">&raquo;</span>
                               <span className="sr-only">Next</span>
                               </a>
                           </li>
                           </ul>
                       </nav>
                   </div> 
                      
                    
                  
                    

                    
                    </div>
                </div>
        </div>

        </div>

        
        
        
    )
}
}
   


export default Filter;