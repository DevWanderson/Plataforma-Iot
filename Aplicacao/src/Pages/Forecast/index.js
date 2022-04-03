import React, { Children, useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, Grid } from '@material-ui/core';
import api from '../../Components/Connections/api';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import fetch from 'cross-fetch';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchDevice from '../../Components/SearchDevice/SearchDevice';
import { RootStateOrAny,useSelector } from 'react-redux';
import { deviceData } from '../../store/reducers';
import {selectedDevice} from '../../store/reducers';
import { devices } from '../../store/reducers'; 
import { render } from 'react-dom';
import {
  LineChart,
  ResponsiveContainer,
  Legend, Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'; 
import { Line } from "react-chartjs-2";
import Button from 'react-bootstrap/Button';
import { deleteFrames } from 'plotly.js';
import ReactDOM from 'react-dom';
import ReactDOMServer from "react-dom/server";
import "../../styles.css";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Select from 'react-select'
import { PermDataSettingOutlined } from '@material-ui/icons';
import { Sunny, Cloudy, Rain, Snow } from 'weather-styled-icon';
//import { View, Text,TextInput,StyleSheet } from "react-native"; 
 



      //let disp = '8cf9574000000012'
      // axios.get(`https://iotibti.ddns.net:7999/forecast?dev_eui=${selectedDevice}`)
     //await axios.get(`https://iotibti.ddns.net:7999/forecast?dev_eui=${disp}`)
     //await axios.get(`https://iotibti.ddns.net:7999/forecast?dev_eui=8cf9574000000012`)
 
      
     class TodoApp extends React.Component {
     
      constructor(props) {
      super(props)
      this.requestValidatorRef = React.createRef();
      this.state = {
          render: false,
          renderr: false,
          renderrr: false,
          username : '',
          cityy : '',
          value: '',
          valueOfInput:''
            
          
      }
       
      this.alertHi = this.alertHi.bind(this);
      this.alertHii = this.alertHii.bind(this);
      this.alertHiii = this.alertHiii.bind(this);
      this.updateInput = this.updateInput.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
       
       
      }
      
      alertHi() {
       this.setState({render: !this.state.render});
      }
      alertHii() {
        this.setState({renderr: !this.state.renderr});
       }
       alertHiii() {
        this.setState({renderrr: !this.state.renderrr});
       }

       updateInput(event){
        this.setState({username : event.target.value});
        
          }

          sell(){
            const cidy = this.state.username
            
              }   
      handleChange(event) {    this.setState({value: event.target.value});  }
      handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }  
  
     

       render() {
        
        const styleObj = {
          fontSize: 14,
          color: "#4a54f1",
          textAlign: "center",
          paddingTop: "20px",
      } 
      const styleObj2 = {
        fontSize: 20,
        color: "#4a54f1",
        textAlign: "center",
        paddingTop: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingBottom: "10px",
    } 
    const styleObj23 = {
      fontSize: 20,
      color: "#4a54f1",
      textAlign: "center",
      paddingTop: "10px",
      paddingRight: "10px",
      paddingLeft: "10px",
      paddingBottom: "10px",
  } 
    const styleObj22 = {
      fontSize: 14,
      color: "#4a54f1",
      textAlign: "center",
      paddingTop: "7px",
      paddingRight: "7px",
      paddingLeft: "7px",
      paddingBottom: "7px",
  } 
    const styleObj3 = {
      fontSize: 16,
      color: "#228b22",
      textAlign: "center",
      paddingTop: "10px",
      paddingRight: "10px",
      paddingLeft: "10px",
      paddingBottom: "10px",
  } 
  const styleObj4 = {
    fontSize: 14,
    color: "#080F0B",
    textAlign: "center",
    paddingTop: "30px",
} 
const styleObj44 = {
  fontSize: 14,
  color: "black",
  textAlign: "center",
  paddingTop: "80px",
} 
const styleObj5 = {
  fontSize: 14,
  color: "#080F0B",
  textAlign: "center",
  paddingTop: "30px",
  
} 
const styleObj6 = {
  fontSize: 14,
  color: "#4a54f1",
  textAlign: "center",
  paddingTop: "10px",
  paddingRight: "10px",
  paddingLeft: "10px",
  paddingBottom: "10px",
   
  display:'inline-block'
} 
 
  
 
//var cidy = this.state.value
   localStorage.setItem('cidy', this.state.value); 
 
         return(
        <div className="App">
            <h style={styleObj3} >Previsão de temperatura para sete dias no futuro </h>
            <p><Icon/></p>  
             
            <p  style={styleObj5} >
            <form onSubmit={this.handleSubmit}>
        <label>
        Coloque o Nome da Cidade:  <h>   </h> 
          <input type="text" value={this.state.value} onChange={this.handleChange} /> </label>
          <h>   </h> 
          <h>
          <button style={styleObj22} onClick={this.alertHiii}>Meteorológica</button>
            
            </h>
      </form>
       <p>
       {this.state.renderrr && <h2 style={styleObj6} ><Weter0/>  </h2>}
      
             </p>
      </p> 
       
             
      
          
             
            
             
 
{/*             <div>
             <input type="text" onChange={this.updateInput}></input>
         
            </div> */}
         
           <p  style={styleObj} >
             
            <p>Escolha um dispositivo</p>
          <SearchDevice/>   
           </p>
           <p  style={styleObj44}  >
          <button style={styleObj23}  onClick={this.alertHi}>Relatório</button>
          {this.state.render && <h1><Fore/></h1>}
           
          <h>.......Escolha o tipo de layout.........</h>

          <button style={styleObj23} onClick={this.alertHii}>Gráfico</button>
            {this.state.renderr && <h2><Ff/></h2>}
            </p>  
              
             </div>
          
          ) ;
      }
 
      }  
      export default TodoApp  ; 
     

