import axios from 'axios';

export function getLists() {
  return axios({
    url:'/styleList.json',
    baseURL: 'https://trackstyle-2bd5c.firebaseio.com',
    method: "GET"
  }).then((res) => {
    this.setState({ styleList: res.data})
    console.log(res.data);
  }).catch((error) => {
    console.log(error);
  });
}

export function createList(styleName){
   let newStyle = {category: styleName, CreatedAt: new Date()};
  return axios({
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


export function deleteStyle(styleId){
  return axios({
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

export function updateSelectedStyle(){
    let id = this.state.stylelog;
    let stylelog = this.state.styleList[id];
    stylelog.category = this.refs.newInput.value;
  return axios({
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
