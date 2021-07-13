import React from 'react';
import queryString from 'query-string'
import axios from 'axios'
import '../Styles/details.css'
import Modal from 'react-modal'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width: "80%",
      padding: '10px 20px 20px 20px'
    }
  };

  const customStyles1 = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      
      padding: '10px 20px 20px 20px'
    }
  };

class Details extends React.Component{

    constructor(){
        super();

        this.state = {
            restaurant: {},
            galleryModalIsOpen: false,
            menuItemsModalIsOpen: false,
            orderItemsModalIsOpen: false,
            resId: undefined,
            menuItems: [],
            subTotal: 0,
            order: [],
            name: undefined,
            email: undefined,
            mobileNumber: undefined,
            address: undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const resId = qs.restaurant;

        axios({
            method: 'GET',
            url: `http://pure-retreat-44124.herokuapp.com/restaurantbyid/${resId}`,
            headers: {'Content-Type' : 'application/json'}
        })
        .then(response => {
            this.setState({restaurant: response.data.Restaurants, resId})
        })
        .catch(err => console.log(err))
    }

    handleModal = (state,value) => {
        const {resId, menuItems} = this.state;

        this.setState({[state]: value});

        if(state == 'menuItemsModalIsOpen' && value == true){
            axios({
                method: 'GET',
                url: `http://pure-retreat-44124.herokuapp.com/menuitemsbyrestaurant/${resId}`,
                headers: {'Content-type': 'application/json'}
            })
            .then(response =>
                this.setState({
                    menuItems: response.data.MenuItems
                }))
            .catch()
        }

        if (state == 'orderItemsModalIsOpen' && value == true){
            const order = menuItems.filter(item => item.qty != 0);
            this.setState({order: order})
        }
    }

    addItem = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add'){
            item.qty = item.qty + 1;
        }

