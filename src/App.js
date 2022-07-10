import React,{ useState,useEffect } from 'react';
import InfoBox from "./InfoBox";
import Table from "./Table";
import {sortData,prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Search from "./Search";
import "leaflet/dist/leaflet.css";
import './App.css';
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core";

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("Worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:30.80746, lng:8.4796});
  const [mapZoom,setMapZoom]=useState(1.6);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    //async->send a request, wait for it, do sommething with info
    const getCountriesData=async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
       const countries=data.map((country)=>(
        {
          name:country.country,//India,United States,United Kingdom
          value:country.countryInfo.iso2//UK,USA,FR
        }
      ));
      //console.log(countries);
      const sortedData=sortData(data);
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
      // console.log(countries);
    });
  };
  getCountriesData();
  },[]);

  function onSearch(inputText){
    onCountryChange(inputText,true);
  }

  const onCountryChange=async (event,isSearched)=>{
    let countryCode="";
    if(isSearched===true){
      countryCode=event;
    }else{
      countryCode=event.target.value;
    }

    const url=countryCode==="Worldwide"
    ?'https:disease.sh/v3/covid-19/all'
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode==="Worldwide"){
        setMapCenter([30.80746,8.4796]);
        setMapZoom(1.6);
      }
      else{
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setMapZoom(4);
      }
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <Search
            countries={countries}
            onSearch={onSearch}/>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map(country=>(
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType==="cases"}
            onClick={e=>setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType==="recovered"}
            onClick={e=>setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType==="deaths"}
            onClick={e=>setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent className="cardContent">
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="graphHeader">Worldwide new {casesType}</h3>
          <LineGraph
            className="app__graph"
            casesType={casesType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