function Icon (){
  return (
    <div>
      <Sunny />
      <Cloudy />
      <Rain />
      <Snow />
    </div>
  );
}

      
       
   function Fore   ()  {
    const styleObj = {
      fontSize: 14,
      color: "#4a54f1",
      textAlign: "center",
      paddingTop: "100px",
  }  
      const   selectedDevice = useSelector((state) => state.deviceState.selectedDevice); // Rule 1: call hooks in top-level
  
  //  const selectedDevice = useSelector((state) => state.deviceState.selectedDevice)
   // const   fser  =  "8cf9574000000012"
    const [error, setError] = useState(null);
    const  [isLoaded, setIsLoaded] = useState(false);
    const   [homes, setHomes] = useState([]);

    useEffect(() => {
      setTimeout(() => {
       fetch(`https://iotibti.ddns.net:7999/forecast?dev_eui=${selectedDevice}`)
        .then (res => {
          return res.json();
        })
        .then(result => {
         setIsLoaded( true) ;
         setHomes( result);
        })
        .catch(err => {
           console.log(err.message);
           
           setIsLoaded( true) 
           setError()
        })
       },1000);
     },[]);
   
     return (
         
      <div style={styleObj}  >
       {homes.map(home => <div><h>
       <p>Para data " {home.index.Row_1 } ", a previsão de temperatura esta "{home.forecasting.Row_1 }"C</p>
       <p>Para data " {home.index.Row_2 } ", a previsão de temperatura esta "{home.forecasting.Row_2 }"C</p>
       <p>Para data " {home.index.Row_3 } ", a previsão de temperatura esta "{home.forecasting.Row_3 }"C</p>
       <p>Para data " {home.index.Row_4 } ", a previsão de temperatura esta "{home.forecasting.Row_4 }"C</p>
       <p>Para data " {home.index.Row_5 } ", a previsão de temperatura esta "{home.forecasting.Row_5 }"C</p>
       <p>Para data " {home.index.Row_6 } ", a previsão de temperatura esta "{home.forecasting.Row_6 }"C</p>
       <p>Para data " {home.index.Row_7 } ", a previsão de temperatura esta "{home.forecasting.Row_7 }"C</p>
          </h>  </div>)}

 
   
          
             
            
                 </div>)   
      
        }
  
  
       function Fore2   ()  {
           const   selectedDevice = useSelector((state) => state.deviceState.selectedDevice); // Rule 1: call hooks in top-level
      
      //  const selectedDevice = useSelector((state) => state.deviceState.selectedDevice)
        // const   fser  =  "8cf9574000000012"
         const [error, setError] = useState(null);
         const  [isLoaded, setIsLoaded] = useState(false);
         const   [homes, setHomes] = useState([]);
  
         useEffect(() => {
           setTimeout(() => {
            fetch(`https://iotibti.ddns.net:7999/forecast?dev_eui=${selectedDevice}`)
             .then (res => {
               return res.json();
             })
             .then(result => {
              setIsLoaded( true) ;
              setHomes( result);
             })
             .catch(err => {
                console.log(err.message);
                
                setIsLoaded( true) 
                setError()
             })
            },1000);
          },[]);
        
          
         const pdfa =     homes.map((home, i) => {
          return (
             <div>
        { `   {  a :  '${home.index.Row_1 }'  } ,{  a :  ${home.index.Row_1 }  }   `} 
       
            </div> 
          );
        });  
 
 
  
         const pdata =     homes.map((home, i) => {
          return (
             <div>{home.index.Row_1 }  
            </div> 
          );
        });  
        
        return(
           
          <div> 
            <p>{pdata} </p>  
          </div>
           
      
        )
      }


      function Ff  ()  {
        const   selectedDevice = useSelector((state) => state.deviceState.selectedDevice); // Rule 1: call hooks in top-level
      
        
        const [error, setError] = useState(null);
        const  [isLoaded, setIsLoaded] = useState(false);
        const   [homes, setHomes] = useState([]);
       
        useEffect(() => {
          setTimeout(() => {
           fetch(`https://iotibti.ddns.net:7999/forecast?dev_eui=${selectedDevice}`)
            .then (res => {
              return res.json();
            })
            .then(result => {
             setIsLoaded( true) ;
             setHomes( result);
             
            })
            .catch(err => {
               console.log(err.message);
               
               setIsLoaded( true) 
               setError()
            })
           },1000);
         },[]);
        
  
        var CircularJSON = require('circular-json');
        const  pd =    CircularJSON.stringify(homes   )
           
        const myJSON = JSON.stringify(pd);
        var first = myJSON.slice(26, 36);
        var first2 = myJSON.slice(51, 61);
        var first3  = myJSON.slice(76, 86);
        var first4  = myJSON.slice(101, 111);
        var first5 = myJSON.slice(126, 136);
        var first6  = myJSON.slice(151, 161);
        var first7  = myJSON.slice(176, 186);

        var second = myJSON.slice(219, 226);
        var second2 = myJSON.slice(241, 248);
        var second3 = myJSON.slice(263, 270);
        var second4 = myJSON.slice(285, 292);
        var second5 = myJSON.slice(307, 314);
        var second6 = myJSON.slice(329, 336);
        var second7 = myJSON.slice(351, 358);

     
const data = {
  labels:      [   `${first}` ,`${first2}` ,`${first3}`,`${first4}` ,`${first5}` ,`${first6}`,`${first7}`],
  datasets: [
    {
      label: "Valores de previsão",
      data: [  `${second }`, `${second2 }` ,`${second3}`, `${second4 }` ,`${second5 }`, `${second6 }` ,`${second7 }`   ],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    }
  ]
};
const styleObj = {
  fontSize: 14,
  color: "#4a54f1",
  textAlign: "center",
  paddingTop: "100px",
} 
 
  return (
    
   
   <div style={{width: '800px',height:'600px',marginLeft: '300px',marginTop: '40px'}}>
        <Line
            data={data}
          
        />
    </div>
    
  );
}

  
function Weter0  (props)  {
  //const   setcitt = useSelector((state) => state.setcitt); // Rule 1: call hooks in top-level
 
  const styleObj = {
    fontSize: 14,
    color: "#4a54f1",
    textAlign: "center",
    paddingTop: "100px",
}  
const styleObj6 = {
  fontSize: 14,
  color: "#4a54f1",
  textAlign: "left",
  paddingTop: "10px",
  paddingRight: "10px",
  paddingLeft: "10px",
  paddingBottom: "10px",
   
  display:'inline-block'
} 
const styleObj2 = {
  fontSize: 14,
  color: "black",
  textAlign: "center",
  paddingTop: "30px",
  paddingRight: "10px",
  paddingLeft: "10px",
  paddingBottom: "10px",
   
   
} 
    //const   selCity = 'tehran'; // Rule 1: call hooks in top-level

//  const selectedDevice = useSelector((state) => state.deviceState.selectedDevice)
 // const   fser  =  "8cf9574000000012"
  const [weterror, setwetError] = useState(null);
  const  [wetisLoaded, setwetIsLoaded] = useState(false);
  const   [wethomes, setwetHomes] = useState([]);
  
 
  
   
  const resultt =  localStorage.getItem('cidy');
   
  useEffect(() => {
    setTimeout(() => {
     fetch(`https://iotibti.ddns.net:7998/forecast/wete?city=${resultt}`)
      .then (res => {
        return res.json();
      })
      .then(wetresult => {
       setwetIsLoaded( true) ;
       setwetHomes( wetresult);
      })
      .catch(err => {
         console.log(err.message);
         
         setwetIsLoaded( true) 
         setwetError()
      })
     },1000);
   },[]);
 
   const wetpdata =     wethomes.map((wethome, i) => {
    return (
       <div>
          
         {wethome}  
      </div> 
    );
  });  
  return(
     
    <div> 
 
      <h style={styleObj6}>Cidade selecionada: <h>   </h><h style={styleObj2}> {wetpdata[0]}   </h> </h>  
      <h style={styleObj6}> Tempo: <h>   </h><h style={styleObj2}> {wetpdata[1]}  </h> </h>    
      <h style={styleObj6}> Clima:<h>   </h> <h style={styleObj2}> {wetpdata[2]} </h> </h>  
      <h style={styleObj6}>  Temperatura: <h>   </h><h style={styleObj2}> {wetpdata[3]} </h> </h>  
    </div>
     

  )
}
 
 