        else{
            item.qty = item.qty - 1;
        }

        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })

        this.setState({menuItems: items, subTotal: total})
    };

    handleChange = (event, state) => {
        this.setState({ [state] : event.target.value });
    }


    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://pure-retreat-44124.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }


    handlePayment = () => {
        const { subTotal, email, order, resId } = this.state;

        const inputObj = {
            email: email,
            restaurant_id: JSON.stringify(resId),
            items: order,
            amount: subTotal
            
            
            }
            
                   axios({
                       method:'POST',
                       url: 'http://pure-retreat-44124.herokuapp.com/addorder',
                       headers:{'Content-Type': 'application/json'},
                       data: inputObj
                   })
                   .then(response => this.setState({orders: response.data.order, email: email, restaurant_id: resId, items: order, amount: subTotal}))
                   .catch() ;
                
            
        
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            // Payment API Call
            this.getData({ amount: subTotal, email: email }).then(response => {
                var information = {
                    action: "http://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        else {
            alert('Email is not valid, Please check it');
        };

    }

    

   
  

render(){
const {restaurant, galleryModalIsOpen, menuItemsModalIsOpen, menuItems, subTotal, orderItemsModalIsOpen, email, order} = this.state;

    return(
        <div>
        <div>
    <div className = "container">
        <div className = "row">

         <div className ="col-sm-12 col-md-12 col-lg-12" id = "imageGallery">   
       <img src="Assets/shutterstock_1154073754@3x.png" height = "350px" width = "100%"/>
       <button type="button" className="btn btn-light" id = "imgButton" onClick = {()=>this.handleModal('galleryModalIsOpen', true)}>Click to view Image Gallery</button>
        </div>

        <div className ="The-Big-Chill-Cakery" > {restaurant.name}</div>
        <div> <button type="button" className="btn btn-outline-danger" id ="place-online-order" onClick = {()=>this.handleModal('menuItemsModalIsOpen', true)} >Place online order</button></div>


        <div>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Overview</button>
                  
                  <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <div id ="detail-header-one"> About this place
                    </div>
                    <div className ="detail-header-two"> Cuisines
                        <div className="detail-header-three">{restaurant && restaurant.cuisines? restaurant.cuisines.map((item) =>`${item.name}, ` ) :null}</div>
                    </div>
                    <div className ="detail-header-two"> Average Cost
                        <div className="detail-header-three">{restaurant.cost} for two people(approx)</div>
                    </div>

                </div>
                
                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                    <div id ="detail-header-one"> Restaurant contact details </div>

                    <div className ="detail-header-two"> Phone number
                        <div className="detail-header-three">{restaurant.contact_number}</div>
                    </div>
                    <div className ="detail-header-two"> Address
                        <div className="detail-header-three">{restaurant.address}</div>
                    </div>

                </div>
              </div>
        </div>

        </div>
    </div>
</div>

<Modal
          isOpen={galleryModalIsOpen}
          style={customStyles}
        >
        <div >
            <div className ="glyphicon glyphicon-remove" id="closeICon" onClick = {()=>this.handleModal('galleryModalIsOpen', false)}></div>
        <Carousel showThumbs = {false}>
            {restaurant && restaurant.thumb? restaurant.thumb.map((path) => {
                return <div>
                <img className ="gallery" src={path}/>
            </div>
            }):null }
                

            </Carousel>
        </div>
    
          
        </Modal>
         

        <Modal  
            isOpen={menuItemsModalIsOpen}
          style={customStyles1}
        >
            <div style = {{"width": "400px"}}>
            <div className ="glyphicon glyphicon-remove" id="closeICon" 
            onClick = {()=>this.handleModal('menuItemsModalIsOpen', false)}></div>
            <div className ="restaurant-header">{restaurant.name}</div>
            <div className ="food-itemDescription">Menu</div>
            <hr/>

              {menuItems.map((item, index) => {
                  return <div>
                      <div>
                        <div style = {{display: 'inline-block' , width: "207px" }}> 
                      <div className ="food-itemName">{item.name}</div>
                      <div className ="food-itemPrice">{`₹ ${item.price}`}</div>
                      <div className ="food-itemDescription">{item.description}</div>
                      </div>
                      <div className ="food-add-position">
                          <div><img className ="foodIcon" src = {item.image}/></div>
                      {item.qty == 0 ? <div><button type="button" className="btn btn-outline-warning" id = "buttonCss" onClick={() => this.addItem(index,'add')}>Add</button></div> :
                      <div style = {{"background-color": "#e2f1ff"}}> <button type="button" id = "minus-buttonCss" className="btn btn-danger" onClick={() => this.addItem(index,'subtract')} >-</button> <span className ="quantity"> {item.qty}</span>
                      <button type="button" className="btn btn-success" id = "plus-buttonCss"
                      onClick={() => this.addItem(index,'add')}>+</button></div> }
                      
                      
                      </div>
                      <hr/>      
                  </div>
                  </div>
              })} 

              <div className ="total-amount-div">{`Subtotal: ${subTotal}`} <button type="button" className="btn btn-outline-danger pay-now" onClick = {()=>this.handleModal('orderItemsModalIsOpen', true)}>Proceed</button></div>
            </div>
            <Modal
          isOpen={orderItemsModalIsOpen}
          style={customStyles1}
        >       <div className ="go-back-div">

                <div className ="glyphicon glyphicon-arrow-left" id="closeICon" onClick = {()=>this.handleModal('orderItemsModalIsOpen', false)}></div>
                <div className="food-itemDescription" id ="goBack">Go Back</div>

                </div>
                <div className ="restaurant-header">{restaurant.name}</div>  
                 

             


              <hr/>
                <form>
                <div style = {{ "margin-top": "-15px",
    "margin-bottom": "10px"}}className="food-itemDescription"> Please fill in your details </div>  

  <div className="form-group order-detail-class">
    <label for="exampleInputEmail1">Email address*</label>
    <input type="email" className="form-control loginForm-input" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange = {(event) => this.handleChange(event,'email')}/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group order-detail-class">
  <label for="form1">Name</label>
  <input type="text" id="form1" className="form-control loginForm-input" placeholder="Name" onChange = {(event) => this.handleChange(event,'name')}/>
  
  </div>
  
  <div className="form-group order-detail-class">
  <label for="form1">Mobile Number</label>
  <input type ="tel" maxLength="10"
   id="form1" className="form-control loginForm-input" placeholder="Mobile number"  onChange = {(event) => this.handleChange(event,'mobileNumber')}/>
  <small className="form-text text-muted">Please enter proper Mobile Number</small>
  </div>
  <div class="form-group order-detail-class">
    <label for="exampleFormControlTextarea1">Address</label>
    <textarea className="form-control loginForm-input" style = {{height: "70px"}} id="exampleFormControlTextarea1" placeholder ="Enter your address" onChange = {(event) => this.handleChange(event,'address')}></textarea>
  </div>

  
</form>
<hr/>
<div>
<div  style = {{ "margin-top": "-15px",
    "margin-bottom": "10px"}} className="food-itemDescription">Order Details:</div>
{menuItems.map((item => {
                  return <div>
                      {item.qty != 0 ? <div className ="order-header"> <span className ="order-header-details">{item.name} </span> 
                      <span style={{ color: "#8c96ab"}}> | </span>  <span className ="order-header-details"> Quantity: </span> {item.qty} <span style={{color: "#8c96ab"}}> | </span> <span className ="order-header-details"> Total: </span>{item.price}  </div> : null}
                  </div>
              }))}


<div className ="total-amount-div">Total Amount : <span>{subTotal}</span></div>
<button type="submit" className="btn btn-danger make-payment" onClick = {this.handlePayment}>Click to make payment</button>
</div>

        </Modal>



        </Modal>
        
        </div>
    )
}
}   


export default Details;