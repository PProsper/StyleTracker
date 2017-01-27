import React, { Component } from 'react';
import axios from 'axios';
// import moment from 'moment';
// import Form from '../components/Form.js';

class App extends Component {
  constructor(props){ //props to be added on element and funciton component creation
    super(props); //props to be added on element and funciton component creation
    this.state = {styleList:[], viewer: {},
    };
    this.handleNewInput = this.handleNewInput.bind(this);
    this.selectStyleItem = this.selectStyleItem.bind(this);
    this.editStyleitem = this.editStyleitem.bind(this);
    this.updateSelectedStyle = this.updateSelectedStyle.bind(this);
  }

  componentDidMount(){
    this.getLists();
    this.deleteStyle();
  }

  getLists(){
    axios({
      url:'/styleList.json',
      baseURL: 'https://trackstyle-2bd5c.firebaseio.com',
      methid: "GET"
    }).then((res) => {
      this.setState({ styleList: res.data})
      console.log(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  createList(styleName){
    let newStyle = {category: styleName, CreatedAt: new Date()};

  axios({
    url: '/styleList.json',
    baseURL:'https://trackstyle-2bd5c.firebaseio.com',
    method: 'POST',
    data: newStyle
  }).then((res)=>{
    let styleList = this.state.styleList;
    let newStyleId = res.data.name;
    styleList[newStyleId] = newStyle;
    this.setState({ styleList : styleList});
  }).catch((error)=>{
    console.log(error)
  });
}

  deleteStyle(styleId){
    axios({
      //not certain what backticks are do
      url: `/styleList/${styleId}.json`,
      baseURL:'https://trackstyle-2bd5c.firebaseio.com',
      method: "DELETE",
    }).then((res)=>{
      let styleList = this.state.styleList;
      delete styleList[styleId];
      this.setState({ styleList: styleList});
    }).catch((error)=>{
      console.log(error);
    });
  }

  handleNewInput(event){
    if (event.charCode === 13) {
      this.createList(event.target.value);
      event.target.value = "";
      }
    //   else {
    //     if(event.onClick){
    //       this.createList(event.target.value);
    //       event.target.value = "";
    //     }
    // }
  }


  entryBox(){
    //onSubmit={(event)=> this.styleInput(event)} //form line
    //ref={(input) =>{this.handleNewInput =input}} //inputline &form line
    return(
      <div className="new-entry form-group">
        <h2> Add To Your StyleList </h2>
        <div className="form-group">
          <label> Style Name </label>
          <input type="text" className="form-control" id="title" placeholder="Enter New Style Name..."  onKeyPress={this.handleNewInput}/>
          <button type="submit">Add</button>
        </div>
      </div>
    );
  }

  renderStyleList() {
    let styleListElement = [];

    for(let styleId in this.state.styleList){
      let style = this.state.styleList[styleId]

      styleListElement.push( //use .push to list the items in the empty array assigned above
        //the key that react will use to identify each styleList item style will be its id, styleId
        <div className="styles d-flex justify-content-between pb-4" key={styleId}>
          <ul className="mt-2" onClick={ () => this.selectStyleItem(styleId) }>
            <li className="inline"> <h3> {style.category} </h3> </li>

          </ul>
          <p
          className="ml-4 btn btn-link inline"
          onClick={ () => { this.deleteStyle(styleId) } }
          >
          X
          </p>
        </div>
      );
    }

    return(
      <div className="styleList">
        {styleListElement}
      </div>
    );
  }

  selectStyleItem(styleId){
    this.setState({stylelog : styleId })
  }

  editStyleitem() {
    this.setState({ edit: true});
  }

  updateSelectedStyle(){
    let id = this.state.stylelog;
    let stylelog = this.state.styleList[id];
    stylelog.category = this.refs.newInput.value;

  axios({
    url: `/styleList/${id}.json`,
    baseURL: 'https://trackstyle-2bd5c.firebaseio.com',
    method: 'PATCH',
    data: stylelog
  }).then((res) => {
    let styleList = this.state.styleList;
    styleList[id] = stylelog;
    this.setState({ styleList: styleList, edit:false});
  }).catch((error) =>{
    console.log(error);
  });
}

  renderSelectedStyle(){
    let content;

    if(this.state.stylelog) {
      let stylelog = this.state.styleList[this.state.stylelog]
      if(!this.state.edit){
        content = (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button onClick={this.editStyleitem}> Edit </button>
            </div>
            <h1>{stylelog.category}</h1>
          </div>
        );
      }else {
        content = (
          <div>
            <div className="d-flex justify-content-end mb-3">
              <button onClick={this.updateSelectedStyle}>Save</button>
            </div>
            <input className="w-100" defaultValue={stylelog.category} ref="newInput"/>
          </div>
        );
      }
    }
      return content;
  }

 //  showList(index) {
 //   this.setState({stylelog: this.state.styleList[index]});
 // }
  render(){
 //    let showstyleList = Object.keys(this.state.styleList).map((Style, i)=> {
 //      console.log(Style)
 //    return(
 //      <li key={ i } onLoad={ ()=>{this.showList(i)} }>
 //        {Style}
 //      </li>
 //    )
 //  });
 //  let ObjList
 //    if(this.state.stylelog){
 //      ObjList = this.state.stylelog.data.name;
 //    }else {
 //      ObjList = "null";
 //    }

//entrybox is a form with multiple inputs
    return(
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
          <div className="lists">
          <div className="styles"> {this.renderStyleList()}< /div>
          < /div>
          </div>
          <div className="col-6 px-4">
          {this.renderSelectedStyle()}
          </div>
          <div className="field">
            {this.entryBox()}
          </div>
        </div>
      </div>
    );
  }
}
export default App;

// <div className="col-6 px-4">
// {this.renderSelectedStyle()}
// </div>
// <div className="field">
//   {this.entryBox()}
// </div>
//use to select list from side bar
// renderSelectStyleList() {
//   // onClick takes a function and when the element that onClick is
//   // bound to, that function is called.
//
//   let planetListItems = this.state.planets.map((planet, i) => {
//     return(<li key={i} onClick={ () => { this.selectPlanet(i) } } >{planet.name}</li>);
//   });
//
//   let planetDetails
//   if (this.state.currentPlanet) {
//     planetDetails = this.state.currentPlanet.name;
//   } else {
//     planetDetails = "Select a planet";
//   }
//
//   return (
//     <div className="App">
//       <div className="planets-list-container">
//         <ul className="planets-list">
//           {planetListItems}
//         </ul>
//       </div>
//       <div className="planet-container">
//         {planetDetails}
//       </div>
//     </div>
