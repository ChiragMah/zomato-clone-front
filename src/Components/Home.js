import React from 'react';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
import axios from 'axios';


class Home extends React.Component{

    constructor(){
        super();

        this.state = {
            locations: [],
            mealtypes: []
        }
    }



   componentDidMount(){
    sessionStorage.clear();

       axios({
        method: 'GET',
        url: 'http://localhost:2022/locations',
        headers: {'Content-Type': 'application/json'}

       }).
       then(response => this.setState({locations: response.data.area}))
       .catch()

       axios({
        method: 'GET',
        url: 'http://localhost:2022/mealtypes',
        headers: {'Content-Type': 'application/json'}

       }).
       then(response => this.setState({mealtypes: response.data.mealtypes}))
       .catch()

   }



render(){
    let {locations, mealtypes} = this.state;
    return(
    <div>
        <Wallpaper ddLocations = {locations}/>
        <QuickSearch mealtypeOptions = {mealtypes}/>
        

    </div>
    )
}
}   


export default Home;